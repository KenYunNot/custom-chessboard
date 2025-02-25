import React from 'react'
import type { Move } from 'chess.js';
import { cn } from '../utils/cn';


type MoveHistoryProps = {
  history: Move[];
  currentFen: string;
  viewPastBoardState: (move: Move) => void;
}

const MoveHistory = ({ 
  history,
  currentFen,
  viewPastBoardState,
} : MoveHistoryProps) => {

  const groupMoveHistoryByTurn = (history: Move[]) => {
    const result = [];
    for (let i = 0; i < history.length/2; i++) {
      result.push([history[i*2], history[i*2+1]]);
    }
    return result;
  }

  return (
    <div 
      className='flex flex-col w-80 h-full py-5 px-8 bg-[#262421] text-white font-semibold'
    >
      {!history.length && (
        <div className='flex items-center justify-center h-full'>
          Make a move!
        </div>
      )}
      {groupMoveHistoryByTurn(history).map((turn, index) => {
        const [white, black] = turn;
        return (
          <div key={index} className='flex gap-5'>
            <span className='mr-5'>{`${index+1}.`}</span>
            <div className='w-14'>
              <button 
                className={cn('w-fit px-1 rounded-md border-b-4 border-transparent', {
                  'bg-gray-600 border-gray-500' : white.after === currentFen,
                })}
                onClick={() => viewPastBoardState(white)}
                disabled={white.after === currentFen}
              >
                {white.san}
              </button>
            </div>
            {black && (
              <div className='w-14'>
                <button 
                  className={cn('w-fit px-1 rounded-md border-b-4 border-transparent', {
                    'bg-gray-600 border-gray-500' : black.after === currentFen,
                  })}
                  onClick={() => viewPastBoardState(black)}
                  disabled={black.after === currentFen}
                >
                  {black.san}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(MoveHistory)