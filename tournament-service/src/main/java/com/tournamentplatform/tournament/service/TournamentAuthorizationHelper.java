package com.tournamentplatform.tournament.service;

import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.security.CurrentUserProvider;
import org.springframework.security.access.AccessDeniedException;
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
            throw new AccessDeniedException("Non sei autorizzato per questa modifica");
        }
    }

    public void checkTournamentCreator(Tournament tournament) {
        String currentUserId = currentUserProvider.getCurrentUserId();
        if (!tournament.getCreatedByUserId().equals(currentUserId)) {
            throw new AccessDeniedException("Non sei autorizzato per questa modifica");
        }
    }

    public String getCurrentUserId(){
        return currentUserProvider.getCurrentUserId();
    }

}
