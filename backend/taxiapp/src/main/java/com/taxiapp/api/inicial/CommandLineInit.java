package com.taxiapp.api.inicial;

/*

@Component
public class CommandLineInit implements CommandLineRunner {

    private final RestTemplate restTemplate;
    private final String url = "http://localhost:8080/api/v1/ws";

    public CommandLineInit() {
        this.restTemplate = new RestTemplate();
        this.restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
    }

    public void run(String... args) throws Exception {
        List<Coordenada> coordenadas = new ArrayList<>();
        coordenadas.add(new Coordenada(0.0, 0.0));

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
}*/