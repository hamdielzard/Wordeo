import { Route, Routes } from 'react-router-dom';

// Pages
import { React, useEffect } from 'react';
import Home from './Pages/Home';
import Account from './Pages/Account';
import SignIn from './Pages/SignIn';
import Game from './Pages/Game';
import Leaderboard from './Pages/Leaderboard';
import NotFound from './Pages/NotFound';
import Store from './Pages/Store';
import Debug from './Pages/Debug';

const DEBUG = true;

// Routes
function App() {
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'CapsLock' && DEBUG) {
        window.location.pathname = '/debug';
      }
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/account/signin" element={<SignIn />} />
      <Route path="/account/:user" element={<Account />} />
      <Route path="/game/" element={<Game />} />
      {' '}
      <Route path="/game/:gameCode" element={<Game />} />
      (DEBUG &&
      {' '}
      <Route path="/debug/" element={<Debug />} />
      )
      <Route path="/store" element={<Store />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
