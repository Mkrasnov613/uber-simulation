package com.ubersim.interfaces;

import com.ubersim.domain.Driver;
import com.ubersim.domain.Passenger;

import java.util.List;
import java.util.Optional;

public interface MatchingStrategy {
    Optional<Driver> findDriver(Passenger passenger, List<Driver> availableDrivers);
}
