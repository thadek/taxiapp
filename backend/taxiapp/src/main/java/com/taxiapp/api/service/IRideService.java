package com.taxiapp.api.service;

import com.taxiapp.api.entity.Ride;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IRideService {

    public Page<Ride> findAll(Pageable pageable);


}
