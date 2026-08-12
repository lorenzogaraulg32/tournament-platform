package com.tournamentplatform.userservice.dto;

import com.tournamentplatform.userservice.entity.utils.Gender;
import com.tournamentplatform.userservice.entity.utils.Sport;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.Set;

public record PatchUserRequest(

        @Size(max = 50)
        String firstName,

        @Size(max = 50)
        String lastName,

        @Past
        LocalDate birthDate,

        Gender gender,

        Set<Sport> sports,

        @Valid
        Set<UserSportRoleRequest> roles,

        @Valid
        GeoLocationRequest location

) {
}