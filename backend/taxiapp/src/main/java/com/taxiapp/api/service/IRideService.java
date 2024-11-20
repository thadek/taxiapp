package com.taxiapp.api.service;

import com.taxiapp.api.model.Ride;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IRideService {

    public Page<Ride> findAll(Pageable pageable);


}
