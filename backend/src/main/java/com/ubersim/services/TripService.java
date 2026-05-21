package com.ubersim.services;

import com.ubersim.domain.*;
import com.ubersim.enums.TripStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TripService {
    public List<Trip> processTick(List<Trip> activeTrips, Map<String, Driver> driversById, Map<String, Passenger> passengersById, double speedKmPerTick, int currentTick) {
        List<Trip> completedTrips = new ArrayList<>();
        for (Trip trip : activeTrips) {
            // get passengers and drivers
            Passenger passenger = passengersById.get(trip.getPassengerId());
            Driver driver = driversById.get(trip.getDriverId());

            // if trip status is DRIVER_ARRIVING - push driver to a new position
            if (trip.getStatus() == TripStatus.DRIVER_ARRIVING) {

                driver.moveToward(trip.getPickupLocation(), speedKmPerTick);

                if (driver.getLocation().distanceTo(trip.getPickupLocation()) <= 0.05) {
                    trip.start(currentTick);
                    driver.startTrip();
                    passenger.startRide();
                }

            } else if (trip.getStatus() == TripStatus.IN_PROGRESS) {

                driver.moveToward(trip.getDropoffLocation(), speedKmPerTick);

                if (driver.getLocation().distanceTo(trip.getDropoffLocation()) <= 0.05) {
                    trip.complete(currentTick);
                    driver.completeTrip(trip.getFare());
                    passenger.completeRide();
                    completedTrips.add(trip);
                }
            }

        }
        return completedTrips;
    }

    public void cancelTrip(Trip trip, Driver driver, Passenger passenger) {
        trip.cancel();
        if (driver != null) driver.setAvailable();
        if (passenger != null) passenger.abandon();
    }
}