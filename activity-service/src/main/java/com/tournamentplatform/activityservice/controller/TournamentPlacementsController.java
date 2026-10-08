package com.tournamentplatform.activityservice.controller;

import com.tournamentplatform.activityservice.dto.request.TournamentPlacementActivityRequest;
import com.tournamentplatform.activityservice.dto.response.TournamentPlacementActivityResponse;
import com.tournamentplatform.activityservice.service.TournamentPlacementsService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tournament-placements")
@AllArgsConstructor
public class TournamentPlacementsController {

    private final TournamentPlacementsService service;


    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<List<TournamentPlacementActivityResponse>> getActivitiesByUserId(

            @PathVariable String tournamentId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByTournamentId(tournamentId));

    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TournamentPlacementActivityResponse>> getActivitiesByTeamId(
            @PathVariable String teamId
    ) {

        return ResponseEntity.ok(service.getAllActivitiesByTeamId(teamId));

    }

    @PostMapping("/internal")
    public ResponseEntity<Void> postNewActivity(
            @Valid @RequestBody TournamentPlacementActivityRequest request
    ) {
        service.postNewActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
