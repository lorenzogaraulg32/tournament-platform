package com.tournamentplatform.teamservice.service;


import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.security.CurrentUserProvider;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Component
public class TeamAuthorizationHelper {


    private final CurrentUserProvider currentUserProvider;

    public TeamAuthorizationHelper(CurrentUserProvider currentUserProvider) {
        this.currentUserProvider = currentUserProvider;
    }

    public void checkTeamAdmin(Team tournament) {
        String currentUserId = currentUserProvider.getCurrentUserId();
        if (!tournament.getAdminIds().contains(currentUserId)) {
            throw new AccessDeniedException("Non sei autorizzato per questa modifica");
        }
    }

    public void checkTeamCreator(Team tournament) {
        String currentUserId = currentUserProvider.getCurrentUserId();
        if (!tournament.getCreatorId().equals(currentUserId)) {
            throw new AccessDeniedException("Non sei autorizzato per questa modifica");
        }
    }

    public String getCurrentUserId(){
        return currentUserProvider.getCurrentUserId();
    }

}
