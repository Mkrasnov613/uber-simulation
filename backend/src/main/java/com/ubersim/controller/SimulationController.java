package com.ubersim.controller;

import com.ubersim.model.SimulationState;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    @GetMapping("/state")
    public SimulationState getState() {
        return SimulationState.stub();
    }
}