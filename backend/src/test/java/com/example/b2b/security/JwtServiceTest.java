package com.example.b2b.security;

import com.example.b2b.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long expiration = 3600000;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", secret);
        ReflectionTestUtils.setField(jwtService, "expirationMs", expiration);
    }

    @Test
    void generateToken_Success() {
        User user = User.builder().email("test@example.com").build();
        String token = jwtService.generateToken(user);
        
        assertNotNull(token);
        assertEquals("test@example.com", jwtService.extractUsername(token));
    }

    @Test
    void isTokenValid_Success() {
        User user = User.builder().email("test@example.com").build();
        String token = jwtService.generateToken(user);
        
        assertTrue(jwtService.isTokenValid(token, user));
    }

    @Test
    void isTokenValid_WrongUser_ReturnsFalse() {
        User user = User.builder().email("test@example.com").build();
        User otherUser = User.builder().email("other@example.com").build();
        String token = jwtService.generateToken(user);
        
        assertFalse(jwtService.isTokenValid(token, otherUser));
    }
}


