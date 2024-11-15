package com.taxiapp.api.controller.rest.role;



import com.taxiapp.api.model.Role;
import com.taxiapp.api.service.impl.RoleServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/roles")
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
@RequiredArgsConstructor
public class RoleController {

    private final RoleServiceImpl roleService;

    @GetMapping()
    public ResponseEntity<List<Role>> getRoles() {
        List<Role> roles = roleService.findAll();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRole(@PathVariable int id) {
        Role role = roleService.findById(id);
        return ResponseEntity.ok(role);
    }

    @PostMapping()
    public ResponseEntity<Role> createRole(@RequestBody @Valid RoleCreateRequest role) {
        Role newRole = roleService.create(role);
        return ResponseEntity.ok(newRole);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable int id, @RequestBody @Valid RoleCreateRequest role) {
        Role updatedRole = roleService.update(role,id);
        return ResponseEntity.ok(updatedRole);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable int id) {
        roleService.delete(id);
        return ResponseEntity.noContent().build();
    }


}
