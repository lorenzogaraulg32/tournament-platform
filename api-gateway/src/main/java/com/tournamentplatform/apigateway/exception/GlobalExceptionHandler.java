package com.tournamentplatform.apigateway.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.support.NotFoundException;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebExceptionHandler;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Component
@Order(-2)
public class GlobalExceptionHandler implements WebExceptionHandler {

    private final ObjectMapper objectMapper;

    public GlobalExceptionHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {

        Route route = exchange.getAttribute(
                ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR
        );

        String serviceName = null;

        if (route != null && route.getUri() != null) {
            serviceName = route.getUri().getHost();
        }

        if (ex instanceof NotFoundException notFoundException
                && notFoundException.getStatusCode()
                .equals(HttpStatus.SERVICE_UNAVAILABLE)) {

            return writeServiceUnavailable(
                    exchange,
                    serviceName
            );
        }

        return Mono.error(ex);
    }

    private Mono<Void> writeServiceUnavailable(
            ServerWebExchange exchange,
            String serviceName
    ) {

        ServerHttpResponse response = exchange.getResponse();

        response.setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        ApiErrorResponse error = new ApiErrorResponse(
                Instant.now(),
                503,
                "SERVICE_UNAVAILABLE",
                "Il servizio " + serviceName + " non è disponibile",
                Map.of(),
                exchange.getRequest().getPath().value(),
                String.valueOf(UUID.randomUUID())
        );

        try {
            byte[] bytes = objectMapper.writeValueAsBytes(error);

            DataBuffer buffer = response.bufferFactory().wrap(bytes);

            return response.writeWith(Mono.just(buffer));

        } catch (JsonProcessingException e) {
            return Mono.error(e);
        }
    }
}