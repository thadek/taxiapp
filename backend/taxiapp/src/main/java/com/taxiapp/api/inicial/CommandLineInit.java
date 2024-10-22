package com.taxiapp.api.inicial;

import org.springframework.boot.CommandLineRunner;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import com.taxiapp.api.model.Coordenada;
import org.springframework.web.client.RestTemplate;

@Component
public class CommandLineInit implements CommandLineRunner {

    private final RestTemplate restTemplate;
    private final String url = "http://localhost:8080/api/v1/send-coordenada";

    public CommandLineInit() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
    }

    public void run(String... args) throws Exception {
        List<Coordenada> coordenadas = new ArrayList<>();
        coordenadas.add(new Coordenada(0.0, 0.0)); // Reemplaza con valores reales o variables

        enviarCoordenadasPeriodicamente(coordenadas);
    }

    private void enviarCoordenadasPeriodicamente(List<Coordenada> coordenadas) {
        for (Coordenada coordenada : coordenadas) {
            enviarCoordenada(coordenada);
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    private void enviarCoordenada(Coordenada coordenada) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Coordenada> requestEntity = new HttpEntity<>(coordenada, headers);

        ResponseEntity<Coordenada> responseEntity = restTemplate.postForEntity(url, requestEntity, Coordenada.class);

        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            System.out.println("Coordenada enviada con éxito: " + coordenada);
        } else {
            System.out.println("Error al enviar coordenada: " + coordenada);
        }
    }
}