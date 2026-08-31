package com.tournamentplatform.teamservice.errorHandling.teamsExceptions;

import com.tournamentplatform.teamservice.errorHandling.ApplicationException;

import static com.tournamentplatform.teamservice.errorHandling.TeamErrorCode.OWNER_REMOVAL;

public class OwnerRemovalExcpetion extends ApplicationException {
    public OwnerRemovalExcpetion() {
        super(OWNER_REMOVAL);
    }
}
