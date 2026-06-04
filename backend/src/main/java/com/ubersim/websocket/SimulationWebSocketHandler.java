package com.ubersim.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ubersim.domain.SimulationState;
import com.ubersim.engine.SimulationEngine;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class SimulationWebSocketHandler extends TextWebSocketHandler {

    private final SimulationEngine engine;
    private final ObjectMapper objectMapper;
    private final CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();

    public SimulationWebSocketHandler(SimulationEngine engine, ObjectMapper objectMapper) {
        this.engine = engine;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        sendState(session, engine.getState());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
    }

    public void broadcast(String json) {
    for (WebSocketSession session : sessions) {
      try {
          if (session.isOpen()) {
              synchronized (session) { session.sendMessage(new TextMessage(json)); }
          }
      } catch (IOException e) { sessions.remove(session); }
    }
}

    private void sendState(WebSocketSession session, SimulationState state) {
        try {
            if (session.isOpen()) {
                String json = objectMapper.writeValueAsString(state);
                synchronized (session) {
                    session.sendMessage(new TextMessage(json));
                }
            }
        } catch (IOException e) {
            sessions.remove(session);
        }
    }
}