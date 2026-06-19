package com.example.b2b.company;

import com.example.b2b.company.CompanyResponse;
import com.example.b2b.company.CompanyUpdateRequest;
import com.example.b2b.company.Company;
import com.example.b2b.user.User;
import com.example.b2b.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllOtherCompanies(User currentUser) {
        return companyRepository.findAll().stream()
                .filter(c -> !c.getUuid().equals(currentUser.getCompany().getUuid()))
                .map(c -> CompanyResponse.builder()
                        .uuid(c.getUuid())
                        .name(c.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateCompany(User currentUser, CompanyUpdateRequest request) {
        Company company = currentUser.getCompany();
        if (request.getName() != null) {
            company.setName(request.getName());
        }
        if (request.getAddress() != null) {
            company.setAddress(request.getAddress());
        }
        if (request.getDescription() != null) {
            company.setDescription(request.getDescription());
        }
        if (request.getLogoUrl() != null) {
            company.setLogoUrl(request.getLogoUrl());
        }
        companyRepository.save(company);
    }
}


