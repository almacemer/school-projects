import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Login from './pages/Login';
import RegisterKorisnik from './pages/RegisterKorisnik';
import RegisterAgencija from './pages/RegisterAgencija';
import Home from './pages/Home';
import ResetPassword from './pages/ResetPassword';
import MojaPutovanja from './pages/MojaPutovanja';
import PlaniranaPutovanja from './pages/PlaniranaPutovanja';
import Nav from './components/Nav';

function Router() {
  return(
    <App />
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

reportWebVitals();
