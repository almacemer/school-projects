import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import '../css/Login.css';

function RegisterAgencija() {
    const [naziv, setNaziv] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [datum, setDatum] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [samePassword, setSamePassword] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState('');
    const [token, setToken] = useCookies(['mytoken']);
    const [agencija, setAgencija] = useState(false);
    const [id, setId] = useState('');
    const [tema, setTema] = useLocalStorage('tema' ? 'dark' : 'light')
    let navigate = useNavigate();

    useEffect(() => {
        if(token['mytoken']) {
            navigate('/home', {state: {id: id, agencija: agencija}});
        }
    }, [token]);

    const promijeniTemu = () => {
        const novaTema = tema === 'light' ? 'dark' : 'light';
        setTema(novaTema)
    }

    const login = () => {
        axios.post('http://127.0.0.1:8000/login/', {
            username: username,
            password: password,
        }).then(
                (response) => {
                    setToken('mytoken', response.data.token);
                    setId(response.data.user_id);
                    setAgencija(true);
                    setErrorMessages('');
                },
                (error) => {
                    console.log(error);
                }
            ) 
    }

    function registerAgencija() {
        axios.post('http://127.0.0.1:8000/api/agencija/', {
            username: username,
            naziv_agencije: naziv,
            email: email,
            datum_osnivanja: datum,
            password: password,
            password2: password2
        }).then(
                (response) => {
                   console.log(response);
                   login();
                },
                (error) => {
                    if(error.response.data.username && error.response.data.email)
                        setErrorMessages("Uneseni username i email se već koriste.");
                    else if(error.response.data.username)
                        setErrorMessages("Uneseni username već postoji. Molimo unesite novi.");
                    else if(error.response.data.email)
                        setErrorMessages("Email se već koristi.");
                    else
                        setErrorMessages("Došlo je do greške. Pokušajte ponovo.");

                    setError(true);
                    console.log(error);
                }
            )
    }

    const registerBtn = () => {
        if (password === password2) 
            registerAgencija();
        else {
            setSamePassword(false);
            setPassword('');
            setPassword2('');
            setError(false);
            setErrorMessages('');
            console.log("nemere")
        }
    }

  return (
    <div className='pozadina' data-theme={tema}>
        <i onClick={promijeniTemu} className='ikona fas fa-toggle-on'></i>
        <div className='naslov'>
            <h1>Registracija agencije</h1>
        </div>
        <div className="login">
            <div className='container'>
                <div className='forma'>
                    <label htmlFor="naziv">Naziv agencije</label> <br></br>
                    <input required type="text" id="naziv" placeholder="Enter naziv agencije" value={naziv} onChange={e => setNaziv(e.target.value)}/>
                    <br></br>
                    
                    <label htmlFor="username">ID agencije</label> <br></br>
                    <input required type="text" id="username" placeholder="Enter ID agencije" value={username} onChange={e => setUsername(e.target.value)}/>
                    <br></br>

                    <label htmlFor="email">Email</label> <br></br>
                    <input required type="email" id="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)}/>
                    <br></br>

                    <label htmlFor="datum">Datum</label> <br></br>
                    <input required type="date" id="datum" placeholder="Enter datum osnivanja" value={datum} onChange={e => setDatum(e.target.value)}/>
                    <br></br>
                    
                    <label htmlFor="password">Password</label> <br></br>
                    <input required type="password" id="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)}/>
                    <br></br>

                    <label htmlFor="password2">Ponovite password</label> <br></br>
                    <input required type="password" id="password2" placeholder="Ponovite password" value={password2} onChange={e => setPassword2(e.target.value)}/>
                    <br></br>
                    
                    <button onClick={registerBtn}>Registruj se</button>

                    {!samePassword ? <div>Unesite ispravnu sifru</div>:
                        <div></div>
                    }

                    {error ? <div>{errorMessages}</div>:
                        <div></div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default RegisterAgencija