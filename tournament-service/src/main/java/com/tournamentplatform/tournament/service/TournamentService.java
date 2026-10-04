package com.tournamentplatform.tournament.service;


import com.tournamentplatform.tournament.client.MediaServiceClient;
import com.tournamentplatform.tournament.dto.tournaments.TournamentCreationRequest;
import com.tournamentplatform.tournament.dto.tournaments.TournamentGetResponse;
import com.tournamentplatform.tournament.dto.tournaments.TournamentPatchRequest;
import com.tournamentplatform.tournament.dto.tournaments.UserTournamentsResponse;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.entity.TournamentStatus;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.TournamentInProgressException;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.TournamentNameAlreadyExistsException;
import com.tournamentplatform.tournament.mapper.TournamentMapper;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TournamentHelper tournamentHelper;
    private final TournamentAuthorizationHelper tournamentAuthorizationHelper;
    private final MediaServiceClient mediaClient;
    private final TournamentMapper mapper;


    //creazione del torneo
    @Transactional
    public TournamentGetResponse createTournament(TournamentCreationRequest request, MultipartFile logo, MultipartFile rules) {

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
                tournamentHelper.generateUniqueInvitationCode(),
                new HashSet<>(),
                new ArrayList<>(),
                mapper.toGeoLocation(request.getLocation()),
                request.getRecruitmentStatus()
        );

        tournamentHelper.validateTournament(tournament);

        Tournament savedTournament = tournamentHelper.saveTournament(tournament);

        if (logo != null && !logo.isEmpty()) {
            mediaClient.putTournamentFile(
                    String.valueOf(savedTournament.getId()),
                    logo,
                    "/internal/media/tournament/{id}/logo"
            );
        }


        if (rules != null && !rules.isEmpty()) {
            mediaClient.putTournamentFile(
                    String.valueOf(savedTournament.getId()),
                    rules,
                    "/internal/media/tournament/{id}/rules"
            );
        }

        return mapper.toTournamentGetResponse(savedTournament);
    }


    public TournamentGetResponse getTournament(String id) {
        Tournament tournament = tournamentHelper.findOrThrow(id);
        return mapper.toTournamentGetResponse(tournament);
    }

    public List<TournamentGetResponse> getAllTournaments() {
        List<Tournament> tournaments = tournamentRepository.findAll();
        List<TournamentGetResponse> tournamentsResponse = new ArrayList<>();
        for (Tournament tournament : tournaments) {
            tournamentsResponse.add(mapper.toTournamentGetResponse(tournament));
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
                        .map(mapper::toTournamentGetResponse)
                        .toList();

        List<TournamentGetResponse> participatingResponses =
                participatingTournaments.stream()
                        .map(mapper::toTournamentGetResponse)
                        .toList();

        return new UserTournamentsResponse(
                managedResponses,
                participatingResponses
        );
    }


    public TournamentGetResponse patchTournament(String id, TournamentPatchRequest patchRequest, MultipartFile logo, MultipartFile rules) {

        Tournament tournament = tournamentHelper.findOrThrow(id);
        tournamentAuthorizationHelper.checkTournamentAdmin(tournament);

        tournamentHelper.applyTournamentPatch(tournament, patchRequest, logo, rules);

        tournamentHelper.validateTournament(tournament);

        Tournament savedTournament = tournamentHelper.saveTournament(tournament);

        return mapper.toTournamentGetResponse(savedTournament);
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

        return mapper.toTournamentGetResponse(savedTeam);
    }

    public List<String> canDeleteTeam(String teamId) {

        List<Tournament> participatingTournaments =
                tournamentRepository.findParticipatedByTeamIds(
                        Set.of(Long.parseLong(teamId))
                );

        for (Tournament tournament : participatingTournaments) {
            if (tournament.getStatus().equals(TournamentStatus.DRAFTING_MATCHES) || tournament.getStatus().equals(TournamentStatus.IN_PROGRESS)) {
                throw new TournamentInProgressException();
            }
        }


        return participatingTournaments.stream()
                .map(tournament -> String.valueOf(tournament.getId()))
                .toList();

    }

    public void leaveTournament(String teamId, String tournamentId) {

        Tournament tournament = tournamentHelper.findOrThrow(tournamentId);

        if (tournament.getStatus().equals(TournamentStatus.DRAFTING_MATCHES) || tournament.getStatus().equals(TournamentStatus.IN_PROGRESS)) {
            throw new TournamentInProgressException();
        }


        tournament.getRegisteredTeamIds().remove(Long.valueOf(teamId));

    }

    public void checkNameAlreadyExists(String teamName) {
        if (tournamentRepository.existsByName(teamName)) {
            throw new TournamentNameAlreadyExistsException();
        }
    }

    public ResponseEntity<Resource> getTournamentMedia(String tournamentId, String mediaType) {
        Optional<MediaServiceClient.MediaResource> media;

        if (mediaType.equals("logo")) {
            media = mediaClient.getTournamentFile(String.valueOf(tournamentId), "/internal/media/tournament/{id}/logo");
        } else if (mediaType.equals("rules")) {
            media = mediaClient.getTournamentFile(String.valueOf(tournamentId), "/internal/media/tournament/{id}/rules");
        } else {
            return ResponseEntity.noContent().build();
        }


        return media.map(file -> ResponseEntity
                .ok()
                .contentType(file.contentType())
                .body(file.resource())
        ).orElse(
                ResponseEntity.noContent().build()
        );

    }


}
