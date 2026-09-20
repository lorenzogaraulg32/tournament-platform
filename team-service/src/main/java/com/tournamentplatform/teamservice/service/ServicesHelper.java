package com.tournamentplatform.teamservice.service;

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
