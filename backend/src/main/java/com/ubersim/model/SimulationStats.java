package com.ubersim.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SimulationStats {
    private int totalTrips;
    private int completedTrips;
    private int cancelledTrips;
    private int activeDrivers;
    private int availableDrivers;
    private int waitingPassengers;
    private double averageWaitTimeSeconds;
    private double averageTripDurationSeconds;
    private double averageFare;

    public static SimulationStats empty() {
        return SimulationStats.builder().build(); // all zeros
    }
}