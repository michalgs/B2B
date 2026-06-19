package com.example.b2b.contract;

import com.example.b2b.contract.ContractCreateRequest;
import com.example.b2b.contract.ContractResponse;
import com.example.b2b.contract.CounterOfferRequest;
import com.example.b2b.contract.ContractMapper;
import com.example.b2b.user.User;
import com.example.b2b.company.Company;
import com.example.b2b.company.CompanyRepository;
import com.example.b2b.contract.ContractRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractService {

    private final ContractRepository contractRepository;
    private final CompanyRepository companyRepository;
    private final ContractMapper contractMapper;

    @Transactional
    public ContractResponse updateContractStatus(UUID uuid, ContractStatus newStatus, User user) {
        Company company = user.getCompany();

        Contract contract = contractRepository.findByUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (contract.getStatus() == ContractStatus.ACCEPTED || contract.getStatus() == ContractStatus.REJECTED) {
            throw new IllegalStateException("Negotiation is already closed");
        }

        // Get the latest shard to determine who is the recipient of the current offer
        ContractShard latestShard = contract.getShards().stream()
                .max(Comparator.comparing(ContractShard::getCreatedAt))
                .orElseThrow(() -> new IllegalStateException("Contract has no shards"));

        // The person who can accept/reject is the one who DID NOT create the latest shard
        if (latestShard.getCreatedBy().getUuid().equals(company.getUuid())) {
            throw new IllegalStateException("You cannot accept or reject your own offer");
        }

        contract.setStatus(newStatus);
        contract = contractRepository.save(contract);
        log.info("Contract {} status updated to {} by company {}", contract.getUuid(), newStatus, company.getUuid());

        return contractMapper.toResponse(contract);
    }

    @Transactional
    public ContractResponse counterOffer(UUID uuid, CounterOfferRequest request, User user) {
        Company company = user.getCompany();
        Contract contract = contractRepository.findByUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getSender().getUuid().equals(company.getUuid()) &&
                !contract.getRecipient().getUuid().equals(company.getUuid())) {
            throw new IllegalArgumentException("You are not authorized to counter-offer on this contract");
        }

        if (contract.getStatus() == ContractStatus.ACCEPTED || contract.getStatus() == ContractStatus.REJECTED) {
            throw new IllegalStateException("Cannot counter-offer on a closed contract");
        }

        ContractShard shard = ContractShard.builder()
                .uuid(UUID.randomUUID())
                .contract(contract)
                .createdBy(company)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .deadline(request.getDeadline())
                .build();

        contract.getShards().add(shard);
        contract.setStatus(ContractStatus.NEGOTIATING);
        contract = contractRepository.save(contract);
        log.info("Counter offer added to contract: {} by company {}", contract.getUuid(), company.getUuid());

        return contractMapper.toResponse(contract);
    }

    @Transactional(readOnly = true)
    public ContractResponse getContractByUuid(UUID uuid, User user) {
        Company company = user.getCompany();
        Contract contract = contractRepository.findByUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));

        if (!contract.getSender().getUuid().equals(company.getUuid()) &&
                !contract.getRecipient().getUuid().equals(company.getUuid())) {
            throw new IllegalArgumentException("You are not authorized to view this contract");
        }

        return contractMapper.toResponse(contract);
    }

    @Transactional(readOnly = true)
    public List<ContractResponse> getUserContracts(User user) {
        Company company = user.getCompany();
        if (company == null) {
            return List.of();
        }

        return contractRepository.findAllByCompany(company).stream()
                .map(contractMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ContractResponse createContract(ContractCreateRequest request, User user) {
        Company senderCompany = user.getCompany();
        
        Company recipientCompany = companyRepository.findByUuid(request.getRecipientCompanyUuid())
                .orElseThrow(() -> new IllegalArgumentException("Recipient company not found"));

        if (senderCompany.getUuid().equals(request.getRecipientCompanyUuid())) {
            throw new IllegalArgumentException("Cannot create contract with your own company");
        }

        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .sender(senderCompany)
                .recipient(recipientCompany)
                .status(ContractStatus.INVITED)
                .build();

        ContractShard shard = ContractShard.builder()
                .uuid(UUID.randomUUID())
                .contract(contract)
                .createdBy(senderCompany)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .currency(request.getCurrency())
                .deadline(request.getDeadline())
                .build();

        contract.getShards().add(shard);
        contract = contractRepository.save(contract);
        log.info("Contract created: {} by company {}", contract.getUuid(), senderCompany.getUuid());

        return contractMapper.toResponse(contract);
    }
}


