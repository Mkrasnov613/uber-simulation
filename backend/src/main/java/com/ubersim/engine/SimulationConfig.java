package com.ubersim.engine;

import lombok.*;

@Data
@Builder
public class SimulationConfig {
    private int driverCount;
    private int passengerCount;
    private int spawnPerTick;
    private int maxPassengerWaitTicks;
    private int maxAbandoned;
    private double driverSpeedKmPerTick;
    private String quotaMode;
    private double quotaTarget;
    private int maxTicks;

    public static SimulationConfig defaults() {
        return SimulationConfig.builder().driverCount(30).passengerCount(15)        // початковий засів
                .spawnPerTick(1)
                .maxPassengerWaitTicks(20).driverSpeedKmPerTick(0.1).quotaMode("RIDES").quotaTarget(30.0)         // підняв (на 5 вигравалось миттєво)
                .maxTicks(400)
                .maxAbandoned(20).build();
    }
}