package com.ubersim.domain;

import com.ubersim.enums.DriverStatus;
import com.ubersim.domain.base.SimulationEntity;
import com.ubersim.interfaces.Stateful;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Driver extends SimulationEntity implements Stateful<DriverStatus> {

    private DriverStatus status;
    private Coordinates location;
    private double rating;
    private int totalTripsCompleted;
    private double totalEarnings;
    private String currentTripId;

    private String currentNodeId;   // node the driver is currently sitting on / last passed
    private List<String> path;      // route as a list of node ids (from findPath)
    private int pathIndex;          // which waypoint in path we're heading to

    public Driver(String name) {
        this.name = name;
    }

    public boolean isAvailable() {
        return status == DriverStatus.AVAILABLE;
    }

    public void setAvailable() {
        this.status = DriverStatus.AVAILABLE;
    }

    @Override
    public boolean isActive() {
        return status != DriverStatus.OFFLINE;
    }

    public void assignToTrip(String tripId) {
        this.currentTripId = tripId;
        this.status = DriverStatus.EN_ROUTE_TO_PASSENGER;
    }

    public void startTrip() {
        this.status = DriverStatus.ON_TRIP;
    }

    public void completeTrip(double fare) {
        this.totalEarnings += fare;
        this.totalTripsCompleted++;
        this.currentTripId = null;
        this.status = DriverStatus.AVAILABLE;
    }

    public void moveToward(Coordinates target, double stepKm) {
        this.location = this.location.stepToward(target, stepKm);
    }

    public void updateRating(double newRating) {

    }

    public static String randomName(int n) {
        List<String> nameList = new ArrayList<>();
        nameList = List.of("Jan", "Anna", "Piotr", "Maria", "Krzysztof",
                "Katarzyna", "Paweł", "Małgorzata", "Tomasz", "Agnieszka",
                "Michał", "Barbara", "Marcin", "Krystyna", "Jakub"
        );//List of predefined names
        int counter = n % nameList.size();
        return nameList.get(counter);
    }

    public void AssignUUID() {
        this.id = UUID.randomUUID().toString();
    }
}