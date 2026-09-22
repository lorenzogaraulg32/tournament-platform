package com.tournamentplatform.userservice.exceptions.teamServiceException;


import com.tournamentplatform.userservice.exceptions.ApplicationException;

import static com.tournamentplatform.userservice.exceptions.UserErrorCode.OWNER_REMOVAL;

public class OwnerRemovalException extends ApplicationException {
    public OwnerRemovalException() {
        super(OWNER_REMOVAL);
    }
}
