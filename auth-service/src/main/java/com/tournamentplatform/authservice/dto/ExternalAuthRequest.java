package com.tournamentplatform.authservice.dto;

import com.tournamentplatform.authservice.entity.ExternalProvider;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ExternalAuthRequest(
        @NotNull(message = "Il provider è obbligatorio")
        ExternalProvider provider,

        @NotBlank(message = "Il token è obbligatorio")
        String idToken
) {
}
