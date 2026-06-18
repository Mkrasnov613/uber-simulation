package com.ubersim.domain;

public record TickSnapshot(
        int tick,
        int waitingPassengers,
        int activeTrips,
        int completedTrips,
        int abandonedPassengers,
        int availableDrivers,
        int busyDrivers,
        double totalEarnings,
        double avgWaitTimeSec
) {}
