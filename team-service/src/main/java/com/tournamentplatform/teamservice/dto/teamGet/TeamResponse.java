package com.tournamentplatform.teamservice.dto.teamGet;

import com.tournamentplatform.teamservice.dto.formation.FormationResponse;
import com.tournamentplatform.teamservice.dto.position.GeoLocationResponse;
import com.tournamentplatform.teamservice.entity.utils.RecruitmentStatus;
import com.tournamentplatform.teamservice.entity.utils.Sport;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {

    private Long id;

    private String name;

    private String description;

    private RecruitmentStatus status;

    GeoLocationResponse location;

    private String imageUrl;

    private String creatorId;

    private Set<String> playerIds = new HashSet<>();

    //L'id dell'admin è anche nei players
    private Set<String> adminIds = new HashSet<>();

    private String invitationCode;

    private Sport sport;

    private FormationResponse formation;

}
