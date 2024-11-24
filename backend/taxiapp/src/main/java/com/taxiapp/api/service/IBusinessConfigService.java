package com.taxiapp.api.service;

import com.taxiapp.api.entity.BusinessConfig;

public interface IBusinessConfigService {
     BusinessConfig saveConfig(BusinessConfig businessConfig);

     BusinessConfig getConfig();

     void loadDefaultConfig();
}
