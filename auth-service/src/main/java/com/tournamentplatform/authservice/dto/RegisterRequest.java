package com.tournamentplatform.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        @Email(message = "Indirizzo email non valido")
        @Size(max = 254, message = "Indirizzo email troppo lungo")
        @Pattern(
                regexp = "(?s).*\\S.*",
                message = "L'email non può essere vuota"
        )
        String email,

        @NotBlank
        @Size(
                min = 8,
                max = 64,
                message = "La password deve contenere tra 8 e 64 caratteri"
        )
        @Pattern(
                regexp = "(?s).*\\S.*",
                message = "La password non può essere vuota"
        )
        String newPassword
) {

}
