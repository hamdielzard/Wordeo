import { Route, Routes } from 'react-router-dom';

// Pages
import Home from './Pages/Home.js';
import Account from './Pages/Account.js';
import SignIn from './Pages/SignIn.js';
import Game from './Pages/Game.js';
import NotFound from './Pages/NotFound.js';
import Debug from './Pages/Debug.js';
import { useEffect } from 'react';

const DEBUG = true;

// Routes
function App() {

  useEffect(() => {
    document.addEventListener('keydown', function (e) {
      if (e.key === "CapsLock" && DEBUG) {
        window.location.pathname = '/debug';
      }
    });
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/account/signin' element={<SignIn />} />
      <Route path='/account/:user' element={<Account />} />
      <Route path='/game/' element={<Game />} /> // TODO: Remove this once the game is implemented
      <Route path='/game/:gameCode' element={<Game />} />
      (DEBUG && <Route path='/debug/' element={<Debug />} />)
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
