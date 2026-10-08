package com.tournamentplatform.activityservice.entity.team_mod;

import com.tournamentplatform.activityservice.entity.Activity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "team_mod_activities")
public class TeamModActivity extends Activity {


    private long userId;
    private long teamId;

    public TeamModActivity(
            long userId,
            long teamId,
            UUID eventId
    ) {

        super(eventId);
        this.teamId = teamId;
        this.userId = userId;
    }

}
