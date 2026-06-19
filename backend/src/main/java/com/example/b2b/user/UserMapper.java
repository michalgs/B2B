package com.example.b2b.user;

import com.example.b2b.company.CompanyMapper;

import com.example.b2b.user.UserMeResponse;
import com.example.b2b.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final CompanyMapper companyMapper;

    public UserMeResponse toMeResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserMeResponse.builder()
                .uuid(user.getUuid())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .company(companyMapper.toUserMeCompanyDto(user.getCompany()))
                .build();
    }
}


