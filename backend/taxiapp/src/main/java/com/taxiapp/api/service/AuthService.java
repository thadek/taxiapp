package com.taxiapp.api.service;


import com.taxiapp.api.controller.auth.AuthResponse;
import com.taxiapp.api.controller.auth.LoginRequest;
import com.taxiapp.api.controller.auth.RegisterRequest;
import com.taxiapp.api.exception.auth.AuthException;
import com.taxiapp.api.model.dto.impl.UserDTOImpl;
import com.taxiapp.api.model.entity.Role;
import com.taxiapp.api.model.entity.User;
import com.taxiapp.api.repository.RoleRepository;
import com.taxiapp.api.repository.UserRepository;
import com.taxiapp.api.security.JwtAuthenticationProvider;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {


        private final RoleRepository roleRepository;
        private final UserRepository userRepository;
        private final JwtAuthenticationProvider jwtAuthenticationProvider;
        private final PasswordEncoder passwordEncoder;
        public AuthResponse login(LoginRequest request) {

            Optional<User> user = userRepository.findByEmail(request.getEmail());
            if(user.isEmpty()){
                throw new AuthException("Usuario no encontrado", HttpStatus.NOT_FOUND);
            }

            if(!passwordEncoder.matches(request.getPassword(),user.get().getPassword())){
                throw new AuthException("Contraseña incorrecta", HttpStatus.UNAUTHORIZED);
            }

            User userDB = user.get();


            UserDTOImpl userDTO = UserDTOImpl.builder().id(userDB.getId().toString())
                    .name(userDB.getName())
                    .lastname(userDB.getLastname())
                    .username(userDB.getUsername())
                    .email(userDB.getEmail())
                    .roles(userDB.getRoles())
                    .build();

            return new AuthResponse(jwtAuthenticationProvider.createToken(userDTO));

        }

        public AuthResponse register(RegisterRequest request)  {

            try{
                if(!roleRepository.findByName("ROLE_USER").isPresent()){
                   throw new AuthException("Error al registrar el usuario",HttpStatus.INTERNAL_SERVER_ERROR);
                }


            Role role = roleRepository.findByName("ROLE_USER").get();


            User user = User.builder()
                    .username(request.getUsername())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .email(request.getEmail())
                    .name(request.getName())
                    .lastname(request.getLastname())
                    .is_disabled(null)
                    .build();

            //Asignar rol al usuario
            user.setRoles(Set.of(role));
            //Guardar si el usuario no existe
            if(!userRepository.findByUsernameAndEmail(request.getUsername(),request.getEmail()).isEmpty()){
                throw new AuthException("Usuario ya registrado",HttpStatus.BAD_REQUEST);
            }

            User userCreated = userRepository.save(user);

            if(userCreated == null){
                throw new AuthException("Error al registrar el usuario",HttpStatus.INTERNAL_SERVER_ERROR);
            }

            UserDTOImpl userDTO = UserDTOImpl.builder().id(userCreated.getId().toString())
                    .name(userCreated.getName())
                    .lastname(userCreated.getLastname())
                    .username(userCreated.getUsername())
                    .email(userCreated.getEmail())
                    .roles(userCreated.getRoles())
                    .build();

            String token =  jwtAuthenticationProvider.createToken(userDTO);

            return new AuthResponse(token);

            }catch (Exception e){
               throw new AuthException("Error al registrar el usuario",HttpStatus.INTERNAL_SERVER_ERROR);
            }

        }

}
