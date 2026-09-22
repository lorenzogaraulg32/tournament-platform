package com.tournamentplatform.userservice.client.authService;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class AuthServiceFeignConfig {

    private static final String INTERNAL_TOKEN_HEADER =
            "X-Internal-Service-Token";

    @Bean
    public RequestInterceptor authServiceRequestInterceptor(
            @Value("${internal.auth-service.token}") String token
    ) {
        return requestTemplate ->
                requestTemplate.header(
                        INTERNAL_TOKEN_HEADER,
                        token
                );
    }
}