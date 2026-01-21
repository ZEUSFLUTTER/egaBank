package com.ega.bank.bank_management_system.web;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.ega.bank.bank_management_system.dto.OperationDto;
import com.ega.bank.bank_management_system.entities.Operation;
import com.ega.bank.bank_management_system.servives.OperationService;

@RestController
@RequestMapping(value="/api/v1")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class OperationRestController {
    
    private final OperationService operationService;

    public OperationRestController(final OperationService operationService){
        this.operationService = operationService;
    }

    @PostMapping("/operations/versement")
    public Object effectuerVersement(@RequestBody OperationDto dto){
        this.operationService.effectuerVersement(dto);
        return true;
    }

    @PostMapping("/operations/retrait")
    public Object effectuerRetrait(@RequestBody OperationDto dto){
        this.operationService.effectuerRetrait(dto);
        return true;
    }

    @GetMapping("/operations/test")
    public String test(){
        return "Operations endpoint is working!";
    }

    @PostMapping("/operations/virement")
    public boolean virement(@RequestBody OperationDto dto){
        System.out.println("=== VIREMENT CONTROLLER ===");
        System.out.println("Virement endpoint called with: " + dto);
        System.out.println("Amount: " + dto.getAmount());
        System.out.println("Source: " + dto.getNumCompteSource());
        System.out.println("Destination: " + dto.getNumCompteDestination());
        
        try {
            boolean result = this.operationService.effectuerVirement(dto);
            System.out.println("Virement result: " + result);
            return result;
        } catch (Exception e) {
            System.err.println("Error in virement controller: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/operations/virement-test")
    public String virementTest(@RequestBody OperationDto dto){
        System.out.println("=== VIREMENT TEST ===");
        System.out.println("DTO received: " + dto);
        return "DTO received successfully: " + dto.toString();
    }

    @GetMapping("/operations/client/{numCompte}")
    public List<Operation> findAllOperationByClient(@PathVariable("numCompte") String numCompte){
        return this.operationService.findByClientNumCompte(numCompte);
    }
}