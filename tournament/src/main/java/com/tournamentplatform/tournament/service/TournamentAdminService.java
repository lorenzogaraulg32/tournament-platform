package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.dto.admin.AdminAddingRequest;
import com.tournamentplatform.tournament.dto.admin.AdminGetResponse;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.errorHandling.ResourceNotFoundException;
import com.tournamentplatform.tournament.repository.TournamentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TournamentAdminService {

    private final TournamentRepository tournamentRepository;
    private final TournamentAuthorizationHelper tournamentAuthorizationHelper;

    public TournamentAdminService(TournamentRepository tournamentRepository, TournamentAuthorizationHelper tournamentAuthorizationHelper) {
        this.tournamentRepository = tournamentRepository;
        this.tournamentAuthorizationHelper = tournamentAuthorizationHelper;
    }


    public List<AdminGetResponse> getTournamentAdmins(String id) {
        Tournament tournament = tournamentRepository.findById(
                        Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Nessun torneo trovato con id: " + id));

        List<AdminGetResponse> response = new ArrayList<>();

        for (String adminId : tournament.getAdminsById()) {
            response.add(new AdminGetResponse(adminId));
        }

        return response;
    }

    public List<AdminGetResponse> addTournamentAdmin(String id, AdminAddingRequest request) {

        Tournament tournament = tournamentRepository.findById(
                        Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Nessun torneo trovato con id: " + id));

        tournamentAuthorizationHelper.checkTournamentAdmin(tournament);

        if (tournament.getAdminsById().contains(request.adminId())) {
            throw new IllegalArgumentException("L'utente è già admin di questo torneo");
        }

        tournament.getAdminsById().add(request.adminId());

        tournamentRepository.save(tournament);

        return getTournamentAdmins(id);

    }

    public void removeAdminFromTournament(String id, String adminId) {
        Tournament tournament = tournamentRepository.findById(
                        Long.valueOf(id))
                .orElseThrow(() -> new ResourceNotFoundException("Nessun torneo trovato con id: " + id));


        tournamentAuthorizationHelper.checkTournamentAdmin(tournament);

        if (tournament.getCreatedByUserId().equals(adminId)) {
            throw new IllegalArgumentException("Il creatore del torneo non può essere rimosso dagli admin");
        }

        if (!tournament.getAdminsById().contains(adminId)) {
            throw new IllegalArgumentException("L'utente non è un amministratore di questo torneo");
        }

        tournament.getAdminsById().remove(adminId);

        tournamentRepository.save(tournament);

    }

}
