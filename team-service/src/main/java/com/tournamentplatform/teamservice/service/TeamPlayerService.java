package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.TeamGetDetailsResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.OwnerRemovalExcpetion;
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


    public TeamGetDetailsResponse addPlayerInTeam(String teamId, String playerId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamAdmin(team);

        team.getPlayerIds().add(playerId);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDetailsResponse(savedTeam);
    }

    public TeamGetDetailsResponse addPlayerInTeamInvitationCode( String invitationCode) {

        Team team = teamsRepository.getByInvitationCode(invitationCode);

        String playerId = teamAuthorizationHelper.getCurrentUserId();

        team.getPlayerIds().add(playerId);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDetailsResponse(savedTeam);
    }

    public TeamGetDetailsResponse removePlayerFromTeam(String teamId, String playerId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamAdmin(team);

        if (team.getCreatorId().equals(playerId)) {
            throw new OwnerRemovalExcpetion();
        }

        team.getPlayerIds().remove(playerId);
        team.getAdminIds().remove(playerId);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDetailsResponse(savedTeam);
    }


    public Set<String> getAllPlayersInTeam(String teamId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);
        return team.getPlayerIds();
    }

}
