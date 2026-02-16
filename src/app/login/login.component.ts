import { Component, OnInit } from '@angular/core';
import{IonicModule} from '@ionic/angular';
import { Api } from '../apiService/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule,CommonModule, 
    FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  {

  constructor(private api: Api, private router: Router) {}

  usuarioData = {
    email: '',
    password: '',
  };
  passwordBlind = true;

    onLogin(){
    if(!this.usuarioData.email||!this.usuarioData.password){
      alert('Por favor, rellena todos los campos');
      return
    }
    this.api.login(this.usuarioData).subscribe({
      next: (res)=> {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert('Error al iniciar sesión');
      }
    });
}
  navigateToRegister(){
    this.router.navigate(['/registro']);
  }
  togglePassword() {
    this.passwordBlind = !this.passwordBlind;
  }
}
