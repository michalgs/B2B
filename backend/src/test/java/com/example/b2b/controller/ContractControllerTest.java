package com.example.b2b.controller;

import com.example.b2b.config.SecurityConfig;
import com.example.b2b.dto.ContractCreateRequest;
import com.example.b2b.dto.ContractResponse;
import com.example.b2b.dto.CounterOfferRequest;
import com.example.b2b.model.User;
import com.example.b2b.repository.UserRepository;
import com.example.b2b.service.ContractService;
import com.example.b2b.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContractController.class)
@Import(SecurityConfig.class)
class ContractControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ContractService contractService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getContracts_Success() throws Exception {
        User user = User.builder().email("test@example.com").build();
        authenticate(user);

        when(contractService.getUserContracts(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/contracts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        SecurityContextHolder.clearContext();
    }

    @Test
    void createContract_Success() throws Exception {
        User user = User.builder().email("test@example.com").build();
        authenticate(user);

        ContractCreateRequest request = new ContractCreateRequest();
        request.setRecipientCompanyUuid(UUID.randomUUID());
        request.setTitle("Title");
        request.setDescription("Desc");
        request.setPrice(BigDecimal.TEN);
        request.setCurrency("USD");
        request.setDeadline(LocalDateTime.now().plusDays(1));

        when(contractService.createContract(any(), any())).thenReturn(new ContractResponse());

        mockMvc.perform(post("/api/v1/contracts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        SecurityContextHolder.clearContext();
    }

    @Test
    void updateStatus_Success() throws Exception {
        User user = User.builder().email("test@example.com").build();
        authenticate(user);

        Map<String, String> statusUpdate = Map.of("status", "ACCEPTED");

        when(contractService.updateContractStatus(any(), any(), any())).thenReturn(new ContractResponse());

        mockMvc.perform(patch("/api/v1/contracts/" + UUID.randomUUID() + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk());

        SecurityContextHolder.clearContext();
    }

    @Test
    void getContract_Success() throws Exception {
        User user = User.builder().email("test@example.com").build();
        authenticate(user);

        UUID uuid = UUID.randomUUID();
        ContractResponse response = ContractResponse.builder()
                .uuid(uuid)
                .senderCompanyName("Sender Co")
                .recipientCompanyName("Recipient Co")
                .status(com.example.b2b.model.ContractStatus.INVITED)
                .build();

        when(contractService.getContractByUuid(eq(uuid), any())).thenReturn(response);

        mockMvc.perform(get("/api/v1/contracts/" + uuid))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.uuid").value(uuid.toString()))
                .andExpect(jsonPath("$.senderCompanyName").value("Sender Co"))
                .andExpect(jsonPath("$.status").value("INVITED"));

        SecurityContextHolder.clearContext();
    }

    @Test
    void getContract_NotFound_ReturnsInternalError() throws Exception {
        User user = User.builder().email("test@example.com").build();
        authenticate(user);

        UUID uuid = UUID.randomUUID();
        when(contractService.getContractByUuid(eq(uuid), any())).thenThrow(new IllegalArgumentException("Contract not found"));

        mockMvc.perform(get("/api/v1/contracts/" + uuid))
                .andExpect(status().isInternalServerError());

        SecurityContextHolder.clearContext();
    }

    @Test
    void counterOffer_Success() throws Exception {
        User user = User.builder().email("test@example.com").build();
        authenticate(user);

        CounterOfferRequest request = new CounterOfferRequest();
        request.setTitle("Counter");
        request.setDescription("Desc");
        request.setPrice(BigDecimal.TEN);
        request.setCurrency("USD");
        request.setDeadline(LocalDateTime.now().plusDays(1));

        when(contractService.counterOffer(any(), any(), any())).thenReturn(new ContractResponse());

        mockMvc.perform(post("/api/v1/contracts/" + UUID.randomUUID() + "/counter-offer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        SecurityContextHolder.clearContext();
    }

    private void authenticate(User user) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
