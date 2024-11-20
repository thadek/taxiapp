package com.taxiapp.api.config.security;

import com.fasterxml.jackson.databind.ObjectMapper;


import com.taxiapp.api.exception.auth.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;


import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter{
    private final JwtAuthenticationProvider jwtAuthenticationProvider;


    public JwtAuthenticationFilter(JwtAuthenticationProvider jwtAuthenticationProvider) {
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
    }

    @Override
    public boolean shouldNotFilter(HttpServletRequest request) {
        List<String> pathsToSkip = List.of("/auth/login", "/auth/register","/docs/", "/v3/api-docs/","/v3/api-docs","/ws/","/ws");
        return pathsToSkip.stream().anyMatch(path -> request.getRequestURI().contains(path));

    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
       try {


        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if(header == null || !header.startsWith("Bearer ")){
          throw new AccessDeniedException("Token not found");

        }
        String token = header.substring(7);

            //Traigo el objeto auth que tiene el user con los roles(authorities) cargados  y lo seteo al contexto de seguridad
            Authentication authentication = jwtAuthenticationProvider.validateToken(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);

           // System.out.println(SecurityContextHolder.getContext());

            filterChain.doFilter(request,response);

       }catch(Exception e) {

           response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
           response.setContentType("application/json");
           ObjectMapper objectMapper = new ObjectMapper();

            ErrorResponse authError = new ErrorResponse(e.getMessage(), 401);

           response.getWriter().write(objectMapper.writeValueAsString(authError));
       }
    }


}
