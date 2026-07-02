package com.tournamentplatform.tournament.Controller;

import com.tournamentplatform.tournament.DTO.TournamentCreationRequest;
import com.tournamentplatform.tournament.DTO.TournamentCreationResponse;
import com.tournamentplatform.tournament.DTO.TournamentGetResponse;
import com.tournamentplatform.tournament.service.TournamentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
        TournamentGetResponse response = tournamentService.getTournamentById(id);
        return ResponseEntity.ok(response);

    }
}
