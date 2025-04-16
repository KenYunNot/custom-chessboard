import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { Outlet } from 'react-router';

const SidebarLayout = () => {
  return (
    <div className='flex'>
      <div className='flex flex-col'>
        <SignedIn>
          <button>
            <SignOutButton />
          </button>
        </SignedIn>
        <SignedOut>
          <button>
            <SignInButton />
          </button>
        </SignedOut>
      </div>
      <Outlet />
    </div>
  );
};

export default SidebarLayout;
