//Selectează un element HTML cu id="sunetColiziune" pentru a manipula sunetele de coliziune în joc.
const sunetColiziune = document.getElementById('sunetColiziune');
//Selectează un element <canvas> cu id="JocInterpretat".
const canvas = document.getElementById("JocInterpretat");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const body = document.body; //body==intregul corp al paginii

startButton.addEventListener("click", function() {
    body.style.backgroundImage = "none"; //schimba fundalul paginii pentru a elimina img de fundal
});

	let figuraViata = null; 
	let pragFigViata = 100; 
	let arrayAsteroizi = [];
	let tragerii = [];
	let navaSpatiala;
	let vieti = 3;
	let scor = 0;
	const trageriiMaxime = 3;
	let culoareNava = '#FFFFFF'; 
    let modelNava = 'triunghi'; 
	
	const stele = [];
	const numarStele = 200; 

	for (let i = 0; i < numarStele; i++) {
		stele.push({
			//x si y sunt pozitii aleatoare pe ecran 
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			viteza: Math.random() * 0.5 + 0.1 //pt a fii o viteza mica
		});
	}
	
	class NavaSpatiala
	{
		constructor() {
			//coordonate initiale pe centrul ecranului
                this.a = canvas.width / 2;
                this.b = canvas.height / 2;
                this.unghi = 0;//in radiani
				this.viteza=5;
				this.deplasare = { sus: false, jos: false, stanga: false, dreapta: false };
            } 

		desenamTriughi() {
			//Salvează și restaurează contextul grafic pentru a lucra cu rotații și transformări.
			context.save();
			//muta punctul de desenare la pozitia navei(adica 0,0)
			context.translate(this.a, this.b);

			//roteste nava conform unghiului curent
			context.rotate(this.unghi);

			const dimensiune = 15;
			//determina cate puncte are figura"triunghi"
			//1 va avea 3 iar 2 va avea 4
			const numarPuncte = modelNava === 'triunghi' ? 3 : modelNava === 'triunghi2' ? 4 : 3;
			const variatie = Math.sin(Date.now() * 0.001) * 5;
			//Math.sin() oscilează între -1 și 1, iar înmulțind cu 5, obținem o variație între -5 și +5.
			//Date.now() asigură că variația se schimbă constant în funcție de timp, creând un efect dinamic (de "pulsare"). 

			const puncte = [];//pt stocarea coordonatelor
			for (let i = 0; i < numarPuncte; i++) {
				//Math.PI * 2 reprezintă un cerc complet (360°).
				//Îpărțim cercul la numărul de puncte (numarPuncte) pentru a determina unghiul dintre fiecare punct.
				//i indică ce punct calculăm.
				// Math.PI / 2 rotește figura astfel încât să fie orientată cu vârful în sus.
				const unghiPunct = (Math.PI * 2 / numarPuncte) * i - Math.PI / 2; 
				//Alternăm variația sinusoidală (+variatie sau -variatie) pentru a crea un efect vizual mai interesant (ca un triunghi distorsionat).
				const raza = dimensiune + (i % 2 === 0 ? variatie : -variatie); 
				const x = raza * Math.cos(unghiPunct);//det poz pt axa X
				const y = raza * Math.sin(unghiPunct);//det poz pt axa Y
				puncte.push({ x, y });//adaucam punctul in array
			}
			//o noua calde de desenare
			context.beginPath();
			//se muta punctul de inceput la primul punct din array ul de mai sus
			context.moveTo(puncte[0].x, puncte[0].y);
			//se parcurg toate punctele si se deseneaza o linie intre ele
			for (let i = 1; i < puncte.length; i++) {
				context.lineTo(puncte[i].x, puncte[i].y);
			}
			context.closePath(); //inchidem conectand ultimul punct cu primul
			context.fillStyle = culoareNava; //culoarea de umplere
			context.fill();//umplem figura cu acea culoare
			//Restaurăm starea inițială a contextului grafic, anulând rotațiile și translatarea făcute anterior.
			context.restore();
		}


	 rotatie(directie) 
	 {
		const acceleratie = 0.01;
		//viteza curenta ==daca e pozitiv -dreapta,daca e nagativ--stanga
    	this.vitezaRotatie = (this.vitezaRotatie || 0) + directie * acceleratie;

		const vitezaMaxima = 0.2; //limita
		//daca se depaseste  este ajustata(0.2 poz si -0.2 neg)
		if (this.vitezaRotatie > vitezaMaxima) this.vitezaRotatie = vitezaMaxima;
		if (this.vitezaRotatie < -vitezaMaxima) this.vitezaRotatie = -vitezaMaxima;
		this.unghi += this.vitezaRotatie; //actualizam unghiul navei
		this.vitezaRotatie *= 0.98; // coef de decelerare
     }
	
	 miscare() {
	   if (this.deplasare.sus) this.b -= this.viteza; //daca se misca in sus se scade valoarea lui b(adica y) pentru ca nava sa se mute mai aproape de partea de sus a ecranului
				if (this.deplasare.jos) this.b += this.viteza;
				if (this.deplasare.stanga) this.a -= this.viteza;
				if (this.deplasare.dreapta) this.a += this.viteza;
				//daca depasim marginea din drp sau stanga ,va aparea pe cealalta parte 
				this.a = (this.a + canvas.width) % canvas.width;
				this.b = (this.b + canvas.height) % canvas.height;
        }


    OmoaraAsteroizi() 
	{ 
		const unghiVariatie = 0.1; 
		//verifica daca este loc pentru a adauga 3 tragerii
		if (tragerii.length <= trageriiMaxime - 3) 
		{ // -1==stanga 0 ==mijloc 1=dreapta
			for (let i = -1; i <= 1; i++)
			{
				const tragereNoua = new Trageri(this.a, this.b, this.unghi + i * unghiVariatie);
				tragerii.push(tragereNoua);
			}
		}
    }
}
			
