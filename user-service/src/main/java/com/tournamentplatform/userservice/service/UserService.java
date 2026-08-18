package com.tournamentplatform.userservice.service;

import com.tournamentplatform.userservice.dto.CreateUserRequest;
import com.tournamentplatform.userservice.dto.PatchUserRequest;
import com.tournamentplatform.userservice.dto.UserResponse;
import com.tournamentplatform.userservice.entity.User;
import com.tournamentplatform.userservice.entity.utils.UserSportRole;
import com.tournamentplatform.userservice.mapper.UserMapper;
import com.tournamentplatform.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ProfilePictureStorageService profilePictureStorageService;

    //Username deve essere richiesto alla fine
    public UserResponse createUser(
            String userId,
            CreateUserRequest request
    ) {

        if (userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User profile already exists"
            );
        }

        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username già registrato");
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


    public UserResponse patchUser(
            String userId,
            PatchUserRequest request
    ) {

        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username già registrato");
        }

        User user = getUserEntity(userId);

        UserMapper.updateEntity(user, request);

        validateSportConfiguration(user);

        User updatedUser = userRepository.save(user);

        return UserMapper.toResponse(updatedUser);
    }


    public void deleteUser(String userId) {

        User user = getUserEntity(userId);

        userRepository.delete(user);
    }


    private User getUserEntity(String userId) {

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );
    }

    private void validateSportConfiguration(User user) {

        for (UserSportRole role : user.getRoles()) {

            if (!user.getSports().contains(role.getSport())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Role sport must be included in user's sports"
                );
            }

            if (role.getRole().getSport() != role.getSport()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Role does not belong to the selected sport"
                );
            }
        }
    }

    public void uploadProfilePicture(String userId, MultipartFile file) {
        User user = getUserEntity(userId);

        String profilePicUrl =
                profilePictureStorageService
                        .storeProfilePicture(userId, file);

        user.setProfilePicUrl(profilePicUrl);

        userRepository.save(user);
    }


    public Resource getProfilePictureByFilename(String filename) {
        return profilePictureStorageService
                .loadProfilePicture(filename);
    }
}
