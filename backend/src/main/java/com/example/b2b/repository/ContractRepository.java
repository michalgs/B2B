package com.example.b2b.repository;

import com.example.b2b.model.Company;
import com.example.b2b.model.Contract;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ContractRepository extends JpaRepository<Contract, Long> {
    
    @EntityGraph(attributePaths = {"sender", "recipient", "shards"})
    @Query("SELECT c FROM Contract c WHERE c.sender = :company OR c.recipient = :company ORDER BY c.updatedAt DESC")
    List<Contract> findAllByCompany(@Param("company") Company company);

    @EntityGraph(attributePaths = {"sender", "recipient", "shards", "shards.createdBy"})
    Optional<Contract> findByUuid(UUID uuid);
}
