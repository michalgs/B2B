package com.example.b2b.controller;

import com.example.b2b.dto.UserMeResponse;
import com.example.b2b.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<UserMeResponse> me(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        UserMeResponse.CompanyDto companyDto = null;
        if (user.getCompany() != null) {
            companyDto = UserMeResponse.CompanyDto.builder()
                    .uuid(user.getCompany().getUuid())
                    .name(user.getCompany().getName())
                    .nip(user.getCompany().getNip())
                    .address(user.getCompany().getAddress())
                    .description(user.getCompany().getDescription())
                    .logoUrl(user.getCompany().getLogoUrl())
                    .build();
        }

        return ResponseEntity.ok(UserMeResponse.builder()
                .uuid(user.getUuid())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .company(companyDto)
                .build());
    }
}
