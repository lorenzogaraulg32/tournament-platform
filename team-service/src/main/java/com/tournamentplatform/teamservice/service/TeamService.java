package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.TeamGetDetailsResponse;
import com.tournamentplatform.teamservice.dto.TeamGetResponse;
import com.tournamentplatform.teamservice.dto.TeamNamePatchRequest;
import com.tournamentplatform.teamservice.dto.teamCreation.TeamCreationRequest;
import com.tournamentplatform.teamservice.dto.teamCreation.TeamCreationResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;

@Service
public class TeamService {

    private final TeamsRepository teamsRepository;
    private final TeamAuthorizationHelper teamAuthorizationHelper;
    private final LogoStorageService logoStorageService;
    private final ServicesHelper servicesHelper;

    public TeamService(TeamsRepository teamsRepository, TeamAuthorizationHelper teamAuthorizationHelper, LogoStorageService logoStorageService, ServicesHelper servicesHelper) {
        this.teamsRepository = teamsRepository;
        this.teamAuthorizationHelper = teamAuthorizationHelper;
        this.logoStorageService = logoStorageService;
        this.servicesHelper = servicesHelper;
    }

    @Transactional
    public TeamCreationResponse createTeam(TeamCreationRequest request, MultipartFile logo) {

        String currentUserId = teamAuthorizationHelper.getCurrentUserId();

        Set<String> players = new HashSet<>();
        players.add(currentUserId);

        Set<String> admins = new HashSet<>();
        admins.add(currentUserId);


        Team team = new Team(
                request.getName(),
                request.getDescription(),
                currentUserId,
                players,
                admins,
                request.getStatus(),
                request.getLocation().getLabel(),
                request.getLocation().getLatitude(),
                request.getLocation().getLongitude(),
                servicesHelper.generateUniqueInvitationCode()
        );

        Team savedTeam = teamsRepository.save(team);

        if (logo != null && !logo.isEmpty()) {
            String logoUrl = logoStorageService.storeTeamLogo(
                    savedTeam.getId(),
                    logo
            );

            savedTeam.setLogoUrl(logoUrl);
        } else {
            System.out.println("Il logo è nullo o vuoto!");
        }


        return new TeamCreationResponse(String.valueOf(savedTeam.getId()));


    }

    public TeamGetDetailsResponse getTeam(String id) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        return servicesHelper.toTeamGetDeatilsResponse(team);
    }

    public ResponseEntity<Resource> getTeamLogo(String teamId) {

        Team team =
                servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamPlayer(team);

        Resource logo =
                logoStorageService.loadTeamLogo(
                        team.getLogoUrl()
                );

        MediaType contentType = MediaTypeFactory
                .getMediaType(logo)
                .orElse(APPLICATION_OCTET_STREAM);

        return ResponseEntity
                .ok()
                .contentType(contentType)
                .cacheControl(CacheControl.noStore())
                .body(logo);
    }

    public TeamGetDetailsResponse patchTeamName(String id, @Valid TeamNamePatchRequest request) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamAdmin(team);

        team.setName(request.getName());

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDeatilsResponse(savedTeam);
    }

    public TeamGetDetailsResponse patchTeamCode(String id) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamAdmin(team);

        team.setInvitationCode(servicesHelper.generateUniqueInvitationCode());

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDeatilsResponse(savedTeam);
    }


    public TeamGetDetailsResponse patchTeamLogo(String id, MultipartFile file) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamAdmin(team);

        String logoUrl = logoStorageService.storeTeamLogo(team.getId(), file);

        team.setLogoUrl(logoUrl);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDeatilsResponse(savedTeam);
    }

    @Transactional
    public void deleteTeam(String id) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamCreator(team);

        Long teamId = team.getId();

        teamsRepository.delete(team);

        teamsRepository.flush();

        logoStorageService.deleteTeamLogo(teamId);
    }


    public List<TeamGetResponse> getCurrentUserTeams() {


        return teamsRepository
                .findAllByPlayerIds(teamAuthorizationHelper.getCurrentUserId())
                .stream()
                .map(servicesHelper::toTeamGetResponse)
                .toList();
    }


    public List<TeamGetResponse> getUserTeams(String playerId) {

        return teamsRepository
                .findAllByPlayerIds(playerId)
                .stream()
                .map(servicesHelper::toTeamGetResponse)
                .toList();
    }


}
