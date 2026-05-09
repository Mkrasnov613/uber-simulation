package com.ubersim.engine;

import lombok.*;

@Data
@Builder
public class SimulationConfig {
    private int driverCount;
    private int passengerCount;
    private int maxPassengerWaitTicks;
    private double driverSpeedKmPerTick;
    private String quotaMode;
    private double quotaTarget;
    private int maxTicks;

    public static SimulationConfig defaults() {
        return new SimulationConfig();
    }
}