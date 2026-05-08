package com.example.b2b.service;

import com.example.b2b.dto.ContractCreateRequest;
import com.example.b2b.dto.ContractResponse;
import com.example.b2b.model.Company;
import com.example.b2b.model.Contract;
import com.example.b2b.model.ContractStatus;
import com.example.b2b.model.User;
import com.example.b2b.repository.CompanyRepository;
import com.example.b2b.repository.ContractRepository;
import com.example.b2b.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    @Transactional
    public ContractResponse updateContractStatus(UUID uuid, ContractStatus newStatus) {
        User user = getCurrentUser();
        Company company = user.getCompany();

        Contract contract = contractRepository.findById(uuid)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        // Only the recipient can accept or reject
        if (!contract.getRecipientCompany().getUuid().equals(company.getUuid())) {
            throw new IllegalStateException("Only the recipient can change the contract status");
        }

        if (contract.getStatus() != ContractStatus.INVITED) {
            throw new IllegalStateException("Negotiation is already resolved or in progress");
        }

        contract.setStatus(newStatus);
        Contract savedContract = contractRepository.save(contract);

        return mapToResponse(savedContract);
    }

    private ContractResponse mapToResponse(Contract c) {
        return ContractResponse.builder()
                .uuid(c.getUuid())
                .status(c.getStatus())
                .senderCompanyName(c.getSenderCompany().getName())
                .recipientCompanyName(c.getRecipientCompany().getName())
                .initialOffering(c.getTitle() + " ($" + c.getPrice() + ")")
                .updatedAt(c.getUpdatedAt())
                .build();
    }

    public List<ContractResponse> getUserContracts() {
        User user = getCurrentUser();
        Company company = user.getCompany();

        List<Contract> contracts = contractRepository.findBySenderCompanyOrRecipientCompanyOrderByUpdatedAtDesc(company, company);

        return contracts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ContractResponse createContract(ContractCreateRequest request) {
        User user = getCurrentUser();
        Company senderCompany = user.getCompany();
        
        Company recipientCompany = companyRepository.findById(request.getRecipientCompanyUuid())
                .orElseThrow(() -> new IllegalArgumentException("Recipient company not found"));

        Contract contract = Contract.builder()
                .senderCompany(senderCompany)
                .recipientCompany(recipientCompany)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .deadline(request.getDeadline())
                .status(ContractStatus.INVITED)
                .build();

        Contract savedContract = contractRepository.save(contract);

        return mapToResponse(savedContract);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
