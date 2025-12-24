import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Obligatoire
import { ClientService } from '../../../../../core/services/client.service';
import { Client } from '../../../../../core/models/client';
import { error } from 'console';
import { FormCompte } from "./form-compte/form-compte";


@Component({
  selector: 'app-form-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormCompte],
  templateUrl: './form-client.html',
  styleUrl: './form-client.scss',
})
export class FormClient implements OnInit {
  public customerForm!: FormGroup;
  public submitted = false;
  public isSuccessed = false;
  public idClient : number =0;
  public name : string = '';
  public showCompteForm : boolean= false;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({

      firstName: ['', [Validators.required,]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      sexe: ['', [Validators.required]],
      address: ['', [Validators.required]],
      nationalite: ['',[Validators.required]]
    });
  }

  get fb() : any{
    return this.customerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.customerForm.invalid) {
      return;
    }
    else{
      this.clientService.postClients(<Client>{
        nom : this.fb.firstName.value,
        prenom : this.fb.lastName.value,
        email : this.fb.email.value,
        telephone : this.fb.telephone.value,
        birthday : this.fb.birthday.value?.replace("/","-"),
        sexe : this.fb.sexe.value,
        address : this.fb.address.value,
        nationalite : this.fb.nationalite.value,
      }).subscribe({
        next:(client : Client) =>{
          this.idClient = client.id;
          this.name = this.fb.firstName.value + '' + this.fb.lastName.value;
          this.isSuccessed = true;
          this.showCompteForm = true;
        },
        error : (error) =>{
          console.error(error);
        }
      })
    }
  }
}
