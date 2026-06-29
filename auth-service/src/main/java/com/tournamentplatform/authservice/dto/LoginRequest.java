package com.tournamentplatform.authservice.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "L'username è obbligatorio")
        @Size(min = 3, max = 30, message = "Lo username deve avere tra 3 e 30 caratteri")
        String nickname,

        @NotBlank(message = "L'email è obbligatoria")
                @Email(message = "Formato email non valido")
        String email,

        @NotBlank(message = "La password è obbligatoria")
        @Size(min = 8, message = "La password deve avere almeno 8 caratteri")
        @Pattern(
                regexp = ".*\\d.*",
                message = "La password deve contenere almeno un numero"
        )
        String password
) {

}
