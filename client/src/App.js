import { Route, Routes } from 'react-router-dom';

// Pages
import Home from './Pages/Home.js';
import Account from './Pages/Account.js';
import SignIn from './Pages/SignIn.js';
import Game from './Pages/Game.js';

// Routes
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/account/signin' element={<SignIn />} />
      <Route path='/account/:user' element={<Account />} />
      <Route path='/game' element={<Game />} />
    </Routes>
  );
}

export default App;
