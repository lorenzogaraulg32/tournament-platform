package com.tournamentplatform.authservice.excpetion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
@Setter
public class LoginException extends RuntimeException {
    HttpStatus code;
    String msg;

}
