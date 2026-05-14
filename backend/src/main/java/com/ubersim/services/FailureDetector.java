package com.ubersim.services;

import com.ubersim.domain.*;
import com.ubersim.engine.SimulationConfig;
import com.ubersim.enums.PassengerStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FailureDetector {
    public List<Passenger> detectAbandoned(List<Passenger> passengers) {
        List<Passenger> abandonedPassengers = new ArrayList<>();

        for(Passenger passenger :passengers){
            //adds wait time to passengers that are waiting
            if(passenger.getStatus() == PassengerStatus.WAITING){
                passenger.incrementWait();
                //when passenger waits too long, abandons the trip and is added to the list
                //of passengers that abandoned the trip
                if(passenger.getMaxWaitTicks()>=passenger.getWaitingTicks()){
                    passenger.abandon();
                    abandonedPassengers.add(passenger);
                }

            }
        }
        return abandonedPassengers;
    }

    public boolean hasSimulationFailed(SimulationConfig config, SimulationStats stats, int currentTick) {
        return false;
    }
}