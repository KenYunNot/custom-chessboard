import React from 'react';
import { useNavigate } from 'react-router';
import { Chess, type Move, type Square } from 'chess.js';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Board from '@/components/board';
import MoveHistory from '@/components/move-history';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { socket } from './lib/socket';
import { cn } from './lib/utils';

type Category = 'bullet' | 'blitz' | 'rapid';

type TimeControl = {
  category: Category;
  time: number;
  increment: number;
  text: string;
};

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

function App() {
  const navigate = useNavigate();
  const chess = React.useMemo(() => new Chess(), []);
  const [fen, setFen] = React.useState(chess.fen());
  const [isBoardFlipped, _] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState<boolean>(socket.connected);
  const [open, setOpen] = React.useState<boolean>(false);
  const [timeControl, setTimeControl] = React.useState<TimeControl>({
    category: 'rapid',
    time: 10,
    increment: 0,
    text: '10 min',
  });

  React.useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit('find-game', timeControl);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onPlayGame = (gameId: number) => {
      navigate(`/game/${gameId}`);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('play-game', onPlayGame);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('play-game', onPlayGame);
    };
  }, []);

  const onDrop = (from: Square, to: Square) => {
    try {
      if (fen !== chess.fen()) return;
      // const _ = chess.move({
      chess.move({
        from,
        to,
        promotion: 'q',
      });
      setFen(chess.fen());
    } catch (error) {}
  };

  const viewPastBoardState = (move: Move) => {
    setFen(move.after);
  };

  return (
    <div className='w-full h-screen p-20'>
      <SignedOut>
        <Board
          fen={fen}
          orientation={isBoardFlipped ? 'b' : 'w'}
          onDrop={onDrop}
        />
        <MoveHistory
          history={chess.history({ verbose: true })}
          currentFen={fen}
          viewPastBoardState={viewPastBoardState}
        />
      </SignedOut>
      <SignedIn>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            if (!open) socket.disconnect();
            setOpen(open);
          }}
        >
          <DialogTrigger className='w-36 h-12 bg-accent-primary text-white text-shadow-xs text-shadow-neutral-500 font-semibold rounded-md hover:bg-accent-secondary hover:cursor-pointer'>
            Create Game
          </DialogTrigger>
          <DialogContent className='bg-body-background text-white border-body-background'>
            <DialogHeader>
              <DialogTitle className='font-semibold text-lg'>Create a game</DialogTitle>
            </DialogHeader>
            {!isConnected && (
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
                  onClick={() => socket.connect()}
                >
                  Play
                </button>
              </div>
            )}
            {isConnected && (
              <div>
                <p>
                  Finding <span className='underline'>{timeControl.text}</span> game...
                </p>
                <button
                  className='w-full mt-5 py-4 font-bold bg-neutral-400 rounded-md border-b-6 border-b-neutral-500 text-xl text-shadow-sm text-shadow-neutral-500 hover:brightness-[1.15] hover:cursor-pointer active:brightness-100'
                  onClick={() => socket.disconnect()}
                >
                  Cancel
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </SignedIn>
    </div>
  );
}

export default App;
