package com.tournamentplatform.userservice.mapper;

import com.tournamentplatform.userservice.dto.*;
import com.tournamentplatform.userservice.entity.User;
import com.tournamentplatform.userservice.entity.utils.GeoLocation;
import com.tournamentplatform.userservice.entity.utils.UserSportRole;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {
    }

    public static User toEntity(
            String userId,
            CreateUserRequest request
    ) {

        User user = new User();

        user.setId(userId);
        user.setUsername(request.username());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setBirthDate(request.birthDate());
        user.setGender(request.gender());
        user.setSports(
                new HashSet<>(request.sports())
        );

        user.setLocation(
                toGeoLocation(request.location())
        );

        Set<UserSportRole> roles = request.roles()
                .stream()
                .map(roleRequest -> toUserSportRole(roleRequest, user))
                .collect(Collectors.toSet());

        user.setRoles(roles);

        return user;
    }

    public static UserResponse toResponse(User user) {

        Set<UserSportRoleResponse> roles = user.getRoles()
                .stream()
                .map(UserMapper::toUserSportRoleResponse)
                .collect(Collectors.toSet());

        return new UserResponse(
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getBirthDate(),
                user.getGender(),
                user.getSports(),
                roles,
                toGeoLocationResponse(user.getLocation()),
                user.getProfilePicUrl()
        );
    }

    private static GeoLocation toGeoLocation(
            GeoLocationRequest request
    ) {

        if (request == null) {
            return null;
        }

        GeoLocation location = new GeoLocation();

        location.setLabel(request.label());
        location.setLatitude(request.latitude());
        location.setLongitude(request.longitude());

        return location;
    }

    private static UserSportRole toUserSportRole(
            UserSportRoleRequest request,
            User user
    ) {

        UserSportRole userSportRole = new UserSportRole();

        userSportRole.setUser(user);
        userSportRole.setSport(request.sport());
        userSportRole.setRole(request.role());

        return userSportRole;
    }

    private static GeoLocationResponse toGeoLocationResponse(
            GeoLocation location
    ) {

        if (location == null) {
            return null;
        }

        return new GeoLocationResponse(
                location.getLabel(),
                location.getLatitude(),
                location.getLongitude()
        );
    }

    private static UserSportRoleResponse toUserSportRoleResponse(
            UserSportRole userSportRole
    ) {

        return new UserSportRoleResponse(
                userSportRole.getSport(),
                userSportRole.getRole()
        );
    }

    public static void updateEntity(
            User user,
            PatchUserRequest request
    ) {

        if (request.username() != null) {
            user.setUsername(request.username());
        }

        if (request.firstName() != null) {
            user.setFirstName(request.firstName());
        }

        if (request.lastName() != null) {
            user.setLastName(request.lastName());
        }

        if (request.birthDate() != null) {
            user.setBirthDate(request.birthDate());
        }

        if (request.gender() != null) {
            user.setGender(request.gender());
        }

        if (request.sports() != null) {
            user.setSports(
                    new HashSet<>(request.sports())
            );
        }

        if (request.location() != null) {
            user.setLocation(
                    toGeoLocation(request.location())
            );
        }

        if (request.roles() != null) {

            user.getRoles().clear();

            request.roles().forEach(roleRequest -> {

                UserSportRole role =
                        toUserSportRole(roleRequest, user);

                user.getRoles().add(role);
            });
        }
    }


}