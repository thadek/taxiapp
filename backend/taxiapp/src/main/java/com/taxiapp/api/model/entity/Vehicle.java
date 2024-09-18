package com.taxiapp.api.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Data
public class Vehicle implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, length = 36)
    private String id;

    @Column(nullable = false, length = 50)
    private String driver_id;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(nullable = false, length = 50)
    private String color;

    @Column(nullable = false, length = 50)
    private String details;

    @Column(nullable = false)
    private Date is_disabled;

    @Column(nullable = false, length = 50)
    private Integer year;

    @Column(nullable = false, length = 50)
    private String license_plate;

    @OneToMany(mappedBy = "vehicle")
    @JoinColumn(name="vehicle_id")
    private List<Ride> rides;

}