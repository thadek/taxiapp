package com.taxiapp.api.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Entity
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, length = 36)
    private String id;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(nullable = false, length = 50)
    private String color;

    @Column(nullable = false, length = 50)
    private String details;

    @Column()
    private Date is_disabled;

    @Column(nullable = false, length = 50)
    private Integer year;

    @Column(unique = true,nullable = false, length = 50)
    private String license_plate;

    @ManyToOne
    @JoinColumn(name="driver_id")
    private Driver driver;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "vehicle")
    private List<Ride> rides;

}