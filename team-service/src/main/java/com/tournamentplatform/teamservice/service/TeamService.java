package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.TeamCreationRequest;
import com.tournamentplatform.teamservice.dto.TeamCreationResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class TeamService {

    private static final String DEFAULT_TEAM_LOGO_URL = "/uploads/team-logos/default_team_logo.png";
    private final TeamsRepository teamsRepository;
    private final TeamAuthorizationHelper teamAuthorizationHelper;

    public TeamService(TeamsRepository teamsRepository, TeamAuthorizationHelper teamAuthorizationHelper) {
        this.teamsRepository = teamsRepository;
        this.teamAuthorizationHelper = teamAuthorizationHelper;
    }

    public TeamCreationResponse createTeam(TeamCreationRequest request) {

        String currentUserId = teamAuthorizationHelper.getCurrentUserId();

        Set<String> players = new HashSet<>(request.getPlayerIds());
        players.add(teamAuthorizationHelper.getCurrentUserId());

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
}
