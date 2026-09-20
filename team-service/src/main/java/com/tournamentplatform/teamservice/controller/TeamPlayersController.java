package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.teamGet.TeamResponse;
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
        Set<String> response = teamPlayerService.getAllPlayersInTeam(teamId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{teamId}/players/{userId}")
    public ResponseEntity<TeamResponse> addPlayer(
            @PathVariable String teamId,
            @PathVariable String userId
    ) {
        TeamResponse response = teamPlayerService.addPlayerInTeam(teamId, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/players/{invitationCode}")
    public ResponseEntity<TeamResponse> addPlayerInvitationCode(
            @PathVariable String invitationCode
    ) {
        TeamResponse response = teamPlayerService.addPlayerInTeamInvitationCode(invitationCode);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/leave/{teamId}")
            public ResponseEntity<String> leaveTeam(
            @PathVariable String teamId
    ) {
        String response = teamPlayerService.leaveTeam(teamId);
        return ResponseEntity.ok(response);
    }



    @DeleteMapping("/{teamId}/players/{userId}")
    public ResponseEntity<String> removePlayer(
            @PathVariable String teamId,
            @PathVariable String userId
    ) {
        String response = teamPlayerService.removePlayerFromTeam(teamId, userId);
        return ResponseEntity.ok(response);
    }



}
