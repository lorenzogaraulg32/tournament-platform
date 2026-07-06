package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.TeamGetResponse;
import com.tournamentplatform.teamservice.service.TeamPlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/teams")
public class TeamPlayersController {

    private final TeamPlayerService teamPlayerService;

    public TeamPlayersController(TeamPlayerService teamPlayerService) {
        this.teamPlayerService = teamPlayerService;
    }

    @GetMapping("/{teamId}/players")
    public ResponseEntity<Set<String>> getPlayers(@PathVariable String teamId) {
        Set<String> response = teamPlayerService.getAllPlayersInTeam(teamId );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{teamId}/players/{userId}")
    public ResponseEntity<TeamGetResponse> addPlayer(
            @PathVariable String teamId,
            @PathVariable String userId
    ) {
        TeamGetResponse response = teamPlayerService.addPlayerInTeam(teamId, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{teamId}/players/{userId}")
    public ResponseEntity<TeamGetResponse> removePlayer(
            @PathVariable String teamId,
            @PathVariable String userId
    ) {
        TeamGetResponse response = teamPlayerService.removePlayerFromTeam(teamId, userId);
        return ResponseEntity.ok(response);
    }
}
