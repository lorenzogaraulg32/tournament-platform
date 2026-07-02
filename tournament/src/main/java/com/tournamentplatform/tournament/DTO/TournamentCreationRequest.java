package com.tournamentplatform.tournament.DTO;

import com.tournamentplatform.tournament.entity.TournamentFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class TournamentCreationRequest {

    //nota, l'id viene preso dal jwt, non va messo qua


    @NotBlank(message = "Nome obbligatorio")
    private String name;

    @NotBlank(message = "Descrizione obbligatoria")
    @Size(max = 1000, message = "La descrizione può avere al massimo 1000 caratteri")
    private String description;

    @NotNull(message = "Il torneo deve avere una data di inizio")
    private LocalDate startDate;

    @NotNull(message = "Il torneo deve avere una data di fine")
    private LocalDate endDate;

    @NotNull(message = "Il torneo deve avere una numero minimo di squadre")
    private Integer minTeams;

    @NotNull(message = "Il torneo deve avere una numero massimo di squadre")
    private Integer maxTeams;

    @NotNull(message = "Il torneo deve avere un formato")
    private TournamentFormat format;


}
