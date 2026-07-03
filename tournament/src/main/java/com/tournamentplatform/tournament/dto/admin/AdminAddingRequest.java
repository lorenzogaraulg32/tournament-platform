package com.tournamentplatform.tournament.dto.admin;

import jakarta.validation.constraints.NotBlank;

public record AdminAddingRequest(

        @NotBlank(message = "L'adminId dell'utente admin è obbligatorio")
        String adminId
) {

}
