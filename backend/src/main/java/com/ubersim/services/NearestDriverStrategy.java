package com.ubersim.services;

import com.ubersim.domain.Driver;
import com.ubersim.domain.Passenger;
import com.ubersim.enums.DriverStatus;
import com.ubersim.interfaces.MatchingStrategy;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
public class NearestDriverStrategy implements MatchingStrategy {

    @Override
    public Optional<Driver> findDriver(Passenger passenger, List<Driver> availableDrivers) {
        if (availableDrivers == null || availableDrivers.isEmpty()) return Optional.empty();

        return availableDrivers.stream()
                .filter(driver -> driver.getStatus() == DriverStatus.AVAILABLE)
                .min(Comparator.comparingDouble(driver ->
                        driver.getLocation().distanceTo(passenger.getPickupLocation())));
    }
}
