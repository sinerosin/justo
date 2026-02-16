export interface Game {
    id: number;
    jornada: number;
    home: string;
    away: string;
    homeScore: number;
    awayScore: number;
    status: 'live' | 'pending' | 'finished';
    time: string;
    league: string;
    events: GameDay[];
    minute?: number;
}
export interface GameDay {
    type: string;
    team: string;
    player: string;
    playerId: number;
    playerAvatar: string;
    minute: number;
    score: string;
}
