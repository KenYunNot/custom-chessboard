import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { Outlet } from 'react-router';

const SidebarLayout = () => {
  return (
    <div className='h-screen flex'>
      <div className='w-32 p-1 flex flex-col gap-1 bg-body-foreground text-white'>
        <SignedIn>
          <a
            href='/play'
            className='py-2 bg-accent-primary rounded-md text-sm font-semibold text-center hover:brightness-110 hover:cursor-pointer'
          >
            Play
          </a>
          <SignOutButton>
            <button className='py-2 bg-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-600 hover:cursor-pointer'>
              Sign Out
            </button>
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button className='py-2 bg-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-600 hover:cursor-pointer'>
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
      <Outlet />
    </div>
  );
};

export default SidebarLayout;
