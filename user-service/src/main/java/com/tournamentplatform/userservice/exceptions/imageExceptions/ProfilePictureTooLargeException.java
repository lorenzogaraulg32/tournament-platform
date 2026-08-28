package com.tournamentplatform.userservice.exceptions.imageExceptions;

import com.tournamentplatform.userservice.exceptions.ApplicationException;

import static com.tournamentplatform.userservice.exceptions.UserErrorCode.USER_INVALID_PIC;
import static com.tournamentplatform.userservice.exceptions.UserErrorCode.USER_TOO_LARGE_PIC;

public class ProfilePictureTooLargeException extends ApplicationException {
    public ProfilePictureTooLargeException() {
        super(USER_TOO_LARGE_PIC);
    }
}
