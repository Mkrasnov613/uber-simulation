package com.ubersim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UberSimulationApplication {
    public static void main(String[] args) {
        SpringApplication.run(UberSimulationApplication.class, args);
    }
}
