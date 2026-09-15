package com.tournamentplatform.teamservice.service;


import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.UserNotAdminException;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.UserNotMemberException;
import com.tournamentplatform.teamservice.errorHandling.teamsExceptions.UserNotOwnerException;
import com.tournamentplatform.teamservice.security.CurrentUserProvider;
import org.springframework.stereotype.Component;

@Component
public class TeamAuthorizationHelper {


    private final CurrentUserProvider currentUserProvider;

    public TeamAuthorizationHelper(CurrentUserProvider currentUserProvider) {
        this.currentUserProvider = currentUserProvider;
    }

    public void checkTeamAdmin(Team team) {
        String currentUserId = currentUserProvider.getCurrentUserId();
        if (!team.getAdminIds().contains(currentUserId)) {
            throw new UserNotAdminException();
        }
    }

    public boolean checkTeamAdmin(Team team, String id) {
        return team.getAdminIds().contains(id);
    }

    public void checkTeamPlayer(Team team) {
        String currentUserId = currentUserProvider.getCurrentUserId();
        if (!team.getPlayerIds().contains(currentUserId)) {
            throw new UserNotMemberException();
        }
    }

    public boolean checkTeamCreator(Team team) {
        String currentUserId = currentUserProvider.getCurrentUserId();
        if (!team.getCreatorId().equals(currentUserId)) {
            throw new UserNotOwnerException();
        }
        return true;
    }

    public String getCurrentUserId() {
        return currentUserProvider.getCurrentUserId();
    }

}
