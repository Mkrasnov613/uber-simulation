package com.ubersim.domain;

import com.ubersim.enums.PassengerStatus;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Passenger {

    private String id;
    private String name;
    private PassengerStatus status;
    private Coordinates pickupLocation;
    private Coordinates dropoffLocation;
    private int waitingTicks;
    private int maxWaitTicks;
    private String currentTripId;

    public Boolean isWaiting() {
        return status == PassengerStatus.WAITING;
    }

    public void hasExceededWaitLimit() {
        return waitingTicks >= maxWaitTicks;
    }

    public void incrementWait() {
        this.waitingTicks++
    }

    public void matchToTrip(String tripId) {
        this.currentTripId = tripId;
        this.status = PassengerStatus.MATCHED;
    }

    public void completeRide() {
        this.currentTripId = null;
        this.status = PassengerStatus.COMPLETED;
    }

    public void abandon() {
        this.currentTripId = null;
        this.status = PassengerStatus.ABANDONED;
    }
}