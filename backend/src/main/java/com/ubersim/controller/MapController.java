package com.ubersim.controller;

import com.ubersim.map.MapDto;
import com.ubersim.map.RoadGraph;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MapController {

    private final RoadGraph graph;

    public MapController(RoadGraph graph) {
        this.graph = graph;
    }

    @GetMapping("/api/map")
    public MapDto getMap() {
        return graph.toDto();
    }
}