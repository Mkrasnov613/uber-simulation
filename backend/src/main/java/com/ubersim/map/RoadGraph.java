package com.ubersim.map;

import com.ubersim.domain.Coordinates;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

public class RoadGraph {

    private final Map<String, Node> nodes = new HashMap<>();
    private final Map<String, List<Edge>> adjacency = new HashMap<>();

    private RoadGraph() {
    }

    public static RoadGraph generateGrid(int rows, int cols, double minLat, double maxLat, double minLng, double maxLng) {
        RoadGraph graph = new RoadGraph();

        // step between adjacent nodes on each axis
        double latStep = (maxLat - minLat) / (rows - 1);
        double lngStep = (maxLng - minLng) / (cols - 1);

        // First pass: place the nodes on the grid.
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                String id = row + "-" + col;

                double lat = minLat + row * latStep;
                double lng = minLng + col * lngStep;

                Node node = new Node(id, new Coordinates(lat, lng));
                graph.nodes.put(id, node);
                graph.adjacency.put(id, new ArrayList<>());
            }
        }

        // Second pass: connect each node to its right and down neighbour.
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                String id = row + "-" + col;
                if (col + 1 < cols) graph.connect(id, row + "-" + (col + 1));
                if (row + 1 < rows) graph.connect(id, (row + 1) + "-" + col);
            }
        }
        return graph;
    }

    public List<String> findPath(String startId, String targetId) {

        // Shortest distance KNOWN SO FAR from the start to each node.
        Map<String, Double> dist = new HashMap<>();

        // "Who came before this node" on the shortest path - used to rebuild the route.
        Map<String, String> prev = new HashMap<>();

        // At the start we know nothing: every node is infinitely far away.
        for (String id : nodes.keySet()) {
            dist.put(id, Double.POSITIVE_INFINITY);
        }
        dist.put(startId, 0.0);

        // The "frontier": a queue that always hands back the node with the SMALLEST distance.
        PriorityQueue<Frontier> priorityQueue = new PriorityQueue<>(Comparator.comparingDouble(Frontier::dist));

        // Seed it with the start (distance 0).
        priorityQueue.add(new Frontier(startId, 0.0));

        while (!priorityQueue.isEmpty()) {

            // Pull the nearest not-yet-finalized node.
            Frontier frontier = priorityQueue.poll();
            String current = frontier.nodeId();

            // Stale copy: we already found a shorter path to current. Skip it.
            if (frontier.dist() > dist.get(current)) continue;

            // Reached the target - its distance is final now.
            if (current.equals(targetId)) break;

            // RELAX: try to improve the distance to each neighbour of current.
            for (Edge edge : neighbors(current)) {
                double newDist = dist.get(current) + edge.weightKm();

                if (newDist < dist.get(edge.to())) {
                    dist.put(edge.to(), newDist);
                    prev.put(edge.to(), current);
                    priorityQueue.add(new Frontier(edge.to(), newDist));
                }
            }
        }

        return reconstructPath(prev, startId, targetId);
    }

    public List<Edge> neighbors(String nodeId) {
        return adjacency.getOrDefault(nodeId, List.of());
    }

    public Node node(String nodeId) {
        return nodes.get(nodeId);
    }

    public String randomNodeId() {
        List<String> ids = new ArrayList<>(nodes.keySet());
        return ids.get(ThreadLocalRandom.current().nextInt(ids.size()));
    }

    public MapDto toDto() {
        List<NodeDto> nodeDtos = new ArrayList<>();
        for (Node node : nodes.values()) {
            nodeDtos.add(new NodeDto(node.id(), node.location().getLatitude(), node.location().getLongitude()));
        }

        List<EdgeDto> edgeDtos = new ArrayList<>();
        for (var entry : adjacency.entrySet()) {
            String from = entry.getKey();
            for (Edge edge : entry.getValue()) {
                if (from.compareTo(edge.to()) < 0) {   // emit each undirected edge once
                    edgeDtos.add(new EdgeDto(from, edge.to()));
                }
            }
        }
        return new MapDto(nodeDtos, edgeDtos);
    }

    private void connect(String a, String b) {
        Node nodeA = nodes.get(a);
        Node nodeB = nodes.get(b);

        double w = nodeA.location().distanceTo(nodeB.location());

        adjacency.get(a).add(new Edge(b, w));
        adjacency.get(b).add(new Edge(a, w));
    }

    private List<String> reconstructPath(Map<String, String> prev, String startId, String targetId) {

        // Collect the path from the TARGET back to the start.
        List<String> path = new ArrayList<>();

        String at = targetId;
        while (at != null) {
            path.add(at);
            if (at.equals(startId)) break;
            at = prev.get(at);
        }

        // If the prev chain didn't lead back to the start, the target is unreachable.
        if (path.isEmpty() || !path.get(path.size() - 1).equals(startId)) {
            return List.of();
        }

        Collections.reverse(path);
        return path;
    }

    // One queue element: a node and the distance we enqueued it with.
    // The distance lives inside the entry (not read from the map) because the
    // queue sorts by it - and that's exactly how we detect stale copies.
    private record Frontier(String nodeId, double dist) {
    }
}