package com.example.b2b.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserMeResponse {
    private UUID uuid;
    private String email;
    private String firstName;
    private String lastName;
    private CompanyDto company;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyDto {
        private UUID uuid;
        private String name;
        private String nip;
        private String address;
        private String description;
        private String logoUrl;
    }
}

