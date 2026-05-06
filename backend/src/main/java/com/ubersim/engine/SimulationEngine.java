package com.ubersim.engine;

import com.ubersim.domain.*;
import com.ubersim.enums.SimulationStatus;
import com.ubersim.services.*;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
public class SimulationEngine {

    private final MatchingService matchingService;
    private final TripService tripService;
    private final QuotaService quotaService;
    private final FailureDetector failureDetector;

    @Getter
    private SimulationState state;

    public SimulationEngine(MatchingService matchingService, TripService tripService, QuotaService quotaService, FailureDetector failureDetector) {
        this.matchingService = matchingService;
        this.tripService = tripService;
        this.quotaService = quotaService;
        this.failureDetector = failureDetector;
        this.state = SimulationState.stub();
    }

    public void start(SimulationConfig config) {
    }

    public void tick() {
    }

    public void stop() {
    }

    public void reset() {
        state = SimulationState.stub();
    }
}