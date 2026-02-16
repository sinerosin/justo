import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Api } from '../apiService/api';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
})
export class HistorialComponent implements OnInit {
  public userBets: any[] = [];
  public currentUser: any = { username: 'alex', points: 0, avatar: 'person-circle-outline' };
  
  public stats = {
    totalPoints: 0,
    winRate: 0,
    totalBets: 0
  };

  constructor(public api: Api, public router: Router) {}

  async ngOnInit() {
    await this.loadUserData();
    this.loadHistory();
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

  loadHistory() {
    this.api.getUserBets(this.currentUser.id).subscribe({
      next: (bets) => {
        this.userBets = bets.reverse(); 
        this.calculateStats(bets);
      }
    });
  }

  calculateStats(bets: any[]) {
    this.stats.totalBets = bets.length;
    this.stats.totalPoints = bets.reduce((acc, bet) => acc + (bet.pointsEarned || 0), 0);
    const finishedBets = bets.filter(b => b.match && b.match.status === 'finished');
    const wonBets = finishedBets.filter(b => b.pointsEarned > 0);
    
    this.stats.winRate = finishedBets.length > 0 
      ? Math.round((wonBets.length / finishedBets.length) * 100) 
      : 0;
  }

  getEscudo(team: string) {
    return `assets/escudos/${team.toLowerCase().replace(/ /g, '_')}.png`;
  }

  navigateTo(path: string) { this.router.navigate([path]); }
  async logout() { await this.api.logout(); this.router.navigate(['/login']); }
}