package com.taxiapp.api.service;

import com.taxiapp.api.controller.auth.dto.AuthResponse;
import com.taxiapp.api.controller.auth.dto.LoginRequest;
import com.taxiapp.api.controller.auth.dto.RegisterRequest;
import com.taxiapp.api.controller.user.dto.UserDTO;
import org.springframework.security.core.Authentication;

public interface IAuthService {

    public AuthResponse login(LoginRequest request);
    public AuthResponse register(RegisterRequest request);
    public UserDTO getMe(Authentication auth);

}
