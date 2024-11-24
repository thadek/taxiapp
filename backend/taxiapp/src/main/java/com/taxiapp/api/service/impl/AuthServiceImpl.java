package com.taxiapp.api.service.impl;


import com.taxiapp.api.config.security.InternalAuth;
import com.taxiapp.api.controller.rest.auth.dto.AuthResponse;
import com.taxiapp.api.controller.rest.auth.dto.LoginRequest;
import com.taxiapp.api.controller.rest.auth.dto.RegisterRequest;
import com.taxiapp.api.controller.rest.user.dto.UserDTO;
import com.taxiapp.api.exception.auth.AuthException;

import com.taxiapp.api.entity.Role;
import com.taxiapp.api.entity.User;
import com.taxiapp.api.repository.RoleRepository;
import com.taxiapp.api.repository.UserRepository;
import com.taxiapp.api.config.security.JwtAuthenticationProvider;
import com.taxiapp.api.service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {


        private final RoleRepository roleRepository;
        private final UserRepository userRepository;
        private final JwtAuthenticationProvider jwtAuthenticationProvider;
        private final PasswordEncoder passwordEncoder;
        public AuthResponse login(LoginRequest request) {

            //Seteo el contexto de seguridad en operacion interna privilegiada para acceder a los datos del usuario
            InternalAuth.performInternalTask();

            Optional<User> user = userRepository.findByEmail(request.getEmail());
            if(user.isEmpty()){
                throw new AuthException("User not found", HttpStatus.NOT_FOUND);
            }

            if(!passwordEncoder.matches(request.getPassword(),user.get().getPassword())){
                throw new AuthException("Incorrect password", HttpStatus.UNAUTHORIZED);
            }

            User userDB = user.get();

            if(userDB.getIs_disabled() != null){
                throw new AuthException("User disabled", HttpStatus.UNAUTHORIZED);
            }


            UserDTO userDTO = UserDTO.builder().id(userDB.getId())
                    .name(userDB.getName())
                    .lastname(userDB.getLastname())
                    .username(userDB.getUsername())
                    .email(userDB.getEmail())
                    .roles(userDB.getRoles())
                    .build();

            return new AuthResponse(jwtAuthenticationProvider.createToken(userDTO));

        }

        public AuthResponse register(RegisterRequest request)  {

            //Seteo el contexto de seguridad en operacion interna privilegiada para acceder a los datos del usuario
            InternalAuth.performInternalTask();

                if(!roleRepository.findByName("ROLE_USER").isPresent()){
                   throw new AuthException("Error al registrar el usuario",HttpStatus.INTERNAL_SERVER_ERROR);
                }


            Role role = roleRepository.findByName("ROLE_USER").get();


            User user = User.builder()
                    .username(request.getUsername())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .email(request.getEmail())
                    .phone(request.getPhone())
                    .name(request.getName())
                    .lastname(request.getLastname())
                    .is_disabled(null)
                    .build();

            //Asignar rol al usuario
            user.setRoles(Set.of(role));
            //Guardar si el usuario no existe
            if(!userRepository.findByUsernameAndEmail(request.getUsername(),request.getEmail()).isEmpty()){
                throw new AuthException("Usuario ya registrado",HttpStatus.CONFLICT);
            }

            User userCreated = userRepository.save(user);

            if(userCreated == null){
                throw new AuthException("Error al registrar el usuario",HttpStatus.INTERNAL_SERVER_ERROR);
            }

            UserDTO userDTO = UserDTO.builder().id(userCreated.getId())
                    .name(userCreated.getName())
                    .lastname(userCreated.getLastname())
                    .username(userCreated.getUsername())
                    .phone(userCreated.getPhone())
                    .email(userCreated.getEmail())
                    .roles(userCreated.getRoles())
                    .build();

            String token =  jwtAuthenticationProvider.createToken(userDTO);

            return new AuthResponse(token);

        }


        public UserDTO getMe(Authentication auth) {
            //Seteo el contexto de seguridad en operacion interna privilegiada para acceder a los datos del usuario
            InternalAuth.performInternalTask();

            Optional<User> user = userRepository.findByEmail(auth.getPrincipal().toString());
            if(user.isEmpty()){
                throw new AuthException("Usuario no encontrado", HttpStatus.NOT_FOUND);
            }

            User userDB = user.get();
            return UserDTO.builder().id(userDB.getId())
                    .name(userDB.getName())
                    .lastname(userDB.getLastname())
                    .username(userDB.getUsername())
                    .phone(userDB.getPhone())
                    .email(userDB.getEmail())
                    .roles(userDB.getRoles())
                    .build();

        }
}
