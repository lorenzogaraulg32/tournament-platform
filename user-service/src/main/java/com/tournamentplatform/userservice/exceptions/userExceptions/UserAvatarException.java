package com.tournamentplatform.userservice.exceptions.userExceptions;


import com.tournamentplatform.userservice.exceptions.ApplicationException;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static com.tournamentplatform.userservice.exceptions.UserErrorCode.USER_AVATAR_ERROR;

@Getter
public class UserAvatarException extends ApplicationException {

    private final HttpStatus status;

    public UserAvatarException(HttpStatus status) {
        super(USER_AVATAR_ERROR);
        this.status = status;
    }

}