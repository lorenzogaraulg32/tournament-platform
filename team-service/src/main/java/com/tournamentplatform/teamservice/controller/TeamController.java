package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.service.TeamService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }
}
