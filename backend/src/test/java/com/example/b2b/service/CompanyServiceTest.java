package com.example.b2b.service;

import com.example.b2b.dto.CompanyUpdateRequest;
import com.example.b2b.model.Company;
import com.example.b2b.model.User;
import com.example.b2b.repository.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @InjectMocks
    private CompanyService companyService;

    private User user;
    private Company company;

    @BeforeEach
    void setUp() {
        company = Company.builder()
                .uuid(UUID.randomUUID())
                .name("Old Name")
                .address("Old Address")
                .description("Old Description")
                .logoUrl("Old Logo")
                .build();

        user = User.builder()
                .email("test@example.com")
                .company(company)
                .build();
    }

    @Test
    void updateCompany_updatesAllFields() {
        CompanyUpdateRequest request = CompanyUpdateRequest.builder()
                .name("New Name")
                .address("New Address")
                .description("New Description")
                .logoUrl("New Logo")
                .build();

        companyService.updateCompany(user, request);

        assertEquals("New Name", company.getName());
        assertEquals("New Address", company.getAddress());
        assertEquals("New Description", company.getDescription());
        assertEquals("New Logo", company.getLogoUrl());
        verify(companyRepository, times(1)).save(company);
    }

    @Test
    void updateCompany_updatesPartialFields() {
        CompanyUpdateRequest request = CompanyUpdateRequest.builder()
                .name("New Name")
                .build();

        companyService.updateCompany(user, request);

        assertEquals("New Name", company.getName());
        assertEquals("Old Address", company.getAddress());
        assertEquals("Old Description", company.getDescription());
        assertEquals("Old Logo", company.getLogoUrl());
        verify(companyRepository, times(1)).save(company);
    }
}
