# Custom Chessboard

The current state of this project is a a simple interactive chessboard (modeled after [Chessboard.jsx](https://github.com/willb335/chessboardjsx)) integrated with [chess.js](https://github.com/jhlywa/chess.js) for move validation. [Future goals](#future-goals) include integrating with [Stockfish](https://stockfishchess.org/) to create an analysis tool or player vs engine functionality and implementing multiplayer functionality.

## How to run the project

### Install dependencies

```
npm i
# or
pnpm i
```

### Run in development mode

```
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Future goals

- ~~Drawing arrows~~
  - ~~Change shape for knight moves~~
- Piece animations when viewing move history (like [chess.com](https://www.chess.com))
- Integrate [Stockfish](https://stockfishchess.org/)
  - Analysis tool
  - Game Review
  - Player vs. Engine
- Multiplayer functionality
