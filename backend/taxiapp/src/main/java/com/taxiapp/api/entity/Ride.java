package com.taxiapp.api.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @Column(nullable = true)
    private Date ride_start;

    @Column(nullable = true)
    private Date ride_end;

    @Column(nullable = true)
    private String comments;

    @Column(nullable = true)
    private Float price;

    @Column(nullable = false, length = 50)
    private RideStatus status;

    @Column(nullable = true)
    private Integer rating;

    @ManyToOne
    @JoinColumn(name="vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User client;

    @OneToOne
    @JsonManagedReference
    @JoinColumn(name = "report_id", referencedColumnName = "id")
    private Report report;

    @Column(nullable = false, name="created_at")
    private Date createdAt;

    @Column(nullable = false, name="updated_at")
    private Date updatedAt;

}
