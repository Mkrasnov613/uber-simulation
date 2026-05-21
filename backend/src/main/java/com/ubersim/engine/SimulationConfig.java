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
        return SimulationConfig.builder().driverCount(10).passengerCount(5).maxPassengerWaitTicks(20).driverSpeedKmPerTick(0.1).quotaMode("RIDES").quotaTarget(5.0).maxTicks(100).build();
    }
}