package com.tournamentplatform.teamservice.dto.teamCreation;

import com.tournamentplatform.teamservice.entity.Team;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TeamCreationRequest {

    @NotBlank(message = "Il nome della squadra è obbligatorio")
    @Size(min = 5, max = 20, message = "Il nome deve avere tra 5 e 20 caratteri")
    private String name;

    @Size(
            max = 160,
            message = "La descrizione non può superare i 160 caratteri"
    )
    private String description;


    @Valid
    @NotNull(message = "Lo stato della squadra è obbligatorio")
    private Team.RecruitmentStatus status;


    @Valid
    private TeamLocationRequest location;


}
