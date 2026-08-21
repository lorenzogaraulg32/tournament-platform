package com.tournamentplatform.teamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TeamGetDetailsResponse {

    private Long id;

    private String name;

    private String description;

    private String locationLabel;

    private String logoUrl;

    private String creatorId;

    private Set<String> playerIds = new HashSet<>();

    //L'id dell'admin è anche nei players
    private Set<String> adminIds = new HashSet<>();

    private String invitationCode;

}