class Asteroizi{

	constructor() {
                this.a= Math.random() * canvas.width;//coordonata X
                this.b = Math.random() * canvas.height; //coordonata Y
                this.vitezaa = Math.random() * 2 - 1; //intre -1 si 1
                this.vitezab = Math.random() * 2 - 1; //pt a se misca in orice directie
                this.rachete = Math.floor(Math.random() * 4) + 1; //intre 1 si 4(viata asteroidului)
				this.dim = this.rachete * 10; //dim proportionala cu nr de vietii
            }
			
	AlegemCuloare() {
		console.log('Health:', this.rachete); 
		const culori = {
			1: 'green',
			2: 'yellow',
			3: 'orange',
			4: 'red'
		 };
    return culori[this.rachete] || 'gray'; 
}


	desenamCerc() 
	{
		//se salveaza contextul grafic 
		context.save();
		//culoarea umbrei-negru
		context.shadowColor = 'rgba(0, 0, 0, 0.3)';
		//gradul de blur al umbrei
		context.shadowBlur = 10;

		//gradient ce incepe din centrul si se extinde pana la marginii
		//this.dim* 03.--raza de inceput<dim asteroidului
		const gradient = context.createRadialGradient(this.a, this.b, this.dim * 0.3, this.a, this.b, this.dim);
		gradient.addColorStop(0, 'white'); //in centru alb
		gradient.addColorStop(1, this.AlegemCuloare()); //culoare specifica fiecarei dim

		context.beginPath();//incepem
		context.arc(this.a, this.b, this.dim, 0, Math.PI * 2);//dim=raza,cerc complet
		context.fillStyle = gradient; //setam culoarea
		context.fill();//umplem
		context.lineWidth = 2;//dim conturului
		context.strokeStyle = 'black';  //culoarea
		context.stroke();//desenarea
		context.fillStyle = 'black'; //culoarea scrisului
		context.fillText(this.rachete, this.a - 5, this.b + 5)//in centru
		context.restore();//restaurarea contextului la starea salvata 
	}


    update() 
	{
		//actualizeaza pox asteroidului 
		this.a += this.vitezaa;//a pe axa X cu vitezaa
		this.b += this.vitezab;

		//daca atinge marginea stanga  sau dreapta  
    	if (this.a <= 0 || this.a >= canvas.width) 
		{
			//se inverseaza directia pe axa X
			this.vitezaa *= -1; 
	    }

		if (this.b <= 0 || this.b >= canvas.height) 
		{
			this.vitezab *= -1; 
		}
    }	
				
}
	
class FiguraViata {
	
