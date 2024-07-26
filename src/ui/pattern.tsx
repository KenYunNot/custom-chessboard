import React from 'react'

const Pattern = () => {
  
  return (
    <svg className='absolute w-full h-full'>
      {[...Array(64)].map((_, i) => {
        const row = Math.floor(i/8);
        const column = i%8;
        const isLight = Boolean((row + column) % 2);
        return (
          <rect 
            className='w-[12.5%] h-[12.5%]'
            x={`${12.5 * column}%`}
            y={`${12.5 * row}%`}
            fill={isLight ? '#ebecd0' : '#739552'}
          />
        )
      })}
    </svg>
  )
}

export default Pattern