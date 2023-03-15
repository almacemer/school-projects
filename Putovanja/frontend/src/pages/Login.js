import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import '../css/Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useCookies(['mytoken']);
    const [errorMessages, setErrorMessages] = useState('');
    const [agencija, setAgencija] = useState(false);
    const [id, setId] = useState('');
    const [tema, setTema] = useLocalStorage('tema' ? 'dark' : 'light')
    let navigate = useNavigate()

    useEffect(() => {
        console.log(token['mytoken'])
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
                    console.log(response.data);
                    setId(response.data.user_id);
                    console.log(response.data.user_id)
                    if(response.data.is_agencija)
                        setAgencija(true);
                    else
                        setAgencija(false);
                    setErrorMessages('');
                },
                (error) => {
                    console.log(error);
                    if (username.length <= 0 || password.length <=0)
                        setErrorMessages('Oba polja su obavezna.');
                    else
                        setErrorMessages('Uneseni podaci nisu ispravni.');
                }
            ) 
    }
    
  return (
    <div className="pozadina" data-theme={tema}>
        <i onClick={promijeniTemu} className='ikona fas fa-toggle-on'></i>
        <div className='naslov'>
            <h1>TRAVEL</h1>
        </div>
        <div className="login">   
            <div className='container'>
                <div className='forma'>
                    <label htmlFor="username">Username ili email</label> <br></br>
                    <input required type="text" id="username" placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)}/>
                    <br></br>

                    <label htmlFor="password">Password</label> <br></br>
                    <input required type="password" id="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)}/>
                    <br></br>

                    <button onClick={login}>Login</button> 
                    
                    <br></br>
                    <div>{errorMessages}</div>
                    <br></br>
                    
                    <div>
                        <h5>Ako nemate svoj račun molimo 
                            <div>
                                <button onClick={() => navigate("/register")}>Registrujte korisnika</button> ili 
                                <button onClick={() => navigate("/registerAgencije")}>Registrujte agenciju</button>
                            </div>
                        </h5>
                    </div>
                    <br></br>
                    <button onClick={() => navigate("/reset-password")}>Reset password</button>
                </div>
            </div> 
        </div>         
    </div>
  )
}

export default Login