package com.ubersim.domain;

import lombok.*;

import java.util.random.RandomGenerator;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Coordinates {
    private double latitude;
    private double longitude;

    public double distanceTo(Coordinates other) {
        return 0;
    }

    public Coordinates stepToward(Coordinates target, double stepKm) {
        return this;
    }
    public void randomCoordinates(){
        double latitude = RandomGenerator.getDefault().nextDouble(52.15, 52.35);
        double longitude = RandomGenerator.getDefault().nextDouble(20.90, 21.15);
        this.latitude = latitude;
        this.longitude = longitude;
    }
}