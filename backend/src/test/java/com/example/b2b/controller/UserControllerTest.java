package com.example.b2b.controller;

import com.example.b2b.config.SecurityConfig;
import com.example.b2b.mapper.CompanyMapper;
import com.example.b2b.mapper.UserMapper;
import com.example.b2b.model.Company;
import com.example.b2b.model.User;
import com.example.b2b.repository.UserRepository;
import com.example.b2b.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@Import({SecurityConfig.class, UserMapper.class, CompanyMapper.class})
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void me_ReturnsAuthenticatedUser() throws Exception {
        UUID userUuid = UUID.randomUUID();
        UUID companyUuid = UUID.randomUUID();

        Company company = Company.builder()
                .uuid(companyUuid)
                .name("Acme Corp")
                .nip("1234567890")
                .address("123 Business St")
                .build();

        User user = User.builder()
                .uuid(userUuid)
                .email("test@example.com")
                .firstName("John")
                .lastName("Doe")
                .company(company)
                .build();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid").value(userUuid.toString()))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.company.uuid").value(companyUuid.toString()))
                .andExpect(jsonPath("$.company.name").value("Acme Corp"));

        SecurityContextHolder.clearContext();
    }
}
