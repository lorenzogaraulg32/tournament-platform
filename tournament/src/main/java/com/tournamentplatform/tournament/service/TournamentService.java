package com.tournamentplatform.tournament.service;


import com.tournamentplatform.tournament.dto.tournaments.TournamentCreationRequest;
import com.tournamentplatform.tournament.dto.tournaments.TournamentCreationResponse;
import com.tournamentplatform.tournament.dto.tournaments.TournamentGetResponse;
import com.tournamentplatform.tournament.dto.tournaments.TournamentPatchRequest;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.entity.TournamentStatus;
import com.tournamentplatform.tournament.errorHandling.ResourceNotFoundException;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TournamentHelper tournamentHelper;
    private final TournamentAuthorizationHelper tournamentAuthorizationHelper;

    public TournamentService(TournamentRepository tournamentRepository, TournamentHelper tournamentHelper, TournamentAuthorizationHelper tournamentAuthorizationHelper) {
        this.tournamentRepository = tournamentRepository;
        this.tournamentHelper = tournamentHelper;
        this.tournamentAuthorizationHelper = tournamentAuthorizationHelper;
    }


    //creazione del torneo
    public TournamentCreationResponse createTournament(TournamentCreationRequest request) {

        String userId = tournamentAuthorizationHelper.getCurrentUserId();

        ArrayList<String> admins = new ArrayList<>();
        admins.add(userId);

        Tournament tournament = new Tournament(
                request.getName(),
                request.getDescription(),
                userId,
                admins,
                request.getStartDate(),
                request.getEndDate(),
                request.getMinTeams(),
                request.getMaxTeams(),
                request.getFormat()
        );

        tournamentHelper.validateTournament(tournament);

        Tournament savedTournament = tournamentRepository.save(tournament);

        return new TournamentCreationResponse(String.valueOf(savedTournament.getId()));
    }


    public TournamentGetResponse getTournament(String id) {
        Tournament tournament = tournamentRepository.findById(
                        Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Nessun torneo trovato con id: " + id));

        return tournamentHelper.toTournamentGetResponse(tournament);
    }

    public List<TournamentGetResponse> getAllTournaments() {
        List<Tournament> tournaments = tournamentRepository.findAll();
        List<TournamentGetResponse> tournamentsResponse = new ArrayList<>();
        for (Tournament tournament : tournaments) {
            tournamentsResponse.add(tournamentHelper.toTournamentGetResponse(tournament));
        }
        return tournamentsResponse;
    }

    public TournamentGetResponse patchTournament(String id, TournamentPatchRequest patchRequest) {

        Tournament tournament = tournamentRepository.findById(
                        Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Nessun torneo trovato con id: " + id));

        tournamentAuthorizationHelper.checkTournamentAdmin(tournament);

        tournamentHelper.applyTournamentPatch(tournament, patchRequest);

        tournamentHelper.validateTournament(tournament);

        Tournament savedTournament = tournamentRepository.save(tournament);

        return tournamentHelper.toTournamentGetResponse(savedTournament);
    }


    public void deleteTournament(String id) {
        Tournament tournament = tournamentRepository.findById(
                        Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Nessun torneo trovato con id: " + id));

        tournamentAuthorizationHelper.checkTournamentCreator(tournament);

        if (tournamentHelper.canBeDeleted(tournament)) {
            tournamentRepository.delete(tournament);
        } else {
            tournament.setStatus(TournamentStatus.CANCELLED);
        }
    }
}
