package com.tournamentplatform.authservice.controller;

import com.tournamentplatform.authservice.dto.*;
import com.tournamentplatform.authservice.service.AuthService;
import com.tournamentplatform.authservice.service.TokenRevocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TokenRevocationService tokenRevocationService;


    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUserInfo(Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName());
        UserResponse response = authService.getUserInfo(userId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserInfo(@PathVariable String userId) {
        UserResponse response = authService.getUserInfo(Long.valueOf(userId));
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


    @DeleteMapping("/internal/users/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable String userId
    ) {
        authService.deleteUser(userId);

        return ResponseEntity.noContent().build();
    }


    @PostMapping("/internal/revocations/{userId}")
    public ResponseEntity<Void> revokeUser(
            @PathVariable String userId
    ) {

        tokenRevocationService.revoke(userId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/internal/revocations/{userId}")
    public ResponseEntity<Void> restoreUser(
            @PathVariable String userId
    ) {

        tokenRevocationService.restore(userId);

        return ResponseEntity.noContent().build();
    }

}
