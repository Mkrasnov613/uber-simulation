package com.ubersim.config;

import com.ubersim.engine.SimulationConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SimulationBeanConfig {

    @Bean
    public SimulationConfig simulationConfig() {
        return SimulationConfig.defaults();
    }
}
