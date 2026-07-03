package com.tournamentplatform.teamservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

import java.util.HashSet;
import java.util.Set;

@Getter
@NoArgsConstructor
public class TeamCreationRequest {

    @NotBlank(message = "Il nome della squadra è obbligatorio")
    @Size(min = 5, max = 20, message = "Il nome deve avere tra 5 e 20 caratteri")
    private String name;

    private String logoUrl;

    private Set<@NotBlank String> playerIds = new HashSet<>();


}
