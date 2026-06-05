package com.ubersim.services;

import com.ubersim.domain.*;
import com.ubersim.enums.TripStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class TripService {

    private final MovementService movementService;

    public TripService(MovementService movementService) {
        this.movementService = movementService;
    }

    public List<Trip> processTick(List<Trip> activeTrips, Map<String, Driver> driversById, Map<String, Passenger> passengersById, double speedKmPerTick, int currentTick) {
        List<Trip> completedTrips = new ArrayList<>();

        for (Trip trip : activeTrips) {
            Passenger passenger = passengersById.get(trip.getPassengerId());
            Driver driver = driversById.get(trip.getDriverId());

            if (trip.getStatus() == TripStatus.DRIVER_ARRIVING) {
                // drive along the route to the pickup (set in MatchingService.createTrip)
                boolean reachedPickup = movementService.advance(driver, speedKmPerTick);

                if (reachedPickup) {
                    trip.start(currentTick);
                    driver.startTrip();
                    passenger.startRide();
                    // now route from pickup → dropoff and keep driving on the next ticks
                    movementService.routeTo(driver, passenger.getPickupNodeId(), passenger.getDropoffNodeId());
                }

            } else if (trip.getStatus() == TripStatus.IN_PROGRESS) {
                // drive along the route to the dropoff
                boolean reachedDropoff = movementService.advance(driver, speedKmPerTick);

                if (reachedDropoff) {
                    trip.complete(currentTick);
                    driver.completeTrip(trip.getFare());
                    passenger.completeRide();
                    driver.setCurrentNodeId(passenger.getDropoffNodeId());
                    driver.setPath(null);   // no active route → driver is parked again
                    completedTrips.add(trip);
                }
            }
        }
        return completedTrips;
    }

    public void cancelTrip(Trip trip, Driver driver, Passenger passenger) {
        trip.cancel();
        if (driver != null) {
            driver.setAvailable();
            driver.setPath(null);   // clear the route so he stops "driving"
        }
        if (passenger != null) passenger.abandon();
    }
}