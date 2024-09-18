package com.taxiapp.api.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Entity
@Data
public class Driver implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, length = 36)
    private String id;

    @Column(nullable = false, length = 50)
    private String license_id;

    @Column(nullable = false, length = 50)
    private String rating;

    @Column(nullable = false)
    private Boolean is_available;

}
