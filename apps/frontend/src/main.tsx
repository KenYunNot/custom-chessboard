import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router';
import SignIn from './routes/signin';
import SignUp from './routes/signup';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl='/'
    >
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<App />}
          />

          <Route
            path='signin'
            element={<SignIn />}
          />
          <Route
            path='signup'
            element={<SignUp />}
          />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
