package com.taxiapp.api.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.util.Date;
import java.util.List;

@Entity
@Data
@SQLDelete(sql = "UPDATE user SET deleted = true WHERE id = ?")
@DynamicUpdate
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(nullable = false, length = 50)
    private String model;

    @Column(nullable = false, length = 50)
    private String color;

    @Column(nullable = false, length = 50)
    private String details;

    @Column(name = "is_disabled")
    private Date isDisabled;

    @Column(nullable = false)
    private boolean deleted = Boolean.FALSE;

    @Column(nullable = false, length = 50)
    private Integer year;

    @Column(unique = true,nullable = false, length = 50,name = "license_plate")
    private String licensePlate;

    @ManyToOne
    @JoinColumn(name="driver_id")
    private Driver driver;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "vehicle")
    private List<Ride> rides;

}