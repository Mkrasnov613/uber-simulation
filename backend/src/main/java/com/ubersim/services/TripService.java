package com.ubersim.services;

import com.ubersim.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TripService {
    public List<Trip> processTick(List<Trip> activeTrips, Map<String, Driver> driversById, Map<String, Passenger> passengersById, double speedKmPerTick, int currentTick) {
        return List.of();
    }

    public void cancelTrip(Trip trip, Driver driver, Passenger passenger) {
    }
}