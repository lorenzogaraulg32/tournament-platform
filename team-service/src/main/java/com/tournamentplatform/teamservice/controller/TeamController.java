package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.TeamGetDetailsResponse;
import com.tournamentplatform.teamservice.dto.TeamGetResponse;
import com.tournamentplatform.teamservice.dto.TeamNamePatchRequest;
import com.tournamentplatform.teamservice.dto.teamCreation.TeamCreationRequest;
import com.tournamentplatform.teamservice.dto.teamCreation.TeamCreationResponse;
import com.tournamentplatform.teamservice.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
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


    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<TeamCreationResponse> createTeam(
            @RequestPart("team")
            @Valid
            TeamCreationRequest request,

            @RequestPart(
                    value = "logo",
                    required = false
            )
            MultipartFile logo
    ) {
        TeamCreationResponse response = teamService.createTeam(request, logo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/my-teams")
    public ResponseEntity<List<TeamGetResponse>> getCurrentUserTeams() {
        List<TeamGetResponse> response = teamService.getCurrentUserTeams();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<List<TeamGetResponse>> getUserTeams(@PathVariable String user_id) {
        List<TeamGetResponse> response = teamService.getUserTeams(user_id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamGetDetailsResponse> getTeam(@PathVariable String id) {
        TeamGetDetailsResponse response = teamService.getTeam(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}/logo")
    public ResponseEntity<Resource> getTeamLogo(
            @PathVariable String id
    ) {
        return teamService.getTeamLogo(id);
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
