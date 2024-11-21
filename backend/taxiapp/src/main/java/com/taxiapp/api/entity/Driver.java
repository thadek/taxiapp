package com.taxiapp.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@AllArgsConstructor

@RequiredArgsConstructor
public class Driver extends User {



    @Column(nullable = false, length = 50)
    private String licenseId;

    @Column(nullable = false, length = 50)
    private String rating;

    @Column(nullable = false)
    private Boolean isAvailable;

}
