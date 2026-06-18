package com.ubersim.config;

import com.ubersim.engine.SimulationConfig;
import com.ubersim.interfaces.MatchingStrategy;
import com.ubersim.services.NearestDriverStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class SimulationBeanConfig {

    @Bean
    public SimulationConfig simulationConfig() {
        return SimulationConfig.defaults();
    }

    @Bean
    @Primary
    public MatchingStrategy matchingStrategy() {
        return new NearestDriverStrategy();
    }
}
