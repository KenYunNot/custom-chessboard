export type Game = {
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

  saveGame(game: Game) {
    let id = Math.ceil(Math.random() * 10000000).toString();
    while (this.findGame(id)) id = Math.ceil(Math.random() * 10000000).toString();
    this.games.set(id, game);
    return id;
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
