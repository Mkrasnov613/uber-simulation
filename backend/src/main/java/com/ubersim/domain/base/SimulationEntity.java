package com.ubersim.domain.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class SimulationEntity {
    protected String id;
    protected String name;
}
