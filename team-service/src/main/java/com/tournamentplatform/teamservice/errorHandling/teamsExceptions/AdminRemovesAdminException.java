package com.tournamentplatform.teamservice.errorHandling.teamsExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.OWNER_REMOVAL;

public class AdminRemovesAdminException extends ApplicationException {
    public AdminRemovesAdminException() {
        super(OWNER_REMOVAL);
    }
}
