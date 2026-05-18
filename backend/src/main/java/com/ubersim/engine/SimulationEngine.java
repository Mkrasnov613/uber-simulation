package com.ubersim.engine;

import com.ubersim.domain.*;
import com.ubersim.enums.SimulationStatus;
import com.ubersim.services.*;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SimulationEngine {

    private final MatchingService matchingService;
    private final TripService tripService;
    private final QuotaService quotaService;
    private final FailureDetector failureDetector;
    private final SimulationConfig simulationConfig;
    private final SimulationStats simulationStats;

    @Getter
    private SimulationState state;

    public SimulationEngine(MatchingService matchingService, TripService tripService, QuotaService quotaService, FailureDetector failureDetector, SimulationConfig simulationConfig, SimulationStats simulationStats) {
        this.matchingService = matchingService;
        this.tripService = tripService;
        this.quotaService = quotaService;
        this.failureDetector = failureDetector;
        this.simulationConfig = simulationConfig;
        this.simulationStats = simulationStats;
        this.state = SimulationState.stub();
    }

    public void start(SimulationConfig config) {
    }

    public void tick() {
        if(state.isRunning()) {

            List<Passenger> abandonedPassengers;
            List<Trip> newTrips;
            List<Trip> completedTrips;
            //I dont know if thats optimal but sure
            Map<String, Driver> driversWithID = new HashMap<>();
            Map<String, Passenger> passengersWithID = new HashMap<>();
            for(Driver driver: state.getDrivers()){
                driversWithID.put(driver.getId(),driver);
            }
            for(Passenger passenger: state.getPassengers()){
                passengersWithID.put(passenger.getId(), passenger);
            }

            double speedOfDrivers = simulationConfig.getDriverSpeedKmPerTick();
            state.setTick(state.getTick() + 1);

            abandonedPassengers = failureDetector.detectAbandoned(state.getPassengers());

            newTrips = matchingService.matchAll(state.getPassengers(), state.getDrivers(), state.getTick());

            completedTrips = tripService.processTick(state.getActiveTrips(),driversWithID ,passengersWithID,speedOfDrivers,state.getTick());

            simulationStats.update(state.getDrivers(),state.getPassengers(), newTrips, completedTrips, abandonedPassengers);

            SimulationStatus status = quotaService.evaluate(simulationConfig,simulationStats,state.getTick());
            state.setStatus(status);
        }
    }

    public void stop() {
    }

    public void reset() {
        state = SimulationState.stub();
    }
}