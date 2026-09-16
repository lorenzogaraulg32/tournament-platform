package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.dto.teamGet.TeamGetDetailsResponse;
import com.tournamentplatform.teamservice.dto.teamGet.TeamGetResponse;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.TeamNotFoundException;
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
                .orElseThrow(TeamNotFoundException::new);
    }

    public TeamGetDetailsResponse toTeamGetDetailsResponse(Team team) {
        return new TeamGetDetailsResponse(
                team.getId(),
                team.getName(),
                team.getDescription(),
                team.getStatus(),
                team.getLocationLabel(),
                buildPublicLogoUrl(team),
                team.getCreatorId(),
                team.getPlayerIds(),
                team.getAdminIds(),
                team.getInvitationCode(),
                team.getSport()
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
