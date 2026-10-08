package com.tournamentplatform.activityservice.controller;


import com.tournamentplatform.activityservice.dto.request.TeamModActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TeamModActivityResponse;
import com.tournamentplatform.activityservice.service.TeamModService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team-mod")
@AllArgsConstructor
public class TeamModController {


    private final TeamModService service;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TeamModActivityResponse>> getActivitiesByUserId(

            @PathVariable String userId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByUserId(userId));

    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TeamModActivityResponse>> getActivitiesByTeamId(

            @PathVariable String teamId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByTeamId(teamId));

    }

    @PostMapping("/internal")
    public ResponseEntity<Void> postNewActivity(
            @Valid @RequestBody TeamModActivityRequest request
    ) {
        service.postNewActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
