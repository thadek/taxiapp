package com.taxiapp.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TaxiappApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaxiappApplication.class, args);
	}

}
