package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.TeamGetDetailsResponse;
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
    public ResponseEntity<TeamGetDetailsResponse> addAdmin(
            @PathVariable String teamId,
            @PathVariable String userId
    ) {
        TeamGetDetailsResponse response = teamAdminService.addAdmin(teamId, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{teamId}/admins/{userId}")
    public ResponseEntity<TeamGetDetailsResponse> removeAdmin(
            @PathVariable String teamId,
            @PathVariable String userId
    ) {
        TeamGetDetailsResponse response = teamAdminService.removeAdmin(teamId, userId);
        return ResponseEntity.ok(response);
    }


}
