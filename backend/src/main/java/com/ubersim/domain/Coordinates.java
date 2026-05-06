package com.ubersim.domain;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Coordinates {
    private double latitude;
    private double longitude;

    public double distanceTo(Coodinates other) {
        return 0;
    }

    public Coordinates stepToward(Coordinates target, double stepKm) {
        return this;
    }
}