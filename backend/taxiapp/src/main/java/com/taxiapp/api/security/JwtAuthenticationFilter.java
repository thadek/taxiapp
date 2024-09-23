package com.taxiapp.api.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;


import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter{
    private final JwtAuthenticationProvider jwtAuthenticationProvider;
    private final List<String> urlskipped = List.of("/auth/login","/auth/register","/test/test");

    public JwtAuthenticationFilter(JwtAuthenticationProvider jwtAuthenticationProvider) {
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return urlskipped.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(header == null || !header.startsWith("Bearer ")){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Token no proporcionado");
        }
        String token = header.substring(7);
        try{
            //Traigo el objeto auth que tiene el user con los roles(authorities) cargados  y lo seteo al contexto de seguridad
            Authentication authentication = jwtAuthenticationProvider.validateToken(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);

           // System.out.println(SecurityContextHolder.getContext());
        }catch (Exception e){
            SecurityContextHolder.clearContext();
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Token no válido");
        }
        
        filterChain.doFilter(request,response);
    }

}
