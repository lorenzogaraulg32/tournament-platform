package com.tournamentplatform.tournament.dto.tournaments;

import com.tournamentplatform.tournament.entity.TournamentFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class TournamentCreationRequest {

    //nota, l'adminId viene preso dal jwt, non va messo qua


    @NotBlank(message = "Nome obbligatorio")
    private String name;

    @NotBlank(message = "Descrizione obbligatoria")
    @Size(max = 500, message = "La descrizione può avere al massimo 500 caratteri")
    private String description;

    @NotNull(message = "Il torneo deve avere una data di inizio")
    private LocalDate startDate;

    @NotNull(message = "Il torneo deve avere una data di fine")
    private LocalDate endDate;

    @NotNull(message = "Il torneo deve avere un numero minimo di squadre")
    @Min(value = 2, message = "Il numero minimo di squadre deve essere almeno 2")
    private Integer minTeams;

    @NotNull(message = "Il torneo deve avere una numero massimo di squadre")
    @Min(value = 2, message = "Il numero minimo di squadre deve essere almeno 2")
    private Integer maxTeams;

    @NotNull(message = "Il torneo deve avere un formato")
    private TournamentFormat format;

    private String rulesUrl;


}
