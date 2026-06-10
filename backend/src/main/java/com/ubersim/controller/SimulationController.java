package com.ubersim.controller;

import com.ubersim.domain.*;
import com.ubersim.engine.SimulationConfig;
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
        engine.start(config);
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/tick")
    public ResponseEntity<SimulationState> tick() {
        engine.tick();
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/stop")
    public ResponseEntity<SimulationState> stop() {
        engine.stop();
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/resume")
    public ResponseEntity<SimulationState> resume() {
        engine.resume();
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/reset")
    public ResponseEntity<SimulationState> reset() {
        engine.reset();
        return ResponseEntity.ok(engine.getState());
    }
}