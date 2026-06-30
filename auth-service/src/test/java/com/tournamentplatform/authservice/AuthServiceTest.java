package com.tournamentplatform.authservice;

import com.tournamentplatform.authservice.dto.*;
import com.tournamentplatform.authservice.excpetion.LoginException;
import com.tournamentplatform.authservice.service.AuthService;
import com.tournamentplatform.authservice.service.JwtService;
import com.tournamentplatform.authservice.user.User;
import com.tournamentplatform.authservice.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static com.tournamentplatform.authservice.user.GlobalRole.ROLE_USER;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;


    @Test
    public void loginTestSuccess() {

        LoginRequest loginRequest = new LoginRequest("prova@gmail.com", "Password123");

        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        when(userRepository.findByEmail("prova@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("Password123", "hashed-password"))
                .thenReturn(true);

        when(jwtService.generateJwtToken(user))
                .thenReturn("fake-jwt-token");

        when(jwtService.getExpiration())
                .thenReturn(3600000L);


        AuthResponse response = authService.login(loginRequest);

        assertEquals("fake-jwt-token", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(3600L, response.expiresIn());
    }

    @Test
    public void loginTestWrongPassword() {

        LoginRequest loginRequest = new LoginRequest("prova@gmail.com", "Password123");

        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        when(userRepository.findByEmail("prova@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("Password123", "hashed-password"))
                .thenReturn(false);

        assertThrows(LoginException.class, () -> authService.login(loginRequest));

        verify(jwtService, never()).generateJwtToken(any());

    }

    @Test
    public void loginTestWrongEmail() {

        LoginRequest loginRequest = new LoginRequest("prova@gmail.com", "Password123");

        when(userRepository.findByEmail("prova@gmail.com"))
                .thenReturn(Optional.empty());

        assertThrows(LoginException.class, () -> authService.login(loginRequest));

        verify(jwtService, never()).generateJwtToken(any());

    }


    @Test
    public void loginTestNotEnabledUser() {

        LoginRequest loginrequest = new LoginRequest("prova@gmail.com", "Password123");

        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                false,
                ROLE_USER
        );

        when(userRepository.findByEmail("prova@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("Password123", "hashed-password"))
                .thenReturn(true);

        assertThrows(LoginException.class, () -> authService.login(loginrequest));

    }


    @Test
    public void registerSuccess() {

        RegisterRequest registerRequest = new RegisterRequest("testuser", "prova@gmail.com", "Password123");

        when(userRepository.existsByEmail("prova@gmail.com"))
                .thenReturn(false);

        when(userRepository.existsByUsername("testuser"))
                .thenReturn(false);

        when(passwordEncoder.encode("Password123"))
                .thenReturn("hashed-password");

        RegisterResponse registerResponse = authService.register(registerRequest);

        verify(userRepository, times(1)).save(any(User.class));

        assertEquals("Utente registrato correttamente", registerResponse.message());
    }

    @Test
    public void registerUsernameAlreadyExist() {

        RegisterRequest registerRequest = new RegisterRequest("testuser", "prova@gmail.com", "Password123");

        when(userRepository.existsByEmail("prova@gmail.com"))
                .thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(registerRequest));

        verify(userRepository, times(0)).save(any(User.class));
    }


    @Test
    public void registerEmailAlreadyExist() {

        RegisterRequest registerRequest = new RegisterRequest("testuser", "prova@gmail.com", "Password123");

        when(userRepository.existsByEmail("prova@gmail.com"))
                .thenReturn(false);

        when(userRepository.existsByUsername("testuser"))
                .thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(registerRequest));

        verify(userRepository, times(0)).save(any(User.class));
    }


    @Test
    public void getUserInfoSuccess() {
        Long userId = 1L;

        User user = new User(
                "prova@gmail.com",
                "hashed-password",
                "testuser",
                true,
                ROLE_USER
        );

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        UserResponse response = authService.getUserInfo(userId);

        assertEquals("prova@gmail.com", response.email());
        assertEquals("testuser", response.username());
        assertTrue(response.enabled());
        assertEquals(ROLE_USER, response.globalRole());
    }

    @Test
    public void getUserNotFound() {
        Long userId = 1L;

        when(userRepository.findById(userId))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> authService.getUserInfo(userId));
    }

}
