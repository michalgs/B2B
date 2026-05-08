package com.example.b2b.service;

import com.example.b2b.dto.CompanyResponse;
import com.example.b2b.model.User;
import com.example.b2b.repository.CompanyRepository;
import com.example.b2b.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public List<CompanyResponse> getAllOtherCompanies() {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return companyRepository.findAll().stream()
                .filter(c -> !c.getUuid().equals(currentUser.getCompany().getUuid()))
                .map(c -> CompanyResponse.builder()
                        .uuid(c.getUuid())
                        .name(c.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
