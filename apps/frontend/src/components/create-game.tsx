import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './shadcn/dialog';

const bullet = [
  { time: 1, increment: 0 },
  { time: 1, increment: 1 },
  { time: 2, increment: 1 },
];

const blitz = [
  { time: 3, increment: 0 },
  { time: 3, increment: 2 },
  { time: 5, increment: 0 },
];

const rapid = [
  { time: 10, increment: 0 },
  { time: 15, increment: 10 },
  { time: 30, increment: 0 },
];

const CreateGame = () => {
  return (
    <Dialog>
      <DialogTrigger className='w-36 h-12 bg-accent-primary text-white text-shadow-xs text-shadow-neutral-500 font-semibold rounded-md hover:bg-accent-secondary hover:cursor-pointer'>
        Create Game
      </DialogTrigger>
      <DialogContent className='bg-body-background text-white border-body-background'>
        <DialogHeader className='text-xl font-semibold'>
          <DialogTitle>Create a game</DialogTitle>
        </DialogHeader>
        <div></div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGame;
