import React, { useMemo, useEffect, useState, useRef } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import '../css/Mapa.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyAVvqviFjd7J0LnKCbgk_FMeXwa_Ro03YY");

function Map(koor) {
  const center = useMemo(() => ({ lat: 39, lng: -15 }), []);
  return (
      <div className="prozor"> 
        <GoogleMap zoom={3} center={center} mapContainerClassName="map-container"> 
          {
            koor.koor.map((el) => {
              return <MarkerF position={{lat: el.lat, lng: el.lng}}/>   
            })
          } 
        </GoogleMap>       
      </div> 
  );

}

const Home = () => {
    const location = useLocation();
    const [koor, setKoor] = useState([]);
    const [mojaPutovanja, setMojaPutovanja] = useState([]);
    const [sviPodaci, setSvePodatke] = useState([]);
    const [prikazi, setPrikazi] = useState(false);
    const [koordinate, setKoordinate] = useState({}); 
    const [ID, setID] = useState("");

    const [token, setToken, removeToken] = useCookies(['mytoken']);
    let navigate = useNavigate(); 

    const getId = () => {
      if(location.state.agencija) {
        try {
           axios.get('http://127.0.0.1:8000/agencijaId/' + location.state.id.toString() + '/')
              .then(
                  (response) => {
                      window.localStorage.setItem('ID', JSON.stringify(response.data));
                      setID(response.data[0].id);
                  },
                  (error) => {
                      console.log(error);
                  }
              )
        }
        catch (error) {
          console.log(error);
        }
      } else {
        try {
           axios.get('http://127.0.0.1:8000/korisnikId/' + location.state.id.toString() + '/')
                .then(
                    (response) => {
                        window.localStorage.setItem('ID', JSON.stringify(response.data));
                        setID(response.data[0].id);
                    },
                    (error) => {
                        console.log(error);
                    }
                )
          }
          catch (error) {
            console.log(error);
          }
      }
    }

    const getData =  () => {
      try{
         axios.get('http://127.0.0.1:8000/home/' + JSON.parse(window.localStorage.getItem('ID'))[0].id + '/')
        .then(
            (response) => {
                window.localStorage.setItem('podaci', JSON.stringify(response.data));
                setSvePodatke(response.data);
            },
            (error) => {
                console.log(error);
            }
        )
      }
      catch (error) {
        //console.log(error);
      }    
    }

    const getSvaPutovanja = async () => {
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
          console.log(error);
        }
      }
    }

    function prikaziMapu(naziv) {
      Geocode.fromAddress(naziv).then(
        (response) => {
          const lat = response.results[0].geometry.location.lat;
          const lng = response.results[0].geometry.location.lng;
          setKoordinate({lat: lat, lng: lng})
        },
        (error) => {
          console.error(error);
        }
      );
    }

    useEffect(() => {
      if(!token['mytoken']) {
        navigate('/');
      }
      getId();
      getData();
    }, [token]);

    useEffect(() => {
      const podaci = JSON.parse(window.localStorage.getItem('podaci'));
      console.log(sviPodaci);
      for(let i=0; i<sviPodaci.length; i++) {
        Geocode.fromAddress(sviPodaci[i].naslov).then(
          (response) => {
            const lat = response.results[0].geometry.location.lat;
            const lng = response.results[0].geometry.location.lng;
            setKoor(koor => [...koor, {lat: lat, lng: lng}])
            setPrikazi(true);
          },
          (error) => {
            console.error(error);
            setPrikazi(false);
          }
        );
      }
      getSvaPutovanja();
    }, [token, sviPodaci])

    function logOut() {
      window.localStorage.clear();
      removeToken(['mytoken']);
    }


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAVvqviFjd7J0LnKCbgk_FMeXwa_Ro03YY"
    });

    if(!isLoaded) return <div>Loading</div>
    

      return (
      <div> 
        <div className='logout'>
        <button onClick={() => navigate('mojaPutovanja', {state: {agencija: location.state.agencija}})}>Moja putovanja</button>
              <button onClick={() => navigate('planiranaPutovanja', {state: {agencija: location.state.agencija}})}>Planiranja putovanja</button>
          <button onClick={() => logOut()}>Log Out</button>
        </div>
        <div className='naslov'>
          <h1>Putovanja u prosljednjih mjesec dana</h1>
        </div>
              
              <Map koor={koor}/>

              <div className='roditelj'>
                <div className='prvi'>
                  <select onChange={e => prikaziMapu(e.target.value)}>
                  {
                  mojaPutovanja.map((el) => {
                    return <option value={el.naslov} key={el.id}>{el.naslov}</option>  
                  })
                  }
                  </select>
                </div>
                <div className='drugi'>
                  {prikazi &&
                  <GoogleMap zoom={8} center={koordinate} mapContainerClassName="map-container"> 
                    <MarkerF position={koordinate}/>   
                  </GoogleMap> 
                  }
                </div>
              </div>
              

              

              

            </div>
        )
        
}

export default Home;