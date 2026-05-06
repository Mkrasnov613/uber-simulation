package com.ubersim.domain;

import com.ubersim.enums.TripStatus;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
public class Trip {

    private String id;
    private String driverId;
    private String passengerId;
    private TripStatus status;
    private Coordinates pickupLocation;
    private Coordinates dropoffLocation;
    private int requestedAtTick;
    private int matchedAtTick;
    private int startedAtTick;
    private int completedAtTick;
    private double fare;
    private double distanceKm;


    public boolean isActive() {
        return status == TripStatus.IN_PROGRESS || status == TripStatus.DRIVER_ARRIVING;
    }

    public int getWaitDuration() {
        return matchedAtTick == 0 ? 0 : matchedAtTick - requestedAtTick
    }

    public int getTripDuration() {
        return (startedAtTick == 0 || completedAtTick == 0) ? 0 : completedAtTick - startedAtTick
    }

    public void match(int tick) {
        this.status = TripStatus.MATCHED;
        this.matchedAtTick = tick;
    }

    public void driverEnRoute() {
        this.status = TripStatus.DRIVER_ARRIVING
    }

    public void start(int tick) {
        this.status = TripStatus.IN_PROGRESS;
        this.startedAtTick = tick;
    }

    // TODO: decide what formula we use to calculate fare
    public double calculateFare() {

    }

    public void complete(int tick) {
        this.status = TripStatus.COMPLETED;
        this.completedAtTick = tick;
        // this.fare = calculateFare();
    }

    public void cancel() {
        this.status = TripStatus.CANCELLED
    }

}
