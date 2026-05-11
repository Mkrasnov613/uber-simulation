package com.ubersim.services;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.ubersim.domain.Driver;
import com.ubersim.domain.Passenger;
import com.ubersim.domain.Trip;
import com.ubersim.enums.TripStatus;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.UUID;

@Service
public class MatchingService {
    public Optional<Driver> findNearestDriver(Passenger passenger, List<Driver> availableDrivers) {
        if (availableDrivers == null || availableDrivers.isEmpty()) return Optional.empty();

        return availableDrivers.stream().min(Comparator.comparingDouble(driver -> driver.getLocation().distanceTo(passenger.getPickupLocation())));
    }

    public Trip createTrip(Driver driver, Passenger passenger, int currentTick) {
        String tripId = UUID.randomUUID().toString();

        double distance = passenger.getPickupLocation().distanceTo(passenger.getDropoffLocation());

        Trip trip = Trip.builder().id(tripId).driverId(driver.getId()).passengerId(passenger.getId()).status(TripStatus.MATCHED).pickupLocation(passenger.getPickupLocation()).dropoffLocation(passenger.getDropoffLocation()).requestedAtTick(currentTick).matchedAtTick(currentTick).distanceKm(distance).build();

        driver.assignToTrip(tripId);
        passenger.matchToTrip(tripId);

        return trip;
    }

    public List<Trip> matchAll(List<Passenger> waitingPassengers, List<Driver> availableDrivers, int currentTick) {
        List<Trip> newTrips = new ArrayList<>();
        List<Driver> remainingDrivers = new ArrayList<>(availableDrivers);

        for (Passenger passenger : waitingPassengers) {
            Optional<Driver> match = findNearestDriver(passenger, remainingDrivers);

            if (match.isPresent()) {
                Driver driver = match.get();
                Trip trip = createTrip(driver, passenger, currentTick);
                newTrips.add(trip);
                remainingDrivers.remove(driver);
            }
        }

        return newTrips;
    }
}