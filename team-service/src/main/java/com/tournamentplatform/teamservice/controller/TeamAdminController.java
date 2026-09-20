package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.teamGet.TeamResponse;
import com.tournamentplatform.teamservice.service.TeamAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/teams")
public class TeamAdminController {


    private final TeamAdminService teamAdminService;

    public TeamAdminController(TeamAdminService teamAdminService) {
        this.teamAdminService = teamAdminService;
    }


    @GetMapping("/{teamId}/admins")
    public ResponseEntity<Set<String>> getAdmins(@PathVariable String teamId) {
        Set<String> response = teamAdminService.getAdmins(teamId);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/{teamId}/admins/{userId}")
    public ResponseEntity<TeamResponse> addAdmin(
            @PathVariable String teamId,
            @PathVariable String userId
    ) {
        TeamResponse response = teamAdminService.addAdmin(teamId, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{teamId}/admins/{userId}")
    public ResponseEntity<String> removeAdmin(
            @PathVariable String teamId,
            @PathVariable String userId
    ) {
        String response = teamAdminService.removeAdmin(teamId, userId);
        return ResponseEntity.ok(response);
    }


}
