package com.tournamentplatform.activityservice.controller;

import com.tournamentplatform.activityservice.dto.request.TeamMembershipActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TeamMembershipActivityResponse;
import com.tournamentplatform.activityservice.service.TeamMembershipService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/team-membership")
public class TeamMembershipController {

    private final TeamMembershipService service;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TeamMembershipActivityResponse>> getActivitiesByUserId(

            @PathVariable String userId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByUserId(userId));

    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TeamMembershipActivityResponse>> getActivitiesByTeamId(

            @PathVariable String teamId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByTeamId(teamId));

    }

    @PostMapping("/internal")
    public ResponseEntity<Void> postNewActivity(
            @Valid @RequestBody TeamMembershipActivityRequest request
    ) {
        service.postNewActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
