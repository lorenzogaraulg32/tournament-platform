package com.tournamentplatform.teamservice.service;

import com.tournamentplatform.teamservice.repository.TeamsRepository;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    private final TeamsRepository teamsRepository;

    public TeamService(TeamsRepository teamsRepository) {
        this.teamsRepository = teamsRepository;
    }
}
