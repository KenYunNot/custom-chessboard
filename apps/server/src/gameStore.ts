export type Game = {
  id: string;
  fen: string;
  playerWhiteId: string;
  playerBlackId: string;
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

  updateFen(id: string, fen: string) {
    const updatedGame = { ...this.findGame(id) };
    updatedGame.fen = fen;
    this.games.set(id, updatedGame);
  }

  removeGame(id: string) {
    this.games.delete(id);
  }
}
