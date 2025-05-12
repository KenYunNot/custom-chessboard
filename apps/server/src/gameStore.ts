type Player = {
  id: string;
  timer: Array<number>;
};

export type Game = {
  id: string;
  time: number;
  increment: number;
  playerWhite: Player;
  playerBlack: Player;
};

export class GameStore {
  games;

  constructor() {
    this.games = new Map();
  }

  findGame(id: string) {
    return this.games.get(id);
  }

  saveGame(id: string, game: Game) {
    this.games.set(id, game);
  }

  removeGame(id: string) {
    this.games.delete(id);
  }
}
