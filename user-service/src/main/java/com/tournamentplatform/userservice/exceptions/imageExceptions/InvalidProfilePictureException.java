package com.tournamentplatform.userservice.exceptions.imageExceptions;

import com.tournamentplatform.userservice.exceptions.ApplicationException;


import static com.tournamentplatform.userservice.exceptions.UserErrorCode.USER_INVALID_PIC;

public class InvalidProfilePictureException extends ApplicationException {
    public InvalidProfilePictureException() {
        super(USER_INVALID_PIC);
    }
}
