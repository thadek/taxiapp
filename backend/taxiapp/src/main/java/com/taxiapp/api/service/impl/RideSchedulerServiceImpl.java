package com.taxiapp.api.service.impl;

import com.taxiapp.api.entity.Ride;
import com.taxiapp.api.enums.RideEvent;
import com.taxiapp.api.enums.RideStatus;
import com.taxiapp.api.events.ride.RideStatusChangeEvent;
import com.taxiapp.api.handler.NotificationServiceHandler;
import com.taxiapp.api.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class RideSchedulerServiceImpl {

    private final RideRepository rideRepository;
    private final Logger logger = LoggerFactory.getLogger(RideSchedulerServiceImpl.class);

    private final ApplicationEventPublisher eventPublisher;

    @Scheduled(fixedRate = 60000)
    @Transactional// Ejecuta cada 1 minuto
    public void updateScheduledRides() {
        // Obtener la hora actual
        Date now = new Date();

        // Calcular el margen de 2 minutos en el futuro
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(now);
        calendar.add(Calendar.MINUTE, 2);
        Date twoMinutesLater = calendar.getTime();

        // Buscar viajes programados
        rideRepository.findByStatus(RideStatus.PROGRAMMED).stream()
                .filter(ride -> ride.getRide_start().before(twoMinutesLater))
                .forEach(ride -> {
                    ride.setStatus(RideStatus.PENDING);
                    eventPublisher.publishEvent(new RideStatusChangeEvent(this, ride.getId(), RideEvent.UPDATED_BY_SYSTEM, ride));
                    rideRepository.save(ride);
                    logger.info("Ride programmed with id {} updated", ride.getId());
                });

        logger.info("Programmed Rides updated");
    }
}