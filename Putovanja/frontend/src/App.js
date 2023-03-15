import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Login from './pages/Login';
import RegisterKorisnik from './pages/RegisterKorisnik';
import RegisterAgencija from './pages/RegisterAgencija';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';
import MojaPutovanja from './pages/MojaPutovanja';
import PlaniranaPutovanja from './pages/PlaniranaPutovanja';
import Nav from './components/Nav';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element = {<Login />}></Route>
        <Route exact path='/register' element = {<RegisterKorisnik />}></Route>
        <Route exact path='/registerAgencije' element = {<RegisterAgencija />}></Route>
        <Route exact path='/home' element = {<Home />}></Route>
        <Route exact path='/reset-password' element = {<ResetPassword />}></Route>
        <Route exact path='/home/mojaPutovanja' element = {<MojaPutovanja />}></Route>
        <Route exact path='/home/planiranaPutovanja' element = {<PlaniranaPutovanja />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
