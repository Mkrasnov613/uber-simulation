package com.ubersim.services;

import com.ubersim.domain.*;
import com.ubersim.engine.SimulationConfig;
import com.ubersim.map.RoadGraph;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpawnService {

    private final RoadGraph graph;

    public SpawnService(RoadGraph graph) {
        this.graph = graph;
    }

    public List<Driver> spawnDrivers(SimulationConfig config) {
        List<Driver> drivers = new ArrayList<>();

        for (int i = 0; i < config.getDriverCount(); i++) {
            Driver driver = new Driver(Driver.randomName(i));

            String nodeId = graph.randomNodeId();           // spawn ON a node
            driver.setCurrentNodeId(nodeId);
            driver.setLocation(graph.node(nodeId).location());

            driver.setAvailable();
            driver.AssignUUID();
            drivers.add(driver);
        }
        return drivers;
    }

    public List<Passenger> spawnPassengers(SimulationConfig config) {
        return spawnPassengers(config.getPassengerCount(), config);
    }

    public List<Passenger> spawnPassengers(int count, SimulationConfig config) {
        List<Passenger> passengers = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            passengers.add(spawnOnePassenger(config));
        }
        return passengers;
    }

    private Passenger spawnOnePassenger(SimulationConfig config) {
        Passenger passenger = new Passenger();

        String pickup = graph.randomNodeId();
        String dropoff = graph.randomNodeId();

        while (dropoff.equals(pickup)) {                // pickup must differ from dropoff
            dropoff = graph.randomNodeId();
        }

        passenger.setPickupNodeId(pickup);
        passenger.setDropoffNodeId(dropoff);

        passenger.setPickupLocation(graph.node(pickup).location());
        passenger.setDropoffLocation(graph.node(dropoff).location());

        passenger.setWaiting();
        passenger.setMaxWaitTicks(config.getMaxPassengerWaitTicks());

        passenger.setWaitingTicks(0);
        passenger.AssignUUID();

        return passenger;
    }

}