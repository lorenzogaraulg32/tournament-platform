package com.tournamentplatform.teamservice.dto.teamModify;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.tournamentplatform.teamservice.dto.position.GeoLocationRequest;
import com.tournamentplatform.teamservice.entity.utils.RecruitmentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class TeamUpdateRequest {

    @Setter
    @Size(
            min = 5,
            max = 20,
            message = "Il nome deve avere tra 5 e 20 caratteri"
    )
    @Pattern(
            regexp = "(?s).*\\S.*",
            message = "Il nome non può contenere solo spazi"
    )
    private String name;

    @Setter
    @Size(
            max = 160,
            message = "La descrizione non può superare i 160 caratteri"
    )
    private String description;

    @Setter
    private RecruitmentStatus status;

    @Valid
    private GeoLocationRequest location;

    @Setter
    @Pattern(
            regexp = "^REMOVE$",
            message = "Operazione sul logo non valida"
    )
    private String newImageUrl;

    @JsonIgnore
    private boolean locationProvided;

    @JsonSetter("location")
    public void setLocation(GeoLocationRequest location) {
        this.location = location;
        this.locationProvided = true;
    }
}