package com.tournamentplatform.userservice.entity.utils;

import lombok.Getter;

@Getter
public enum SportRole {

    GOALKEEPER(Sport.FOOTBALL),
    DEFENDER(Sport.FOOTBALL),
    MIDFIELDER(Sport.FOOTBALL),
    FORWARD(Sport.FOOTBALL),
    FILL_FB(Sport.FOOTBALL),

    BLOCKER(Sport.BEACH_VOLLEY),
    BEACH_DEFENDER(Sport.BEACH_VOLLEY),
    FILL_BV(Sport.BEACH_VOLLEY),

    POINT_GUARD(Sport.BASKETBALL),
    SHOOTING_GUARD(Sport.BASKETBALL),
    SMALL_FORWARD(Sport.BASKETBALL),
    POWER_FORWARD(Sport.BASKETBALL),
    CENTER(Sport.BASKETBALL),
    FILL_BK(Sport.BASKETBALL);


    private final Sport sport;

    SportRole(Sport sport) {
        this.sport = sport;
    }

}