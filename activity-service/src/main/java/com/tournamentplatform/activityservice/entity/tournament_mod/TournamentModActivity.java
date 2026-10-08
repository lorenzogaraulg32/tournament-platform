package com.tournamentplatform.activityservice.entity.tournament_mod;

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
@Table(name = "tournament_mod_activities")
public class TournamentModActivity extends Activity {


    private long userId;
    private long tournamentId;

    public TournamentModActivity(
            long userId,
            long tournamentId,
            UUID eventId
    ) {
        super(eventId);
        this.userId = userId;
        this.tournamentId = tournamentId;
    }

}
