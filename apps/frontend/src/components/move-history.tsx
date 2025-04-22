import React from 'react';
import type { Move } from 'chess.js';
import { cn } from '@/lib/utils';

type MoveHistoryProps = {
  history: Move[];
  currentFen: string;
  viewPastBoardState: (move: Move) => void;
};

const MoveHistory = ({ history, currentFen, viewPastBoardState }: MoveHistoryProps) => {
  const groupMoveHistoryByTurn = (history: Move[]) => {
    const result = [];
    for (let i = 0; i < history.length / 2; i++) {
      result.push([history[i * 2], history[i * 2 + 1]]);
    }
    return result;
  };

  return (
    <div className='flex flex-col w-[550px] min-w-80 h-full py-5 px-8 bg-body-foreground text-white font-semibold rounded-md'>
      {!history.length && (
        <div className='flex items-center justify-center h-full'>Make a move!</div>
      )}
      {groupMoveHistoryByTurn(history).map((turn, index) => {
        const [white, black] = turn;
        return (
          <div
            key={index}
            className='flex gap-5'
          >
            <span className='mr-5'>{`${index + 1}.`}</span>
            <MoveButton
              move={white}
              currentFen={currentFen}
              viewPastBoardState={viewPastBoardState}
            />
            {black && (
              <MoveButton
                move={black}
                currentFen={currentFen}
                viewPastBoardState={viewPastBoardState}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const MoveButton = ({
  move,
  currentFen,
  viewPastBoardState,
}: {
  move: Move;
  currentFen: string;
  viewPastBoardState: MoveHistoryProps['viewPastBoardState'];
}) => {
  return (
    <div className='w-14'>
      <button
        className={cn('w-fit px-1 rounded-sm border-b-4 border-transparent', {
          'bg-gray-600 border-gray-500': move.after === currentFen,
        })}
        onClick={() => viewPastBoardState(move)}
        disabled={move.after === currentFen}
      >
        {move.san}
      </button>
    </div>
  );
};

export default React.memo(MoveHistory);
