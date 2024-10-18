package com.taxiapp.api.service.impl;

import com.taxiapp.api.controller.user.dto.UserCreateRequest;
import com.taxiapp.api.controller.user.dto.UserUpdateRequest;
import com.taxiapp.api.exception.common.DuplicatedEntityException;
import com.taxiapp.api.exception.common.EntityNotFoundException;
import com.taxiapp.api.model.Role;
import com.taxiapp.api.model.User;
import com.taxiapp.api.repository.RoleRepository;
import com.taxiapp.api.repository.UserRepository;
import com.taxiapp.api.service.IUserService;
import com.taxiapp.api.utils.ResultResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserDetailsService, IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Value("${default.admin.username}")
    private String defaultAdminUsername;

    @Value("${default.admin.password}")
    private String defaultAdminPassword;

    @Value("${default.admin.email}")
    private String defaultAdminEmail;



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user  = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("Invalid username or password.");
        }
        User userData = user.get();
        return new org.springframework.security.core.userdetails.User(userData.getUsername(), userData.getPassword(), getAuthority(userData));
    }

    // Get user authorities
    private Set<SimpleGrantedAuthority> getAuthority(User user) {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();
        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        });
        return authorities;
    }


    //Create admin default user
    @Transactional
    public void createDefaultAdminUserIfNotFound() {

       Optional<Role> roleAdmin = roleRepository.findByName("ROLE_ADMIN");
        if (userRepository.findByUsername(defaultAdminUsername).isEmpty() && roleAdmin.isPresent()) {
            User user = User.builder().name("Admin")
                    .lastname("Admin")
                    .username(defaultAdminUsername)
                    .password(passwordEncoder.encode(defaultAdminPassword))
                    .email(defaultAdminEmail).build();
            user.setRoles(Set.of(roleAdmin.get()));
            userRepository.save(user);
        }
    }


    //CRUD User

    /**
     * Create a user in the database
     * @param user
     * @return
     */
    @Transactional
    @Override
    public User create(UserCreateRequest user) {

        boolean exists = userRepository.existsByEmail(user.email());

        if(exists){
            throw new DuplicatedEntityException("User", "email", user.email());
        }


        // Busca los roles en la base de datos
        Set<Role> roles = user.roles().stream()
                .map(role -> roleRepository.findById(role.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Role","id" ,role.getId().toString())))
                .collect(Collectors.toSet());

        User usr = User.builder()
                .name(user.name())
                .lastname(user.lastname())
                .username(user.username())
                .email(user.email())
                .is_disabled(user.is_disabled())
                .password(passwordEncoder.encode(user.password()))
                .roles(roles)
                .build();

        return userRepository.save(usr);
    }



    /**
     * Update a user in the database
     * @param user
     * @return
     */
    @Transactional
    @Override
    public User update(UserUpdateRequest user, UUID id) {
        // Check if the user exists
        User usr = userRepository.findById(id).orElse(null);
        if(usr == null){
            throw new EntityNotFoundException("User", "id", id.toString());
        }



        //Si trae cambios en roles los busco en db
        if(user.roles() != null && !user.roles().isEmpty()){
            Set<Role> roles = user.roles().stream()
                    .map(role -> roleRepository.findById(role.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Role","id" ,role.getId().toString())))
                    .collect(Collectors.toSet());
            usr.setRoles(roles);
        }

        //Seteo los campos que pueden ser modificados
        if(user.name() != null){
            usr.setName(user.name());
        }
        if(user.lastname() != null){
            usr.setLastname(user.lastname());
        }
        if(user.username() != null){
            usr.setUsername(user.username());
        }
        if(user.email() != null){
            usr.setEmail(user.email());
        }
        if(user.is_disabled() != null){
            usr.setIs_disabled(user.is_disabled());
        }
        //Hash password si corresponde
        if(user.password() != null){
            usr.setPassword(passwordEncoder.encode(user.password()));
        }

        return userRepository.save(usr);
    }


    /**
     * Delete a user from the database
     * @param id
     */
    @Transactional
    @Override
    public void delete(UUID id) {
        boolean exists = userRepository.existsById(id);
        if(!exists){
            throw new EntityNotFoundException("User", "id", id.toString());
        }
        userRepository.deleteById(id);
    }


    /**
     * Get all users paginated
     * @param pageable
     * @return Page<User>
     */
    @Transactional(readOnly = true)
    @Override
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public ResultResponse restore(UUID id) {
        User usr = userRepository.findById(id).orElse(null);
        String message = "";
        if(usr == null){
            throw new EntityNotFoundException("User", "id", id.toString());
        }
        if(!usr.isDeleted()){
            return new ResultResponse("User " +usr.getId()+ " is not deleted", HttpStatus.NOT_MODIFIED);
        }
        usr.setDeleted(false);
        userRepository.save(usr);
        return new ResultResponse("User " +usr.getId()+ " restored successfully", HttpStatus.OK);
    }

    @Transactional(readOnly = true)
    @Override
    public Page<User> findAllDeleted(Pageable pageable) {
        return userRepository.findDeletedUsers(pageable);

    }

    @Override
    public ResultResponse assignDriverRole(UUID id) {
        User usr = userRepository.findById(id).orElse(null);
        if(usr == null){
            throw new EntityNotFoundException("User", "id", id.toString());
        }
        Role role = roleRepository.findByName("ROLE_DRIVER").orElse(null);
        if(role == null){
            throw new EntityNotFoundException("Role", "name", "ROLE_DRIVER");
        }
        usr.getRoles().add(role);
        userRepository.save(usr);
        return new ResultResponse("Role assigned successfully", HttpStatus.OK);

    }

    /**
     * Get a user by id
     * @param id
     * @return User
     */
    @Transactional(readOnly = true)
    @Override
    public User findById(UUID id) {
        User usr = userRepository.findById(id).orElse(null);
        if(usr == null){
            throw new EntityNotFoundException("User", "id", id.toString());
        }
        return usr;
    }

    /**
     *
     * @param username
     * @return
     */
    @Transactional(readOnly = true)
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    /**
     *
     * @param email
     * @return
     */
    @Transactional(readOnly = true)
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }



}
