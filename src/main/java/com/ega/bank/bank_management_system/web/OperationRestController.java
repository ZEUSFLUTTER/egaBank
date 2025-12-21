package com.ega.bank.bank_management_system.web;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.ega.bank.bank_management_system.dto.OperationDto;
import com.ega.bank.bank_management_system.entities.Operation;
import com.ega.bank.bank_management_system.servives.OperationService;

@RestController
@RequestMapping(value="/api/v1")
@CrossOrigin("*")
public class OperationRestController {
    
    private final OperationService operationService;

    public OperationRestController(final OperationService operationService){
        this.operationService = operationService;
    }

    @PostMapping("/operations/versement")
    public Object effectuerVersement(@RequestBody OperationDto dto){
        return this.operationService.effectuerVersement(dto);
    }

    @PostMapping("/operations/retrait")
    public Object effectuerRetrait(@RequestBody OperationDto dto){
        return this.operationService.effectuerRetrait(dto);
    }

    @PostMapping("/operations/virement")
    public boolean virement(@RequestBody OperationDto dto){
        return this.operationService.effectuerVirement(dto);
    }

    @GetMapping("/operations/client/{numCompte}")
    public List<Operation> findAllOperationByClient(@PathVariable("numCompte") String numCompte){
        return this.operationService.findByClientNumCompte(numCompte);
    }
}