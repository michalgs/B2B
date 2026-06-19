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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed: email {} already in use", request.getEmail());
            throw new RegistrationConflictException("Company or User already registered");
        }

        if (companyRepository.existsByNip(request.getNip())) {
            log.warn("Registration failed: NIP {} already in use", request.getNip());
            throw new RegistrationConflictException("Company or User already registered");
        }

        Company company = Company.builder()
                .uuid(UUID.randomUUID())
                .name(request.getCompanyName())
                .address(request.getCompanyAddress())
                .nip(request.getNip())
                .build();

        company = companyRepository.save(company);

        User user = User.builder()
                .uuid(UUID.randomUUID())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .company(company)
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: user with email {} not found", request.getEmail());
                    return new AuthorizationException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: incorrect password for user {}", request.getEmail());
            throw new AuthorizationException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}


