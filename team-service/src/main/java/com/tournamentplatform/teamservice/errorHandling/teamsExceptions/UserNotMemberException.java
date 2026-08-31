package com.tournamentplatform.teamservice.errorHandling.teamsExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.USER_IS_NOT_MEMBER_OF_TEAM;

public class UserNotMemberException extends ApplicationException {
    public UserNotMemberException() {
        super(USER_IS_NOT_MEMBER_OF_TEAM);
    }
}
