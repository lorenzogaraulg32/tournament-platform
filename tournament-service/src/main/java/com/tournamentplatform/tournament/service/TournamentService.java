package com.tournamentplatform.tournament.service;


import com.tournamentplatform.tournament.dto.tournaments.*;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.entity.TournamentStatus;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TournamentHelper tournamentHelper;
    private final TournamentAuthorizationHelper tournamentAuthorizationHelper;
    private final LogoStorageService logoStorageService;

    public TournamentService(
            TournamentRepository tournamentRepository,
            TournamentHelper tournamentHelper,
            TournamentAuthorizationHelper tournamentAuthorizationHelper,
            LogoStorageService logoStorageService
    ) {
        this.tournamentRepository = tournamentRepository;
        this.tournamentHelper = tournamentHelper;
        this.tournamentAuthorizationHelper = tournamentAuthorizationHelper;
        this.logoStorageService = logoStorageService;
    }


    //creazione del torneo
    @Transactional
    public TournamentCreationResponse createTournament(TournamentCreationRequest request, MultipartFile logo) {

        String userId = tournamentAuthorizationHelper.getCurrentUserId();

        ArrayList<String> admins = new ArrayList<>();
        admins.add(userId);

        TournamentLocationRequest location = request.getLocation();

        String locationLabel = null;
        BigDecimal latitude = null;
        BigDecimal longitude = null;

        if (location != null) {
            locationLabel = location.getLabel();
            latitude = location.getLatitude();
            longitude = location.getLongitude();
        }

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
                tournamentHelper.generateUniqueInvitationCode(),
                new HashSet<>(),
                new ArrayList<>(),
                locationLabel,
                latitude,
                longitude
        );

        tournamentHelper.validateTournament(tournament);

        Tournament savedTournament = tournamentHelper.saveTournament(tournament);

        if (logo != null && !logo.isEmpty()) {
            String logoUrl = logoStorageService.storeTeamLogo(
                    tournament.getId(),
                    logo
            );

            savedTournament.setLogoUrl(logoUrl);
        }

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


    public TournamentGetResponse patchTournamentCode(String id) {

        Tournament team = tournamentHelper.findOrThrow(id);

        tournamentAuthorizationHelper.checkTournamentAdmin(team);

        team.setInvitationCode(tournamentHelper.generateUniqueInvitationCode());

        Tournament savedTeam = tournamentRepository.save(team);

        return tournamentHelper.toTournamentGetResponse(savedTeam);
    }
}
