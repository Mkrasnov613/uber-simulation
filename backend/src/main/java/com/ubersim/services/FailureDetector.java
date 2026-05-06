package com.ubersim.services;

import com.ubersim.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FailureDetector {
    public List<Passenger> detectAbandoned(List<Passenger> passengers) {
        return List.of();
    }

    public boolean hasSimulationFailed(SimulationConfig config, SimulationStats stats, int currentTick) {
        return false;
    }
}