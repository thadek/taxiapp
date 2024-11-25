package com.taxiapp.api.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.mapping.ToOne;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@Entity
@Data
@DynamicUpdate
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, length = 50)
    private String description;

    @Column(name = "last_location", nullable = false, length = 50)
    private String lastLocation;

    @Column(name = "date" , nullable = false)
    private Date date;

    @OneToOne(mappedBy = "report")
    @JsonBackReference
    @JoinColumn(name="ride_id")
    private Ride ride;

    @PreRemove
    private void preRemove() {
        if (ride != null) {
            ride.setReport(null);
        }
    }

}
