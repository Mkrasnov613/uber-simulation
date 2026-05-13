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
                trip.setDistanceKm(trip.getDistanceKm() - speedKmPerTick);

                // if driver is close - set trip status to IN_PROGRESS and start trip for passenger and driver
                if (trip.getDistanceKm() <= 0.05) {
                    trip.setStatus(TripStatus.IN_PROGRESS);
                    trip.setDistanceKm(trip.getDistanceKm());

                    // TODO: check if those methods are used somewhere else, if not - make them as a single method in Trip
                    if (driver != null) {
                        driver.startTrip();
                    }
                    if (passenger != null) {
                        passenger.startRide();
                    }
                }
            } else if (trip.getStatus() == TripStatus.IN_PROGRESS) {
                trip.setDistanceKm(trip.getDistanceKm() - speedKmPerTick);
                if (trip.getDistanceKm() <= 0.05) {
                    trip.complete(currentTick);
                    completedTrips.add(trip);
                    if (driver != null) {
                        driver.completeTrip(trip.getFare());
                    }
                    if (passenger != null) {
                        passenger.completeRide();
                    }
                }
            }


        }
        return completedTrips;
    }

    public void cancelTrip(Trip trip, Driver driver, Passenger passenger) {
    }
}