package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.dto.tournaments.TournamentGetResponse;
import com.tournamentplatform.tournament.dto.tournaments.TournamentPatchRequest;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.entity.TournamentStatus;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.InvalidTournamentException;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.TournamentNotFoundException;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Component;

@Component
public class TournamentHelper {

    private final TournamentRepository tournamentRepository;

    public TournamentHelper(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    public Tournament findOrThrow(String id) {
        return tournamentRepository.findById(Long.valueOf(id)).orElseThrow(TournamentNotFoundException::new);
    }

    public Tournament saveTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    public TournamentGetResponse toTournamentGetResponse(Tournament tournament) {
        return new TournamentGetResponse(
                tournament.getId(),
                tournament.getName(),
                tournament.getDescription(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getCreatedAt(),
                tournament.getUpdatedAt(),
                tournament.getMinTeams(),
                tournament.getMaxTeams(),
                tournament.getFormat().name(),
                tournament.getStatus().name(),
                tournament.getRulesUrl()
        );
    }

    public void validateTournament(Tournament tournament) {
        if (tournament.getMaxTeams() < tournament.getMinTeams()) {
            throw new InvalidTournamentException();
        }

        if (tournament.getStartDate().isAfter(tournament.getEndDate())) {
            throw new InvalidTournamentException();
        }
    }

    public void applyTournamentPatch(Tournament tournament, TournamentPatchRequest request) {

        if (request.getName() != null) {
            tournament.setName(request.getName());
        }

        if (request.getDescription() != null) {
            tournament.setDescription(request.getDescription());
        }

        if (request.getStartDate() != null) {
            tournament.setStartDate(request.getStartDate());
        }

        if (request.getEndDate() != null) {
            tournament.setEndDate(request.getEndDate());
        }

        if (request.getMinTeams() != null) {
            tournament.setMinTeams(request.getMinTeams());
        }

        if (request.getMaxTeams() != null) {
            tournament.setMaxTeams(request.getMaxTeams());
        }

        if (request.getFormat() != null) {
            tournament.setFormat(request.getFormat());
        }

        if (request.getStatus() != null) {
            tournament.setStatus(request.getStatus());
        }
    }

    public boolean canBeDeleted(Tournament tournament) {
        return tournament.getStatus().equals(TournamentStatus.CREATED) || tournament.getStatus().equals(TournamentStatus.REG_OPEN);
    }
}
