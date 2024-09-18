package com.taxiapp.api.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Role {

    @Id
    private Integer Id;

    @Column(unique = true)
    String name;
}
