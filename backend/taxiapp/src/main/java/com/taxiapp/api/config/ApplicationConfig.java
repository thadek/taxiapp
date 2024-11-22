package com.taxiapp.api.config;


import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.taxiapp.api.config.security.JwtAuthenticationFilter;
import com.taxiapp.api.config.security.JwtAuthenticationProvider;
import com.taxiapp.api.config.security.websocket.AuthChannelInterceptor;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;

@RequiredArgsConstructor
@Configuration
public class ApplicationConfig {

    private final JwtAuthenticationProvider jwtAuthenticationProvider;



    /**
     * Bean Password encoder para inyección
     * @return Implementación BCryptPasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder()   { return new BCryptPasswordEncoder();}

    /**
     * Bean de JwtAuth Filter para inyección
     * @return Implementación JwtAuthenticationFilter
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtAuthenticationProvider);
    }


    @Bean
    public AuthChannelInterceptor jwtHandShakeInterceptor() {
        return new AuthChannelInterceptor(jwtAuthenticationProvider);
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }




}
