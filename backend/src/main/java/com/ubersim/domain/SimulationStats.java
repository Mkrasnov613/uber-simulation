package com.ubersim.domain;

import com.ubersim.enums.DriverStatus;
import com.ubersim.enums.PassengerStatus;
import com.ubersim.enums.TripStatus;
import lombok.Builder;
import lombok.Data;

import java.util.List;

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
    private double totalEarnings;


    public double getCancellationRate() {
        return 0;
    }

    public double getCompletionRate() {
        return 0;
    }

    public static SimulationStats empty() {
        return SimulationStats.builder().build(); // all zeros
    }

    public void update(List<Driver> drivers,List<Passenger> passengers,List<Trip> Trips) {

        this.waitingPassengers=0;
        this.availableDrivers=0;
        this.activeDrivers=0;

        for(Passenger passenger:passengers){
            if(passenger.getStatus()==PassengerStatus.WAITING){
                waitingPassengers++;
            }
        }

        for(Driver driver: drivers){
            if(driver.getStatus()!=DriverStatus.OFFLINE){
                activeDrivers++;
            }
            if(driver.getStatus()==DriverStatus.AVAILABLE){
                availableDrivers++;
            }
        }
        for(Trip trip: Trips){
            totalTrips++;
            if(trip.getStatus()== TripStatus.COMPLETED){
                completedTrips++;
            } else if(trip.getStatus() == TripStatus.CANCELLED){
                cancelledTrips++;
            }
        }
    }
}
