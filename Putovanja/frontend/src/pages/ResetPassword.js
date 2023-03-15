import React, { useState, useCookies } from 'react';
import axios from 'axios';
import { Cookies, getCookie } from 'react-cookie';


axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  //var csrftoken = getCookie('csrftoken');
  
  function posaljiEmail() {
    axios.post('http://127.0.0.1:8000/reset-password/', {
            email: email
        }).then(
                (response) => {
                   console.log(response);
                   setMessage('Upute o promjeni passworda su poslane na email:' + email)
                },
                (error) => {
                    console.log(error);
                    setMessage('Molimo unesite ispravnu email adresu.')
                }
            )
  }

  return (
    <div>
        <label htmlFor="email">Email</label> <br></br>
        <input required type="email" id="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)}/>
        <button onClick={() => posaljiEmail()}>Reset</button>
        <br></br>

        
        <p> {message} </p>
        
    </div>
  )
}

export default ResetPassword