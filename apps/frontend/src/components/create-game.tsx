import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { socket } from '@/lib/socket';
import { cn } from '@/lib/utils';
import type { Category, TimeControl } from '@/lib/types';
import { useUser } from '@clerk/clerk-react';

const timeSignatures = {
  bullet: [
    { category: 'bullet', time: 1, increment: 0, text: '1 min' },
    { category: 'bullet', time: 1, increment: 1, text: '1 | 1' },
    { category: 'bullet', time: 2, increment: 1, text: '2 | 1' },
  ],
  blitz: [
    { category: 'blitz', time: 3, increment: 0, text: '3 min' },
    { category: 'blitz', time: 3, increment: 2, text: '3 | 2' },
    { category: 'blitz', time: 5, increment: 0, text: '5 min' },
  ],
  rapid: [
    { category: 'rapid', time: 10, increment: 0, text: '10 min' },
    { category: 'rapid', time: 15, increment: 10, text: '15 | 10' },
    { category: 'rapid', time: 30, increment: 0, text: '30 min' },
  ],
} as { [key in Category]: Array<TimeControl> };

const CreateGameDialog = () => {
  const { user } = useUser();
  const [timeControl, setTimeControl] = React.useState<TimeControl>({
    category: 'rapid',
    time: 10,
    increment: 0,
    text: '10 min',
  });

  const connect = () => {
    socket.auth = { userId: user?.id };
    socket.timeControl = timeControl;
    socket.connect();
  };

  return (
    <Dialog>
      <DialogTrigger className='w-36 h-12 bg-accent-primary text-white text-shadow-xs text-shadow-neutral-500 font-semibold rounded-md hover:bg-accent-secondary hover:cursor-pointer'>
        Create Game
      </DialogTrigger>
      <DialogContent className='bg-body-background text-white border-body-background'>
        <DialogHeader>
          <DialogTitle className='font-semibold text-lg'>Create a game</DialogTitle>
          <DialogDescription>Select a time control</DialogDescription>
        </DialogHeader>
        <div className='w-full'>
          {Object.entries(timeSignatures).map(([category, options]) => {
            return (
              <div
                key={category}
                className='w-full mt-3'
              >
                <p className='font-semibold'>
                  {category.charAt(0).toUpperCase()}
                  {category.slice(1)}
                </p>
                <div className='mt-1 flex gap-3'>
                  {options.map((option, i) => (
                    <button
                      key={i}
                      className={cn(
                        'w-1/3 py-3 bg-neutral-700 font-semibold rounded-sm hover:bg-neutral-600 hover:cursor-pointer',
                        {
                          'inset-shadow-[0_0_0_2px] inset-shadow-accent-primary':
                            timeControl.time === option.time &&
                            timeControl.increment === option.increment,
                        }
                      )}
                      onClick={() => setTimeControl(option)}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <button
            className='w-full mt-5 py-4 font-bold bg-accent-primary rounded-md border-b-6 border-b-accent-secondary text-xl text-shadow-sm text-shadow-neutral-500 hover:brightness-[1.15] hover:cursor-pointer active:brightness-100'
            onClick={connect}
          >
            Play
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameDialog;
