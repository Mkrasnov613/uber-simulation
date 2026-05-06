package com.ubersim.domain;

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


    public double getCancellationRate() {
        return 0;
    }

    public double getCompletionRate() {
        return 0;
    }

    public static SimulationStats empty() {
        return SimulationStats.builder().build(); // all zeros
    }
}