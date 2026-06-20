package com.example.b2b.user;

import com.example.b2b.user.LoginRequest;
import com.example.b2b.user.RegisterRequest;
import com.example.b2b.user.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import com.example.b2b.user.AuthResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse authResponse = userService.register(request);
        addAuthCookie(response, authResponse.getToken());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse loginResponse = userService.login(request);
        addAuthCookie(response, loginResponse.getToken());
        return ResponseEntity.ok(loginResponse);
    }

    private void addAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("auth_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Reverted to secure as requested
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 24 hours
        cookie.setAttribute("SameSite", "None"); // Required for Secure=true in cross-origin
        response.addCookie(cookie);
    }
}


