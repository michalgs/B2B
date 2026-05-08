package com.example.b2b.service;

import com.example.b2b.dto.CompanyResponse;
import com.example.b2b.model.User;
import com.example.b2b.repository.CompanyRepository;
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
}
