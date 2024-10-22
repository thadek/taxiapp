package com.taxiapp.api.config.security.websocket;

import java.util.Map;

import com.taxiapp.api.config.security.JwtAuthenticationProvider;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;




@RequiredArgsConstructor
public class JWTHandShakeInterceptor implements HandshakeInterceptor {

    private final JwtAuthenticationProvider jwtprovider;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        try {

            String authToken = request.getHeaders().getFirst("Authorization");
            if(authToken == null || !authToken.startsWith("Bearer ")){
                throw new AccessDeniedException("Token no encontrado");

            }
            String token = authToken.substring(7);
            Authentication authentication = jwtprovider.validateToken(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            attributes.put("user", jwtprovider.getUserFromToken(token));
            return true;
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            return false;
        }

    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}