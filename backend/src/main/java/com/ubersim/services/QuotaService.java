package com.ubersim.services;

import com.ubersim.domain.SimulationStats;
import com.ubersim.engine.SimulationConfig;
import com.ubersim.enums.SimulationStatus;
import org.springframework.stereotype.Service;

@Service
public class QuotaService {

    public SimulationStatus evaluate(SimulationConfig config, SimulationStats stats, int currentTick) {
        // WIN: quota (rides or earnings) reached
        if (isQuotaMet(config, stats)) {
            return SimulationStatus.COMPLETED;
        }

        // LOSE (early): too many passengers gave up
        if (hasSimulationFailed(config, stats)) {
            return SimulationStatus.FAILED;
        }

        // LOSE (timeout): ran out of ticks without hitting the quota
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

    // the "lose" parameter: fail once abandonment crosses the configured limit
    public boolean hasSimulationFailed(SimulationConfig config, SimulationStats stats) {
        return stats.getCancelledTrips() >= config.getMaxAbandoned();
    }

    public double getProgress(SimulationConfig config, SimulationStats stats) {
        double current = "EARNINGS".equals(config.getQuotaMode())
                ? stats.getTotalEarnings()
                : stats.getCompletedTrips();

        if (config.getQuotaTarget() <= 0) return 1.0;
        return Math.min(current / config.getQuotaTarget(), 1.0);
    }
}
