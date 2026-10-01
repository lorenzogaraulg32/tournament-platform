package com.tournamentplatform.teamservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class MediaServiceClient {

    public record MediaResource(
            Resource resource,
            MediaType contentType
    ) {
    }

    private final RestClient restClient;
    private final String mediaServiceToken;

    public MediaServiceClient(
            RestClient.Builder builder,
            @Value("${internal.media-service.token}")
            String mediaServiceToken
    ) {

        this.mediaServiceToken = mediaServiceToken;

        this.restClient = builder
                .baseUrl("http://media-service")
                .build();
    }


    public void putTeamLogo(
            String teamId,
            MultipartFile file
    ) {

        try {

            ByteArrayResource resource =
                    new ByteArrayResource(file.getBytes()) {

                        @Override
                        public String getFilename() {
                            return file.getOriginalFilename();
                        }
                    };

            MultiValueMap<String, Object> body =
                    new LinkedMultiValueMap<>();

            body.add("file", resource);

            restClient
                    .put()
                    .uri(
                            "/internal/media/team/{id}/logo",
                            teamId
                    )
                    .header(
                            "X-Internal-Service-Token",
                            mediaServiceToken
                    )
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();

        } catch (IOException exception) {
            throw new RuntimeException(
                    "Errore durante la lettura del logo",
                    exception
            );
        }
    }


    public MediaResource getTeamLogo(String teamId) {

        ResponseEntity<byte[]> response = restClient
                .get()
                .uri(
                        "/internal/media/team/{id}/logo",
                        teamId
                )
                .header(
                        "X-Internal-Service-Token",
                        mediaServiceToken
                )
                .retrieve()
                .toEntity(byte[].class);

        byte[] bytes = response.getBody();

        MediaType contentType =
                response.getHeaders().getContentType();

        return new MediaResource(
                new ByteArrayResource(bytes),
                contentType
        );
    }

    public void deleteTeamLogo(String teamId) {

        restClient
                .delete()
                .uri(
                        "/internal/media/team/{id}/logo",
                        teamId
                )
                .header(
                        "X-Internal-Service-Token",
                        mediaServiceToken
                )
                .retrieve()
                .toBodilessEntity();
    }
}