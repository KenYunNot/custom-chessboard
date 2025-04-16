import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

const SignUp = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <ClerkSignUp />
    </div>
  );
};

export default SignUp;
