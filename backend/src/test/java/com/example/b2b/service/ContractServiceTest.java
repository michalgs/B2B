package com.example.b2b.service;

import com.example.b2b.dto.ContractCreateRequest;
import com.example.b2b.dto.ContractResponse;
import com.example.b2b.dto.CounterOfferRequest;
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
        Contract contract1 = Contract.builder().uuid(UUID.randomUUID()).build();
        Contract contract2 = Contract.builder().uuid(UUID.randomUUID()).build();
        
        when(contractRepository.findAllByCompany(company)).thenReturn(List.of(contract1, contract2));
        when(contractMapper.toResponse(any(Contract.class)))
            .thenReturn(ContractResponse.builder().uuid(contract1.getUuid()).build())
            .thenReturn(ContractResponse.builder().uuid(contract2.getUuid()).build());

        List<ContractResponse> result = contractService.getUserContracts(user);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(contract1.getUuid(), result.get(0).getUuid());
        assertEquals(contract2.getUuid(), result.get(1).getUuid());
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
    void updateContractStatus_Closed_ThrowsException() {
        Contract contractAccepted = Contract.builder().status(ContractStatus.ACCEPTED).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contractAccepted));
        assertThrows(IllegalStateException.class, () -> contractService.updateContractStatus(UUID.randomUUID(), ContractStatus.REJECTED, user));

        Contract contractRejected = Contract.builder().status(ContractStatus.REJECTED).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contractRejected));
        assertThrows(IllegalStateException.class, () -> contractService.updateContractStatus(UUID.randomUUID(), ContractStatus.ACCEPTED, user));
    }

    @Test
    void updateContractStatus_NoShards_ThrowsException() {
        Contract contract = Contract.builder().status(ContractStatus.INVITED).shards(new ArrayList<>()).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        
        assertThrows(IllegalStateException.class, () -> contractService.updateContractStatus(UUID.randomUUID(), ContractStatus.ACCEPTED, user));
    }

    @Test
    void updateContractStatus_CannotAcceptOwnOffer_ThrowsException() {
        ContractShard shard = ContractShard.builder().createdBy(company).createdAt(LocalDateTime.now()).build();
        Contract contract = Contract.builder()
                .sender(company)
                .recipient(recipientCompany)
                .status(ContractStatus.INVITED)
                .shards(new ArrayList<>(List.of(shard)))
                .build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        
        // Sender trying to accept their own offer
        assertThrows(IllegalStateException.class, () -> contractService.updateContractStatus(UUID.randomUUID(), ContractStatus.ACCEPTED, user));
    }

    @Test
    void updateContractStatus_Success() {
        ContractShard shard = ContractShard.builder().createdBy(company).createdAt(LocalDateTime.now()).build();
        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .sender(company)
                .recipient(recipientCompany)
                .status(ContractStatus.INVITED)
                .shards(new ArrayList<>(List.of(shard)))
                .build();
        
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        when(contractRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(contractMapper.toResponse(any())).thenReturn(new ContractResponse());

        User recipientUser = User.builder().company(recipientCompany).build();
        ContractResponse result = contractService.updateContractStatus(contract.getUuid(), ContractStatus.ACCEPTED, recipientUser);

        assertNotNull(result);
        assertEquals(ContractStatus.ACCEPTED, contract.getStatus());
    }

    @Test
    void updateContractStatus_UsesLatestShard() {
        LocalDateTime now = LocalDateTime.now();
        ContractShard oldShard = ContractShard.builder().createdBy(company).createdAt(now.minusHours(1)).build();
        ContractShard newShard = ContractShard.builder().createdBy(recipientCompany).createdAt(now).build();
        
        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .sender(company)
                .recipient(recipientCompany)
                .status(ContractStatus.NEGOTIATING)
                .shards(new ArrayList<>(List.of(oldShard, newShard)))
                .build();
        
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        when(contractRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(contractMapper.toResponse(any())).thenReturn(new ContractResponse());

        // Now the latest shard was created by recipientCompany. 
        // So the SENDER (company) should be able to accept it.
        ContractResponse result = contractService.updateContractStatus(contract.getUuid(), ContractStatus.ACCEPTED, user);

        assertNotNull(result);
        assertEquals(ContractStatus.ACCEPTED, contract.getStatus());
    }

    @Test
    void getContractByUuid_Success() {
        UUID uuid = UUID.randomUUID();
        Contract contract = Contract.builder().uuid(uuid).sender(company).recipient(recipientCompany).build();
        ContractResponse response = ContractResponse.builder().uuid(uuid).senderCompanyName("Sender Co").build();
        
        when(contractRepository.findByUuid(uuid)).thenReturn(Optional.of(contract));
        when(contractMapper.toResponse(contract)).thenReturn(response);

        ContractResponse result = contractService.getContractByUuid(uuid, user);
        
        assertNotNull(result);
        assertEquals(uuid, result.getUuid());
        assertEquals("Sender Co", result.getSenderCompanyName());
    }

    @Test
    void getContractByUuid_UserNoCompany_ThrowsException() {
        User userNoCo = User.builder().build();
        UUID uuid = UUID.randomUUID();
        Contract contract = Contract.builder().uuid(uuid).sender(company).recipient(recipientCompany).build();
        
        when(contractRepository.findByUuid(uuid)).thenReturn(Optional.of(contract));

        assertThrows(NullPointerException.class, () -> contractService.getContractByUuid(uuid, userNoCo));
    }

    @Test
    void getContractByUuid_Unauthorized_ThrowsException() {
        Company otherCompany = Company.builder().uuid(UUID.randomUUID()).build();
        Contract contract = Contract.builder().sender(otherCompany).recipient(otherCompany).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));

        assertThrows(IllegalArgumentException.class, () -> contractService.getContractByUuid(UUID.randomUUID(), user));
    }

    @Test
    void counterOffer_Success() {
        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .sender(company)
                .recipient(recipientCompany)
                .status(ContractStatus.INVITED)
                .shards(new ArrayList<>())
                .build();
        
        CounterOfferRequest request = new CounterOfferRequest();
        request.setTitle("Counter");
        request.setPrice(BigDecimal.valueOf(100));
        request.setCurrency("USD");
        request.setDeadline(LocalDateTime.now().plusDays(7));

        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        when(contractRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(contractMapper.toResponse(any())).thenReturn(new ContractResponse());

        ContractResponse result = contractService.counterOffer(contract.getUuid(), request, user);

        assertNotNull(result);
        assertEquals(ContractStatus.NEGOTIATING, contract.getStatus());
        assertEquals(1, contract.getShards().size());
    }

    @Test
    void counterOffer_Unauthorized_ThrowsException() {
        Company otherCompany = Company.builder().uuid(UUID.randomUUID()).build();
        Contract contract = Contract.builder().sender(otherCompany).recipient(otherCompany).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));

        assertThrows(IllegalArgumentException.class, () -> contractService.counterOffer(UUID.randomUUID(), new CounterOfferRequest(), user));
    }

    @Test
    void counterOffer_Closed_ThrowsException() {
        Contract contractAccepted = Contract.builder().sender(company).recipient(recipientCompany).status(ContractStatus.ACCEPTED).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contractAccepted));
        assertThrows(IllegalStateException.class, () -> contractService.counterOffer(UUID.randomUUID(), new CounterOfferRequest(), user));

        Contract contractRejected = Contract.builder().sender(company).recipient(recipientCompany).status(ContractStatus.REJECTED).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contractRejected));
        assertThrows(IllegalStateException.class, () -> contractService.counterOffer(UUID.randomUUID(), new CounterOfferRequest(), user));
    }

    @Test
    void counterOffer_Success_Recipient() {
        Contract contract = Contract.builder()
                .uuid(UUID.randomUUID())
                .sender(recipientCompany) // Swapped for recipient testing
                .recipient(company)
                .status(ContractStatus.INVITED)
                .shards(new ArrayList<>())
                .build();
        
        CounterOfferRequest request = new CounterOfferRequest();
        request.setTitle("Counter");
        request.setPrice(BigDecimal.valueOf(100));
        request.setCurrency("USD");
        request.setDeadline(LocalDateTime.now().plusDays(7));

        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        when(contractRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);
        when(contractMapper.toResponse(any())).thenReturn(new ContractResponse());

        ContractResponse result = contractService.counterOffer(contract.getUuid(), request, user);
        assertNotNull(result);
    }

    @Test
    void getContractByUuid_Success_Recipient() {
        Contract contract = Contract.builder().sender(recipientCompany).recipient(company).build();
        when(contractRepository.findByUuid(any())).thenReturn(Optional.of(contract));
        when(contractMapper.toResponse(any())).thenReturn(new ContractResponse());

        ContractResponse result = contractService.getContractByUuid(UUID.randomUUID(), user);
        assertNotNull(result);
    }

    @Test
    void counterOffer_NotFound_ThrowsException() {
        when(contractRepository.findByUuid(any())).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> contractService.counterOffer(UUID.randomUUID(), new CounterOfferRequest(), user));
    }

    @Test
    void getContractByUuid_NotFound_ThrowsException() {
        when(contractRepository.findByUuid(any())).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> contractService.getContractByUuid(UUID.randomUUID(), user));
    }
}
