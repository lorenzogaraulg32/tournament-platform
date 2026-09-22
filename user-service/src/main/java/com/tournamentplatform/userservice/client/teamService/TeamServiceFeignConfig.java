package com.tournamentplatform.userservice.client.teamService;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class TeamServiceFeignConfig {

    private static final String INTERNAL_TOKEN_HEADER =
            "X-Internal-Service-Token";

    @Bean
    public RequestInterceptor teamServiceRequestInterceptor(
            @Value("${internal.team-service.token}") String token
    ) {
        return requestTemplate -> {

            System.out.println(
                    "TeamService internal token configured: "
                            + (token != null && !token.isBlank())
            );

            requestTemplate.header(
                    INTERNAL_TOKEN_HEADER,
                    token
            );

            System.out.println(
                    "TeamService internal header added: "
                            + requestTemplate.headers()
                            .containsKey(INTERNAL_TOKEN_HEADER)
            );
        };
    }

    @Bean
    public ErrorDecoder teamServiceErrorDecoder(
            ObjectMapper objectMapper
    ) {
        return new TeamServiceErrorDecoder(objectMapper);
    }
}