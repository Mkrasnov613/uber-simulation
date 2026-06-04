package com.ubersim.engine;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ubersim.websocket.SimulationWebSocketHandler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SimulationTicker {

  private final SimulationEngine engine;
  private final SimulationWebSocketHandler handler;
  private final ObjectMapper objectMapper;

  public SimulationTicker(SimulationEngine engine, SimulationWebSocketHandler handler, ObjectMapper objectMapper) {
      this.engine = engine;
      this.handler = handler;
      this.objectMapper = objectMapper;
  }

  @Scheduled(fixedRate = 700)
  public void tickAndBroadcast() {
    String json;
    synchronized (engine) {
      engine.tick();
      try {
        json = objectMapper.writeValueAsString(engine.getState());
      } catch (JsonProcessingException e) {
        return;
      }
    }
  handler.broadcast(json);
  }
}