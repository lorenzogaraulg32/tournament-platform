package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.TeamCreationRequest;
import com.tournamentplatform.teamservice.dto.TeamCreationResponse;
import com.tournamentplatform.teamservice.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }


    @PostMapping()
    public ResponseEntity<TeamCreationResponse> createTeam(@RequestBody @Valid TeamCreationRequest request) {
        TeamCreationResponse response = teamService.createTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
