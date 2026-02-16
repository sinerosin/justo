import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../apiService/api';
import { Game } from '../game';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-liga',
  standalone: true,
  templateUrl: './liga.component.html',
  styleUrls: ['./liga.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LigaComponent implements OnInit {
  public teams: any[] = [];
  public jornadaPartidos: Game[] = [];
  public currentJornada: number = 1; 
  public maxJornada: number = 38;
  public realCurrentJornada: number = 1; 
  private Loanding: boolean = false;
  public currentUser: any = {};

  private readonly escudos: { [key: string]: string } = {
    'Real Madrid': 'real_madrid.png', 'FC Barcelona': 'fc_barcelona.png',
    'Atlético Madrid': 'atletico.png', 'Real Sociedad': 'real_sociedad.png',
    'Villarreal': 'villarreal.png', 'Sevilla FC': 'sevilla.png',
    'Real Betis': 'betis.png', 'Athletic Club': 'athletic.png',
    'Girona FC': 'girona.png', 'Valencia CF': 'valencia.png',
    'Osasuna': 'osasuna.png', 'Getafe CF': 'getafe.png',
    'Rayo Vallecano': 'rayo.png', 'RCD Mallorca': 'mallorca.png',
    'Celta de Vigo': 'celta.png', 'UD Almería': 'almeria.png',
    'Granada CF': 'granada.png', 'Cádiz CF': 'cadiz.png',
    'Deportivo Alavés': 'alaves.png', 'UD Las Palmas': 'las_palmas.png'
  };

  constructor(public api: Api, public router: Router) {}

  async ngOnInit() {
    await this.loadUserData();
    this.loadStandings();
    this.initJornada();
  }

  async loadUserData() {
    const { value } = await Preferences.get({ key: 'user' });
    if (value) {
      const user = JSON.parse(value);
      this.currentUser = {
        username: user.username,
        profPicture: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
      };
    }
  }

  loadStandings() {
    this.api.getStandings().subscribe(res => {
      this.teams = res;
    });
  }

  initJornada() {
    this.api.getGames().subscribe(res => {
      if(res.length > 0) {
        this.realCurrentJornada = Math.max(...res.map(g => g.jornada));
        this.currentJornada = this.realCurrentJornada;
        this.loadJornadaResults(this.currentJornada);
      }
    });
  }

  changeJornada(lim: number) {
  const nuevaJornada = this.currentJornada + lim;
  if (nuevaJornada >= 1 && nuevaJornada <= this.maxJornada) {
    this.currentJornada = nuevaJornada; 
    this.loadJornadaResults(this.currentJornada); 
  }
}

loadJornadaResults(n: number) {
  this.Loanding = true; 
  this.api.getJornadaResults(n).subscribe({
    next: (res) => {
      this.jornadaPartidos = res; 
      this.Loanding = false;
    },
    error: (err) => {
      console.error('Error al cargar la jornada', err);
      this.Loanding = false;
    }
  });
}

  getEscudo(teamName: string): string {
    return `assets/equipos/${this.escudos[teamName] || 'default.png'}`;
  }

  navigateTo(path: string) { this.router.navigate([path]); }
  async logout() { await this.api.logout(); this.router.navigate(['/login']); }
}