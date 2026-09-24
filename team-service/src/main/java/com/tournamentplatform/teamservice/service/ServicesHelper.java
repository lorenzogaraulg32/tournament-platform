package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.entity.Formation;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.TeamNotFoundException;
import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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


    @Transactional
    public Team resetFormation(Team team) {
        Formation formation = team.getFormation();

        if (formation != null) {
            formation.setName(null);
            formation.getSlotAssignment().clear();
            formation.getBenchOrder().clear();
        }

        team.setFormation(formation);

        return teamsRepository.save(team);
    }

    @Transactional
    public void removePlayerFromFormation(Team team, String playerId) {
        Formation formation = team.getFormation();

        if (formation == null) {
            return;
        }

        formation.getSlotAssignment()
                .values()
                .removeIf(playerId::equals);

        formation.getBenchOrder()
                .removeIf(playerId::equals);
    }


}
