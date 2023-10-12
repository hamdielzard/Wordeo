import { Route, Routes } from 'react-router-dom';

// Pages
import Home from './Pages/Home.js';
import Account from './Pages/Account';
import SignIn from './Pages/SignIn';
import Game from './Pages/Game';

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
