package com.taxiapp.api.config;


import com.taxiapp.api.config.security.websocket.AuthChannelInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final AuthChannelInterceptor authChannelInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Esto es para los mensajes que se envían desde el servidor al cliente
        config.setUserDestinationPrefix("/user");
        config.setApplicationDestinationPrefixes("/app"); // Esto es para los mensajes que se envían desde el cliente al servidor

    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
     //  registry.addEndpoint("/ws").addInterceptors(jwtHandShakeInterceptor).setAllowedOriginPatterns("*");
       registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(authChannelInterceptor);
    }



}

