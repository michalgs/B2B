package com.example.b2b.company;

import com.example.b2b.user.UserMeResponse;
import com.example.b2b.company.Company;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class CompanyMapperTest {

    private final CompanyMapper mapper = new CompanyMapper();

    @Test
    void toUserMeCompanyDto_NullInput_ReturnsNull() {
        assertNull(mapper.toUserMeCompanyDto(null));
    }

    @Test
    void toUserMeCompanyDto_ValidInput_ReturnsDto() {
        UUID uuid = UUID.randomUUID();
        Company company = Company.builder()
                .uuid(uuid)
                .name("Acme")
                .nip("1234567890")
                .address("Street")
                .description("Desc")
                .logoUrl("logo.png")
                .build();

        UserMeResponse.CompanyDto dto = mapper.toUserMeCompanyDto(company);

        assertNotNull(dto);
        assertEquals(uuid, dto.getUuid());
        assertEquals("Acme", dto.getName());
        assertEquals("1234567890", dto.getNip());
    }
}


