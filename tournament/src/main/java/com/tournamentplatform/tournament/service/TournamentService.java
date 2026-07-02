package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.DTO.TournamentCreationRequest;
import com.tournamentplatform.tournament.DTO.TournamentCreationResponse;
import com.tournamentplatform.tournament.DTO.TournamentGetResponse;
import com.tournamentplatform.tournament.DTO.TournamentPatchRequest;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.errorHandling.ResourceNotFoundException;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import com.tournamentplatform.tournament.security.CurrentUserProvider;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final CurrentUserProvider currentUserProvider;
    private final TournamentServiceHelper helper;

    public TournamentService(TournamentRepository tournamentRepository, CurrentUserProvider currentUserProvider, TournamentServiceHelper helper) {
        this.tournamentRepository = tournamentRepository;
        this.currentUserProvider = currentUserProvider;
        this.helper = helper;
    }


    //creazione del torneo
    public TournamentCreationResponse createTournament(TournamentCreationRequest request) {


        String userId = currentUserProvider.getCurrentUserId();


        ArrayList<String> admins = new ArrayList<>();
        admins.add(userId);


        Tournament tournament = tournamentRepository.save(new Tournament(
                request.getName(),
                request.getDescription(),
                userId,
                admins,
                request.getStartDate(),
                request.getEndDate(),
                request.getMinTeams(),
                request.getMaxTeams(),
                request.getFormat()
        ));

        return new TournamentCreationResponse(String.valueOf(tournament.getId()));
    }


    public TournamentGetResponse getTournament(String id) {
        Tournament tournament = tournamentRepository.findById(
                        Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Nessun torneo trovato con id:" + id));

        return helper.toTournamentGetResponse(tournament);
    }

    public TournamentGetResponse patchTournament(String id, TournamentPatchRequest patchRequest) {

        String currentUserId = currentUserProvider.getCurrentUserId();
        Tournament tournament = tournamentRepository.findById(
                        Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Nessun torneo trovato con id:" + id));

        if (!tournament.getAdminsById().contains(currentUserId)) {
            throw new AccessDeniedException("Non sei autorizzato a modificare questo torneo");
        }

        helper.applyTournamentPatch(tournament, patchRequest);

        helper.validateTournament(tournament);

        Tournament savedTournament = tournamentRepository.save(tournament);

        return helper.toTournamentGetResponse(savedTournament);
    }
}
