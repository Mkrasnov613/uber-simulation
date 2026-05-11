package com.ubersim.services;

import com.ubersim.domain.SimulationStats;
import com.ubersim.engine.SimulationConfig;
import com.ubersim.enums.SimulationStatus;
import org.springframework.stereotype.Service;

@Service
public class QuotaService {

    public SimulationStatus evaluate(SimulationConfig config, SimulationStats stats, int currentTick) {
        if (isQuotaMet(config, stats)) {
            return SimulationStatus.COMPLETED;
        }

        if (currentTick >= config.getMaxTicks()) {
            return SimulationStatus.FAILED;
        }

        return SimulationStatus.RUNNING;
    }

    public boolean isQuotaMet(SimulationConfig config, SimulationStats stats) {
        if ("RIDES".equals(config.getQuotaMode())) {
            return stats.getCompletedTrips() >= config.getQuotaTarget();

        } else if ("EARNINGS".equals(config.getQuotaMode())) {
            return stats.getTotalEarnings() >= config.getQuotaTarget();
        }
        return false;
    }

    public double getProgress(SimulationConfig config, SimulationStats stats) {
        double current = 0;

        if ("RIDES".equals(config.getQuotaMode())) {
            current = stats.getCompletedTrips();
        } else if ("EARNINGS".equals(config.getQuotaMode())) {
            current = stats.getTotalEarnings();
        }

        if (config.getQuotaTarget() <= 0) return 1.0;

        double progress = current / config.getQuotaTarget();
        return Math.min(progress, 1.0);
    }
}
