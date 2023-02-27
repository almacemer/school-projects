function urediPredavanje(id) {

    const naziv = document.getElementById('naziv').value,
        kod_predavanja = document.getElementById('kod').value,
        vrijeme = document.getElementById('vrijeme').value,
        kdatum = document.getElementById('kdatum').value,
        slika = document.getElementById('slika').value,
        ponavljanje = document.getElementById('ponavljanje').value;
    $.ajax({
        url: '/pocetna/predavanje-info/uredi',
        data: {
            id: id,
            naziv: naziv,
            kod: kod_predavanja,
            vrijeme: vrijeme,
            kdatum: kdatum,
            slika: slika,
            ponavljanje: ponavljanje
        },
        type: 'PUT',
        beforeSend: function() {

        },
        error: function (error) {
            console.info(error)
        }
    }).done(function (data) {
        console.info(data);
        $("#kod-predavanja").text(`${data.kod}`);
        $("#naziv-predavanja").text(data.naziv);
        $("#vrijeme-predavanja").text(data.vrijeme);
        $("#kdatum-predavanja").text(moment(data.kdatum).format('DD-MMM-YYYY'));
    })
}

function odgovori(id) {
    socket.emit('obrisi-pitanje-publici', id, kod)
    $.ajax({
        url: `/pocetna/odgovori-pitanje/${id}`,
        data: {},
        type: 'PUT'
    }).done(function (data) {
        const pitanje = document.getElementById(`pitanje${id}`);
        $(`#lajk${id}`).remove();
        $(`#odgovori${id}`).remove();
        $(`#sakrij${id}`).remove();
        $(`#obrisi${id}`).remove();
        const odgovorena_pitanja = document.getElementById('odgovorena-pitanja');
        odgovorena_pitanja.appendChild(pitanje);
    })
}

function sakrijPitanje(id) {
    socket.emit('obrisi-pitanje-publici', id, kod)
    $.ajax({
        url: `/pocetna/sakrij-pitanje/${id.toString()}`,
        data: {},
        type: 'PUT',
        error: function (error) {
            console.info(error)
        }
    }).done(function (data) {
        const pitanje = document.getElementById(`pitanje${id}`);
        $(`#lajk${id}`).remove();
        $(`#odgovori${id}`).remove();
        $(`#sakrij${id}`).remove();

        const sakrivenja_pitanja = document.getElementById('sakrivena-pitanja');
        sakrivenja_pitanja.appendChild(pitanje);
    })
}

function obrisiPitanje(id) {
    $.ajax({
        url: `/pocetna/obrisi-pitanje/${id.toString()}`,
        data: {},
        type: 'PUT'
    }).done(function (data) {
        //$(`#pitanje${id}`).remove(); ili ovo ispod, svejedno je
        document.getElementById(`pitanje${id}`).remove();
        console.info(data);
        socket.emit('obrisi-pitanje-publici', id, kod);
    });
}

function sortiraj(tip, id) {
    $.ajax({
        url: `/pocetna/sortiraj`,
        data: {id: id, tip: tip},
        type: 'GET'
    }).done(function (data) {
        document.getElementById('sva-pitanja').innerHTML = data;
    });
}

var socket = io.connect('ws://localhost:3000');
socket.emit('create', kod);

