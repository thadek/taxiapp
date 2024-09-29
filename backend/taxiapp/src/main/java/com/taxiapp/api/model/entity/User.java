package com.taxiapp.api.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.IdGeneratorType;
import org.hibernate.annotations.NotFound;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User  {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "Name is mandatory")
    private String name;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "Lastname is mandatory")
    private String lastname;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "Username is mandatory")
    private String username;

    @Column(nullable = false, length = 255)
    @JsonIgnore
    @NotBlank(message = "Password is mandatory")
    private String password;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email is mandatory")
    private String email;

    private Timestamp is_disabled;

    @ManyToMany(fetch=FetchType.EAGER,cascade = CascadeType.MERGE)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    @OneToMany(mappedBy = "client")
    private List<Ride> rides;

}
