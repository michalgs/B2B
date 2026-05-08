package com.example.b2b.service;

import com.example.b2b.dto.ContractCreateRequest;
import com.example.b2b.dto.ContractResponse;
import com.example.b2b.mapper.ContractMapper;
import com.example.b2b.model.*;
import com.example.b2b.repository.CompanyRepository;
import com.example.b2b.repository.ContractRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractServiceTest {

    @Mock
    private ContractRepository contractRepository;
    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private ContractMapper contractMapper;

    @InjectMocks
    private ContractService contractService;

    private User user;
    private Company company;
    private Company recipientCompany;

    @BeforeEach
    void setUp() {
        company = Company.builder().uuid(UUID.randomUUID()).name("Sender Co").build();
        recipientCompany = Company.builder().uuid(UUID.randomUUID()).name("Recipient Co").build();
        user = User.builder().company(company).email("test@example.com").build();
    }

    @Test
    void getUserContracts_Success() {
        when(contractRepository.findAllByCompany(any())).thenReturn(List.of(new Contract()));
        when(contractMapper.toResponse(any())).thenReturn(new ContractResponse());

        List<ContractResponse> result = contractService.getUserContracts(user);

        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void createContract_Success() {
        ContractCreateRequest request = new ContractCreateRequest();
        request.setRecipientCompanyUuid(recipientCompany.getUuid());
        request.setTitle("Title");
        request.setDescription("Desc");
        request.setPrice(BigDecimal.TEN);
        request.setCurrency("USD");
        request.setDeadline(LocalDateTime.now().plusDays(1));

        when(companyRepository.findByUuid(recipientCompany.getUuid())).thenReturn(Optional.of(recipientCompany));
        when(contractRepository.save(any(Contract.class))).thenAnswer(i -> i.getArguments()[0]);
        when(contractMapper.toResponse(any())).thenReturn(new ContractResponse());

        ContractResponse result = contractService.createContract(request, user);

        assertNotNull(result);
        verify(contractRepository).save(any(Contract.class));
    }

    @Test
    void getUserContracts_NoCompany_ReturnsEmptyList() {
        User userNoCo = User.builder().build();
        assertTrue(contractService.getUserContracts(userNoCo).isEmpty());
    }

    @Test
    void createContract_Self_ThrowsException() {
        ContractCreateRequest request = new ContractCreateRequest();
        request.setRecipientCompanyUuid(company.getUuid());

        when(companyRepository.findByUuid(company.getUuid())).thenReturn(Optional.of(company));

        assertThrows(IllegalArgumentException.class, () -> contractService.createContract(request, user));
    }

    @Test
    void createContract_RecipientNotFound_ThrowsException() {
        when(companyRepository.findByUuid(any())).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> contractService.createContract(new ContractCreateRequest(), user));
    }

    @Test
    void updateContractStatus_NotFound_ThrowsException() {
        when(contractRepository.findByUuid(any())).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> contractService.updateContractStatus(UUID.randomUUID(), ContractStatus.ACCEPTED, user));
    }

    @Test
    void updateContractStatus_NotRecipient_ThrowsException() {
        Contract contract = Contract.builder().recipient(recipientCompany).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        
        // Sender trying to accept
        assertThrows(IllegalStateException.class, () -> contractService.updateContractStatus(UUID.randomUUID(), ContractStatus.ACCEPTED, user));
    }

    @Test
    void updateContractStatus_AlreadyResolved_ThrowsException() {
        Contract contract = Contract.builder().recipient(recipientCompany).status(ContractStatus.ACCEPTED).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        
        User recipientUser = User.builder().company(recipientCompany).build();
        assertThrows(IllegalStateException.class, () -> contractService.updateContractStatus(UUID.randomUUID(), ContractStatus.REJECTED, recipientUser));
    }

    @Test
    void updateContractStatus_Success() {
        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .sender(company)
                .recipient(recipientCompany)
                .status(ContractStatus.INVITED)
                .shards(new ArrayList<>())
                .build();
        
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        when(contractRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(contractMapper.toResponse(any())).thenReturn(new ContractResponse());

        ContractResponse result = contractService.updateContractStatus(contract.getUuid(), ContractStatus.ACCEPTED, User.builder().company(recipientCompany).build());

        assertNotNull(result);
        assertEquals(ContractStatus.ACCEPTED, contract.getStatus());
    }
}
