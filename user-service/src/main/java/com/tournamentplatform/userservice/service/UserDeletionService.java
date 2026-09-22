package com.tournamentplatform.userservice.service;

import com.tournamentplatform.userservice.entity.utils.DeletingStatus;
import com.tournamentplatform.userservice.exceptions.userExceptions.UserNotFoundException;
import com.tournamentplatform.userservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class UserDeletionService {

    private final UserRepository userRepository;

    @Transactional
    public void markAsDeleting(String userId) {
        if ( userRepository.updateDeletingStatus(
                userId,
                DeletingStatus.DELETING
        ) == 0) {
            throw new UserNotFoundException();
        }
    }

    @Transactional
    public void restoreActive(String userId) {

        if ( userRepository.updateDeletingStatus(
                userId,
                DeletingStatus.ACTIVE
        ) == 0) {
            throw new UserNotFoundException();
        }
    }

    @Transactional
    public void deletePermanently(String userId) {
        userRepository.deleteById(userId);
    }


}
