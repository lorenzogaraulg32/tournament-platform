package com.tournamentplatform.tournament.controller;

import com.tournamentplatform.tournament.dto.admin.AdminAddingRequest;
import com.tournamentplatform.tournament.dto.admin.AdminGetResponse;
import com.tournamentplatform.tournament.service.TournamentAdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tournaments")
public class AdminController {

    private final TournamentAdminService tournamentAdminService;

    public AdminController(TournamentAdminService tournamentAdminService) {
        this.tournamentAdminService = tournamentAdminService;
    }


    //restituisce tutti gli admin di un torneo
    @GetMapping("/{id}/admins")
    public ResponseEntity<List<AdminGetResponse>> getTournamentAdmins(@PathVariable String id) {
        List<AdminGetResponse> response = tournamentAdminService.getTournamentAdmins(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/admins")
    public ResponseEntity<List<AdminGetResponse>> addTournamentAdmin(@PathVariable String id, @RequestBody @Valid AdminAddingRequest request) {
        List<AdminGetResponse> response = tournamentAdminService.addTournamentAdmin(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/admins/{adminId}")
    public ResponseEntity<Void> removeTournamentAdmin(@PathVariable String id, @PathVariable String adminId) {
        tournamentAdminService.removeAdminFromTournament(id, adminId);
        return ResponseEntity.noContent().build();
    }
}
