import { Component, OnInit } from '@angular/core';
import{IonicModule} from '@ionic/angular';
import { Api } from '../apiService/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-registro',
  imports: [IonicModule,CommonModule, 
    FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent   {

  constructor(private api: Api, private router: Router) {}
  userData = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  };
  onRegister() {
    if(!this.userData.username||!this.userData.email||!this.userData.password||!this.userData.passwordConfirmation){
      alert('Por favor, rellena todos los campos');
      return
    }
    this.api.register(this.userData).subscribe({
      next: (res)=> {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert('Error al registrar');
      }
    });
  }
  navigateToLogin(){
    this.router.navigate(['/login']);
  }

}