    constructor() {
        this.x = Math.random() * canvas.width; 
        this.y = Math.random() * canvas.height; 
        this.dim = 30; 
        this.active = true; //daca este vizibila
    }
    
    draw() {
        if (this.active) {
            context.fillStyle = "red";
            
            context.beginPath();
			//creaza 2 arce(jumattai de cerc pt formarea vf inimii)
            context.arc(this.x - this.dim / 4, this.y, this.dim / 4, Math.PI, 0); //stanga
            context.arc(this.x + this.dim / 4, this.y, this.dim / 4, Math.PI, 0); //dreapta
            context.lineTo(this.x, this.y + this.dim / 2); //linie de la baza celor 2 arce pana la un punct de jos
            context.closePath(); //inchidem
            context.fill(); //umplem
        }
    }
    
    checkCollision(tragere)
	{
		//dist dintre proiectii(tragerii) si inima
		//teorema lui pitagora 
		//returneaza radacina patrata a sumei patratelor dif pe X SI Y
        const dist = Math.hypot(tragere.a - this.x, tragere.b - this.y);
		//daca dist <dim -- a lovit  figura
        if (dist < this.dim) {
            this.active = false; //dispare
            return true; //a avut loc coleziunea
        }
        return false; //n a avut loc coleziunea
    }
}

