package com.ubersim.domain;

import com.ubersim.enums.SimulationStatus;
import lombok.*;
import com.ubersim.engine.SimulationConfig;

import java.util.ArrayList;
import java.util.List;

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
        return new ArrayList<>();
    }

    public List<Passenger> getWaitingPassengers() {
        return new ArrayList<>();
    }

    public boolean isRunning() {
        return running;
    }

    public boolean isFinished() {
        return false;
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