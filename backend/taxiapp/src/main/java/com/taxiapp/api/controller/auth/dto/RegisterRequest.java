package com.taxiapp.api.controller.auth.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest
{

    @NotNull(message = "Username cannot be null")
    @NotBlank(message = "Username cannot be blank")
    private String username;
    @NotNull(message = "Password cannot be null")
    @NotBlank(message = "Password cannot be blank")
    private String password;
    @NotNull(message = "Email cannot be null")
    @NotBlank(message = "Email cannot be blank")
    private String email;
    @NotNull(message = "name cannot be null")
    @NotBlank(message = "name cannot be blank")
    private String name;
    @NotNull(message = "Lastname cannot be null")
    @NotBlank(message = "Lastname cannot be blank")
    private String lastname;
}
