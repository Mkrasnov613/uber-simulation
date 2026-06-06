package com.ubersim.services;

import com.ubersim.domain.Coordinates;
import com.ubersim.domain.Driver;
import com.ubersim.map.RoadGraph;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovementService {

    private final RoadGraph graph;

    public MovementService(RoadGraph graph) {
        this.graph = graph;
    }

    // Build a route and put the driver on it
    public void routeTo(Driver driver, String fromNodeId, String toNodeId) {
        List<String> route = graph.findPath(fromNodeId, toNodeId);
        driver.setPath(route);
        driver.setPathIndex(route.size() > 1 ? 1 : 0);  // index 0 is where we already are
    }

    public boolean advance(Driver driver, double stepKm) {
        List<String> path = driver.getPath();
        if (path == null || driver.getPathIndex() >= path.size()) {
            return true; // no active route, or already at the end
        }

        // the waypoint we are heading to right now
        Coordinates target = graph.node(path.get(driver.getPathIndex())).location();
        driver.moveToward(target, stepKm);   // your existing step, just toward the next node

        // reached this waypoint? (stepToward snaps exactly onto target when within stepKm)
        if (driver.getLocation().distanceTo(target) < 1e-9) {
            driver.setCurrentNodeId(path.get(driver.getPathIndex()));   // now sitting on it
            driver.setPathIndex(driver.getPathIndex() + 1);             // aim at the next
        }

        return driver.getPathIndex() >= path.size();
    }
}
