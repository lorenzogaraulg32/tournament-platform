package com.tournamentplatform.userservice.scheduler;

import com.tournamentplatform.userservice.entity.utils.DeletingStatus;
import com.tournamentplatform.userservice.exceptions.teamServiceException.OwnerRemovalException;
import com.tournamentplatform.userservice.repository.UserRepository;
import com.tournamentplatform.userservice.service.UserDeletionSagaService;
import com.tournamentplatform.userservice.service.UserDeletionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserDeletionRecoveryScheduler {

    private final UserRepository userRepository;
    private final UserDeletionSagaService userDeletionSagaService;

    @Scheduled(
            fixedDelayString =
                    "${saga.user-deletion.recovery-delay-ms:60000}"
    )
    public void recoverDeletingUsers() {

        List<String> userIds =
                userRepository.findIdsByDeletingStatus(
                        DeletingStatus.DELETING
                );

        for (String userId : userIds) {

            try {
                userDeletionSagaService.completeDeletion(userId);

                log.info(
                        "User deletion recovered successfully: {}",
                        userId
                );

            } catch (OwnerRemovalException exception) {

                try {

                    userDeletionSagaService.cancelDeletion(userId);

                    log.warn(
                            "User deletion cancelled because user {} owns a team",
                            userId
                    );

                } catch (Exception restoreException) {

                    log.warn(
                            "Unable to restore user {} after deletion cancellation: {}",
                            userId,
                            restoreException.getMessage()
                    );
                }

            } catch (Exception exception) {

                log.warn(
                        "Unable to recover deletion for user {}: {}",
                        userId,
                        exception.getMessage()
                );
            }
        }
    }
}