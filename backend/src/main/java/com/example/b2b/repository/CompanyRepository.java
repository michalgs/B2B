package com.example.b2b.repository;

import com.example.b2b.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    boolean existsByNip(String nip);
    
    Optional<Company> findByUuid(UUID uuid);
}
