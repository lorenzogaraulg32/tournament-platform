package com.tournamentplatform.activityservice.dto.request;

import com.tournamentplatform.activityservice.entity.Activity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ActivityRequestPOST(
        LocalDateTime issuedAt,

        @NotNull(message = "L'autore è obbligatorio")
        @Valid
        Activity.EntityReference actor,

        @NotNull(message = "Il soggetto è obbligatorio")
        @Valid
        Activity.EntityReference subject,

        @Valid
        Activity.EntityReference context,

        @NotNull(message = "L'azione è obbligatoria")
        Activity.Action action,

        String details
) {}