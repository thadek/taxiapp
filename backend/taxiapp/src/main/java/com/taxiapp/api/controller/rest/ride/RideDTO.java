package com.taxiapp.api.controller.rest.ride;

import com.taxiapp.api.controller.rest.user.dto.UserClassDTO;
import com.taxiapp.api.controller.rest.user.dto.UserDTO;
import com.taxiapp.api.controller.rest.vehicle.dto.VehicleDTO;
import com.taxiapp.api.entity.Report;
import com.taxiapp.api.entity.User;
import com.taxiapp.api.entity.Vehicle;
import com.taxiapp.api.enums.RideStatus;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Data
public class RideDTO {

     String id;
     String pickup_location;
     String dropoff_location;
     Boolean is_booked;
     Date ride_start;
     Date ride_end;
     String comments;
     Float price;
     RideStatus status;
     Integer rating;
     VehicleDTO vehicle;
     UserClassDTO client;
     List<Report> reports;
     Date createdAt;
     Date updatedAt;
}
