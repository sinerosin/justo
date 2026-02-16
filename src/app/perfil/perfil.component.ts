import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../apiService/api';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector:' app-perfil',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  public currentUser: any = { id: null, username: '', avatar: 'person-outline', points: 0 };
  public newUsername: string = '';
  public selectedAvatar: string = '';

  public avatarOptions: string[] = [
    'person', 'star', 'trophy', 'sports_soccer', 'people', 'rocket',
     'local_fire_department'
  ];

  constructor(public api: Api, public router: Router) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    const { value } = await Preferences.get({ key: 'user' });
    if (value) {
      const user = JSON.parse(value);
      this.currentUser = {
        ...user,
        username: user.username,
        profPicture: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
      };
      this.newUsername = user.username;
      this.selectedAvatar = user.avatar || 'person';
    }
  }
  

  selectAvatar(icon: string) {
    this.selectedAvatar = icon;
  }

  async saveChanges() {
    if (!this.newUsername.trim()) {
      alert('El nombre de usuario no puede estar vacío');
      return;
    }

    const updateData = {
      username: this.newUsername,
      avatar: this.selectedAvatar
    };

    this.api.updateUserProfile(this.currentUser.id, updateData).subscribe({
      next: async (updatedUser) => {
        await Preferences.set({
          key: 'user',
          value: JSON.stringify(updatedUser)
        });
        
        this.currentUser = updatedUser;
        alert('Perfil actualizado con éxito');
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar el perfil');
      }
    });
  }

  navigateTo(path: string) { this.router.navigate([path]); }
  async logout() { await this.api.logout(); this.router.navigate(['/login']); }
}