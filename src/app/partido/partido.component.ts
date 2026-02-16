import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../apiService/api';
import { Game } from '../game';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-partido',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.scss'],
})
export class PartidoComponent implements OnInit {
  public game?: Game;
  public standings: any[] = [];
  public currentUser: any = { username: 'alex', avatar: 'person-circle-outline', points: 0 };
  public saveBet: boolean = false;
  
  public betData = {
    home: 0,
    away: 0
  };

  private readonly logos: { [key: string]: string } = {
    'Athletic Club': 'athletic.png', 'Atlético Madrid': 'atletico.png',
    'Cádiz CF': 'cadiz.png', 'Celta de Vigo': 'celta.png',
    'Deportivo Alavés': 'alaves.png', 'FC Barcelona': 'fc_barcelona.png',
    'Getafe CF': 'getafe.png', 'Girona FC': 'girona.png',
    'Granada CF': 'granada.png', 'Osasuna': 'osasuna.png',
    'Rayo Vallecano': 'rayo.png', 'RCD Mallorca': 'mallorca.png',
    'Real Betis': 'betis.png', 'Real Madrid': 'real_madrid.png',
    'Real Sociedad': 'real_sociedad.png', 'Sevilla FC': 'sevilla.png',
    'UD Almería': 'almeria.png', 'UD Las Palmas': 'las_palmas.png',
    'Valencia CF': 'valencia.png', 'Villarreal': 'villarreal.png'
  };

  constructor(
    private route: ActivatedRoute,
    public api: Api,
    public router: Router
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatchDetails(Number(id));
    }
    await this.loadUserData();
    this.loadStandings();
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

  loadMatchDetails(id: number) {
    this.api.getMatchById(id).subscribe(res => {
      this.game = res;
    });
  }

  loadStandings() {
    this.api.getStandings().subscribe( {
      next: (res) => {
      this.standings = res; 
    },
    error: (err) => console.error('Error cargando clasificación', err)
    });
  }

  enviarApuesta() {
    if (!this.game) return;
    this.saveBet = true;

    const payload = {
      userId: this.currentUser.id,
      matchId: this.game.id,
      homeScore: this.betData.home,
      awayScore: this.betData.away
    };

    this.api.postBet(payload).subscribe({
      next: () => {
        alert('¡Apuesta realizada! Suerte.');
        this.saveBet = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        alert(err.error.error || 'Error al apostar');
        this.saveBet = false;
      }
    });
  }

  getEscudo(team: string): string {
    const file = this.logos[team] || 'default.png';
    return `assets/equipos/${file}`;
  }

  navigateTo(path: string) { this.router.navigate([path]); }
  async logout() { await this.api.logout(); this.router.navigate(['/login']); }
}