package com.tournamentplatform.tournament.service;


import com.tournamentplatform.tournament.dto.tournaments.*;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.entity.TournamentStatus;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
                request.getFormat(),
                request.getRulesUrl(),
                tournamentHelper.generateUniqueInvitationCode(),
                new HashSet<>(),
                new ArrayList<>()
        );

        tournamentHelper.validateTournament(tournament);

        Tournament savedTournament = tournamentHelper.saveTournament(tournament);

        return new TournamentCreationResponse(String.valueOf(savedTournament.getId()));
    }


    public TournamentGetResponse getTournament(String id) {
        Tournament tournament = tournamentHelper.findOrThrow(id);
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

    public UserTournamentsResponse getMyTournaments(
            List<String> myTeamIds
    ) {
        String userId =
                tournamentAuthorizationHelper.getCurrentUserId();

        List<Tournament> managedTournaments =
                tournamentRepository.findManagedByUserId(userId);

        Set<Long> convertedTeamIds = myTeamIds == null
                ? Set.of()
                : myTeamIds.stream()
                .map(Long::valueOf)
                .collect(Collectors.toSet());

        List<Tournament> participatingTournaments =
                convertedTeamIds.isEmpty()
                        ? List.of()
                        : tournamentRepository
                        .findParticipatedByTeamIds(convertedTeamIds);

        List<TournamentGetResponse> managedResponses =
                managedTournaments.stream()
                        .map(tournamentHelper::toTournamentGetResponse)
                        .toList();

        List<TournamentGetResponse> participatingResponses =
                participatingTournaments.stream()
                        .map(tournamentHelper::toTournamentGetResponse)
                        .toList();

        return new UserTournamentsResponse(
                managedResponses,
                participatingResponses
        );
    }


    public TournamentGetResponse patchTournament(String id, TournamentPatchRequest patchRequest) {

        Tournament tournament = tournamentHelper.findOrThrow(id);
        tournamentAuthorizationHelper.checkTournamentAdmin(tournament);

        tournamentHelper.applyTournamentPatch(tournament, patchRequest);

        tournamentHelper.validateTournament(tournament);

        Tournament savedTournament = tournamentHelper.saveTournament(tournament);

        return tournamentHelper.toTournamentGetResponse(savedTournament);
    }


    public void deleteTournament(String id) {
        Tournament tournament = tournamentHelper.findOrThrow(id);

        tournamentAuthorizationHelper.checkTournamentCreator(tournament);

        if (tournamentHelper.canBeDeleted(tournament)) {
            tournamentRepository.delete(tournament);
        } else {
            tournament.setStatus(TournamentStatus.CANCELLED);
        }
    }



}
