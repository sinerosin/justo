import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Api } from '../apiService/api';
import { Router, RouterLink } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  public leaderboard: any[] = [];
  public topThree: any[] = [];
  public restOfUsers: any[] = [];
  public currentUser: any = {};

  constructor(public api: Api, public router: Router) {}

  async ngOnInit() {
    await this.loadUserData();
    this.loadRanking();
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
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  loadRanking() {
    this.api.getLeaderboard().subscribe({
      next: (res) => {
        this.leaderboard = res;

        this.topThree = res.slice(0, 3);
        this.restOfUsers = res.slice(3);
      },
      error: (err) => console.error('Error cargando ranking', err)
    });
  }

  async logout() {
    await this.api.logout();
    this.router.navigate(['/login']);
  }
}