package com.example.b2b.user;

import com.example.b2b.company.CompanyMapper;

import com.example.b2b.user.UserMeResponse;
import com.example.b2b.company.Company;
import com.example.b2b.user.User;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private final CompanyMapper companyMapper = new CompanyMapper();
    private final UserMapper mapper = new UserMapper(companyMapper);

    @Test
    void toMeResponse_NullInput_ReturnsNull() {
        assertNull(mapper.toMeResponse(null));
    }

    @Test
    void toMeResponse_WithCompany_ReturnsFullResponse() {
        UUID userUuid = UUID.randomUUID();
        UUID companyUuid = UUID.randomUUID();
        Company company = Company.builder()
                .uuid(companyUuid)
                .name("Acme")
                .build();
        User user = User.builder()
                .uuid(userUuid)
                .email("test@test.com")
                .company(company)
                .build();

        UserMeResponse response = mapper.toMeResponse(user);

        assertNotNull(response);
        assertEquals(userUuid, response.getUuid());
        assertEquals(companyUuid, response.getCompany().getUuid());
    }

    @Test
    void toMeResponse_WithoutCompany_ReturnsResponseWithNullCompany() {
        User user = User.builder().uuid(UUID.randomUUID()).build();

        UserMeResponse response = mapper.toMeResponse(user);

        assertNotNull(response);
        assertNull(response.getCompany());
    }
}


