package com.taxiapp.api.controller.rest.businessconfig;

import com.taxiapp.api.model.BusinessConfig;
import com.taxiapp.api.service.impl.BusinessConfigServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/config")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ROLE_ADMIN')")
public class BusinessConfigController {

    private final BusinessConfigServiceImpl businessConfigService;
    private final ModelMapper modelMapper;

    @GetMapping()
    public ResponseEntity<BusinessConfig> getConfig() {
        return ResponseEntity.ok(businessConfigService.getConfig());
    }

    @PutMapping()
    public ResponseEntity<BusinessConfig> saveConfig(@Valid BusinessConfigDTO businessConfig) {
        return ResponseEntity.ok(businessConfigService.saveConfig(modelMapper.map(businessConfig, BusinessConfig.class)));
    }


}
