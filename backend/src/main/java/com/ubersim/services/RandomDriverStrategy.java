package com.ubersim.services;

import com.ubersim.domain.Driver;
import com.ubersim.domain.Passenger;
import com.ubersim.enums.DriverStatus;
import com.ubersim.interfaces.MatchingStrategy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Component
public class RandomDriverStrategy implements MatchingStrategy {

    private final Random random = new Random();

    @Override
    public Optional<Driver> findDriver(Passenger passenger, List<Driver> availableDrivers) {
        if (availableDrivers == null || availableDrivers.isEmpty()) return Optional.empty();

        List<Driver> eligible = availableDrivers.stream()
                .filter(driver -> driver.getStatus() == DriverStatus.AVAILABLE)
                .toList();

        if (eligible.isEmpty()) return Optional.empty();

        return Optional.of(eligible.get(random.nextInt(eligible.size())));
    }
}
