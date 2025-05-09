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

const CreateGameDialog = ({ isConnected }: { isConnected: boolean }) => {
  const { user } = useUser();
  const [timeControl, setTimeControl] = React.useState<TimeControl>({
    category: 'rapid',
    time: 10,
    increment: 0,
    text: '10 min',
  });
  const [open, setOpen] = React.useState<boolean>(false);

  const connect = () => {
    const sessionId = localStorage.getItem('sessionId');
    socket.auth = { userId: user?.id, sessionId };
    socket.timeControl = timeControl;
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) disconnect();
        setOpen(open);
      }}
    >
      <DialogTrigger className='w-36 h-12 bg-accent-primary text-white text-shadow-xs text-shadow-neutral-500 font-semibold rounded-md hover:bg-accent-secondary hover:cursor-pointer'>
        Create Game
      </DialogTrigger>
      <DialogContent className='bg-body-background text-white border-body-background'>
        <DialogHeader>
          <DialogTitle className='font-semibold text-lg'>Play a game</DialogTitle>
          <DialogDescription>
            {isConnected ? 'Finding a game...' : 'Select a time control'}
          </DialogDescription>
        </DialogHeader>
        <div className='w-full'>
          <div
            className={cn({
              'brightness-80 pointer-events-none': isConnected,
            })}
          >
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
          </div>
          {!isConnected && (
            <button
              className='w-full mt-5 py-4 font-bold bg-accent-primary rounded-md border-b-6 border-b-accent-secondary text-xl text-shadow-sm text-shadow-neutral-500 hover:brightness-[1.15] hover:cursor-pointer active:brightness-100'
              onClick={connect}
            >
              Play
            </button>
          )}
          {isConnected && (
            <button
              className='w-full mt-5 py-4 font-bold bg-neutral-500 rounded-md border-b-6 border-b-neutral-600 text-xl text-shadow-sm text-shadow-neutral-500 hover:brightness-[1.15] hover:cursor-pointer active:brightness-100'
              onClick={disconnect}
            >
              Cancel
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameDialog;
