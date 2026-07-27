package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.*;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TeamService {

    private static final String DEFAULT_TEAM_LOGO_URL = "/uploads/team-logos/default_team_logo.png";
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

    public TeamCreationResponse createTeam(TeamCreationRequest request) {

        String currentUserId = teamAuthorizationHelper.getCurrentUserId();

        Set<String> players = new HashSet<>(request.getPlayerIds());
        players.add(currentUserId);

        Set<String> admins = new HashSet<>();
        admins.add(currentUserId);

        Team team = new Team(
                request.getName(),
                DEFAULT_TEAM_LOGO_URL,
                currentUserId,
                players,
                admins
        );

        Team savedTeam = teamsRepository.save(team);

        return new TeamCreationResponse(String.valueOf(savedTeam.getId()));


    }

    public TeamGetDetailsResponse getTeam(String id) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        return servicesHelper.toTeamGetDeatilsResponse(team);
    }


    public TeamGetDetailsResponse patchTeamName(String id, @Valid TeamNamePatchRequest request) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamAdmin(team);

        team.setName(request.getName());

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDeatilsResponse(savedTeam);
    }

    public TeamGetDetailsResponse patchTeamLogo(String id, MultipartFile file) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);

        teamAuthorizationHelper.checkTeamAdmin(team);

        String logoUrl = logoStorageService.storeTeamLogo(String.valueOf(team.getId()), file);

        team.setLogoUrl(logoUrl);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDeatilsResponse(savedTeam);
    }

    public void deleteTeam(String id) {

        Team team = servicesHelper.getTeamEntityOrThrow(id);


        teamAuthorizationHelper.checkTeamCreator(team);

        teamsRepository.delete(team);
    }


    public List<TeamGetResponse> getPlayerTeams() {

        String playerId = teamAuthorizationHelper.getCurrentUserId();

        return teamsRepository
                .findAllByPlayerIds(playerId)
                .stream()
                .map(servicesHelper::toTeamGetResponse)
                .toList();
    }
}
