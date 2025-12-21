package com.ega.bank.bank_management_system.web;

import org.springframework.web.bind.annotation.*;
import com.ega.bank.bank_management_system.dto.ClientDto;
import com.ega.bank.bank_management_system.entities.Client;
import com.ega.bank.bank_management_system.servives.ClientService;

import java.util.List;

@RestController
@RequestMapping(value="/api/v1")
@CrossOrigin("*")
public class ClientRestController {

    private final ClientService clientService;
    
    public ClientRestController(final ClientService clientService){
        this.clientService = clientService;
    }

    @PostMapping("/clients")
    public void createClient(@RequestBody ClientDto dto){
        this.clientService.createNewClient(dto);
    }

    @GetMapping("/clients")
    public List<Client> findAll(){
        return this.clientService.findAll();
    }

    @GetMapping("/clients/{id}")
    public Client findOne(@PathVariable("id") long id){
        return this.clientService.findOne(id);
    }
}