package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.TeamGetResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.ResourceNotFoundException;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.stereotype.Service;

@Service
public class ServicesHelper {

    private final TeamsRepository teamsRepository;

    public ServicesHelper(TeamsRepository teamsRepository) {
        this.teamsRepository = teamsRepository;
    }

    public Team getTeamEntityOrThrow(String id) {
        return teamsRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Team non trovato con id: " + id));
    }

    public TeamGetResponse toTeamGetResponse(Team team) {
        return new TeamGetResponse(
                team.getId(),
                team.getName(),
                team.getLogoUrl(),
                team.getCreatorId(),
                team.getPlayerIds(),
                team.getAdminIds()
        );
    }

}
