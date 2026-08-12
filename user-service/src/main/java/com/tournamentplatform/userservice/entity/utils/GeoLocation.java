package com.tournamentplatform.userservice.entity.utils;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class GeoLocation {

    private String label;

    private Double latitude;

    private Double longitude;


}