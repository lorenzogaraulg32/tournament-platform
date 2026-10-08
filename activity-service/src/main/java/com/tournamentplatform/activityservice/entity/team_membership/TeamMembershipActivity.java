package com.tournamentplatform.activityservice.entity.team_membership;

import com.tournamentplatform.activityservice.entity.Activity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "team_membership_activities")
@NoArgsConstructor
public class TeamMembershipActivity extends Activity {

    private long userId;

    private long teamId;

    @Enumerated(EnumType.STRING)
    private TeamMembershipActivities type;

    @Enumerated(EnumType.STRING)
    private SportRole sportRole;


    public TeamMembershipActivity(
            long userId,
            long teamId,
            TeamMembershipActivities type,
            SportRole sportRole,
            UUID eventId
    ) {
        super(eventId);
        this.userId = userId;
        this.teamId = teamId;
        this.type = type;
        this.sportRole = sportRole;
    }

}
