package com.tournamentplatform.teamservice.controller;

import com.tournamentplatform.teamservice.dto.formation.FormationRequest;
import com.tournamentplatform.teamservice.dto.formation.FormationResponse;
import com.tournamentplatform.teamservice.dto.teamCreation.TeamCreationRequest;
import com.tournamentplatform.teamservice.dto.teamGet.TeamResponse;
import com.tournamentplatform.teamservice.dto.teamModify.TeamUpdateRequest;
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
    public ResponseEntity<TeamResponse> createTeam(
            @RequestPart("team")
            @Valid
            TeamCreationRequest request,

            @RequestPart(
                    value = "logo",
                    required = false
            )
            MultipartFile logo
    ) {
        TeamResponse response = teamService.createTeam(request, logo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @PostMapping("/name/{team_name}")
    public ResponseEntity<String> checkTeamName(@PathVariable String team_name) {
        String response = teamService.checkTeamName(team_name);

        return ResponseEntity.status(200).body(response);
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<List<TeamResponse>> getUserTeams(@PathVariable String user_id) {
        List<TeamResponse> response = teamService.getUserTeams(user_id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable String id) {
        TeamResponse response = teamService.getTeam(id);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}/logo")
    public ResponseEntity<Resource> getTeamLogo(
            @PathVariable String id
    ) {
        return teamService.getTeamLogo(id);
    }

    @PatchMapping(
            value = "/{teamId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<TeamResponse> updateTeam(
            @PathVariable String teamId,
            @Valid @RequestPart("team") TeamUpdateRequest request,
            @RequestPart(value = "logo", required = false) MultipartFile logo
    ) {
        TeamResponse response = teamService.updateTeam(teamId, request, logo);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @PatchMapping(
            value = "/logo/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<TeamResponse> patchTeamLogo(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        TeamResponse response = teamService.patchTeamLogo(id, file);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @PostMapping("/{id}/change_code")
    public ResponseEntity<TeamResponse> changeInvitationCode(
            @PathVariable String id
    ) {
        TeamResponse response = teamService.patchTeamCode(id);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/{id}/formation")
    public ResponseEntity<FormationResponse> updateFormation(
            @PathVariable String id,
            @Valid @RequestBody FormationRequest request
    ) {
        FormationResponse response = teamService.updateTeamFormation(id, request);
        return ResponseEntity.ok(response);
    }
}
