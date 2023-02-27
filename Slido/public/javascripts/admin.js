function obrisiPredavaca(id) {
    $.ajax({
        url: `/admin/obrisi-predavaca/${id}`,
        data: { },
        type: 'PUT',
        beforeSend: function() {

        }
    }).done(function (data) {
        console.info(id);
        $("#tableID").find(`tr#predavac${id}`).remove();
    });
}

function blokiraj(id, dani) {
    $.ajax({
        url: `/admin/blokiraj-predavaca/${id}`,
        data: { dani: dani },
        type: 'PUT',
        beforeSend: function() {

        }
    }).done(function (data) {
        console.info(id);
        $("#tableID").find(`tr#predavac${id}`).remove();
    });
}


function obrisiPredavanje(id) {
    $.ajax({
        url: `/admin/obrisi-predavanje/${id}`,
        data: { },
        type: 'PUT',
        beforeSend: function() {

        }
    }).done(function (data) {
        $("#tableID").find(`tr#predavanje${id}`).remove();
    });
}

function obrisiPitanje(id) {
    $.ajax({
        url: `/admin/obrisi-pitanje/${id}`,
        data: { },
        type: 'PUT',
        beforeSend: function() {

        }
    }).done(function (data) {
        $("#tableID").find(`tr#pitanje${id}`).remove();
    });
}

function obrisiRijec(id) {
    $.ajax({
        url: `/admin/obrisi-rijec/${id}`,
        data: { },
        type: 'PUT',
        beforeSend: function() {

        }
    }).done(function (data) {
        $("#tableID").find(`tr#rijec${id}`).remove();
    });
}

function urediRijec(id) {
    const rijec = document.getElementById(`${id}`).value;
    $.ajax({
        url: `/admin/uredi-rijec/${id}`,
        data: { rijec: rijec },
        type: 'PUT',
        beforeSend: function() {

        }
    }).done(function (data) {
        document.getElementById(`${id}`).value = rijec;
    });
}

function dodajRijec(broj) {
    const rijec = document.getElementById('nova-rijec').value;
    if (rijec !== '') {
        $.ajax({
            url: `/admin/dodaj-rijec`,
            data: { rijec: rijec, broj: broj },
            type: 'POST',
            beforeSend: function() {

            }
        }).done(function (data) {
            document.getElementById('tabela-body').innerHTML += data;
            document.getElementById('nova-rijec').value = '';
        });
    }

}
