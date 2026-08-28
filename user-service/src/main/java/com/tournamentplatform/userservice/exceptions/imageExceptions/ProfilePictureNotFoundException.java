package com.tournamentplatform.userservice.exceptions.imageExceptions;

import com.tournamentplatform.userservice.exceptions.ApplicationException;

import static com.tournamentplatform.userservice.exceptions.UserErrorCode.USER_PIC_NOT_FOUND;
import static com.tournamentplatform.userservice.exceptions.UserErrorCode.USER_TOO_LARGE_PIC;

public class ProfilePictureNotFoundException extends ApplicationException {
    public ProfilePictureNotFoundException() {
        super(USER_PIC_NOT_FOUND);
    }
}
