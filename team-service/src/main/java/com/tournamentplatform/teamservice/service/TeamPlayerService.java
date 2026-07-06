package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.TeamGetResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class TeamPlayerService {

    private final ServicesHelper servicesHelper;
    private final TeamsRepository teamsRepository;
    private final TeamAuthorizationHelper teamAuthorizationHelper;

    public TeamPlayerService(ServicesHelper servicesHelper, TeamsRepository teamsRepository, TeamAuthorizationHelper teamAuthorizationHelper) {
        this.servicesHelper = servicesHelper;
        this.teamsRepository = teamsRepository;
        this.teamAuthorizationHelper = teamAuthorizationHelper;
    }


    public TeamGetResponse addPlayerInTeam(String teamId, String playerId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamAdmin(team);

        team.getPlayerIds().add(playerId);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetResponse(savedTeam);
    }

    public TeamGetResponse removePlayerFromTeam(String teamId, String playerId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamAdmin(team);

        if (team.getCreatorId().equals(playerId)) {
            throw new IllegalArgumentException("Il creator non può essere rimosso dai giocatori");
        }

        team.getPlayerIds().remove(playerId);
        team.getAdminIds().remove(playerId);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetResponse(savedTeam);
    }


    public Set<String> getAllPlayersInTeam(String teamId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);
        return team.getPlayerIds();
    }
}
