package com.ubersim.domain;

import com.ubersim.domain.base.SimulationEntity;
import com.ubersim.enums.DriverStatus;
import com.ubersim.enums.PassengerStatus;
import com.ubersim.interfaces.Stateful;
import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Passenger extends SimulationEntity implements Stateful<PassengerStatus> {

    private PassengerStatus status;
    private Coordinates pickupLocation;
    private Coordinates dropoffLocation;
    private int waitingTicks;
    private int maxWaitTicks;
    private String currentTripId;

    public boolean isActive() {
        return status != PassengerStatus.COMPLETED && status != PassengerStatus.ABANDONED;
    }

    public void setWaiting(){
        this.status = PassengerStatus.WAITING;
    }

    public boolean isWaiting() {
        return status == PassengerStatus.WAITING;
    }

    public boolean hasExceededWaitLimit() {
        return waitingTicks >= maxWaitTicks;
    }

    public void incrementWait() {
        this.waitingTicks++;
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

    public void startRide(){
        this.status = PassengerStatus.IN_TRIP;
    }

    public void AssignUUID() {
        this.id = UUID.randomUUID().toString();
    }
}