package com.tournamentplatform.userservice.service;

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProfilePictureStorageService profilePictureStorageService;
    private final UserDeletionService userDeletionService;
    private final UserDeletionSagaService userDeletionSagaService;


    //Username deve essere richiesto alla fine
    @Transactional
    public UserResponse createUser(
            String userId,
            CreateUserRequest request
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

        return UserMapper.toResponse(savedUser);
    }


    @Transactional(readOnly = true)
    public UserResponse getUser(String userId) {

        User user = getUserEntity(userId);

        return UserMapper.toResponse(user);
    }

    @Transactional
    public UserResponse patchUser(
            String userId,
            PatchUserRequest request,
            MultipartFile logo
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

        if (logo != null && !logo.isEmpty()) {
            String profilePicUrl =
                    profilePictureStorageService.storeProfilePicture(
                            userId,
                            logo
                    );

            user.setProfilePicUrl(profilePicUrl);
        } else if ("REMOVE".equals(request.newPicUrl())) {
            profilePictureStorageService.deleteProfilePicture(userId);
            user.setProfilePicUrl(null);
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

    @Transactional
    public void uploadProfilePicture(String userId, MultipartFile file) {
        User user = getUserEntity(userId);

        String profilePicUrl =
                profilePictureStorageService
                        .storeProfilePicture(userId, file);

        user.setProfilePicUrl(profilePicUrl);

        userRepository.save(user);
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

    public Resource getProfilePictureByFilename(String filename) {
        return profilePictureStorageService
                .loadProfilePicture(filename);
    }


}
