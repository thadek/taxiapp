package com.taxiapp.api.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;


@Entity
@Data
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, length = 36)
    private String id;

    @Column(nullable = false, length = 50)
    private String client_id;

    @Column(nullable = false, length = 50)
    private String vehicle_id;

    @Column(nullable = false, length = 50)
    private String pickup_location;

    @Column(nullable = false, length = 50)
    private String dropoff_location;

    @Column(nullable = false)
    private Date ride_start;

    @Column(nullable = false)
    private Date ride_end;

    @Column(nullable = false)
    private Float price;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(nullable = false)
    private Integer rating;

    @ManyToOne
    @JoinColumn(name="vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @OneToMany(mappedBy = "ride")
    @JoinColumn(name="ride_id")
    private List<Report> reports;

    @OneToMany(mappedBy = "ride")
    @JoinColumn(name="ride_id")
    private List<RideHistory> rideHistoryList;

}
