package com.example.b2b.contract;

import com.example.b2b.contract.ContractCreateRequest;
import com.example.b2b.contract.ContractResponse;
import com.example.b2b.contract.CounterOfferRequest;
import com.example.b2b.contract.ContractStatus;
import com.example.b2b.user.User;
import com.example.b2b.contract.ContractService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @GetMapping
    public Map<String, List<ContractResponse>> getContracts(@AuthenticationPrincipal User user) {
        return Map.of("content", contractService.getUserContracts(user));
    }

    @GetMapping("/{uuid}")
    public ContractResponse getContract(@AuthenticationPrincipal User user, @PathVariable UUID uuid) {
        return contractService.getContractByUuid(uuid, user);
    }

    @PostMapping("/{uuid}/counter-offer")
    public ContractResponse counterOffer(@AuthenticationPrincipal User user, @PathVariable UUID uuid, @Valid @RequestBody CounterOfferRequest request) {
        return contractService.counterOffer(uuid, request, user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContractResponse createContract(@AuthenticationPrincipal User user, @Valid @RequestBody ContractCreateRequest request) {
        return contractService.createContract(request, user);
    }

    @PatchMapping("/{uuid}/status")
    public ContractResponse updateStatus(@AuthenticationPrincipal User user, @PathVariable UUID uuid, @RequestBody Map<String, String> statusUpdate) {
        String statusStr = statusUpdate.get("status");
        ContractStatus status = ContractStatus.valueOf(statusStr);
        return contractService.updateContractStatus(uuid, status, user);
    }
}


