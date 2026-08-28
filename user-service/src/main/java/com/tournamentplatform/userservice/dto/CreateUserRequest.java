package com.tournamentplatform.userservice.dto;


import com.tournamentplatform.userservice.entity.utils.Gender;
import com.tournamentplatform.userservice.entity.utils.Sport;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.Set;

public record CreateUserRequest(

        @NotBlank
        @Size(max = 20, message = "L'username non può superare i 20 caratteri")
        String username,

        @NotBlank
        @Size(max = 20, message = "Il nome non può superare i 20 caratteri")
        String firstName,

        @NotBlank
        @Size(max = 20, message = "Il cognome non può superare i 20 caratteri")
        String lastName,

        @NotNull
        @Past(message = "La data di nascita deve essere nel passato")
        LocalDate birthDate,

        @NotNull(message = "Il sesso è obbligatorio")
        Gender gender,

        @NotEmpty(message = "Selezionare almeno uno sport")
        Set<Sport> sports,

        @Valid
        @NotEmpty(message = "Selezionare almeno un ruolo per sport")
        Set<UserSportRoleRequest> roles,

        @Valid
        GeoLocationRequest location

) {
}