package com.tournamentplatform.activityservice.controller;

import com.tournamentplatform.activityservice.dto.request.TournamentAuthorityActivityRequest;
import com.tournamentplatform.activityservice.dto.request.TournamentModActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TournamentAuthorityActivityResponse;
import com.tournamentplatform.activityservice.dto.response.TournamentModActivityResponse;
import com.tournamentplatform.activityservice.service.TournamentAuthorityService;
import com.tournamentplatform.activityservice.service.TournamentModService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tournament-mod")
@AllArgsConstructor
public class TournamentModController {

    private final TournamentModService service;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TournamentModActivityResponse>> getActivitiesByUserId(

            @PathVariable String userId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByUserId(userId));

    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<TournamentModActivityResponse>> getActivitiesByTournamentId(

            @PathVariable String tournamentId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByTournamentId(tournamentId));

    }

    @PostMapping("/internal")
    public ResponseEntity<Void> postNewActivity(
            @Valid @RequestBody TournamentModActivityRequest request
    ) {
        service.postNewActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }



}
