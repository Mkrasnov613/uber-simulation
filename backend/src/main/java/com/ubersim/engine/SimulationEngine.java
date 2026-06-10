package com.ubersim.engine;

import com.ubersim.domain.*;
import com.ubersim.enums.SimulationStatus;
import com.ubersim.services.*;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SimulationEngine {

    private final MatchingService matchingService;
    private final TripService tripService;
    private final QuotaService quotaService;
    private final SpawnService spawnService;
    private final FailureDetector failureDetector;
    private final SimulationConfig simulationConfig;

    @Getter
    private SimulationState state;

    public SimulationEngine(MatchingService matchingService, TripService tripService, QuotaService quotaService, SpawnService spawnService, FailureDetector failureDetector, SimulationConfig simulationConfig) {
        this.matchingService = matchingService;
        this.tripService = tripService;
        this.quotaService = quotaService;
        this.spawnService = spawnService;
        this.failureDetector = failureDetector;
        this.simulationConfig = simulationConfig;
        this.state = SimulationState.stub();
    }

    public void start(SimulationConfig config) {
        SimulationConfig effectiveConfig = (config != null) ? config : simulationConfig;

        List<Driver> drivers = spawnService.spawnDrivers(effectiveConfig);
        List<Passenger> passengers = spawnService.spawnPassengers(effectiveConfig);

        this.state = SimulationState.builder()
                .status(SimulationStatus.RUNNING)
                .running(true)
                .tick(0)
                .drivers(drivers)
                .passengers(passengers)
                .activeTrips(new ArrayList<>())
                .config(effectiveConfig)
                .stats(SimulationStats.empty())
                .build();
    }

    public void tick() {
        if (state.isRunning()) {
            state.setTick(state.getTick() + 1);

            // 1. continuous demand — fresh passengers each tick
            List<Passenger> fresh = spawnService.spawnPassengers(state.getConfig().getSpawnPerTick(), state.getConfig());
            state.getPassengers().addAll(fresh);

            Map<String, Driver> driversWithID = new HashMap<>();
            Map<String, Passenger> passengersWithID = new HashMap<>();
            for (Driver driver : state.getDrivers()) driversWithID.put(driver.getId(), driver);
            for (Passenger passenger : state.getPassengers()) passengersWithID.put(passenger.getId(), passenger);

            double speedOfDrivers = state.getConfig().getDriverSpeedKmPerTick();

            // 2. abandonment
            List<Passenger> abandonedPassengers = failureDetector.detectAbandoned(state.getPassengers());
            for (Passenger p : abandonedPassengers) {
                Trip trip = state.getActiveTrips().stream()
                        .filter(t -> t.getPassengerId().equals(p.getId()))
                        .findFirst().orElse(null);
                if (trip != null) {
                    Driver driver = driversWithID.get(trip.getDriverId());
                    tripService.cancelTrip(trip, driver, p);
                    state.getActiveTrips().remove(trip);
                }
            }

            // 3. matching + movement
            List<Trip> newTrips = matchingService.matchAll(state.getPassengers(), state.getDrivers(), state.getTick());
            state.getActiveTrips().addAll(newTrips);

            List<Trip> completedTrips = tripService.processTick(
                    state.getActiveTrips(), driversWithID, passengersWithID, speedOfDrivers, state.getTick());
            state.getActiveTrips().removeAll(completedTrips);

            // 4. stats + outcome
            state.getStats().update(state.getDrivers(), state.getPassengers(), newTrips, completedTrips, abandonedPassengers);

            SimulationStatus status = quotaService.evaluate(state.getConfig(), state.getStats(), state.getTick());
            state.setStatus(status);
            if (status == SimulationStatus.COMPLETED || status == SimulationStatus.FAILED) {
                stop();
            }

            // 5. cleanup — drop passengers that are done so the list & WS payload stay bounded
            state.getPassengers().removeIf(p -> !p.isActive());
        }
    }

    public void stop() {
        state.setRunning(false);
    }

    public void resume() {
        if (state.getStatus() == SimulationStatus.RUNNING) {
            state.setRunning(true);
        }
    }

    public void reset() {
        state = SimulationState.stub();
    }
}