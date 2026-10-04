package com.tournamentplatform.mediaservice.exceptions;

public class MediaNotFoundException extends RuntimeException {

    public MediaNotFoundException(String message){
        super(message);
    }

    public MediaNotFoundException(
            String message,
            Throwable cause
    ) {
        super(message, cause);
    }


}
