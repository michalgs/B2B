package com.example.b2b.controller;

import com.example.b2b.dto.CompanyResponse;
import com.example.b2b.model.User;
import com.example.b2b.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public List<CompanyResponse> getCompanies(@AuthenticationPrincipal User user) {
        return companyService.getAllOtherCompanies(user);
    }
}
