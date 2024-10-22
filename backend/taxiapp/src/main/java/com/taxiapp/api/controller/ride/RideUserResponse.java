package com.taxiapp.api.controller.ride;

import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.model.Vehicle;
import jakarta.persistence.Column;
import lombok.*;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RideUserResponse {

    private String rideId;
    private RideStatus status;
    private String pickup_location;
    private String dropoff_location;
    private Float price;
    private Vehicle vehicle;

    private Boolean is_booked;
    private Date ride_start;
    private Date ride_end;


}
