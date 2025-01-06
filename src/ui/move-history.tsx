import React from 'react'

const MoveHistory = ({ 
  history,
} : {
  history: string[],
}) => {

  const groupMoveHistoryByTurn = (history: string[]) => {
    const result = [];
    for (let i = 0; i < history.length/2; i++) {
      result.push([history[i*2], history[i*2+1]]);
    }
    return result;
  }

  return (
    <div className='flex flex-col w-80 h-full py-5 px-8 bg-gray-700 text-white font-semibold'>
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
            <div className='w-20'>{white}</div>
            <div className='w-20'>{black}</div>
          </div>
        )
      })}
    </div>
  )
}

export default React.memo(MoveHistory)