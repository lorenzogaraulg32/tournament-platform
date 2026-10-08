package com.tournamentplatform.activityservice.controller;


import com.tournamentplatform.activityservice.dto.request.TeamAuthorityActivityRequest;
import com.tournamentplatform.activityservice.dto.request.TournamentAuthorityActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TeamAuthorityActivityResponse;
import com.tournamentplatform.activityservice.dto.response.TournamentAuthorityActivityResponse;
import com.tournamentplatform.activityservice.service.TeamAuthorityService;
import com.tournamentplatform.activityservice.service.TournamentAuthorityService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tournament-authority")
@AllArgsConstructor
public class TournamentAuthorityController {

    private final TournamentAuthorityService service;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TournamentAuthorityActivityResponse>> getActivitiesByUserId(

            @PathVariable String userId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByUserId(userId));

    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<TournamentAuthorityActivityResponse>> getActivitiesByTeamId(

            @PathVariable String tournamentId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByTournamentId(tournamentId));

    }

    @PostMapping("/internal")
    public ResponseEntity<Void> postNewActivity(
            @Valid @RequestBody TournamentAuthorityActivityRequest request
    ) {
        service.postNewActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
