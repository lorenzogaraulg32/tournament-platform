package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.*;
import com.tournamentplatform.teamservice.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @GetMapping("/my-teams")
    public ResponseEntity<List<TeamGetResponse>> getPlayerTeams() {
        List<TeamGetResponse> response = teamService.getPlayerTeams();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamGetDetailsResponse> getTeam(@PathVariable String id) {
        TeamGetDetailsResponse response = teamService.getTeam(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/name/{id}")
    public ResponseEntity<TeamGetDetailsResponse> patchTeamName(@PathVariable String id, @RequestBody @Valid TeamNamePatchRequest patchRequest) {
        TeamGetDetailsResponse response = teamService.patchTeamName(id, patchRequest);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping(
            value = "/logo/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<TeamGetDetailsResponse> patchTeamLogo(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        TeamGetDetailsResponse response = teamService.patchTeamLogo(id, file);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}
