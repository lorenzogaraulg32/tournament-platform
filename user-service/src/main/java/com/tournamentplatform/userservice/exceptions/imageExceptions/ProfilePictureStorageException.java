package com.tournamentplatform.userservice.exceptions.imageExceptions;

import com.tournamentplatform.userservice.exceptions.ApplicationException;

import static com.tournamentplatform.userservice.exceptions.UserErrorCode.USER_PIC_IO_ERROR;

public class ProfilePictureStorageException extends ApplicationException {
    public ProfilePictureStorageException() {
        super(USER_PIC_IO_ERROR);
    }
}
