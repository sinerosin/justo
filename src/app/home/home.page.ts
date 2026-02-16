import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Game } from '../game';
import { Preferences } from '@capacitor/preferences';
import { Api } from '../apiService/api';

@Component({
  selector: 'app-home',
  standalone: true, 
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit, OnDestroy {
  public games: Game[] = [];
  public gamesFilter: Game[] = [];
  public currentJornada: number = 0;
  public filter: string = 'all';
  public search: string = '';
  public Loanding: boolean = false;
  public fecha: Date = new Date();
  private timer: any;

  public currentUser: any = {
    username: 'Invitado',
    profPicture: 'assets/default.png',
  };

  private readonly escudos: { [key: string]: string } = {
    'Real Madrid': 'real_madrid.png',
    'FC Barcelona': 'fc_barcelona.png',
    'Atlético Madrid': 'atletico.png',
    'Real Sociedad': 'real_sociedad.png',
    'Villarreal': 'villarreal.png',
    'Sevilla FC': 'sevilla.png',
    'Real Betis': 'betis.png',
    'Athletic Club': 'athletic.png',
    'Girona FC': 'girona.png',
    'Valencia CF': 'valencia.png',
    'Osasuna': 'osasuna.png',
    'Getafe CF': 'getafe.png',
    'Rayo Vallecano': 'rayo.png',
    'RCD Mallorca': 'mallorca.png',
    'Celta de Vigo': 'celta.png',
    'UD Almería': 'almeria.png',
    'Granada CF': 'granada.png',
    'Cádiz CF': 'cadiz.png',
    'Deportivo Alavés': 'alaves.png',
    'UD Las Palmas': 'las_palmas.png'
  };

  constructor(private api: Api, public router: Router) {}

  async ngOnInit() {
    await this.loadUserData();
    this.loadGames();
    
    this.timer = setInterval(() => {
      this.fecha = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
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

  loadGames() {
    this.Loanding = true;
    this.api.getGames().subscribe({
      next: (res) => {
        this.games = res;
        if(this.games.length > 0) {
           this.currentJornada = Math.max(...this.games.map(g => g.jornada));
        }
        this.filters();
        this.Loanding = false;
      },
      error: () => {
        this.Loanding = false;
      }
    });
  }

  setFilter(type: string) {
    this.filter = type;
    this.filters();
  }

  filters() {
    const searchTerm = this.search.toLowerCase();
    
    this.gamesFilter = this.games.filter((game) => {
      const isCurrentJornada = game.jornada === this.currentJornada;
      const matchesSearch = game.home.toLowerCase().includes(searchTerm) || 
                            game.away.toLowerCase().includes(searchTerm);
      const matchesStatus = this.filter === 'all' || game.status === this.filter;

      return isCurrentJornada && matchesSearch && matchesStatus;
    });
  }

  getEscudos(equipo: string): string {
    const file = this.escudos[equipo] || 'default.png';
    return `assets/equipos/${file}`;
  }

  getLastGoal(game: Game) {
    if (!game.events || game.events.length === 0) return null;
    return [...game.events].reverse().find(e => e.type === 'goal' || e.type === 'Gol');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  async logout() {
    await this.api.logout();
    this.router.navigate(['/login']);
  }
  navigateToGame(id: number) {
    this.router.navigate(['/partido', id]);
  }
  viewDetails(gameId: number) {
    this.router.navigate(['/partido', gameId]);
  }
}