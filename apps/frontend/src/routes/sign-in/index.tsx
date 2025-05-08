import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

const SignIn = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <ClerkSignIn />
    </div>
  );
};

export default SignIn;
