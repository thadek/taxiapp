package com.taxiapp.api.model;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Coordenada {
    private double x;
    private double y;

    public Coordenada(double x, double y) {
        this.x = x;
        this.y = y;
    }
}