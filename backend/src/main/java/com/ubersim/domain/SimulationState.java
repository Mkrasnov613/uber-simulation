package com.ubersim.domain;

import com.ubersim.enums.DriverStatus;
import com.ubersim.enums.PassengerStatus;
import com.ubersim.enums.SimulationStatus;
import lombok.*;
import com.ubersim.engine.SimulationConfig;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimulationState {
    private SimulationStatus status;
    private boolean running;
    private int tick;
    private SimulationConfig config;
    private List<Driver> drivers;
    private List<Passenger> passengers;
    private List<Trip> activeTrips;
    private SimulationStats stats;

    public List<Driver> getAvailableDrivers() {
        if (drivers == null) return new ArrayList<>();
        return drivers.stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
                .collect(Collectors.toList());
    }

    public List<Passenger> getWaitingPassengers() {
        if (passengers == null) return new ArrayList<>();
        return passengers.stream()
                .filter(p -> p.getStatus() == PassengerStatus.WAITING)
                .collect(Collectors.toList());
    }

    public boolean isFinished() {
        return status == SimulationStatus.COMPLETED || status == SimulationStatus.FAILED;
    }

    // Returns hardcoded data so the FE connection test passes
    public static SimulationState stub() {
        return SimulationState.builder()
                .running(false)
                .tick(0)
                .drivers(List.of())
                .passengers(List.of())
                .activeTrips(List.of())
                .stats(SimulationStats.empty())
                .build();
    }
}