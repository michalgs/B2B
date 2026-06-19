package com.example.b2b;

import com.example.b2b.company.CompanyResponse;
import com.example.b2b.company.CompanyUpdateRequest;
import com.example.b2b.contract.ContractCreateRequest;
import com.example.b2b.contract.ContractResponse;
import com.example.b2b.contract.CounterOfferRequest;
import com.example.b2b.user.AuthResponse;
import com.example.b2b.user.LoginRequest;
import com.example.b2b.user.RegisterRequest;
import com.example.b2b.user.UserMeResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class B2bIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Helper to register a company + user and return the JWT auth token
    private String registerAndGetToken(String email, String password, String firstName, String lastName,
                                       String companyName, String companyAddress, String nip) throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword(password);
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setCompanyName(companyName);
        request.setCompanyAddress(companyAddress);
        request.setNip(nip);

        MvcResult result = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(responseBody, AuthResponse.class);
        assertNotNull(authResponse.getToken());
        return authResponse.getToken();
    }

    // Helper to retrieve user profile
    private UserMeResponse getUserMe(String token) throws Exception {
        MvcResult meResult = mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readValue(meResult.getResponse().getContentAsString(), UserMeResponse.class);
    }

    // Helper to create a contract
    private ContractResponse createContract(String token, UUID recipientCompanyUuid, String title, BigDecimal price) throws Exception {
        ContractCreateRequest contractRequest = new ContractCreateRequest();
        contractRequest.setRecipientCompanyUuid(recipientCompanyUuid);
        contractRequest.setTitle(title);
        contractRequest.setDescription("Full description for " + title);
        contractRequest.setPrice(price);
        contractRequest.setCurrency("EUR");
        contractRequest.setDeadline(LocalDateTime.now().plusDays(30));

        MvcResult result = mockMvc.perform(post("/api/v1/contracts")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contractRequest)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readValue(result.getResponse().getContentAsString(), ContractResponse.class);
    }

    @Test
    void testProfileAndCompanyListing() throws Exception {
        String tokenA = registerAndGetToken("userA@example.com", "securePassword123", "Alice", "Smith",
                "Alpha Corp", "123 Alpha Road", "1234567890");
        String tokenB = registerAndGetToken("userB@example.com", "securePassword123", "Bob", "Jones",
                "Beta LLC", "456 Beta Ave", "0987654321");

        UserMeResponse meA = getUserMe(tokenA);
        assertEquals("userA@example.com", meA.getEmail());
        assertEquals("Alpha Corp", meA.getCompany().getName());

        UserMeResponse meB = getUserMe(tokenB);
        assertEquals("userB@example.com", meB.getEmail());
        assertEquals("Beta LLC", meB.getCompany().getName());

        // Alice lists companies; should see Bob's company, but not her own
        MvcResult companiesResult = mockMvc.perform(get("/api/v1/companies")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andReturn();
        List<CompanyResponse> companies = objectMapper.readValue(companiesResult.getResponse().getContentAsString(),
                new TypeReference<List<CompanyResponse>>() {});

        assertTrue(companies.stream().anyMatch(c -> c.getUuid().equals(meB.getCompany().getUuid())));
        assertTrue(companies.stream().noneMatch(c -> c.getUuid().equals(meA.getCompany().getUuid())));
    }

    @Test
    void testCompanyDetailsUpdate() throws Exception {
        String tokenA = registerAndGetToken("userA@example.com", "securePassword123", "Alice", "Smith",
                "Alpha Corp", "123 Alpha Road", "1234567890");

        CompanyUpdateRequest updateRequest = CompanyUpdateRequest.builder()
                .name("Alpha Ultimate Corp")
                .address("789 Omega Blvd")
                .description("Top Tier B2B Partner")
                .logoUrl("http://alpha.com/logo.png")
                .build();

        mockMvc.perform(patch("/api/v1/companies/me")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk());

        UserMeResponse meA = getUserMe(tokenA);
        assertEquals("Alpha Ultimate Corp", meA.getCompany().getName());
        assertEquals("789 Omega Blvd", meA.getCompany().getAddress());
        assertEquals("Top Tier B2B Partner", meA.getCompany().getDescription());
        assertEquals("http://alpha.com/logo.png", meA.getCompany().getLogoUrl());
    }

    @Test
    void testContractCreation() throws Exception {
        String tokenA = registerAndGetToken("userA@example.com", "securePassword123", "Alice", "Smith",
                "Alpha Corp", "123 Alpha Road", "1234567890");
        String tokenB = registerAndGetToken("userB@example.com", "securePassword123", "Bob", "Jones",
                "Beta LLC", "456 Beta Ave", "0987654321");

        UserMeResponse meB = getUserMe(tokenB);

        ContractResponse contract = createContract(tokenA, meB.getCompany().getUuid(), "Software Dev Agreement", new BigDecimal("15000.00"));
        assertNotNull(contract.getUuid());
        assertEquals("INVITED", contract.getStatus().name());
        assertEquals("Alpha Corp", contract.getSenderCompanyName());
        assertEquals("Beta LLC", contract.getRecipientCompanyName());
        assertEquals(1, contract.getShards().size());
        assertEquals("Software Dev Agreement", contract.getShards().get(0).getTitle());
        assertTrue(new BigDecimal("15000.00").compareTo(contract.getShards().get(0).getPrice()) == 0);
    }

    @Test
    void testContractRetrieval() throws Exception {
        String tokenA = registerAndGetToken("userA@example.com", "securePassword123", "Alice", "Smith",
                "Alpha Corp", "123 Alpha Road", "1234567890");
        String tokenB = registerAndGetToken("userB@example.com", "securePassword123", "Bob", "Jones",
                "Beta LLC", "456 Beta Ave", "0987654321");

        UserMeResponse meB = getUserMe(tokenB);
        ContractResponse created = createContract(tokenA, meB.getCompany().getUuid(), "Retrieval Test", new BigDecimal("5000.00"));

        // Bob gets his contract list
        MvcResult bContractsResult = mockMvc.perform(get("/api/v1/contracts")
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andReturn();
        Map<String, List<ContractResponse>> bContractsMap = objectMapper.readValue(
                bContractsResult.getResponse().getContentAsString(),
                new TypeReference<Map<String, List<ContractResponse>>>() {});
        List<ContractResponse> bContractsList = bContractsMap.get("content");
        assertTrue(bContractsList.stream().anyMatch(c -> c.getUuid().equals(created.getUuid())));

        // Bob fetches the specific contract
        MvcResult bSingleContractResult = mockMvc.perform(get("/api/v1/contracts/" + created.getUuid())
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andReturn();
        ContractResponse bContract = objectMapper.readValue(bSingleContractResult.getResponse().getContentAsString(), ContractResponse.class);
        assertEquals(created.getUuid(), bContract.getUuid());
    }

    @Test
    void testSelfAcceptanceConstraint() throws Exception {
        String tokenA = registerAndGetToken("userA@example.com", "securePassword123", "Alice", "Smith",
                "Alpha Corp", "123 Alpha Road", "1234567890");
        String tokenB = registerAndGetToken("userB@example.com", "securePassword123", "Bob", "Jones",
                "Beta LLC", "456 Beta Ave", "0987654321");

        UserMeResponse meB = getUserMe(tokenB);
        ContractResponse created = createContract(tokenA, meB.getCompany().getUuid(), "Self Accept Test", new BigDecimal("5000.00"));

        // Alice (the creator of the current shard) tries to accept it -> should fail
        Map<String, String> statusUpdate = Map.of("status", "ACCEPTED");
        mockMvc.perform(patch("/api/v1/contracts/" + created.getUuid() + "/status")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testCounterOfferAndSelfAcceptanceConstraint() throws Exception {
        String tokenA = registerAndGetToken("userA@example.com", "securePassword123", "Alice", "Smith",
                "Alpha Corp", "123 Alpha Road", "1234567890");
        String tokenB = registerAndGetToken("userB@example.com", "securePassword123", "Bob", "Jones",
                "Beta LLC", "456 Beta Ave", "0987654321");

        UserMeResponse meB = getUserMe(tokenB);
        ContractResponse created = createContract(tokenA, meB.getCompany().getUuid(), "Counter Offer Test", new BigDecimal("5000.00"));

        // Bob makes a counter-offer
        CounterOfferRequest counterRequest = new CounterOfferRequest();
        counterRequest.setTitle("Software Dev Agreement - Counter B");
        counterRequest.setDescription("Increased scope of testing and support");
        counterRequest.setPrice(new BigDecimal("18500.00"));
        counterRequest.setCurrency("EUR");
        counterRequest.setDeadline(LocalDateTime.now().plusDays(45));

        MvcResult counterResult = mockMvc.perform(post("/api/v1/contracts/" + created.getUuid() + "/counter-offer")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(counterRequest)))
                .andExpect(status().isOk())
                .andReturn();
        ContractResponse counterResponse = objectMapper.readValue(counterResult.getResponse().getContentAsString(), ContractResponse.class);
        assertEquals("NEGOTIATING", counterResponse.getStatus().name());
        assertEquals(2, counterResponse.getShards().size());
        assertEquals("Beta LLC", counterResponse.getShards().get(1).getCreatedByName());

        // Bob (the creator of this new counter-offer shard) tries to accept it -> should fail
        Map<String, String> statusUpdate = Map.of("status", "ACCEPTED");
        mockMvc.perform(patch("/api/v1/contracts/" + created.getUuid() + "/status")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testAcceptContract() throws Exception {
        String tokenA = registerAndGetToken("userA@example.com", "securePassword123", "Alice", "Smith",
                "Alpha Corp", "123 Alpha Road", "1234567890");
        String tokenB = registerAndGetToken("userB@example.com", "securePassword123", "Bob", "Jones",
                "Beta LLC", "456 Beta Ave", "0987654321");

        UserMeResponse meB = getUserMe(tokenB);
        ContractResponse created = createContract(tokenA, meB.getCompany().getUuid(), "Acceptance Test", new BigDecimal("10000.00"));

        // Bob makes a counter-offer
        CounterOfferRequest counterRequest = new CounterOfferRequest();
        counterRequest.setTitle("Counter Offer");
        counterRequest.setDescription("Terms");
        counterRequest.setPrice(new BigDecimal("12000.00"));
        counterRequest.setCurrency("EUR");
        counterRequest.setDeadline(LocalDateTime.now().plusDays(45));

        mockMvc.perform(post("/api/v1/contracts/" + created.getUuid() + "/counter-offer")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(counterRequest)))
                .andExpect(status().isOk());

        // Alice accepts the counter-offer
        Map<String, String> statusUpdate = Map.of("status", "ACCEPTED");
        MvcResult acceptResult = mockMvc.perform(patch("/api/v1/contracts/" + created.getUuid() + "/status")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andReturn();
        ContractResponse acceptedContract = objectMapper.readValue(acceptResult.getResponse().getContentAsString(), ContractResponse.class);
        assertEquals("ACCEPTED", acceptedContract.getStatus().name());
    }

    @Test
    void testClosedContractConstraints() throws Exception {
        String tokenA = registerAndGetToken("userA@example.com", "securePassword123", "Alice", "Smith",
                "Alpha Corp", "123 Alpha Road", "1234567890");
        String tokenB = registerAndGetToken("userB@example.com", "securePassword123", "Bob", "Jones",
                "Beta LLC", "456 Beta Ave", "0987654321");

        UserMeResponse meB = getUserMe(tokenB);
        ContractResponse created = createContract(tokenA, meB.getCompany().getUuid(), "Closed Contract Test", new BigDecimal("10000.00"));

        // Bob accepts immediately (Alice was the creator)
        Map<String, String> statusUpdate = Map.of("status", "ACCEPTED");
        mockMvc.perform(patch("/api/v1/contracts/" + created.getUuid() + "/status")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk());

        // Trying to counter-offer on a closed contract -> should fail
        CounterOfferRequest counterRequest = new CounterOfferRequest();
        counterRequest.setTitle("Late Counter");
        counterRequest.setDescription("Terms");
        counterRequest.setPrice(new BigDecimal("12000.00"));
        counterRequest.setCurrency("EUR");
        counterRequest.setDeadline(LocalDateTime.now().plusDays(45));

        mockMvc.perform(post("/api/v1/contracts/" + created.getUuid() + "/counter-offer")
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(counterRequest)))
                .andExpect(status().isInternalServerError());

        // Trying to change status again -> should fail
        Map<String, String> rejectUpdate = Map.of("status", "REJECTED");
        mockMvc.perform(patch("/api/v1/contracts/" + created.getUuid() + "/status")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rejectUpdate)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testRegistrationConflict() throws Exception {
        registerAndGetToken("original@example.com", "password123", "John", "Doe",
                "Original SA", "Warsaw", "1111111111");

        // Try to register with duplicate email
        RegisterRequest duplicateEmailReq = new RegisterRequest();
        duplicateEmailReq.setEmail("original@example.com");
        duplicateEmailReq.setPassword("password123");
        duplicateEmailReq.setFirstName("Jane");
        duplicateEmailReq.setLastName("Doe");
        duplicateEmailReq.setCompanyName("Different Company");
        duplicateEmailReq.setCompanyAddress("Krakow");
        duplicateEmailReq.setNip("2222222222");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateEmailReq)))
                .andExpect(status().isConflict());

        // Try to register with duplicate NIP
        RegisterRequest duplicateNipReq = new RegisterRequest();
        duplicateNipReq.setEmail("different@example.com");
        duplicateNipReq.setPassword("password123");
        duplicateNipReq.setFirstName("Jane");
        duplicateNipReq.setLastName("Doe");
        duplicateNipReq.setCompanyName("Different Company");
        duplicateNipReq.setCompanyAddress("Krakow");
        duplicateNipReq.setNip("1111111111");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateNipReq)))
                .andExpect(status().isConflict());
    }

    @Test
    void testUnauthorizedAndForbiddenActions() throws Exception {
        String tokenA = registerAndGetToken("alice@test.com", "password123", "Alice", "Test",
                "Alice Co", "A-Town", "1231231234");
        String tokenB = registerAndGetToken("bob@test.com", "password123", "Bob", "Test",
                "Bob Co", "B-Town", "5675675678");
        String tokenC = registerAndGetToken("charlie@test.com", "password123", "Charlie", "Test",
                "Charlie Co", "C-Town", "9019019012");

        UserMeResponse meB = getUserMe(tokenB);
        UUID companyUuidB = meB.getCompany().getUuid();

        // 1. Unauthenticated request to protected endpoint should fail
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isUnauthorized());

        // 2. Invalid Login credentials should fail
        LoginRequest badLogin = new LoginRequest();
        badLogin.setEmail("alice@test.com");
        badLogin.setPassword("wrongPassword");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badLogin)))
                .andExpect(status().isUnauthorized());

        // 3. User A creates contract with User B
        ContractResponse contract = createContract(tokenA, companyUuidB, "Agreement AB", new BigDecimal("1000.00"));
        UUID contractUuid = contract.getUuid();

        // 4. User C (an outsider) tries to read the contract -> should fail (500 via IllegalArgumentException)
        mockMvc.perform(get("/api/v1/contracts/" + contractUuid)
                        .header("Authorization", "Bearer " + tokenC))
                .andExpect(status().isInternalServerError());

        // 5. User C tries to counter-offer on the contract -> should fail
        CounterOfferRequest counterRequest = new CounterOfferRequest();
        counterRequest.setTitle("Intruder Offer");
        counterRequest.setDescription("Intruder Details");
        counterRequest.setPrice(new BigDecimal("2000.00"));
        counterRequest.setCurrency("PLN");
        counterRequest.setDeadline(LocalDateTime.now().plusDays(5));

        mockMvc.perform(post("/api/v1/contracts/" + contractUuid + "/counter-offer")
                        .header("Authorization", "Bearer " + tokenC)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(counterRequest)))
                .andExpect(status().isInternalServerError());
    }
}
