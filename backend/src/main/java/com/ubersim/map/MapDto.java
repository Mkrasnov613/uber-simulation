package com.ubersim.map;

import java.util.List;

public record MapDto(List<NodeDto> nodes, List<EdgeDto> edges) {}