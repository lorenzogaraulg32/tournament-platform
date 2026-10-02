package com.tournamentplatform.teamservice.client;

import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.TeamLogoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
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
            @LoadBalanced RestClient.Builder builder,
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

        } catch (HttpClientErrorException | HttpServerErrorException exception) {

            throw new TeamLogoException(
                    HttpStatus.valueOf(
                            exception.getStatusCode().value()
                    )
            );

        } catch (ResourceAccessException exception) {

            throw new TeamLogoException(
                    HttpStatus.SERVICE_UNAVAILABLE
            );

        } catch (IOException exception) {

            throw new TeamLogoException(
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }


    public MediaResource getTeamLogo(String teamId) {

        try {

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

        } catch (HttpClientErrorException | HttpServerErrorException exception) {

            throw new TeamLogoException(
                    HttpStatus.valueOf(
                            exception.getStatusCode().value()
                    )
            );

        } catch (ResourceAccessException exception) {

            throw new TeamLogoException(
                    HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }


    public void deleteTeamLogo(String teamId) {

        try {

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

        } catch (HttpClientErrorException | HttpServerErrorException exception) {

            throw new TeamLogoException(
                    HttpStatus.valueOf(
                            exception.getStatusCode().value()
                    )
            );

        } catch (ResourceAccessException exception) {

            throw new TeamLogoException(
                    HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }
}
