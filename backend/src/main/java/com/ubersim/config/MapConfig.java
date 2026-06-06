package com.ubersim.config;

import com.ubersim.map.RoadGraph;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapConfig {

    @Bean
    public RoadGraph roadGraph() {
        return RoadGraph.generateGrid(7, 7, 52.15, 52.35, 20.90, 21.15);
    }
}
