package com.tournamentplatform.userservice.service;

import com.tournamentplatform.userservice.client.mediaService.MediaServiceClient;
import com.tournamentplatform.userservice.dto.CreateUserRequest;
import com.tournamentplatform.userservice.dto.PatchUserRequest;
import com.tournamentplatform.userservice.dto.UserResponse;
import com.tournamentplatform.userservice.entity.User;
import com.tournamentplatform.userservice.entity.utils.UserSportRole;
import com.tournamentplatform.userservice.exceptions.teamServiceException.OwnerRemovalException;
import com.tournamentplatform.userservice.exceptions.userExceptions.InvalidSportRoleConfigurationException;
import com.tournamentplatform.userservice.exceptions.userExceptions.UserAlreadyExistException;
import com.tournamentplatform.userservice.exceptions.userExceptions.UserNotFoundException;
import com.tournamentplatform.userservice.exceptions.userExceptions.UsernameAlreadyRegisteredException;
import com.tournamentplatform.userservice.mapper.UserMapper;
import com.tournamentplatform.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MediaServiceClient mediaServiceClient;
    private final UserDeletionService userDeletionService;
    private final UserDeletionSagaService userDeletionSagaService;


    //Username deve essere richiesto alla fine
    @Transactional
    public UserResponse createUser(
            String userId,
            CreateUserRequest request,
            MultipartFile avatar
    ) {

        if (userRepository.existsById(userId)) {
            throw new UserAlreadyExistException();
        }

        if (userRepository.existsByUsername(request.username())) {
            throw new UsernameAlreadyRegisteredException();
        }

        User user = UserMapper.toEntity(userId, request);

        validateSportConfiguration(user);

        User savedUser = userRepository.save(user);

        if(avatar != null && !avatar.isEmpty()) {
            mediaServiceClient.putUserAvatar(userId,avatar);
        }

        return UserMapper.toResponse(savedUser);
    }


    @Transactional(readOnly = true)
    public UserResponse getUser(String userId) {

        User user = getUserEntity(userId);

        return UserMapper.toResponse(user);
    }

    public ResponseEntity<Resource> getUserAvatar(String userId) {

        getUserEntity(userId);

        Optional<MediaServiceClient.MediaResource> media =
                mediaServiceClient.getUserAvatar  (userId);

        return media.map(file -> ResponseEntity
                .ok()
                .contentType(file.contentType())
                .body(file.resource())
        ).orElse(
                ResponseEntity.noContent().build()
        );
    }

    @Transactional
    public UserResponse patchUser(
            String userId,
            PatchUserRequest request,
            MultipartFile avatar
    ) {
        User user = getUserEntity(userId);


        if (
                request.username() != null
                        && !request.username().equals(user.getUsername())
                        && userRepository.existsByUsername(request.username())
        ) {
            throw new UsernameAlreadyRegisteredException();
        }

        UserMapper.updateEntity(user, request);


        System.out.println("Sport ricevuti: " + request.sports());
        System.out.println("Ruoli ricevuti: " + request.roles());

        System.out.println("Sport dopo mapping: " + user.getSports());

        user.getRoles().forEach(role ->
                System.out.println(
                        "Ruolo dopo mapping: sport=" + role.getSport()
                                + ", ruolo=" + role.getRole()
                                + ", sport associato al ruolo=" + role.getRole().getSport()
                )
        );

        validateSportConfiguration(user);

        if (avatar != null && !avatar.isEmpty()) {
            mediaServiceClient.putUserAvatar(userId, avatar);
        } else if (request.removeAvatar()) {
            mediaServiceClient.deleteUserAvatar(userId);
        }

        User updatedUser = userRepository.save(user);

        return UserMapper.toResponse(updatedUser);
    }

    public void deleteUser(String userId) {

        userDeletionService.markAsDeleting(userId);

        try {

            userDeletionSagaService.completeDeletion(userId);

        } catch (OwnerRemovalException exception) {

            userDeletionSagaService.cancelDeletion(userId);

            throw exception;

        } catch (Exception exception) {

            System.out.println(
                    "Deletion saga incomplete for user "
                            + userId
                            + ". Recovery scheduler will retry"
            );
        }
    }


    private User getUserEntity(String userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }

    private void validateSportConfiguration(User user) {
        if (
                user.getSports() == null || user.getSports().isEmpty()
                        || user.getRoles() == null || user.getRoles().isEmpty()
        ) {
            throw new InvalidSportRoleConfigurationException();
        }

        for (UserSportRole role : user.getRoles()) {
            if (!user.getSports().contains(role.getSport())) {
                throw new InvalidSportRoleConfigurationException();
            }

            if (role.getRole().getSport() != role.getSport()) {
                throw new InvalidSportRoleConfigurationException();
            }
        }

        boolean everySportHasARole = user.getSports().stream()
                .allMatch(sport -> user.getRoles().stream()
                        .anyMatch(role -> role.getSport() == sport));

        if (!everySportHasARole) {
            throw new InvalidSportRoleConfigurationException();
        }
    }



}
