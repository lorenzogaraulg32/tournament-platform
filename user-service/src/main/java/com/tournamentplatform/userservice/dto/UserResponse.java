package com.tournamentplatform.userservice.dto;

import com.tournamentplatform.userservice.dto.position.GeoLocationResponse;
import com.tournamentplatform.userservice.dto.sport_roles.UserSportRoleResponse;
import com.tournamentplatform.userservice.entity.utils.Gender;
import com.tournamentplatform.userservice.entity.utils.Sport;

import java.time.LocalDate;
import java.util.Set;

public record UserResponse(

        String firstName,

        String lastName,

        String username,

        LocalDate birthDate,

        Gender gender,

        Set<Sport> sports,

        Set<UserSportRoleResponse> roles,

        GeoLocationResponse location,

        String profilePicUrl

) {
}