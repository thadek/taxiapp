package com.taxiapp.api.service;

import com.taxiapp.api.controller.rest.auth.dto.AuthResponse;
import com.taxiapp.api.controller.rest.auth.dto.LoginRequest;
import com.taxiapp.api.controller.rest.auth.dto.RegisterRequest;
import com.taxiapp.api.controller.rest.user.dto.UserDTO;
import org.springframework.security.core.Authentication;

public interface IAuthService {

    public AuthResponse login(LoginRequest request);
    public AuthResponse register(RegisterRequest request);


}
