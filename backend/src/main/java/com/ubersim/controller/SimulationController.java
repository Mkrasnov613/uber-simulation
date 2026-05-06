package com.ubersim.controller;

import com.ubersim.domain.*;
import com.ubersim.engine.SimulationEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final SimulationEngine engine;

    public SimulationController(SimulationEngine engine) {
        this.engine = engine;
    }

    @GetMapping("/state")
    public SimulationState getState() {
        return engine.getState();
    }

    @PostMapping("/start")
    public ResponseEntity<SimulationState> start(@RequestBody(required = false) SimulationConfig config) {
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/tick")
    public ResponseEntity<SimulationState> tick() {
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/stop")
    public ResponseEntity<SimulationState> stop() {
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/reset")
    public ResponseEntity<SimulationState> reset() {
        return ResponseEntity.ok(engine.getState());
    }
}