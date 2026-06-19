package com.example.b2b.contract;

import com.example.b2b.company.CompanyRepository;

import com.example.b2b.company.Company;
import com.example.b2b.contract.Contract;
import com.example.b2b.contract.ContractShard;
import com.example.b2b.contract.ContractStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ContractRepositoryTest {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void findAllByCompany_ReturnsContractsForSenderOrRecipient() {
        Company company1 = Company.builder().uuid(UUID.randomUUID()).name("Company 1").nip("1234567890").address("Addr 1").build();
        Company company2 = Company.builder().uuid(UUID.randomUUID()).name("Company 2").nip("0987654321").address("Addr 2").build();
        Company otherCompany = Company.builder().uuid(UUID.randomUUID()).name("Other").nip("1111111111").address("Addr 3").build();

        company1 = companyRepository.save(company1);
        company2 = companyRepository.save(company2);
        otherCompany = companyRepository.save(otherCompany);

        Contract contract1 = Contract.builder().uuid(UUID.randomUUID()).sender(company1).recipient(company2).status(ContractStatus.INVITED).build();
        Contract contract2 = Contract.builder().uuid(UUID.randomUUID()).sender(company2).recipient(company1).status(ContractStatus.NEGOTIATING).build();
        Contract unrelatedContract = Contract.builder().uuid(UUID.randomUUID()).sender(company2).recipient(otherCompany).status(ContractStatus.INVITED).build();

        contractRepository.save(contract1);
        contractRepository.save(contract2);
        contractRepository.save(unrelatedContract);

        List<Contract> result = contractRepository.findAllByCompany(company1);

        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(c -> c.getUuid().equals(contract1.getUuid())));
        assertTrue(result.stream().anyMatch(c -> c.getUuid().equals(contract2.getUuid())));
    }

    @Test
    void findByUuid_ReturnsContractWithShards() {
        Company sender = Company.builder().uuid(UUID.randomUUID()).name("Sender").nip("123").address("A").build();
        Company recipient = Company.builder().uuid(UUID.randomUUID()).name("Recipient").nip("456").address("B").build();
        sender = companyRepository.save(sender);
        recipient = companyRepository.save(recipient);

        UUID contractUuid = UUID.randomUUID();
        Contract contract = Contract.builder()
                .uuid(contractUuid)
                .sender(sender)
                .recipient(recipient)
                .status(ContractStatus.INVITED)
                .build();
        
        ContractShard shard = ContractShard.builder()
                .uuid(UUID.randomUUID())
                .contract(contract)
                .createdBy(sender)
                .title("Offer")
                .description("Initial offer description")
                .price(BigDecimal.TEN)
                .currency("USD")
                .deadline(LocalDateTime.now().plusDays(7))
                .createdAt(LocalDateTime.now())
                .build();
        
        contract.setShards(List.of(shard));
        contractRepository.save(contract);

        entityManager.flush();
        entityManager.clear();

        Optional<Contract> result = contractRepository.findByUuid(contractUuid);

        assertTrue(result.isPresent());
        assertEquals(contractUuid, result.get().getUuid());
        assertFalse(result.get().getShards().isEmpty());
        assertEquals("Offer", result.get().getShards().get(0).getTitle());
        assertEquals("Sender", result.get().getShards().get(0).getCreatedBy().getName());
    }
}



