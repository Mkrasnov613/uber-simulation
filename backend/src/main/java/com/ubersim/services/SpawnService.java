package com.ubersim.services;

import com.ubersim.domain.*;

import java.util.ArrayList;
import java.util.List;

public class SpawnService{
    public List<Driver> spawnDrivers(int n = config.driverCount){
        List<Driver> drivers = new ArrayList<>();
        for(int i=0;i<n;i++){
            drivers.add(new Driver(Driver.randomName(i)));
        }
        for(Driver driver :drivers){
            Coordinates Cordinates = new Coordinates();
            Cordinates.randomCoordinates();

            driver.setAvailable();
            driver.setLocation(Cordinates);
            driver.AssignUUID();
        }
        return drivers;
    }
    public List<Passenger> spawnPassengers(int n = config.passengerCount){
        List<Passenger> passangers = new ArrayList<>();
        for(int i=0;i<n;i++){
            passangers.add(new Passenger());
        }
        for(Passenger passanger :passangers){
            Coordinates spawn = new Coordinates();
            Coordinates desination = new Coordinates();

            spawn.randomCoordinates();
            desination.randomCoordinates();
            passanger.setWaiting();
            passanger.setPickupLocation(spawn);
            passanger.setDropoffLocation(desination);
            passanger.AssignUUID();
        }
        return passangers;
    }
}