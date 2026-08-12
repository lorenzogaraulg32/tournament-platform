package com.tournamentplatform.userservice.dto;

import com.tournamentplatform.userservice.entity.utils.Gender;
import com.tournamentplatform.userservice.entity.utils.Sport;

import java.time.LocalDate;
import java.util.Set;

public record UserResponse(

        String id,

        String firstName,

        String lastName,

        LocalDate birthDate,

        Gender gender,

        Set<Sport> sports,

        Set<UserSportRoleResponse> roles,

        GeoLocationResponse location,

        String logoUrl

) {
}