import React from 'react';
import { useParams } from 'react-router';

const Game = () => {
  const { id } = useParams();

  return <div>Game</div>;
};

export default Game;
