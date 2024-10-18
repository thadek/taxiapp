package com.taxiapp.api.config;


import com.taxiapp.api.config.security.JwtAuthenticationFilter;
import com.taxiapp.api.config.security.JwtAuthenticationProvider;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.record.RecordModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

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
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

}
