const pool = require('../db');


const spremiPredavaca = (ime, prezime, email, password, salt) => {

}
const dajPredavace = () => {
    const query = `SELECT * FROM predavaci WHERE obrisan = $1`;
    const vrijednosti = [ false ];
    return pool.query(query, vrijednosti);
}

const obrisiPredavaca = (id) => {
    const query = `UPDATE predavaci SET obrisan = true WHERE id = $1`;
    const vrijednosti = [ id ];

    return pool.query(query, vrijednosti);
}

const blokirajPredavaca = (id, datum) => {
    const query = `UPDATE predavaci SET blokiran_do = $1 WHERE id = $2`;
    const vrijednosti = [datum, id];

    return pool.query(query, vrijednosti);
}

const dajBrojPredavaca = () => {
    const query = `SELECT COUNT(*) AS broj FROM predavaci`;

    return pool.query(query);
}

const dajBrojBlokiranihPredavaca = () => {
    const query = `SELECT COUNT(*) AS broj FROM predavaci WHERE blokiran_do IS NOT NULL`;

    return pool.query(query);
}

module.exports = {
    dajPredavace,
    obrisiPredavaca,
    blokirajPredavaca,
    dajBrojPredavaca,
    dajBrojBlokiranihPredavaca
}