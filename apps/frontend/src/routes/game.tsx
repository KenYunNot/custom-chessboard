import React from 'react';
import { useParams } from 'react-router';

const Game = () => {
  const { gameId } = useParams();

  return <div>{gameId}</div>;
};

export default Game;
