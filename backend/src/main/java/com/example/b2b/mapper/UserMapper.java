package com.example.b2b.mapper;

import com.example.b2b.dto.UserMeResponse;
import com.example.b2b.model.User;
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
