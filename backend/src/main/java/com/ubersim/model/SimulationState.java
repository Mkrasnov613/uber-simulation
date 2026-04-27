package com.ubersim.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SimulationState {
    private boolean running;
    private int tick;
    private List<Object> drivers;
    private List<Object> passengers;
    private List<Object> activeTrips;
    private SimulationStats stats;

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