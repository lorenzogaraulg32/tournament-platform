package com.tournamentplatform.activityservice.entity.team_authority;

import com.tournamentplatform.activityservice.entity.Activity;
import com.tournamentplatform.activityservice.entity.AuthorityActivities;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "team_authority_activities")
public class TeamAuthorityActivity extends Activity {


    private long userId;
    private long teamId;

    @Enumerated(EnumType.STRING)
    private AuthorityActivities tipo;

    public TeamAuthorityActivity(
            long userId,
            long teamId,
            AuthorityActivities tipo,
            UUID eventId
    ) {

        super(eventId);
        this.userId = userId;
        this.teamId = teamId;
        this.tipo = tipo;

    }

}
