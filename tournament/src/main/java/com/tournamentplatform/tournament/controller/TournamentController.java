package com.tournamentplatform.tournament.controller;

import com.tournamentplatform.tournament.dto.tournaments.TournamentCreationRequest;
import com.tournamentplatform.tournament.dto.tournaments.TournamentCreationResponse;
import com.tournamentplatform.tournament.dto.tournaments.TournamentGetResponse;
import com.tournamentplatform.tournament.dto.tournaments.TournamentPatchRequest;
import com.tournamentplatform.tournament.service.TournamentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @PostMapping()
    public ResponseEntity<TournamentCreationResponse> createTournament(@RequestBody @Valid TournamentCreationRequest request) {
        TournamentCreationResponse response = tournamentService.createTournament(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournamentGetResponse> getTournament(@PathVariable String id) {
        TournamentGetResponse response = tournamentService.getTournament(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping()
    public ResponseEntity<List<TournamentGetResponse>> getAllTournaments() {
        List<TournamentGetResponse> response = tournamentService.getAllTournaments();
        return ResponseEntity.ok(response);
    }

    //restituisce il torneo aggiornato come fosse una get
    @PatchMapping("/{id}")
    public ResponseEntity<TournamentGetResponse> patchTournament(@PathVariable String id, @RequestBody @Valid TournamentPatchRequest patchRequest) {
        TournamentGetResponse response = tournamentService.patchTournament(id, patchRequest);
        return ResponseEntity.ok(response);

    }




}
