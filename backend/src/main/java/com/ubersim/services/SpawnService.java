package com.ubersim.services;

import com.ubersim.domain.*;
import com.ubersim.engine.SimulationConfig;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpawnService {

    private final SimulationConfig config;

    public SpawnService(SimulationConfig config) {
        this.config = config;
    }

    public List<Driver> spawnDrivers() {
        int driverCount = config.getDriverCount();
        List<Driver> drivers = new ArrayList<>();
        for (int i = 0; i < driverCount; i++) {
            drivers.add(new Driver(Driver.randomName(i)));
        }
        for (Driver driver : drivers) {
            Coordinates Cordinates = new Coordinates();
            Cordinates.randomCoordinates();

            driver.setAvailable();
            driver.setLocation(Cordinates);
            driver.AssignUUID();
        }
        return drivers;
    }


    public List<Passenger> spawnPassengers() {
        int passengerCount = config.getPassengerCount();
        List<Passenger> passengers = new ArrayList<>();
        for (int i = 0; i < passengerCount; i++) {
            passengers.add(new Passenger());
        }
        for (Passenger passenger : passengers) {
            Coordinates spawn = new Coordinates();
            Coordinates destination = new Coordinates();

            spawn.randomCoordinates();
            destination.randomCoordinates();
            passenger.setWaiting();
            passenger.setPickupLocation(spawn);
            passenger.setDropoffLocation(destination);
            passenger.AssignUUID();
        }
        return passengers;
    }
}