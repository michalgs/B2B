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
        // contract.md specifies response as { "content": [...] }
        return Map.of("content", contractService.getUserContracts());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContractResponse createContract(@Valid @RequestBody ContractCreateRequest request) {
        return contractService.createContract(request);
    }
}
