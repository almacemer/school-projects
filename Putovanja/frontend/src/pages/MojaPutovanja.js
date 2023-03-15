import React, {useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const MojaPutovanja = () => {
    const [mojaPutovanja, setMojaPutovanja] = useState([]);
    const location = useLocation();
    let navigate = useNavigate(); 
    const [token, setToken, removeToken] = useCookies(['mytoken']);
    
    const getData = async () => {
      if(location.state.agencija) {
        try{
          await axios.get('http://127.0.0.1:8000/mojeputovanjeAgencija/' + JSON.parse(window.localStorage.getItem('ID'))[0].id + '/')
          .then(
              (response) => {
                  window.localStorage.setItem('mojaputovanja', JSON.stringify(response.data));
                  setMojaPutovanja(response.data);
              },
              (error) => {
                  console.log(error);
              })
        }
        catch (error) {
          console.log(error);
        }
      } else {
        try{
          await axios.get('http://127.0.0.1:8000/mojeputovanjeKorisnik/' + JSON.parse(window.localStorage.getItem('ID'))[0].id + '/')
          .then(
              (response) => {
                  window.localStorage.setItem('mojaputovanja', JSON.stringify(response.data));
                  setMojaPutovanja(response.data);
              },
              (error) => {
                  console.log(error);
              })
        }
        catch (error) {
          //console.log(error);
        }
      }
    }

    function logOut() {
      window.localStorage.clear();
      removeToken(['mytoken']);
    }

    useEffect(() => {
      if(!token['mytoken']) 
        navigate('/');
    }, [token]);

    useEffect(() => {
      getData();
    }, [token, mojaPutovanja])

    return (
      <div>
        <div className='logout'>
          <button onClick={() => navigate('/home', {state: {agencija: location.state.agencija}})}>Početna</button>
          <button onClick={() => navigate('/home/planiranaPutovanja', {state: {agencija: location.state.agencija}})}>Planiranja putovanja</button>
          <button onClick={() => logOut()}>Log Out</button>
        </div>
        <div className='naslov'>
          <h1>Moja putovanja</h1>
        </div>
        {[...mojaPutovanja]
        .map(el => {
            return(
              <div key={el.id} className='putovanje'>
                <img className='slika' src={el.slika} alt='Ucitavamo se molimo sacekajte'></img>
                <div className='opis'>
                  <h2>{el.naslov}</h2>
                  <p>Opis: {el.opis}</p>
                  <h4>Tip: {el.tip1}</h4>
                  <h4>Datum: {el.datum}</h4>
                  <h4>Prevoz: {el.prevoz} </h4>
                </div>
                     
              </div>
            )
          })
          }
      </div>
    )
}

export default MojaPutovanja