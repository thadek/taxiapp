package com.taxiapp.api.config;


import com.taxiapp.api.config.security.JwtAccessDeniedHandler;
import com.taxiapp.api.config.security.JwtAuthenticationFilter;

import com.taxiapp.api.config.security.JWTAuthEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JWTAuthEntryPoint jwtAuthEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, JWTAuthEntryPoint jwtAuthEntryPoint, JwtAccessDeniedHandler jwtAccessDeniedHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthEntryPoint = jwtAuthEntryPoint;
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        http
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex->{
                    ex.authenticationEntryPoint(jwtAuthEntryPoint);
                    ex.accessDeniedHandler(jwtAccessDeniedHandler);
                })

                 .authorizeHttpRequests(authorize->
                    authorize.requestMatchers("/auth/*","/error","/docs/**","/v3/api-docs/**","/v3/api-docs","/ws/**").permitAll()
                                    .anyRequest().authenticated())

                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                .sessionManagement((session)-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();

    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000"); // Reemplaza con la URL de tu frontend
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return source;
    }



}
