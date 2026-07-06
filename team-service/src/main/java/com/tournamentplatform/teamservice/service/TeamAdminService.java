package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.TeamGetResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class TeamAdminService {

    private final ServicesHelper servicesHelper;
    private final TeamsRepository teamsRepository;
    private final TeamAuthorizationHelper teamAuthorizationHelper;

    public TeamAdminService(ServicesHelper servicesHelper, TeamsRepository teamsRepository, TeamAuthorizationHelper teamAuthorizationHelper) {
        this.servicesHelper = servicesHelper;
        this.teamsRepository = teamsRepository;
        this.teamAuthorizationHelper = teamAuthorizationHelper;
    }


    public TeamGetResponse addAdmin(String teamId, String userId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);
        teamAuthorizationHelper.checkTeamCreator(team);

        if (!team.getPlayerIds().contains(userId)) {
            throw new IllegalArgumentException("L'utente deve essere un giocatore del team prima di diventare admin");
        }

        team.getAdminIds().add(userId);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetResponse(savedTeam);

    }

    public TeamGetResponse removeAdmin(String teamId, String userId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);
        teamAuthorizationHelper.checkTeamCreator(team);

        if (team.getCreatorId().equals(userId)) {
            throw new IllegalArgumentException("Il creator non può essere rimosso dagli admin");
        }

        team.getAdminIds().remove(userId);

        Team savedTeam = teamsRepository.save(team);

        return servicesHelper.toTeamGetResponse(savedTeam);

    }

    public Set<String> getAdmins(String teamId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);
        return team.getAdminIds();
    }


}
