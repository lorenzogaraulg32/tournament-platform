package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.TeamGetDetailsResponse;
import com.tournamentplatform.teamservice.dto.TeamGetResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.ResourceNotFoundException;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

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

    public TeamGetDetailsResponse toTeamGetDeatilsResponse(Team team) {
        return new TeamGetDetailsResponse(
                team.getId(),
                team.getName(),
                team.getDescription(),
                team.getLocationLabel(),
                buildPublicLogoUrl(team),
                team.getCreatorId(),
                team.getPlayerIds(),
                team.getAdminIds(),
                team.getInvitationCode()
        );
    }

    public TeamGetResponse toTeamGetResponse(Team team) {
        return new TeamGetResponse(
                team.getId(),
                team.getName(),
                buildPublicLogoUrl(team),
                team.getPlayerIds().size()
        );
    }


    private String buildPublicLogoUrl(Team team) {
        if (
                team.getLogoUrl() == null ||
                        team.getLogoUrl().isBlank()
        ) {
            return null;
        }

        return "/teams/" + team.getId() + "/logo";
    }


    public String generateUniqueInvitationCode() {
        String code;

        do {
            code = UUID.randomUUID()
                    .toString()
                    .replace("-", "")
                    .substring(0, 8)
                    .toUpperCase();
        } while (teamsRepository.existsByInvitationCode(code));

        return code;
    }

}
