package com.tournamentplatform.authservice.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tournamentplatform.authservice.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Component
public class SecurityErrorResponseWriter {

    private static final Logger log =
            LoggerFactory.getLogger(SecurityErrorResponseWriter.class);

    private final ObjectMapper objectMapper;

    public SecurityErrorResponseWriter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public void write(
            HttpServletRequest request,
            HttpServletResponse response,
            HttpStatus status,
            String code,
            String message
    ) throws IOException {
        String traceId = UUID.randomUUID().toString();
        String path = request.getRequestURI();

        log.debug(
                "Errore security: traceId={}, status={}, code={}, path={}",
                traceId,
                status.value(),
                code,
                path
        );

        ApiErrorResponse errorResponse = new ApiErrorResponse(
                Instant.now(),
                status.value(),
                code,
                message,
                Map.of(),
                path,
                traceId
        );

        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
