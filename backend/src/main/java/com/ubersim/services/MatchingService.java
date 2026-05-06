package com.ubersim.services;

import com.ubersim.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MatchingService {
    public Optional<Driver> findNearestDriver(Passenger passenger, List<Driver> availableDrivers) {
        return Optional.empty();
    }

    public Trip createTrip(Driver driver, Passenger passenger, int currentTick) {
        return new Trip();
    }

    public List<Trip> matchAll(List<Passenger> waiting, List<Driver> available, int tick) {
        return List.of();
    }
}