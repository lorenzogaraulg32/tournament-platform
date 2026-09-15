package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.teamGet.TeamGetDetailsResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.AdminRemovesAdminException;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.OwnerRemovalExcpetion;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.TeamNotFoundException;
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

    public TeamGetDetailsResponse addPlayerInTeamInvitationCode(String invitationCode) {

        Team team = teamsRepository
                .findByInvitationCode(invitationCode)
                .orElseThrow(TeamNotFoundException::new);

        String playerId = teamAuthorizationHelper.getCurrentUserId();

        team.getPlayerIds().add(playerId);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetDetailsResponse(savedTeam);
    }

    public String removePlayerFromTeam(String teamId, String playerId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamAdmin(team);

        if (team.getCreatorId().equals(playerId)) {
            throw new OwnerRemovalExcpetion();
        }


        //un admin non può essere rimosso da un altro admin ma solo dal creatore
        if (teamAuthorizationHelper.checkTeamAdmin(team, playerId) && !teamAuthorizationHelper.checkTeamCreator(team)) {
            throw new AdminRemovesAdminException();
        }


        team.getPlayerIds().remove(playerId);
        team.getAdminIds().remove(playerId);

        teamsRepository.save(team);

        return "Eliminato";
    }


    public Set<String> getAllPlayersInTeam(String teamId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);
        return team.getPlayerIds();
    }

    public String leaveTeam(String teamId) {

        String currentUserId = teamAuthorizationHelper.getCurrentUserId();

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        if (teamAuthorizationHelper.checkTeamCreator(team)) {
            throw new OwnerRemovalExcpetion();
        }

        if (teamAuthorizationHelper.checkTeamAdmin(team, currentUserId)) {
            team.getAdminIds().remove(currentUserId);
        }

        team.getPlayerIds().remove(currentUserId);


        teamsRepository.save(team);


        return "Squadra abbandonata";

    }
}
