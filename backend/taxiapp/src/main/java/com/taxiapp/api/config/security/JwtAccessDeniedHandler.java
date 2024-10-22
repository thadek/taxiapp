package com.taxiapp.api.config.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.access.AccessDeniedHandler;

import org.springframework.security.access.AccessDeniedException;

import org.springframework.stereotype.Component;


import java.io.IOException;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        // Responder con un 403 Forbidden cuando el usuario no tiene permisos
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden: No tienes permiso para acceder a este recurso");
    }
}