socket.on('chat-message', function(data, pitanjeId){
    const pitanje = document.createElement('div');
    pitanje.className = "alert alert-info";
    pitanje.setAttribute('id', `pitanje${pitanjeId}`);

    const div = document.createElement('div');
    div.className = "row";

    const tekst_pitanja = document.createElement('div');
    tekst_pitanja.className = "col-sm-7";
    tekst_pitanja.innerText = data;

    const dugmic1 = document.createElement('div');
    dugmic1.className = "col-sm-2";

    const lajk_dugmic = document.createElement('button');
    lajk_dugmic.className = "btn";
    lajk_dugmic.setAttribute('id', `lajk${pitanjeId}`);
    lajk_dugmic.setAttribute('disabled', 'true');
    lajk_dugmic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
                                        <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                    </svg>`;

    const span_broj_lajkova = document.createElement('span');
    span_broj_lajkova.setAttribute('id', `brojLajkova${pitanjeId}`);

    lajk_dugmic.appendChild(span_broj_lajkova);

    dugmic1.appendChild(lajk_dugmic);

    const dugmic2 = document.createElement('div');
    dugmic2.className = "col-sm-1";

    const odgovori_dugmic = document.createElement('button');
    odgovori_dugmic.className = "btn";
    odgovori_dugmic.setAttribute('onclick', `odgovori(${pitanjeId})`);
    odgovori_dugmic.setAttribute('id', `odgovori(${pitanjeId})`);
    odgovori_dugmic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                         </svg>`;

    dugmic2.appendChild(odgovori_dugmic);


    const dugmic4 = document.createElement('div');
    dugmic4.className = "col-sm-1";

    const sakrij_dugmic = document.createElement('button');
    sakrij_dugmic.className = "btn";
    sakrij_dugmic.setAttribute('onclick', `sakrijPitanje(${pitanjeId})`);
    sakrij_dugmic.setAttribute('id', `sakrij(${pitanjeId})`);
    sakrij_dugmic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                                          <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                                       </svg>`;

    dugmic4.appendChild(sakrij_dugmic);

    const dugmic5 = document.createElement('div');
    dugmic5.className = "col-sm-1";

    const obrisi_dugmic = document.createElement('button');
    obrisi_dugmic.className = "btn";
    obrisi_dugmic.setAttribute('onclick', `obrisiPitanje(${pitanjeId})`);
    obrisi_dugmic.setAttribute('id', `obrisi(${pitanjeId})`);
    obrisi_dugmic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                       </svg>`;

    dugmic5.appendChild(obrisi_dugmic);

    div.appendChild(tekst_pitanja);
    div.appendChild(dugmic1);
    div.appendChild(dugmic2);
    div.appendChild(dugmic4);
    div.appendChild(dugmic5);


    pitanje.appendChild(div);

    const sva_pitanja = document.getElementById('boks');
    sva_pitanja.appendChild(pitanje);
});

socket.on('zabranjena-rijec', function(data, pitanjeId){
    const pitanje = document.createElement('div');
    pitanje.className = "alert alert-info";
    pitanje.setAttribute('id', `pitanje${pitanjeId}`);

    const div = document.createElement('div');
    div.className = "row";

    const tekst_pitanja = document.createElement('div');
    tekst_pitanja.className = "col-sm-8";
    tekst_pitanja.innerText = data;

    const dugmic1 = document.createElement('div');
    dugmic1.className = "col-sm-2";

    const otkrij_dugmic = document.createElement('button');
    otkrij_dugmic.className = "btn";
    otkrij_dugmic.setAttribute('onclick', `otkrijPitanje(${pitanjeId})`);
    otkrij_dugmic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                               </svg>`;

    dugmic1.appendChild(otkrij_dugmic);

    const dugmic2 = document.createElement('div');
    dugmic2.className = "col-sm-2";

    const obrisi_dugmic = document.createElement('button');
    obrisi_dugmic.className = "btn";
    obrisi_dugmic.setAttribute('onclick', `obrisiPitanje(${pitanjeId})`);
    obrisi_dugmic.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                       </svg>`;

    dugmic2.appendChild(obrisi_dugmic);

    div.appendChild(tekst_pitanja);
    div.appendChild(dugmic1);
    div.appendChild(dugmic2);

    pitanje.appendChild(div);

    const sakrivena_pitanja = document.getElementById('sakrivena-pitanja');
    sakrivena_pitanja.appendChild(pitanje);
});

socket.on('promjena_lajkova', function (id, likes) {
    document.getElementById(`brojLajkova${id}`).innerHTML = likes;
});

function posaljiIzvjestaj(kod) {
    $.ajax({
        url: `/pocetna/posalji-izvjestaj`,
        data: {kod: kod},
        type: 'POST'
    }).done(function (data) {
        document.getElementById('notifikacija').style.display = "block";
        document.getElementById('notifikacija').innerHTML = "Izvještaj je dostavljen na Vaš email."
        setTimeout(function() {
            document.getElementById('notifikacija').style.display = "none";
        }, 5000);
    });

}

function posaljiEmailove() {
    $.ajax({
        url: '/pocetna/posalji-emailove',
        data: { emailovi: document.getElementById('email-input').value, kod: kod},
        type: 'POST'
    }).done(function (data) {
        document.getElementById('email-input').value = '';
        document.getElementById('notifikacija').style.display = "block";
        document.getElementById('notifikacija').innerHTML = "Pristupni link uspješno poslan."
        setTimeout(function() {
            document.getElementById('notifikacija').style.display = "none";
        }, 5000);
    })
}