class Trageri
	{
		constructor(a, b, unghi) { //pozitia navei
            this.a = a;
            this.b = b;
            this.unghi= unghi;
            this.viteza = 10;
        }

        desenamCerculete() {
            context.beginPath();
			//raza =3
            context.arc(this.a, this.b, 3, 0, Math.PI * 2);
            context.fillStyle = 'white';
            context.fill();
        }

        update() {
			//actualizam pozitia 
            this.a += Math.sin(this.unghi) * this.viteza;//* viteza-- det cat de mult s a deplasat la fiecare actualizare
            this.b -= Math.cos(this.unghi) * this.viteza;
			
			// iesire din afara canvasului
			const depasesteLimita = this.a < 0 || this.a > canvas.width || this.b < 0 || this.b > canvas.height;
			if (depasesteLimita) { //daca a iesit
				const index = tragerii.indexOf(this); //index=pozitia din array trageri 
				if (index !== -1) { //daca este gasit 
					tragerii.splice(index, 1); //il elimina 
				}
			}
        }
	}
	
	
	function incepeJocul() {
		//creearea navei
            nava= new NavaSpatiala();
			//creaza 10 asteroizi (loop)
            for (let i = 0; i < 10; i++) {
                arrayAsteroizi.push(new Asteroizi());//pentru a putea fii desenat si actualizat
            }
			//porneste animatia
            animatie();
        }
	
	
	function animatie() {
           context.clearRect(0, 0, canvas.width, canvas.height);//sterge continut din canvas
		   animareFundalStele(); //animatia fundalului
            nava.desenamTriughi();//se deseneaza triunghiul
            nava.miscare(); //animatia navei
			verificareColiziuniIntreAsteroizi();
			//daca nr curent de asteroizi<20 --se adauga noi asteroizii in array
			while (arrayAsteroizi.length < 20) {
				arrayAsteroizi.push(new Asteroizi());
			}

			//pt fiecare asteroid din array se deseneaza si actualizeaza poz sa
            for (let asteroid of arrayAsteroizi) {
                asteroid.desenamCerc();
                asteroid.update();
            }
            for (let trage of tragerii) {
               trage.desenamCerculete();
                trage.update();
            }
            ScadeVietiiAsteroizi();

			//daca este activ,se va desena 
			 if (figuraViata) {
				figuraViata.draw();
				}

            context.fillStyle = 'white';
            context.fillText(`Scor: ${scor}`, 10, 20); //in stanga sus
            context.fillText(`Vieți: ${vieti}`, canvas.width - 100, 20); //dreapta sus
            requestAnimationFrame(animatie);//se apeleaza functuia pt a cotnua bucla de desenare si actualizare
        }
		
		function desenareStea(context, x, y, raza, colturi, adancime) 
		{
			//adancime: Factorul de scalare pentru razele interioare (dimensiunea lor relativă față de razele principale).
			const unghi = Math.PI / colturi;//unghiul dintre 2 puncte succesive 
			//colturi==nr de colturi ale stelei 
			context.beginPath();//incepem
			for (let i = 0; i < 2 * colturi; i++) {
				//pentru punctele externa folism raza pentru interna raza* adacime
				const r = i % 2 === 0 ? raza : raza * adancime;
				//coord fiecarui punct al stelei 
				//det poz pe baza unghiului curent 
				const nx = x + r * Math.cos(i * unghi);
				const ny = y + r * Math.sin(i * unghi);
				context.lineTo(nx, ny);
			}
			context.closePath();
			context.fillStyle = 'white';
			context.fill();
			}

	function animareFundalStele() {
		context.fillStyle = 'rgba(0, 0, 0, 0.3)';//un dreptunghii semitransparent pe intrega sup a canvasului
		context.fillRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < stele.length; i++) {
			const star = stele[i];
			desenareStea(context, star.x, star.y, 3, 5, 0.5);
			star.y += star.viteza;//se misca in jos
			if (star.y > canvas.height) { //daca iese din canvas 
				//se repozitioneaza
				star.y = Math.random() * -10;
				star.x = Math.random() * canvas.width;
			}
		}
	}
		
		function coliziuneIntreAsteroizi(asteroid1, asteroid2) 
		{
			//calc dist cu o formula matematica 
		const distanta = Math.hypot(asteroid1.a - asteroid2.a, asteroid1.b - asteroid2.b);
		const razaTotala = asteroid1.dim + asteroid2.dim;
		//daca a dist dintre centrele lor <  suma razelor lor  --se suprapun
		if (distanta < razaTotala) {
			//returneaza unghiul (radiani) intre axa X si vectorul dintre centrele celor 2 asteroizi
			const unghiColiziune = Math.atan2(asteroid2.b - asteroid1.b, asteroid2.a - asteroid1.a);

			//salvam vitezele  inainte de coleziune 
			const vitezaX1 = asteroid1.vitezaa;
			const vitezaY1 = asteroid1.vitezab;
			const vitezaX2 = asteroid2.vitezaa;
			const vitezaY2 = asteroid2.vitezab;

			//acctualizam comp de viteza pt cei 2 asteroizi
			asteroid1.vitezaa = vitezaX2 * Math.cos(unghiColiziune) - vitezaY2 * Math.sin(unghiColiziune);
			asteroid1.vitezab = vitezaX2 * Math.sin(unghiColiziune) + vitezaY2 * Math.cos(unghiColiziune);
			asteroid2.vitezaa = vitezaX1 * Math.cos(unghiColiziune) - vitezaY1 * Math.sin(unghiColiziune);
			asteroid2.vitezab = vitezaX1 * Math.sin(unghiColiziune) + vitezaY1 * Math.cos(unghiColiziune);
		}
}

  function verificareColiziuniIntreAsteroizi() {
    for (let i = 0; i < arrayAsteroizi.length; i++) { //parcurge  fiecare asteroid
        for (let j = i + 1; j < arrayAsteroizi.length; j++) {
			//incepe de la i+1 pt a evita verifcarea asteroiduluui cu el insusui  si 
			//pt a reduce verficari redundante
            coliziuneIntreAsteroizi(arrayAsteroizi[i], arrayAsteroizi[j]);
        }
    }
}
		
	 function resetGame() {
			scor = 0;
			vieti = 3;
			nava.a = 100;
			nava.b = 100; 
			arrayAsteroizi = [];
			for (let i = 0; i < 10; i++) {
				arrayAsteroizi.push(new Asteroizi());
			}
			figuraViata = null; 
			pragFigViata = 100;
        }
		
		function cresteDificultatea() {
			vieti = 3;
			scor = 0;
			arrayAsteroizi,tragerii = [];
			nava = new NavaSpatiala(); 
			for (let i = 0; i < 10; i++) {
				arrayAsteroizi.push(new Asteroizi());
			}
			figuraViata = null; 
			animatie(); 
}
	
		
	function ScadeVietiiAsteroizi() {

		//cand se atinge 100 apare inima si nu exista deja o inima pe ecran
    if (scor >= pragFigViata && !figuraViata) {
        figuraViata = new FiguraViata(); 
    }
	
	if(scor>=500)
	{
	alert("Ati atins scorul maxim  de puncte!FELICITARI!");
		cresteDificultatea();
	}
    

    for (let tragere of tragerii) {//parcurgem toate tragerile
        for (let asteroid of arrayAsteroizi) { //pt fiecare tragere se parcurge fiecare asteroid
			//dist dintre poz tragerii si poz asteroidului  
            const dist = Math.hypot(tragere.a - asteroid.a, tragere.b - asteroid.b);
            if (dist < asteroid.dim) { //daca dist<dim asteroidului( a lovit asteroidul)
                asteroid.rachete--; //reducer viata asteroidlui cu 1 
                scor += 10; //scorul creste cu 10
                tragerii.splice(tragerii.indexOf(tragere), 1); //elimina tragerea care a lovit asteroidul din lista

                if (asteroid.rachete <= 0) { //daca vitile asteroidului sunt epuizate
                    arrayAsteroizi.splice(arrayAsteroizi.indexOf(asteroid), 1);//elimina asteroidul din lista 
                    arrayAsteroizi.push(new Asteroizi()); //se adauga unul nou 
                }
				else{
					asteroid.dim = asteroid.rachete * 10;//actualizeaza dim astroidului in funct de vitile ramase
				}
                return; //opreste verficarea supl pt acea traere( a fost elim)
            }
        }
	sunetColiziune.currentTime = 0;
    sunetColiziune.play();
    }

	//parcurgem lista de asteroidzi 
    for (let asteroid of arrayAsteroizi) {
		//dist dintre nava si asteroid 
        const dist = Math.hypot(nava.a - asteroid.a, nava.b - asteroid.b);
        if (dist < asteroid.dim) { //daca s au cicocnit 
            vieti--;//scade vieti
            if (vieti > 0) {
                alert(`Ai ${vieti} vieți rămase!`);
				 arrayAsteroizi = [];
            for (let i = 0; i < 10; i++) {
                arrayAsteroizi .push(new Asteroizi());
            }
            } else {
               alert("Jocul s-a terminat! Scor final: " + scor);
                resetGame();
            }
            break;
        }
    }

	//daca figura este activa
    if (figuraViata && figuraViata.active) {
        for (let tragere of tragerii) {//parcurgem targerile
            if (figuraViata.checkCollision(tragere)) {//daca exista coleziune 
                vieti++; //creste cu 1 
                alert(`Ai câștigat o viață! Ai acum ${vieti} vieți.`);
                figuraViata = null; 
                pragFigViata += pragFigViata; //se dubleaza
                break;
            }
        }
    }
}
	
