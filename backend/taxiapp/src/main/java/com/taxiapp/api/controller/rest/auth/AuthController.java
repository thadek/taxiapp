package com.taxiapp.api.controller.rest.auth;

import com.taxiapp.api.controller.rest.auth.dto.RegisterRequest;
import com.taxiapp.api.controller.rest.user.dto.UserDTO;
import com.taxiapp.api.exception.auth.AuthException;
import com.taxiapp.api.controller.rest.auth.dto.AuthResponse;
import com.taxiapp.api.controller.rest.auth.dto.LoginRequest;

import com.taxiapp.api.service.impl.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authService;


    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        try{
            return ResponseEntity.ok(authService.login(request));
        }catch(Exception e){
            if(e instanceof AuthException){
                AuthException ex = (AuthException) e;
                throw new ResponseStatusException(ex.getStatusCode(),ex.getMessage());
            }
            System.out.println(e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error interno");
        }

    }


    @CrossOrigin(origins = "*")
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        try{
            return ResponseEntity.ok(authService.register(request));
        }catch(Exception e){
            if(e instanceof AuthException){
                AuthException ex = (AuthException) e;
                throw new ResponseStatusException(ex.getStatusCode(),ex.getMessage());
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error interno");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication auth) {

        try{
            return ResponseEntity.ok(authService.getMe(auth));
        }catch(Exception e){
            if(e instanceof AuthException){
                AuthException ex = (AuthException) e;
                throw new ResponseStatusException(ex.getStatusCode(),ex.getMessage());
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error interno");
        }
    }

}
