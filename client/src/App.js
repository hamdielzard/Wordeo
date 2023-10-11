import './App.css';
import {Route, Routes} from 'react-router-dom';

//pages
import HomePage from './pages/HomePage.js';
import AccountPage from './pages/AccountPage';
import SignInPage from './pages/SignInPage';
import GamePage from './pages/GamePage';

//routes
function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/account/signin' element={<SignInPage/>}/>
      <Route path='/account/:user' element={<AccountPage/>}/>
      <Route path='/game' element={<GamePage/>}/>
    </Routes>
  );
}

export default App;
