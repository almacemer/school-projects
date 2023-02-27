const pool = require('../db');

const spremiPitanje = (tekst, predavanje, sakriveno) => {
    const query = `INSERT INTO pitanja (tekst, predavanje, odgovoreno, sakriveno, izbrisano, vrijeme) 
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const vrijednosti = [tekst, predavanje, false, sakriveno, false, new Date()];

    return pool.query(query, vrijednosti);
}

const dodajPitanje = (tekst, predavanje_id) => {
    const query = `INSERT INTO pitanja (tekst, predavanje) VALUES ($1, $2) RETURNING id`;
    const vrijednosti = [tekst, predavanje_id];

    return pool.query(query, vrijednosti);
}

const dajPitanja = (id) => {
    const query = `SELECT * FROM pitanja WHERE predavanje = $1`;
    const vrijednosti = [id];

    return pool.query(query, vrijednosti)
}

const dajPitanjaPublici = (id) => {
    const query = `SELECT * FROM pitanja WHERE predavanje = $1 AND odgovoreno = $2 AND izbrisano = $2 AND sakriveno = $2`;
    const vrijednosti = [id, false];

    return pool.query(query, vrijednosti)
}

const dajSvaPitanja = (id) => {
    const query = `SELECT * FROM pitanja WHERE predavanje = $1`;
    const vrijednosti = [id];

    return pool.query(query, vrijednosti);
}

const odgovorenoPitanje = (id) => {
    const query = `UPDATE pitanja SET odgovoreno = true WHERE id = $1`;
    const vrijednosti = [ id ];

    return pool.query(query, vrijednosti);
}

const sakrijPitanje = (id) => {
    const query = `UPDATE pitanja SET sakriveno = true WHERE id = $1 RETURNING *`;
    const vrijednosti = [ id ];

    return pool.query(query, vrijednosti);
}

const otkrijPitanje = (id) => {
    const query = `UPDATE pitanja SET sakriveno = false WHERE id = $1 RETURNING *`;
    const vrijednosti = [ id ];

    return pool.query(query, vrijednosti);
}

const obrisiPitanje = (id) => {
    const query = `UPDATE pitanja SET izbrisano = true WHERE id = $1`;
    const vrijednosti = [ id ];

    return pool.query(query, vrijednosti);
}

const prebrojPitanjaNekogPredavanja = (id) => {
    const query = `SELECT COUNT(*) AS broj FROM pitanja WHERE predavanje = $1`;
    const vrijednosti = [ id ];

    return pool.query(query, vrijednosti);
}

const prebrojOdgovorenaPitanjaNekogPredavanja = (id) => {
    const query = `SELECT COUNT(*) AS broj FROM pitanja WHERE predavanje = $1 AND odgovoreno = $2`;
    const vrijednosti = [ id, true ];

    return pool.query(query, vrijednosti);
}

const dajPitanjaPoLajkovimaAsc = (predavanje) => {
    const query = `SELECT * FROM pitanja 
                   WHERE predavanje = $1 AND izbrisano = $2 AND odgovoreno = $2 AND sakriveno = $2 
                   ORDER BY lajkovi ASC`;
    const vrijednosti = [predavanje, false];

    return pool.query(query, vrijednosti);
}

const dajPitanjaPoLajkovimaDesc = (predavanje) => {
    const query = `SELECT * FROM pitanja 
                   WHERE predavanje = $1 AND izbrisano = $2 AND izbrisano = $2 AND odgovoreno = $2 AND sakriveno = $2 
                   ORDER BY lajkovi DESC`;
    const vrijednosti = [predavanje, false];

    return pool.query(query, vrijednosti);
}

const dajPitanjaPoVremenuAsc = (predavanje) => {
    const query = `SELECT * FROM pitanja 
                   WHERE predavanje = $1 AND izbrisano = $2 AND izbrisano = $2 AND odgovoreno = $2 AND sakriveno = $2  
                   ORDER BY vrijeme ASC`;
    const vrijednosti = [predavanje, false];

    return pool.query(query, vrijednosti);
}

const dajPitanjaPoVremenuDesc = (predavanje) => {
    const query = `SELECT * FROM pitanja 
                   WHERE predavanje = $1 
                   AND izbrisano = $2 AND izbrisano = $2 AND odgovoreno = $2 AND sakriveno = $2
                   ORDER BY vrijeme DESC`;
    const vrijednosti = [predavanje, false];

    return pool.query(query, vrijednosti);
}

const dajPitanjaIPredavanja = () => {
  const query = `SELECT p.id as pitanjeid, p.ime_osobe as ime, p.tekst as tekst, p.lajkovi as lajkovi, p.vrijeme as vrijeme, 
                    pr.id as predavanjeid, pr.naziv as predavanjenaziv, pr.kod as predavanjekod 
                 FROM pitanja p RIGHT JOIN predavanja pr ON p.predavanje = pr.id
                 WHERE p.izbrisano = false`;

  return pool.query(query);
}

const dajPitanje = (id) => {
    const query = `SELECT * FROM pitanja WHERE id = $1`;
    const vrijednosti = [id];

    return pool.query(query, vrijednosti);
}

const dajBrojPostavljenihPitanja = () => {
    const query = `SELECT count(*) as broj FROM pitanja`;

    return pool.query(query);
}

const dajBrojSakrivenihPitanja = () => {
    const query = `SELECT count(*) as broj FROM pitanja WHERE sakriveno = true`;

    return pool.query(query);
}

module.exports = {
    spremiPitanje,
    dajPitanja,
    dajSvaPitanja,
    odgovorenoPitanje,
    sakrijPitanje,
    otkrijPitanje,
    obrisiPitanje,
    prebrojPitanjaNekogPredavanja,
    prebrojOdgovorenaPitanjaNekogPredavanja,
    dodajPitanje,
    dajPitanjaPublici,
    dajPitanjaPoLajkovimaAsc,
    dajPitanjaPoLajkovimaDesc,
    dajPitanjaPoVremenuAsc,
    dajPitanjaPoVremenuDesc,
    dajPitanjaIPredavanja,
    dajPitanje,
    dajBrojPostavljenihPitanja,
    dajBrojSakrivenihPitanja
}