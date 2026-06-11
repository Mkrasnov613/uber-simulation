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
        return totalTrips == 0 ? 0 : (double) cancelledTrips / totalTrips;
    }

    public double getCompletionRate() {
        return totalTrips == 0 ? 0 : (double) completedTrips / totalTrips;
    }

    public static SimulationStats empty() {
        return SimulationStats.builder().build(); // all zeros
    }

    public void update(List<Driver> drivers, List<Passenger> passengers, List<Trip> newTrips, List<Trip> completedTripsList, List<Passenger> canceledPassengers) {

        this.waitingPassengers = 0;
        this.activeDrivers = 0;
        this.availableDrivers = 0;


        for (Passenger passenger : passengers) {
            if (passenger.getStatus() == PassengerStatus.WAITING) {
                waitingPassengers++;
            }
        }

        for (Driver driver : drivers) {
            if (driver.getStatus() != DriverStatus.OFFLINE) {
                activeDrivers++;
            }
            if (driver.getStatus() == DriverStatus.AVAILABLE) {
                availableDrivers++;
            }
        }
        //adds total count of trips from returning functions
        this.cancelledTrips += canceledPassengers.size();
        this.completedTrips += completedTripsList.size();
        this.totalTrips += newTrips.size();
        double totalTripTime = 0;
        for(Trip completedTrip: completedTripsList){
            totalTripTime +=  completedTrip.getCompletedAtTick() - completedTrip.getStartedAtTick();
        }
        this.averageTripDurationSeconds = totalTripTime / completedTripsList.size();

    }
}