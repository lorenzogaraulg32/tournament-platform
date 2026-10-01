package com.tournamentplatform.mediaservice.exceptions;

public class InvalidMediaFileException extends RuntimeException{

    public InvalidMediaFileException(String message){
        super(message);
    }

    public InvalidMediaFileException(
            String message,
            Throwable cause
    ) {
        super(message, cause);
    }


}
