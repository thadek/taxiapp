package com.taxiapp.api.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class BusinessConfig {

    @Id
    @Column(nullable = false, length = 36)
    private String id;
    private String name;
    private Double dayTimeKmPrice;
    private Double nightTimeKmPrice;
    private String coords;


}
