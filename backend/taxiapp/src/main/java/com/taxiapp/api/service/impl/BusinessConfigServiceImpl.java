package com.taxiapp.api.service.impl;

import com.taxiapp.api.model.BusinessConfig;
import com.taxiapp.api.repository.BusinessConfigRepository;
import com.taxiapp.api.service.IBusinessConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BusinessConfigServiceImpl implements IBusinessConfigService {

    private final BusinessConfigRepository businessConfigRepository;

    @Override
    public BusinessConfig saveConfig(BusinessConfig businessConfig) {
        return businessConfigRepository.save(businessConfig);
    }

    @Override
    public BusinessConfig getConfig() {
        return businessConfigRepository.findAll().get(0);
    }

    @Override
    public void loadDefaultConfig() {

        if(businessConfigRepository.findAll().isEmpty()){
            BusinessConfig businessConfig = new BusinessConfig();
            businessConfig.setId("0");
            businessConfig.setName("TaxiApp");
            businessConfig.setCoords("-38.952531,-68.059168");
            businessConfig.setDayTimeKmPrice(1000.0);
            businessConfig.setNightTimeKmPrice(1500.0);
            businessConfigRepository.save(businessConfig);
        }

    }




}
