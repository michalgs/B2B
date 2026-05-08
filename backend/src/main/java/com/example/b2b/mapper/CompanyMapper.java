package com.example.b2b.mapper;

import com.example.b2b.dto.UserMeResponse;
import com.example.b2b.model.Company;
import com.example.b2b.model.User;
import org.springframework.stereotype.Component;

@Component
public class CompanyMapper {

    public UserMeResponse.CompanyDto toUserMeCompanyDto(Company company) {
        if (company == null) {
            return null;
        }

        return UserMeResponse.CompanyDto.builder()
                .uuid(company.getUuid())
                .name(company.getName())
                .nip(company.getNip())
                .address(company.getAddress())
                .description(company.getDescription())
                .logoUrl(company.getLogoUrl())
                .build();
    }
}
