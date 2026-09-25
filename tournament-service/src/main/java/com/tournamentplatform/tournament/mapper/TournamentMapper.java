package com.tournamentplatform.tournament.mapper;

import com.tournamentplatform.tournament.dto.position.GeoLocationRequest;
import com.tournamentplatform.tournament.dto.position.GeoLocationResponse;
import com.tournamentplatform.tournament.dto.tournaments.TournamentGetResponse;
import com.tournamentplatform.tournament.entity.Tournament;
import com.tournamentplatform.tournament.entity.misc.GeoLocation;
import org.springframework.stereotype.Component;

@Component
public class TournamentMapper {


    public TournamentGetResponse toTournamentGetResponse(Tournament tournament) {
        return new TournamentGetResponse(
                tournament.getId(),
                tournament.getName(),
                tournament.getDescription(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getCreatedAt(),
                tournament.getUpdatedAt(),
                tournament.getMinTeams(),
                tournament.getMaxTeams(),
                tournament.getFormat().name(),
                tournament.getStatus().name(),
                tournament.getRulesUrl(),
                tournament.getCreatedByUserId(),
                tournament.getAdminsById(),
                tournament.getRegisteredTeamIds(),
                tournament.getMatches(),
                tournament.getLogoUrl(),
                toGeoLocationResponse(tournament.getLocation()),
                tournament.getInvitationCode()
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


}
