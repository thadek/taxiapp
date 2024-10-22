package com.taxiapp.api.controller.test;

import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {


    @Secured("ROLE_ADMIN")
    @GetMapping("/admin")
    public String admin() {
        return "Admin";
    }

    @Secured("ROLE_USER")
    @GetMapping("/user")
    public String user() {
        return "User";
    }


    @Secured("ROLE_DRIVER")
    @GetMapping("/driver")
    public String driver() {
        return "Driver";
    }


}
