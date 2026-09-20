package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.teamGet.TeamResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.OwnerRemovalExcpetion;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.UserNotMemberException;
import com.tournamentplatform.teamservice.mapper.TeamMapper;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class TeamAdminService {

    private final ServicesHelper servicesHelper;
    private final TeamsRepository teamsRepository;
    private final TeamAuthorizationHelper teamAuthorizationHelper;
    private final TeamMapper mapper;

    public TeamAdminService(ServicesHelper servicesHelper, TeamsRepository teamsRepository, TeamAuthorizationHelper teamAuthorizationHelper, TeamMapper mapper) {
        this.servicesHelper = servicesHelper;
        this.teamsRepository = teamsRepository;
        this.teamAuthorizationHelper = teamAuthorizationHelper;
        this.mapper = mapper;
    }


    public TeamResponse addAdmin(String teamId, String userId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);
        teamAuthorizationHelper.checkTeamCreator(team);

        if (!team.getPlayerIds().contains(userId)) {
            throw new UserNotMemberException();
        }

        team.getAdminIds().add(userId);

        Team savedTeam = teamsRepository.save(team);

        return mapper.toTeamResponse(savedTeam);

    }

    //solo il creatore può rimuovere altri admin
    public String removeAdmin(String teamId, String userId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);

        teamAuthorizationHelper.checkTeamCreator(team);

        if (team.getCreatorId().equals(userId)) {
            throw new OwnerRemovalExcpetion();
        }

        team.getAdminIds().remove(userId);

        teamsRepository.save(team);

        return "Eliminato";

    }

    public Set<String> getAdmins(String teamId) {

        Team team = servicesHelper.getTeamEntityOrThrow(teamId);
        return team.getAdminIds();
    }


}
