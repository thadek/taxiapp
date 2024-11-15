package com.taxiapp.api.config.security.websocket;


import com.taxiapp.api.config.security.JwtAuthenticationProvider;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthChannelInterceptor implements ChannelInterceptor {

    private final JwtAuthenticationProvider jwtTokenProvider;

    public AuthChannelInterceptor(JwtAuthenticationProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = accessor.getFirstNativeHeader("token");
            if (token != null) {
                // Autenticar el usuario y establecer el contexto de seguridad
                Authentication auth = jwtTokenProvider.validateToken(token);
                //SecurityContextHolder.getContext().setAuthentication(auth);
                accessor.setUser(auth);
            }
        }

        return message;
    }
}