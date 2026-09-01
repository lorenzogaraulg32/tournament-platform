package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.NotTournamentAdminException_FORBIDDEN;
import com.tournamentplatform.tournament.errorHandling.tournamentExceptions.NotTournamentOwnerException;
import com.tournamentplatform.tournament.security.CurrentUserProvider;
import org.springframework.stereotype.Component;

@Component
public class TournamentAuthorizationHelper {


    private final CurrentUserProvider currentUserProvider;

    public TournamentAuthorizationHelper(CurrentUserProvider currentUserProvider) {
        this.currentUserProvider = currentUserProvider;
    }

    public void checkTournamentAdmin(Tournament tournament) {
        String currentUserId = currentUserProvider.getCurrentUserId();
        if (!tournament.getAdminsById().contains(currentUserId)) {
            throw new NotTournamentAdminException_FORBIDDEN();
        }
    }

    public void checkTournamentCreator(Tournament tournament) {
        String currentUserId = currentUserProvider.getCurrentUserId();
        if (!tournament.getCreatedByUserId().equals(currentUserId)) {
            throw new NotTournamentOwnerException();
        }
    }

    public String getCurrentUserId() {
        return currentUserProvider.getCurrentUserId();
    }

}
