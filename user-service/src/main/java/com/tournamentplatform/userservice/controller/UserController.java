package com.tournamentplatform.userservice.controller;

import com.tournamentplatform.userservice.dto.CreateUserRequest;
import com.tournamentplatform.userservice.dto.PatchUserRequest;
import com.tournamentplatform.userservice.dto.UserResponse;
import com.tournamentplatform.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @PostMapping("/me")
    public ResponseEntity<UserResponse> createUser(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateUserRequest request
    ) {

        String userId = jwt.getSubject();

        UserResponse response =
                userService.createUser(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable String userId
    ) {

        UserResponse response =
                userService.getUser(userId);

        return ResponseEntity.ok(response);
    }


    @PatchMapping("/me")
    public ResponseEntity<UserResponse> patchUser(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody PatchUserRequest request
    ) {

        String userId = jwt.getSubject();

        UserResponse response =
                userService.patchUser(userId, request);

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser(
            @AuthenticationPrincipal Jwt jwt
    ) {

        String userId = jwt.getSubject();

        userService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }
}