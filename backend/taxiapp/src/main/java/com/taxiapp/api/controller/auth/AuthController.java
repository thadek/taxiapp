package com.taxiapp.api.controller.auth;

import com.taxiapp.api.service.exception.auth.AuthException;
import com.taxiapp.api.model.dto.impl.UserDTOImpl;
import com.taxiapp.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
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


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
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
    public ResponseEntity<String> me(Authentication auth) {

        try{

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            UserDTOImpl user = (UserDTOImpl) userDetails;

            return ResponseEntity.ok("asd");
        }catch(Exception e){
            if(e instanceof AuthException){
                AuthException ex = (AuthException) e;
                throw new ResponseStatusException(ex.getStatusCode(),ex.getMessage());
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error interno");
        }
    }

}
