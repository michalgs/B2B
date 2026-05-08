package com.example.b2b.controller;

import com.example.b2b.dto.ContractCreateRequest;
import com.example.b2b.dto.ContractResponse;
import com.example.b2b.service.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @GetMapping
    public Map<String, List<ContractResponse>> getContracts() {
        List<ContractResponse> contracts = contractService.getUserContracts();
        System.out.println("DEBUG: Returning " + contracts.size() + " contracts. First status: " + 
            (contracts.isEmpty() ? "none" : contracts.get(0).getStatus()));
        return Map.of("content", contracts);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContractResponse createContract(@Valid @RequestBody ContractCreateRequest request) {
        ContractResponse response = contractService.createContract(request);
        System.out.println("DEBUG: Created contract with status: " + response.getStatus());
        return response;
    }
}
