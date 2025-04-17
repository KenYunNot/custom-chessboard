import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { Outlet } from 'react-router';

const SidebarLayout = () => {
  return (
    <div className='flex'>
      <div className='w-32 p-1 flex flex-col bg-foreground text-white'>
        <SignedIn>
          <button className='py-2 bg-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-600 hover:cursor-pointer'>
            <SignOutButton />
          </button>
        </SignedIn>
        <SignedOut>
          <button className='py-2 bg-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-600 hover:cursor-pointer'>
            <SignInButton />
          </button>
        </SignedOut>
      </div>
      <Outlet />
    </div>
  );
};

export default SidebarLayout;
