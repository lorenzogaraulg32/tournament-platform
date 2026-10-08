package com.tournamentplatform.activityservice.mapper;

import com.tournamentplatform.activityservice.dto.request.*;
import com.tournamentplatform.activityservice.dto.response.*;
import com.tournamentplatform.activityservice.entity.team_authority.TeamAuthorityActivity;
import com.tournamentplatform.activityservice.entity.team_membership.TeamMembershipActivity;
import com.tournamentplatform.activityservice.entity.team_mod.TeamModActivity;
import com.tournamentplatform.activityservice.entity.tournament_authorities.TournamentAuthorityActivity;
import com.tournamentplatform.activityservice.entity.tournament_mod.TournamentModActivity;
import com.tournamentplatform.activityservice.entity.tournament_placements.TournamentPlacementActivity;
import org.springframework.stereotype.Component;

@Component
public final class ActivityMapper {

    private ActivityMapper() {
    }


    // =========================================================
    // TEAM MEMBERSHIP
    // =========================================================

    public static TeamMembershipActivity toEntity(
            TeamMembershipActivityRequest request
    ) {
        return new TeamMembershipActivity(
                request.userId(),
                request.teamId(),
                request.type(),
                request.sportRole(),
                request.eventId()
        );
    }


    public static TeamMembershipActivityResponse toResponse(
            TeamMembershipActivity activity
    ) {
        return new TeamMembershipActivityResponse(
                activity.getId(),
                activity.getEventId(),
                activity.getUserId(),
                activity.getTeamId(),
                activity.getType(),
                activity.getSportRole(),
                activity.getOccurredAt()
        );
    }


    // =========================================================
    // TEAM AUTHORITY
    // =========================================================

    public static TeamAuthorityActivity toEntity(
            TeamAuthorityActivityRequest request
    ) {
        return new TeamAuthorityActivity(
                request.userId(),
                request.teamId(),
                request.type(),
                request.eventId()
        );
    }


    public static TeamAuthorityActivityResponse toResponse(
            TeamAuthorityActivity activity
    ) {
        return new TeamAuthorityActivityResponse(
                activity.getId(),
                activity.getEventId(),
                activity.getUserId(),
                activity.getTeamId(),

                // Entity: "tipo"
                // DTO:    "type"
                activity.getTipo(),

                activity.getOccurredAt()
        );
    }


    // =========================================================
    // TOURNAMENT AUTHORITY
    // =========================================================

    public static TournamentAuthorityActivity toEntity(
            TournamentAuthorityActivityRequest request
    ) {
        return new TournamentAuthorityActivity(
                request.userId(),
                request.tournamentId(),
                request.type(),
                request.eventId()
        );
    }


    public static TournamentAuthorityActivityResponse toResponse(
            TournamentAuthorityActivity activity
    ) {
        return new TournamentAuthorityActivityResponse(
                activity.getId(),
                activity.getEventId(),
                activity.getUserId(),
                activity.getTournamentId(),

                // Entity: "tipo"
                // DTO:    "type"
                activity.getTipo(),

                activity.getOccurredAt()
        );
    }


    // =========================================================
    // TOURNAMENT PLACEMENT
    // =========================================================

    public static TournamentPlacementActivity toEntity(
            TournamentPlacementActivityRequest request
    ) {
        return new TournamentPlacementActivity(
                request.teamId(),
                request.tournamentId(),
                request.eventId()
        );
    }


    public static TournamentPlacementActivityResponse toResponse(
            TournamentPlacementActivity activity
    ) {
        return new TournamentPlacementActivityResponse(
                activity.getId(),
                activity.getEventId(),
                activity.getTeamId(),
                activity.getTournamentId(),
                activity.getOccurredAt()
        );
    }


    // =========================================================
// TEAM MOD
// =========================================================

    public static TeamModActivity toEntity(
            TeamModActivityRequest request
    ) {
        return new TeamModActivity(
                request.userId(),
                request.teamId(),
                request.eventId()
        );
    }

    public static TeamModActivityResponse toResponse(
            TeamModActivity activity
    ) {
        return new TeamModActivityResponse(
                activity.getUserId(),
                activity.getTeamId(),
                activity.getOccurredAt()

        );
    }

    // =========================================================
// Tournament MOD
// =========================================================

    public static TournamentModActivity toEntity(
            TournamentModActivityRequest request
    ) {
        return new TournamentModActivity(
                request.userId(),
                request.tournamentId(),
                request.eventId()
        );
    }

    public static TournamentModActivityResponse toResponse(
            TournamentModActivity activity
    ) {
        return new TournamentModActivityResponse(
                activity.getUserId(),
                activity.getTournamentId(),
                activity.getOccurredAt()

        );
    }
}