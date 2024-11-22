package com.taxiapp.api.controller.websocket.location;

import com.taxiapp.api.model.Location;
import com.taxiapp.api.service.impl.LocationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.logging.Level;
import java.util.logging.Logger;


@RequiredArgsConstructor
@Controller
public class LocationController {

    private static final Logger logger = Logger.getLogger(LocationController.class.getName());
    private final LocationServiceImpl locationServiceImpl;

    /**
     * Espejo de las coordenadas de un usuario movil en el mapa
     * @param coords
     * @return Location
     */
    @MessageMapping("/location")
    @SendTo("/topic/locations")
    public LocationDTO sendCoords(Location coords, Principal principal) throws Exception {
        try{
            return locationServiceImpl.getVehicleLocation(coords, principal);
        }catch(Exception e) {
            logger.log(Level.WARNING, "Ocurrió un error en LocationController: " +e.getMessage());
            return null;
        }
    }

}