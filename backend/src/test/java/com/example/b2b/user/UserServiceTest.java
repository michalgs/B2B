package com.example.b2b.user;

import com.example.b2b.security.JwtService;

import com.example.b2b.user.AuthResponse;
import com.example.b2b.user.LoginRequest;
import com.example.b2b.user.RegisterRequest;
import com.example.b2b.common.AuthorizationException;
import com.example.b2b.common.RegistrationConflictException;
import com.example.b2b.company.Company;
import com.example.b2b.user.User;
import com.example.b2b.company.CompanyRepository;
import com.example.b2b.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;
    private Company company;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setCompanyName("Test Company");
        registerRequest.setCompanyAddress("Test Address");
        registerRequest.setNip("1234567890");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        company = Company.builder()
                .uuid(UUID.randomUUID())
                .name("Test Company")
                .nip("1234567890")
                .address("Test Address")
                .build();

        user = User.builder()
                .uuid(UUID.randomUUID())
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("John")
                .lastName("Doe")
                .company(company)
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(companyRepository.existsByNip(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(jwtService.generateToken(any(User.class))).thenReturn("testToken");

        AuthResponse response = userService.register(registerRequest);

        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("testToken", response.getToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_EmailAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(RegistrationConflictException.class, () -> userService.register(registerRequest));
    }

    @Test
    void register_NipAlreadyExists_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(companyRepository.existsByNip(anyString())).thenReturn(true);

        assertThrows(RegistrationConflictException.class, () -> userService.register(registerRequest));
    }

    @Test
    void login_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtService.generateToken(any(User.class))).thenReturn("testToken");

        AuthResponse response = userService.login(loginRequest);

        assertNotNull(response);
        assertEquals("testToken", response.getToken());
    }

    @Test
    void login_UserNotFound_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(AuthorizationException.class, () -> userService.login(loginRequest));
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(AuthorizationException.class, () -> userService.login(loginRequest));
    }
}


