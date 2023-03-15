import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router-dom';

const PlaniranaPutovanja = () => {
    const [putovanja, setPutovanja] = useState([]);
    const [zahtjevi, setZahtjevi] = useState([]);
    const [zahtjeviTip1, setZahtjeviTip1] = useState([]);
    const [zahtjeviTip2, setZahtjeviTip2] = useState([]);
    const [zahtjeviTip3, setZahtjeviTip3] = useState([]);
    const [agencije, setAgencije] = useState([]);
    const [agencija, setAgencija] = useState("");
    const [mjesto, setMjesto] = useState("");
    const [vrijeme, setVrijeme] = useState("");
    const [prevoz, setPrevoz] = useState("");
    const [cijena, setCijena] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [naCekanju, setNaCekanju] = useState([]);
    const [odobreno, setOdobreno] = useState([]);
    const [odbijeno, setOdbijeno] = useState([]);
    const [token, setToken, removeToken] = useCookies(['mytoken']);
    let navigate = useNavigate(); 
    const location = useLocation();

    const dajPlaniranaPutovanja = () => {
        if(!location.state.agencija) {
          axios.get('http://127.0.0.1:8000/planiranaputovanja/')
        .then(
            (response) => {
                setPutovanja(response.data)
            },
            (error) => {
                console.log(error);
            })  
        } else {
            axios.get('http://127.0.0.1:8000/planiranaputovanja/agencija/' + + JSON.parse(window.localStorage.getItem('ID'))[0].id + '/')
        .then(
            (response) => {
                setPutovanja(response.data)
            },
            (error) => {
                console.log(error);
            })
        }
    }

    const dajAgencije = () => {
        axios.get('http://127.0.0.1:8000/api/sveagencije/')
        .then(
            (response) => {
                setAgencije(response.data)
                console.log(response.data)
            },
            (error) => {
                console.log(error);
            })  
    }

    const zahtjev1 = async () => {
        await axios.get('http://127.0.0.1:8000/zahtjevi/1/1/')
        .then(
            (response) => {
                setZahtjeviTip1(response.data);
                axios.get('http://127.0.0.1:8000/zahtjevi/1/1/')
                .then(
                    (response) => {
                    setZahtjeviTip1(response.data);
                },
                (error) => {
                    console.log(error);
                })
            },
            (error) => {
                console.log(error);
            })
    }

    const zahtjev2 = () => {
        axios.get('http://127.0.0.1:8000/zahtjevi/1/2/')
        .then(
            (response) => {
                setZahtjeviTip2(response.data)
            },
            (error) => {
                console.log(error);
            })
    }

    const zahtjev3 = () => {
        axios.get('http://127.0.0.1:8000/zahtjevi/1/3/')
        .then(
            (response) => {
                setZahtjeviTip3(response.data)
            },
            (error) => {
                console.log(error);
            })
    }

    const spremiPlaniranoPutovanje = () => {
        axios.post('http://127.0.0.1:8000/spremi/planiranoputovanje/', {
            agencija: JSON.parse(window.localStorage.getItem('ID'))[0].id,
            naslov: mjesto,
            opis: "kofol",
            datum: vrijeme
        })
        .then(
            (response) => {
                console.log(response);
            },
            (error) => {
                console.log(error);
            })
        setMjesto("");
        //setOpis("");
        setVrijeme("");
        setPrevoz("");
        setMax(0);
        setMin(0);
    }

    const spremiPlaniranoPutovanjeKorisnik = () => {
        console.log(agencija)
        axios.post('http://127.0.0.1:8000/spremi/planiranoputovanje/', {
            agencija: agencija,
            naslov: mjesto,
            opis: "kofol",
            datum: vrijeme
        })
        .then(
            (response) => {
                console.log(response);
            },
            (error) => {
                console.log(error);
            })
        setMjesto("");
        //setOpis("");
        setVrijeme("");
        setPrevoz("");
        setMax(0);
        setMin(0);
    }

    useEffect(() => {
        if(!token['mytoken']) 
          navigate('/');
      }, [token]);

    useEffect(() => {
        dajPlaniranaPutovanja();
        dajAgencije();
        zahtjev1();
        zahtjev2();
        zahtjev3();
    }, [token])

    function prijavi(id) {
        axios.post('http://127.0.0.1:8000/spremi/zahtjev/', {
            korisnik:  JSON.parse(window.localStorage.getItem('ID'))[0].id,
            putovanje: id,
            tip: 1
        }).then(
                (response) => {
                   console.log(response);
                },
                (error) => {
                    console.log(error);
                    
                }
            )
    }

    function obrisi(id) {
        axios.delete('http://127.0.0.1:8000/obrisi/planiranaputovanja/' + id.toString())
        .then(
                (response) => {
                   console.log(response);
                },
                (error) => {
                    console.log(error);
                    
                }
            )
    }

    function logOut() {
        window.localStorage.clear();
        removeToken(['mytoken']);
      }

    return (
        <div>
            <div className='logout'>
                <button onClick={() => navigate('/home', {state: {agencija: location.state.agencija}})}>Početna</button>
                <button onClick={() => navigate('/home/mojaPutovanja', {state: {agencija: location.state.agencija}})}>Moja putovanja</button>
                <button onClick={() => logOut()}>Log Out</button>
            </div>
            <div className='naslov'>
                <h1>Planirana putovanja</h1>
            </div>
            {putovanja.map((el) => {
                return (
                    <div className='putovanje' key={el.id}>
                        <h2>Naslov: {el.naslov} </h2>
                        <h3>Datum: {el.datum} </h3>
                        <h4>Opis: {el.opis} </h4>
                        <h4>Agencija: {el.agencija} </h4>
                        {location.state.agencija? <button onClick={() => obrisi(el.id)}>Obrisi putovanje</button>
                                                : <button onClick={() => prijavi(el.id)}>Prijavi se za putovanje</button>
                        }
                        
                    </div>
                )
            })
            }
            <div>
                <h2>Zahtjevi na čekanju:</h2>
                {zahtjeviTip1.map((el) => {
                    return (
                        <div key={el.id}>
                            <button>Obrisi zahtjev</button>
                        </div>
                    )
                })
                }
                <h2>Odobreni zahtjevi:</h2>
                {zahtjeviTip2.map((el) => {
                    return (
                        <div key={el.id}>
                            <button>Obrisi putovanje</button>
                        </div>
                    )
                })
                }
                <h2>Odbijeni zahtjevi:</h2>
                {zahtjeviTip3.map((el) => {
                    return (
                        <div key={el.id}>
                            <button>Posalji zahtjev ponovo</button>
                        </div>
                    )
                })
                }
            </div>
            
            
            <br></br>
            
            <div className='novoPutovanje'>
              <h1>Kreiraj novo putovanje</h1>
                <div className='login'>
                    {location.state.agencija?
                        <div className='forma'>
                            <label htmlFor="mjesto">Mjesto</label> <br></br>
                            <input required type="text" id="mjesto" placeholder="Unesite mjesto" value={mjesto} onChange={e => setMjesto(e.target.value)}/>
                            <br></br>
                            <label htmlFor="vrijeme">Vrijeme</label> <br></br>
                            <input required type="date" id="vrijeme" placeholder="Odaberite datum" value={vrijeme} onChange={e => setVrijeme(e.target.value)}/>
                            <br></br>
                            <label htmlFor="prevoz">Unesite prevoz</label> <br></br>
                            <input required type="text" id="prevoz" placeholder="Unesite prevoz" value={prevoz} onChange={e => setPrevoz(e.target.value)}/>
                            <br></br>
                            <label htmlFor="min">Minimalan broj putnika</label> <br></br>
                            <input required type="text" id="min" placeholder="Unesite minimalni broj putnika" value={min} onChange={e => setMin(e.target.value)}/>
                            <br></br>
                            <label htmlFor="max">Maksimalan broj putnika</label> <br></br>
                            <input required type="text" id="max" placeholder="Unesite maksimalni broj putnika" value={max} onChange={e => setMax(e.target.value)}/>
                            <br></br>
                            <button onClick={spremiPlaniranoPutovanje}>Spremi</button>
                        </div>  
                        :
                        <div>
                            <select onChange={e => setAgencija(e.target.value)}>
                                {
                                agencije.map((el) => {
                                return <option value={el.id}>{el.naziv_agencije}</option>  
                                })
                                }
                            </select>
                            <br></br>
                            <label htmlFor="mjesto">Mjesto</label> <br></br>
                            <input required type="text" id="mjesto" placeholder="Unesite mjesto" value={mjesto} onChange={e => setMjesto(e.target.value)}/>
                            <br></br>
                            <label htmlFor="vrijeme">Vrijeme</label> <br></br>
                            <input required type="date" id="vrijeme" placeholder="Odaberite datum" value={vrijeme} onChange={e => setVrijeme(e.target.value)}/>
                            <br></br>
                            <label htmlFor="prevoz">Unesite prevoz</label> <br></br>
                            <input required type="text" id="prevoz" placeholder="Unesite prevoz" value={prevoz} onChange={e => setPrevoz(e.target.value)}/>
                            <br></br>
                            <label htmlFor="cijena">Maksimalna cijena</label> <br></br>
                            <input required type="text" id="cijena" placeholder="Unesite maksimalnu cijenu" value={cijena} onChange={e => setCijena(e.target.value)}/>
                            <br></br>
                            <button onClick={spremiPlaniranoPutovanjeKorisnik}>Spremi</button>
                        </div>
                    }
                </div>
                
            </div>
            
        </div>
    )
}

export default PlaniranaPutovanja