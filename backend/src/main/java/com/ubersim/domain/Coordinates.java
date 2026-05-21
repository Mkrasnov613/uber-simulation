package com.ubersim.domain;

import lombok.*;

import java.util.random.RandomGenerator;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Coordinates {
    private double latitude;
    private double longitude;

    // 1. Takes two points on Earth — e.g. (52.23, 21.01) and (52.25, 21.05)
    // 2. Converts lat/lng difference to radians
    // 3. Applies Haversine formula, The haversine formula calculates the shortest
    // distance (great-circle distance) between two points on a sphere, such as Earth,
    // using their latitudes and longitudes
    // 4. Returns straight-line distance in kilometres

    public double distanceTo(Coordinates other) {
        final double R = 6371.0; // Earth radius in km

        double dLat = Math.toRadians(other.getLatitude() - this.latitude);
        double dLng = Math.toRadians(other.getLongitude() - this.longitude);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(this.latitude))
                * Math.cos(Math.toRadians(other.getLatitude()))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    public Coordinates stepToward(Coordinates target, double stepKm) {
        double distance = this.distanceTo(target);

        if (distance <= stepKm) {
            return new Coordinates(target.getLatitude(), target.getLongitude());
        }

        double fraction = stepKm / distance;

        double newLat = this.latitude + fraction * (target.getLatitude() - this.latitude);
        double newLng = this.longitude + fraction * (target.getLongitude() - this.longitude);

        return new Coordinates(newLat, newLng);
    }

    public void randomCoordinates() {
        double latitude = RandomGenerator.getDefault().nextDouble(52.15, 52.35);
        double longitude = RandomGenerator.getDefault().nextDouble(20.90, 21.15);
        this.latitude = latitude;
        this.longitude = longitude;
    }
}