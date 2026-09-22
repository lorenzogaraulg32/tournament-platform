package com.tournamentplatform.userservice.client.teamService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tournamentplatform.userservice.exceptions.UserErrorCode;
import com.tournamentplatform.userservice.exceptions.teamServiceException.OwnerRemovalException;

import feign.Response;
import feign.codec.ErrorDecoder;

import java.io.IOException;

public class TeamServiceErrorDecoder implements ErrorDecoder {

    private final ObjectMapper objectMapper;

    private final ErrorDecoder defaultDecoder =
            new Default();

    public TeamServiceErrorDecoder(
            ObjectMapper objectMapper
    ) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Exception decode(
            String methodKey,
            Response response
    ) {

        // Gli altri status vengono lasciati alla gestione standard Feign.
        if (response.status() != 403 || response.body() == null) {
            return defaultDecoder.decode(methodKey, response);
        }

        try {
            byte[] bodyBytes =
                    response.body()
                            .asInputStream()
                            .readAllBytes();

            // Ricostruiamo la response perché il body Feign è consumabile una volta sola.
            Response responseCopy =
                    response.toBuilder()
                            .body(bodyBytes)
                            .build();

            JsonNode body =
                    objectMapper.readTree(bodyBytes);

            String code =
                    body.path("code").asText();

            if (
                    UserErrorCode.OWNER_REMOVAL
                            .getCode()
                            .equals(code)
            ) {
                return new OwnerRemovalException();
            }

            return defaultDecoder.decode(
                    methodKey,
                    responseCopy
            );

        } catch (IOException exception) {
            return defaultDecoder.decode(
                    methodKey,
                    response
            );
        }
    }
}