package com.example.b2b.company;

import com.example.b2b.company.CompanyResponse;
import com.example.b2b.company.CompanyUpdateRequest;
import com.example.b2b.user.User;
import com.example.b2b.company.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @PatchMapping("/me")
    public ResponseEntity<Void> updateMyCompany(@AuthenticationPrincipal User user, @RequestBody CompanyUpdateRequest request) {
        companyService.updateCompany(user, request);
        return ResponseEntity.ok().build();
    }
}


