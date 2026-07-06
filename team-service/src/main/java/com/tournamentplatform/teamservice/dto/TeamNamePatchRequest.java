package com.tournamentplatform.teamservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class TeamNamePatchRequest {

    @NotBlank(message = "Il nome della squadra è obbligatorio")
    @Size(min = 5, max = 20, message = "Il nome deve avere tra 5 e 20 caratteri")
    String name;
}
