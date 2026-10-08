package com.tournamentplatform.activityservice.controller;

import com.tournamentplatform.activityservice.dto.request.TeamAuthorityActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TeamAuthorityActivityResponse;
import com.tournamentplatform.activityservice.service.TeamAuthorityService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team-authority")
@AllArgsConstructor
public class TeamAuthorityController {

    private final TeamAuthorityService service;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TeamAuthorityActivityResponse>> getActivitiesByUserId(

            @PathVariable String userId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByUserId(userId));

    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TeamAuthorityActivityResponse>> getActivitiesByTeamId(

            @PathVariable String teamId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByTeamId(teamId));

    }

    @PostMapping("/internal")
    public ResponseEntity<Void> postNewActivity(
            @Valid @RequestBody TeamAuthorityActivityRequest request
    ) {
        service.postNewActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
