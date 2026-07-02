package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.DTO.TournamentCreationRequest;
import com.tournamentplatform.tournament.DTO.TournamentCreationResponse;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import com.tournamentplatform.tournament.security.CurrentUserProvider;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final CurrentUserProvider currentUserProvider;

    public TournamentService(TournamentRepository tournamentRepository, CurrentUserProvider currentUserProvider) {
        this.tournamentRepository = tournamentRepository;
        this.currentUserProvider = currentUserProvider;
    }


    //creazione del torneo
    public TournamentCreationResponse createTournament(TournamentCreationRequest request) {


        String userId = currentUserProvider.getcurretUserId();


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


}
