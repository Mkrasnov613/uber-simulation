package com.ubersim.domain;

import com.ubersim.enums.DriverStatus;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    private String id;
    private String name;
    private DriverStatus status;
    private Coordinates location;
    private double rating;
    private int totalTripsCompleted;
    private double totalEarnings;
    private String currentTripId;

    public Boolean isAvailable() {
        return status == DriverStatus.AVAILABLE;
    }

    public void assignToTrip(String tripId) {
        this.currentTripId = tripId;
        this.status = DriverStatus.EN_ROUTE_TO_PASSENGER;
    }

    public void startTrip() {
        this.status = DriverStatus.ON_TRIP;
    }

    public void completeTrip(double fare) {
        this.totalEarnings += fare;
        this.totalTripsCompleted++;
        this.currentTripId = null;
        this.status = DriverStatus.AVAILABLE;
    }

    public void moveToward(Coordinates target, double stepKm){}

    public void updateRating(double newRating){

    }
}