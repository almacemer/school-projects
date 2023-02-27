const pool = require('../db');

const spremiPredavanje = (kod, naziv, vrijeme, ponavljanje, slika, kdatum, predavac_id) => {
    const query = `INSERT INTO predavanja (kod, naziv, vrijeme, ponavljanje, slika, kdatum, predavac_id) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const vrijednosti = [kod, naziv, vrijeme, ponavljanje, slika, kdatum, predavac_id];

    return pool.query(query, vrijednosti);
}

const dajPredavanje = (kod) => {
    const query = `SELECT * FROM predavanja WHERE kod = $1`
    const vrijednosti = [kod];

    return pool.query(query, vrijednosti);
}

const dajPredavanja = (id) => {
    const query = `SELECT * FROM predavanja WHERE predavac_id = $1`;
    const vrijednosti = [id];

    return pool.query(query, vrijednosti);
}

const dajSvaPredavanja = () => {
    const query = `SELECT * FROM predavanja`;

    return pool.query(query);
}

const dajAktivnaPredavanja = () => {
    const query = `SELECT * FROM predavanja WHERE kdatum >= $1 AND obrisano = $2`;
    const vrijednosti = [new Date, false];

    return pool.query(query, vrijednosti);
}

const dajPredavanjaIPitanja = (id) => {
    const query = `SELECT *, count(pitanja.id) as broj FROM predavanja
                   INNER JOIN pitanja ON pitanja.predavanje = predavanja.id
                   WHERE predavanja.predavac_id = $1
                   `;
    const vrijednosti = [id];

    return pool.query(query, vrijednosti);
}

const urediPredavanje = (id, kod, naziv, vrijeme, ponavljanje, kdatum) => {
    const query = `UPDATE predavanja 
                   SET kod = $1, naziv = $2, vrijeme = $3, ponavljanje = $4, kdatum = $5
                   WHERE id = $6
                   RETURNING *`;
    const vrijednosti = [kod, naziv, vrijeme, ponavljanje, kdatum, id];

    return pool.query(query, vrijednosti);
}

const dajId = kod => {
    const query = `SELECT id FROM predavanja WHERE kod = $1`;
    const vrijednosti = [kod];

    return pool.query(query, vrijednosti);
}

const obrisiPredavanje = (id) => {
    const query = `UPDATE predavanja SET obrisano = true WHERE id = $1`;
    const vrijednosti = [id];

    return pool.query(query, vrijednosti);
}

const urediSliku = (id, slika) => {
    const query = `UPDATE predavanja SET slika = $1 WHERE id = $2`;
    const vrijednosti = [slika, id];

    return pool.query(query, vrijednosti);
}

const dajBrojAktivnihPredavanja = () => {
    const query = `SELECT COUNT(*) as broj FROM predavanja WHERE kdatum >= $1`;
    const vrijednosti = [ new Date() ];

    return pool.query(query, vrijednosti);
}

module.exports = {
    spremiPredavanje,
    dajPredavanje,
    dajPredavanja,
    dajPredavanjaIPitanja,
    dajSvaPredavanja,
    urediPredavanje,
    dajId,
    dajAktivnaPredavanja,
    obrisiPredavanje,
    urediSliku,
    dajBrojAktivnihPredavanja
};