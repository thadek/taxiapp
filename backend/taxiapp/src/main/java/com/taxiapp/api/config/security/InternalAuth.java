package com.taxiapp.api.config.security;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class InternalAuth {

    /**
     * Metodo que setea el contexto de seguridad con un usuario ADMIN para realizar operaciones internas
     */
    public static void performInternalTask() {
        // Autenticación programática para acceso interno
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("internal_user", null,
                        Arrays.asList(new SimpleGrantedAuthority("ROLE_ADMIN")))
        );

    }
}
