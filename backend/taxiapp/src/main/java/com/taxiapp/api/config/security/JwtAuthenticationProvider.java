package com.taxiapp.api.config.security;

import com.taxiapp.api.controller.rest.user.dto.UserDTO;
import com.taxiapp.api.exception.auth.AuthException;

import com.taxiapp.api.model.Role;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationProvider {

    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.token.validity}")
    private Integer tokenValidity;

    public String createToken(UserDTO user) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + tokenValidity); // 24 horas
        return Jwts.builder()
                .setSubject(user.email())
                .claim("roles", user.roles().stream().map(Role::getName).collect(Collectors.joining(",")))
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Authentication validateToken(String token) {
        SecurityContext context = SecurityContextHolder.getContext();
        try {
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token);
            Claims claims = claimsJws.getBody();

            final Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("roles").toString().split(","))
                    .map(SimpleGrantedAuthority::new).collect(Collectors.toSet());


          return  new UsernamePasswordAuthenticationToken(claims.getSubject(), null, authorities);

         } catch (ExpiredJwtException e) {
            throw new AuthException( "Expired JWT Token", HttpStatus.UNAUTHORIZED);
         } catch (JwtException | IllegalArgumentException e) {
            throw new AuthException("Invalid JWT token", HttpStatus.UNAUTHORIZED);
        }


    }


    public String getUserFromToken(String token) {
        try {
            Jws<Claims
                    > claimsJws = Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token);
            Claims claims = claimsJws.getBody();
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            throw new AuthException("Expired JWT Token", HttpStatus.UNAUTHORIZED);
        } catch (JwtException | IllegalArgumentException e) {
            throw new AuthException("Invalid JWT token", HttpStatus.UNAUTHORIZED);

        }
    }


}
