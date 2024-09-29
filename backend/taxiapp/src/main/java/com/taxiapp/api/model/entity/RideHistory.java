package com.taxiapp.api.model.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Entity
@Data
public class RideHistory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, length = 36)
    private String id;

    @Column(nullable = false, length = 50)
    private String ride_id;

    @Column(nullable = false)
    private Date timestamp;

    @Column(nullable = false, length = 50)
    private String event_type;

    @ManyToOne
    @JoinColumn(name="ride_id")
    private Ride ride;

}
