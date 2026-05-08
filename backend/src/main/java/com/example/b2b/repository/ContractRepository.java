package com.example.b2b.repository;

import com.example.b2b.model.Contract;
import com.example.b2b.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContractRepository extends JpaRepository<Contract, UUID> {
    List<Contract> findBySenderCompanyOrRecipientCompanyOrderByUpdatedAtDesc(Company sender, Company recipient);
}
