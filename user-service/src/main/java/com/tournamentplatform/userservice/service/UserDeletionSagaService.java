package com.tournamentplatform.userservice.service;

import com.tournamentplatform.userservice.client.authService.AuthServiceClient;
import com.tournamentplatform.userservice.client.teamService.TeamServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDeletionSagaService {

    private final AuthServiceClient authServiceClient;
    private final UserDeletionService userDeletionService;
    private final ProfilePictureStorageService profilePictureStorageService;
    private final TeamServiceClient teamServiceClient;

    public void completeDeletion(String userId) {

        authServiceClient.revokeSubject(userId);

        teamServiceClient.removeUserFromTeams(userId);

        authServiceClient.deleteUser(userId);

        profilePictureStorageService.deleteProfilePicture(userId);

        userDeletionService.deletePermanently(userId);
    }

    public void cancelDeletion(String userId) {

        userDeletionService.restoreActive(userId);

        try {
            authServiceClient.restoreSubject(userId);

        } catch (Exception exception) {

            // Il subject è ancora revocato.
            // Riportiamo l'utente in DELETING così lo scheduler
            // continuerà a occuparsi della compensazione.
            userDeletionService.markAsDeleting(userId);

            throw exception;
        }
    }

}