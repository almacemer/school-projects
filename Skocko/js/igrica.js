var svi_znakovi = ["owl", "tref", "pik", "herc", "karo", "star"];
var kombinacija = generisi();

function generisi() {
	var indeks = Math.floor(Math.random()*6);
	var prvi_znak = svi_znakovi[indeks];
	indeks = Math.floor(Math.random()*6);
	var drugi_znak = svi_znakovi[indeks];
	indeks = Math.floor(Math.random()*6);
	var treci_znak = svi_znakovi[indeks];
	indeks = Math.floor(Math.random()*6);
	var cetvrti_znak = svi_znakovi[indeks];
	var rezultat = [prvi_znak, drugi_znak, treci_znak, cetvrti_znak]
	return rezultat;
}

console.log(svi_znakovi);
console.log(kombinacija);
var red = 0;
var kolona = 0;
var unesena_kombinacija = [];
var bodovi = 0;


//document.getElementsByClassName('znak1').innerHTML =  'blaaa';


function dodajZnak(simbol) {
		if (kolona < 4) {
			unesena_kombinacija.push(simbol);
			document.getElementsByClassName('brisanje')[red].style.display = "inline-block";
			console.log('owl');
			console.log("kolona : " + kolona);
			var id_polja = 4*red + kolona;	
			var polje = document.getElementsByClassName("dugmic2")[id_polja];
			var slika = document.createElement("img");
			slika.src = "../images/" + simbol + ".png";
			slika.classList.add('znak');
			slika.classList.add('img-fluid');
			polje.appendChild(slika);
			kolona++;
		}
		if (kolona == 4) {
			document.getElementsByClassName("slanje")[red].style.display = "inline-block";
		}
	
};

function posaljiKombinaciju() {
	for (let i = 0; i < 4; i++) {
		let krug = document.getElementsByClassName('kruzic'+(red+1).toString())[i].style.backgroundColor = "#bbb";
	}

	var na_tacnom_mjestu = 0;
	var na_pogresnom_mjestu = 0;

	console.log('unesena_kombinacija: ');
	console.log(unesena_kombinacija);

	var pomocni = [];
	pomocni.push(unesena_kombinacija[0]);
	pomocni.push(unesena_kombinacija[1]);
	pomocni.push(unesena_kombinacija[2]);
	pomocni.push(unesena_kombinacija[3]);

	var pomocni2 = [];
	pomocni2.push(kombinacija[0]);
	pomocni2.push(kombinacija[1]);
	pomocni2.push(kombinacija[2]);
	pomocni2.push(kombinacija[3]);

	for(let i = 0; i < 4; i++) {
		if(unesena_kombinacija[i] == kombinacija[i]) {
			na_tacnom_mjestu += 1;
			let pozicija1 = pomocni.indexOf(kombinacija[i]);
			let pozicija2 = pomocni2.indexOf(kombinacija[i]);
			pomocni.splice(pozicija1,1);
			pomocni2.splice(pozicija2,1);
		}
	}
	console.log("pomocni  " + pomocni);
	console.log("pomocni2 " + pomocni2);

	var i = 0;
	while (i < pomocni.length) {
		if (pomocni2.includes(pomocni[i])) {
			let pozicija = pomocni2.indexOf(pomocni[i]);
			pomocni2.splice(pozicija, 1);
			na_pogresnom_mjestu++;
		}
		i++;
	}

	console.log("tacno" + na_tacnom_mjestu);
	console.log("netacno" + na_pogresnom_mjestu);

	document.getElementsByClassName("slanje")[red].style.display = "none";
	document.getElementsByClassName("brisanje")[red].style.display = "none";

	document.getElementsByClassName("crvenoIZuto")[red].style.display = "inline-block";

	for(let i = 0; i < na_tacnom_mjestu; i++) {
		let krug = document.getElementsByClassName('kruzic'+(red+1).toString())[i].style.backgroundColor = "red";
		console.log("crveno");
	}
	for(let j = na_tacnom_mjestu; j < na_tacnom_mjestu + na_pogresnom_mjestu; j++) {
		let krug = document.getElementsByClassName('kruzic'+(red+1).toString())[j].style.backgroundColor = "yellow";
		console.log("zuto");
	}	

	if (na_tacnom_mjestu == 4) {
		bodovi += 100 - 10*red;
		var bod = bodovi.toString();
		console.log(bodovi);
		var poruka = document.getElementsByClassName('alert')[0].style.display = "inline-block";
		document.getElementById('p').innerHTML = bod;

		setTimeout(function() {
    		var nizCZ = document.getElementsByClassName("crvenoIZuto");
			var nizDugmica = document.getElementsByClassName('dugmic2');
			
			for (let i = 0; i < 4; i++) {
				let krug = document.getElementsByClassName('kruzic'+(red+1).toString())[i].style.backgroundColor = "#bbb";
			}
			
			red = 0;
			kolona = 0;
			na_tacnom_mjestu = 0;
			na_pogresnom_mjestu = 0;

			kombinacija = generisi();
			unesena_kombinacija = [];
			console.log(kombinacija);

			for (let i = 0; i < nizCZ.length; i++) {
				nizCZ[i].style.display = 'none';
			}

			for (let i = 0; i < nizDugmica.length; i++) {
				nizDugmica[i].innerHTML = ' ';
			}
		}, 3000);
		
	}

	if (red == 6) {
		document.getElementsByClassName('kraj')[0].style.display = "block";
		document.getElementById('bodovi').innerHTML = bodovi.toString();
		console.log(bodovi);
		bodovi = 0;
		for (let i = 1; i < 5; i++) {
			var znak1 = document.getElementsByClassName('znak1');			
			var slika1 = document.createElement("img");
			slika1.src = "../images/" + kombinacija[i-1] + ".png";
			slika1.classList.add('znak');
			slika1.classList.add('img-fluid');
			znak1[i-1].appendChild(slika1);
		}
		window.scrollTo(0, document.body.scrollHeight);

	}

	unesena_kombinacija = [];
	red++;
	console.log("red"+ red);
	kolona = 0;
}

var bod1 = 0;

function obrisiZnak() {	
	document.getElementsByClassName('dugmic2')[4*red + kolona - 1].innerHTML = '';
	if (kolona > 0) {
		kolona--;
		unesena_kombinacija.pop();
	}
	if (kolona == 0)
		document.getElementsByClassName("brisanje")[red].style.display = "none";
	else if(kolona == 3)
		document.getElementsByClassName('slanje')[red].style.display = "none";
}