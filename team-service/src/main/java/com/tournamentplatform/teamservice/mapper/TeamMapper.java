package com.tournamentplatform.teamservice.mapper;

import com.tournamentplatform.teamservice.dto.formation.FormationRequest;
import com.tournamentplatform.teamservice.dto.formation.FormationResponse;
import com.tournamentplatform.teamservice.dto.position.GeoLocationRequest;
import com.tournamentplatform.teamservice.dto.position.GeoLocationResponse;
import com.tournamentplatform.teamservice.dto.teamGet.TeamResponse;
import com.tournamentplatform.teamservice.entity.Formation;
import com.tournamentplatform.teamservice.entity.Team;
import com.tournamentplatform.teamservice.entity.utils.GeoLocation;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class TeamMapper {

    public TeamResponse toTeamResponse(Team team) {
        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getDescription(),
                team.getStatus(),
                toGeoLocationResponse(team.getLocation()),
                buildPublicImageUrl(team),
                team.getCreatorId(),
                team.getPlayerIds(),
                team.getAdminIds(),
                team.getInvitationCode(),
                team.getSport(),
                toFormationResponse(team.getFormation())
        );
    }

    public GeoLocation toGeoLocation(
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

    public static GeoLocationResponse toGeoLocationResponse(
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


    private String buildPublicImageUrl(Team team) {
        if (
                team.getImageUrl() == null ||
                        team.getImageUrl().isBlank()
        ) {
            return null;
        }

        return "/teams/" + team.getId() + "/logo";
    }

    public Formation toFormation(FormationRequest request) {
        Formation formation = new Formation();
        formation.setName(request.name());
        formation.setSlotAssignment(request.slotAssignment());
        formation.setBenchOrder(request.benchOrder());

        return formation;
    }


    public FormationResponse toFormationResponse(Formation formation) {
        if (formation == null) {
            return new FormationResponse(null, Map.of(), List.of());
        }

        return new FormationResponse(
                formation.getName(),
                formation.getSlotAssignment() != null
                        ? formation.getSlotAssignment()
                        : Map.of(),
                formation.getBenchOrder() != null
                        ? formation.getBenchOrder()
                        : List.of()
        );
    }

}