const actiuni = {
    ArrowUp: () => { nava.deplasare.sus = true; },
    ArrowDown: () => { nava.deplasare.jos = true; },
    ArrowLeft: () => { nava.deplasare.stanga = true; },
    ArrowRight: () => { nava.deplasare.dreapta = true; },
    z: () => { nava.rotatie(-1); }, //stanga
    c: () => { nava.rotatie(1); },  //dreapta 
    x: () => { nava.OmoaraAsteroizi(); } 
};

//cand o tasta este apasata
window.addEventListener('keydown', (e) => {
    const actiune = actiuni[e.key];
    if (actiune) {
        actiune();
    }
});

//cand o tasta este eliberata 
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') nava.deplasare.sus = false;
    if (e.key === 'ArrowDown') nava.deplasare.jos = false;
    if (e.key === 'ArrowLeft') nava.deplasare.stanga = false;
    if (e.key === 'ArrowRight') nava.deplasare.dreapta = false;
    if (e.key === 'z' || e.key === 'c') {
        nava.vitezaRotatie = 0;
    }
});


 document.getElementById('startButton').addEventListener('click', () => 
 {
			culoareNava = document.getElementById('culoareNava').value;
			modelNava= document.getElementById("modelNava").value;
			const name = document.getElementById('nume').value.trim();
			const age = document.getElementById('varsta').value.trim();
			
			nava = new NavaSpatiala(culoareNava,modelNava);
			if (!name) {
				alert("Te rugăm să introduci numele.");
				return;
			}
			if (!age || isNaN(age) || age <= 0) {
				alert("Te rugăm să introduci o vârstă validă.");
				return;
			}
			incepeJocul();
			document.getElementById("formular").style.display = "none";
			canvas.style.display = "block";
  });