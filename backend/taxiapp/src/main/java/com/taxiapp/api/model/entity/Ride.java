package com.taxiapp.api.model.entity;

import com.taxiapp.api.enums.RideStatus;
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
    private String pickup_location;

    @Column(nullable = false, length = 50)
    private String dropoff_location;

    @Column(nullable = false)
    private Boolean is_booked;

    @Column(nullable = false)
    private Date ride_start;

    @Column(nullable = false)
    private Date ride_end;

    @Column(nullable = false)
    private Float price;

    @Column(nullable = false, length = 50)
    private RideStatus status;

    @Column(nullable = false)
    private Integer rating;

    @ManyToOne
    @JoinColumn(name="vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User client;

    @OneToMany(mappedBy = "ride")
    private List<Report> reports;

    @Column(nullable = false)
    private Date created_at;

    @Column(nullable = false)
    private Date updated_at;

}
