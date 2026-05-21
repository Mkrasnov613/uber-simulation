package com.ubersim.services;

import com.ubersim.domain.Driver;
import com.ubersim.domain.Passenger;
import com.ubersim.domain.Trip;
import com.ubersim.enums.DriverStatus;
import com.ubersim.enums.PassengerStatus;
import com.ubersim.enums.TripStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MatchingService {

    public Optional<Driver> findNearestDriver(Passenger passenger, List<Driver> availableDrivers) {
        if (availableDrivers == null || availableDrivers.isEmpty()) return Optional.empty();

        return availableDrivers.stream()
                .filter(driver -> driver.getStatus() == DriverStatus.AVAILABLE)
                .min(Comparator.comparingDouble(driver ->
                        driver.getLocation().distanceTo(passenger.getPickupLocation())));
    }

    public Trip createTrip(Driver driver, Passenger passenger, int currentTick) {
        String tripId = UUID.randomUUID().toString();

        double distance = passenger.getPickupLocation()
                .distanceTo(passenger.getDropoffLocation());

        Trip trip = Trip.builder()
                .id(tripId)
                .driverId(driver.getId())
                .passengerId(passenger.getId())
                .status(TripStatus.DRIVER_ARRIVING)
                .pickupLocation(passenger.getPickupLocation())
                .dropoffLocation(passenger.getDropoffLocation())
                .requestedAtTick(currentTick)
                .matchedAtTick(currentTick)
                .distanceKm(distance)
                .build();

        driver.assignToTrip(tripId);
        passenger.matchToTrip(tripId);

        return trip;
    }

    public List<Trip> matchAll(List<Passenger> passengers, List<Driver> drivers, int currentTick) {
        List<Trip> newTrips = new ArrayList<>();

        List<Passenger> waitingPassengers = passengers.stream()
                .filter(p -> p.getStatus() == PassengerStatus.WAITING)
                .toList();

        List<Driver> remainingDrivers = drivers.stream()
                .filter(d -> d.getStatus() == DriverStatus.AVAILABLE)
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));

        for (Passenger passenger : waitingPassengers) {
            if (remainingDrivers.isEmpty()) break;

            Optional<Driver> match = findNearestDriver(passenger, remainingDrivers);

            if (match.isPresent()) {
                Driver driver = match.get();
                Trip trip = createTrip(driver, passenger, currentTick);
                newTrips.add(trip);
                remainingDrivers.remove(driver); // щоб один водій не взяв двох пасажирів
            }
        }

        return newTrips;
    }
}