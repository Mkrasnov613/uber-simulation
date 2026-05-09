package com.ubersim.interfaces;

public interface Stateful<T extends Enum<T>> {
    T getStatus();
    void setStatus(T status);
    boolean isActive();
}
