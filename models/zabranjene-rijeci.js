const pool = require('../db');

const dajZabranjeneRijeci = () => {
    const query = `SELECT * FROM zabranjene_rijeci WHERE obrisana = $1`;
    const vrijedonsti = [false];

    return pool.query(query, vrijedonsti);
}

const dodajZabranjenuRijec = (rijec) => {
    const query = `INSERT INTO zabranjene_rijeci (rijec) VALUES ($1) RETURNING *`;
    const vrijednosti = [ rijec ];

    return pool.query(query, vrijednosti);
}

const urediZabranjenuRijec = (id, rijec) => {
    const query = `UPDATE zabranjene_rijeci SET rijec = $1 WHERE id = $2`;
    const vrijednosti = [ rijec, id ];

    return pool.query(query, vrijednosti);
}

const obrisiZabranjenuRijec = (id) => {
    const query = `UPDATE zabranjene_rijeci SET obrisana = $1 WHERE id = $2`;
    const vrijednosti = [ true, id ];

    return pool.query(query, vrijednosti);
}

module.exports = {
    dajZabranjeneRijeci,
    dodajZabranjenuRijec,
    urediZabranjenuRijec,
    obrisiZabranjenuRijec
}