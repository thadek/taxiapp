package com.taxiapp.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
/*
@Configuration
public class WebConfig implements WebMvcConfigurer {

   @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")  // Rutas que quieres permitir
                .allowedOrigins("http://localhost:3000")  // Origen permitido
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Métodos HTTP permitidos
                .allowedHeaders("*")  // Headers permitidos
                .allowCredentials(true);
    }
}*/