package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.dto.admin.AdminAddingRequest;
import com.tournamentplatform.tournament.dto.admin.AdminGetResponse;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.CantRemoveOwnerException;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.NotTournamentAdminException_BAD_REQUEST;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.UserAlreadyAdminException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TournamentAdminService {


    private final TournamentAuthorizationHelper tournamentAuthorizationHelper;
    private final TournamentHelper tournamentHelper;


    public TournamentAdminService(TournamentAuthorizationHelper tournamentAuthorizationHelper, TournamentHelper tournamentHelper) {
        this.tournamentAuthorizationHelper = tournamentAuthorizationHelper;
        this.tournamentHelper = tournamentHelper;
    }


    public List<AdminGetResponse> getTournamentAdmins(String id) {
        Tournament tournament = tournamentHelper.findOrThrow(id);

        List<AdminGetResponse> response = new ArrayList<>();

        for (String adminId : tournament.getAdminsById()) {
            response.add(new AdminGetResponse(adminId));
        }

        return response;
    }

    public List<AdminGetResponse> addTournamentAdmin(String id, AdminAddingRequest request) {
        Tournament tournament = tournamentHelper.findOrThrow(id);
        tournamentAuthorizationHelper.checkTournamentAdmin(tournament);

        if (tournament.getAdminsById().contains(request.adminId())) {
            throw new UserAlreadyAdminException();
        }

        tournament.getAdminsById().add(request.adminId());

        tournamentHelper.saveTournament(tournament);

        return getTournamentAdmins(id);

    }

    public void removeAdminFromTournament(String id, String adminId) {
        Tournament tournament = tournamentHelper.findOrThrow(id);

        tournamentAuthorizationHelper.checkTournamentAdmin(tournament);

        if (tournament.getCreatedByUserId().equals(adminId)) {
            throw new CantRemoveOwnerException();
        }

        if (!tournament.getAdminsById().contains(adminId)) {
            throw new NotTournamentAdminException_BAD_REQUEST();
        }

        tournament.getAdminsById().remove(adminId);

        tournamentHelper.saveTournament(tournament);


    }


}
