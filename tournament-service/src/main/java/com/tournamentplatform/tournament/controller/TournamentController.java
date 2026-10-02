package com.tournamentplatform.tournament.controller;

import com.tournamentplatform.tournament.dto.tournaments.*;
import com.tournamentplatform.tournament.service.TournamentService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/tournaments")
public class TournamentController {

    private final TournamentService tournamentService;

    public TournamentController(TournamentService tournamentService) {
        this.tournamentService = tournamentService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<TournamentGetResponse> createTournament(
            @RequestPart("tournament") TournamentCreationRequest request,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "rules", required = false) MultipartFile rules
    ) {

        TournamentGetResponse response = tournamentService.createTournament(request, logo, rules);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TournamentGetResponse> getTournament(@PathVariable String id) {
        TournamentGetResponse response = tournamentService.getTournament(id);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}/logo")
    public ResponseEntity<Resource> getTournamentLogo(
            @PathVariable String id
    ) {
        return tournamentService.getTournamentMedia(id, "logo");
    }


    @GetMapping("/{id}/rules")
    public ResponseEntity<Resource> getTournamentRules(
            @PathVariable String id
    ) {
        return tournamentService.getTournamentMedia(id, "rules");
    }

    @GetMapping()
    public ResponseEntity<List<TournamentGetResponse>> getAllTournaments() {
        List<TournamentGetResponse> response = tournamentService.getAllTournaments();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-tournaments")
    public ResponseEntity<UserTournamentsResponse> getMyTournaments(
            @RequestParam(required = false)
            List<String> myTeamIds
    ) {
        return ResponseEntity.ok(
                tournamentService.getMyTournaments(
                        myTeamIds != null ? myTeamIds : List.of()
                )
        );
    }


    @DeleteMapping("/leave/{tournamentId}/{teamId}")
    public ResponseEntity<Void> leaveTournament(
            @PathVariable String tournamentId,
            @PathVariable String teamId
    ) {
        tournamentService.leaveTournament(teamId, tournamentId);
        return ResponseEntity.noContent().build();

    }


    @GetMapping("/can_delete_team/{teamId}")
    public ResponseEntity<List<String>> canDeleteTeam(
            @PathVariable String teamId
    ) {
        List<String> response = tournamentService.canDeleteTeam(teamId);
        return ResponseEntity.ok(response);

    }


    @GetMapping("/nameCheck/{teamName}")
    public ResponseEntity<List<String>> checkNameAlreadyExists(
            @PathVariable String teamName
    ) {
        tournamentService.checkNameAlreadyExists(teamName);
        return ResponseEntity.ok().build();

    }


    //restituisce il torneo aggiornato come fosse una get
    @PatchMapping("/{tournamentId}")
    public ResponseEntity<TournamentGetResponse> patchTournament(
            @PathVariable String tournamentId,
            @RequestPart("tournament") TournamentPatchRequest request,
            @RequestPart(value = "logo", required = false) MultipartFile logo,
            @RequestPart(value = "rules", required = false) MultipartFile rules
    ) {
        TournamentGetResponse response = tournamentService.patchTournament(tournamentId, request, logo, rules);
        return ResponseEntity.ok(response);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable String id) {
        tournamentService.deleteTournament(id);
        return ResponseEntity.noContent().build();

    }

    @PostMapping("/{id}/change_code")
    public ResponseEntity<TournamentGetResponse> changeInvitationCode(
            @PathVariable String id
    ) {
        TournamentGetResponse response = tournamentService.patchTournamentCode(id);
        return ResponseEntity.ok(response);
    }


}
