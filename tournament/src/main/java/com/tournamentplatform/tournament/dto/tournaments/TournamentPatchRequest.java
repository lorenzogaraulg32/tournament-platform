package com.tournamentplatform.tournament.dto.tournaments;

import com.tournamentplatform.tournament.entity.TournamentFormat;
import com.tournamentplatform.tournament.entity.TournamentStatus;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TournamentPatchRequest {

    private String name;

    @Size(max = 1000, message = "La descrizione può avere al massimo 1000 caratteri")
    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer minTeams;

    private Integer maxTeams;

    private TournamentFormat format;

    private TournamentStatus status;





}
