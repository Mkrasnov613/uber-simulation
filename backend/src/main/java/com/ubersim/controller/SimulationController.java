package com.ubersim.controller;

import com.ubersim.domain.*;
import com.ubersim.engine.SimulationConfig;
import com.ubersim.engine.SimulationEngine;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/export/json")
    public ResponseEntity<List<TickSnapshot>> exportJson() {
        return ResponseEntity.ok(engine.getHistory());
    }

    @GetMapping("/export/csv")
    public ResponseEntity<String> exportCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("Tick,Waiting Passengers,Active Trips,Completed Trips,Abandoned,Available Drivers,Busy Drivers,Total Earnings,Avg Wait (sec)\n");
        for (TickSnapshot snap : engine.getHistory()) {
            sb.append(snap.tick()).append(",")
              .append(snap.waitingPassengers()).append(",")
              .append(snap.activeTrips()).append(",")
              .append(snap.completedTrips()).append(",")
              .append(snap.abandonedPassengers()).append(",")
              .append(snap.availableDrivers()).append(",")
              .append(snap.busyDrivers()).append(",")
              .append(String.format("%.2f", snap.totalEarnings())).append(",")
              .append(String.format("%.1f", snap.avgWaitTimeSec())).append("\n");
        }
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=simulation.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(sb.toString());
    }
}