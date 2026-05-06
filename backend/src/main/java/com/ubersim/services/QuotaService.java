package com.ubersim.services;

import com.ubersim.domain.*;
import com.ubersim.enums.SimulationStatus;
import org.springframework.stereotype.Service;

@Service
public class QuotaService {
    public SimulationStatus evaluate(SimulationConfig config, SimulationStats stats, int currentTick) {
        return SimulationStatus.IDLE;
    }

    public boolean isQuotaMet(SimulationConfig config, SimulationStats stats) {
        return false;
    }

    public double getProgress(SimulationConfig config, SimulationStats stats) {
        return 0;
    }
}