package com.taxiapp.api.service;

import com.taxiapp.api.model.BusinessConfig;

import java.util.List;

public interface IBusinessConfigService {
     BusinessConfig saveConfig(BusinessConfig businessConfig);

     BusinessConfig getConfig();

     void loadDefaultConfig();
}
