package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.TeamCreationRequest;
import com.tournamentplatform.teamservice.dto.TeamCreationResponse;
import com.tournamentplatform.teamservice.dto.TeamGetResponse;
import com.tournamentplatform.teamservice.dto.TeamNamePatchRequest;
import com.tournamentplatform.teamservice.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @GetMapping("/{id}")
    public ResponseEntity<TeamGetResponse> getTeam(@PathVariable String id) {
        TeamGetResponse response = teamService.getTeam(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/name/{id}")
    public ResponseEntity<TeamGetResponse> patchTeamName(@PathVariable String id, @RequestBody @Valid TeamNamePatchRequest patchRequest) {
        TeamGetResponse response = teamService.patchTeamName(id, patchRequest);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping(
            value = "/logo/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<TeamGetResponse> patchTeamLogo(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        TeamGetResponse response = teamService.patchTeamLogo(id, file);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}
