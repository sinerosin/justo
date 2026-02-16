import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Observable, tap, from, switchMap } from 'rxjs';
import { Game } from '../game';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  constructor(private http: HttpClient) {}


  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(async (res) => {
        if (res && res.token) {
          await Preferences.set({ key: this.TOKEN_KEY, value: res.token });
          await Preferences.set({
            key: this.USER_KEY,
            value: JSON.stringify(res.user),
          });
        }
      })
    );
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
    await Preferences.remove({ key: this.USER_KEY });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }


  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/matches`);
  }

  getMatchById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/matches/${id}`);
  }

  getStandings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/league/standings`);
  }

  getJornadaResults(jornada: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/league/results/${jornada}`);
  }


  postBet(betData: { userId: number, matchId: number, homeScore: number, awayScore: number }): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/bets`, betData, { headers });
      })
    );
  }

  getUserBets(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bets/user/${userId}`);
  }


  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard`);
  }

  getTopScorers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/players/top-scorers`);
  }

  getTeamPlayers(teamName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/teams/${teamName}/players`);
  }


  updateUserProfile(userId: number, data: { username?: string, avatar?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}`, data);
  }

}