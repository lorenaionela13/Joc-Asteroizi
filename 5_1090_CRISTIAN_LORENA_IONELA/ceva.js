const sunetColiziune = document.getElementById('sunetColiziune');
const canvas = document.getElementById("JocInterpretat");
const context = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const body = document.body; 

startButton.addEventListener("click", function() {
    body.style.backgroundImage = "none"; 
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
			
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			viteza: Math.random() * 0.5 + 0.1 
		});
	}
	
	class NavaSpatiala
	{
		constructor() {
		
                this.a = canvas.width / 2;
                this.b = canvas.height / 2;
                this.unghi = 0;
				this.viteza=5;
				this.deplasare = { sus: false, jos: false, stanga: false, dreapta: false };
            } 

		desenamTriughi() {
	
			context.save();
	
			context.translate(this.a, this.b);

		
			context.rotate(this.unghi);

			const dimensiune = 15;
			
			const numarPuncte = modelNava === 'triunghi' ? 3 : modelNava === 'triunghi2' ? 4 : 3;
			const variatie = Math.sin(Date.now() * 0.001) * 5;
			

			const puncte = [];
			for (let i = 0; i < numarPuncte; i++) {
				
				const unghiPunct = (Math.PI * 2 / numarPuncte) * i - Math.PI / 2; 
				
				const raza = dimensiune + (i % 2 === 0 ? variatie : -variatie); 
				const x = raza * Math.cos(unghiPunct);
				const y = raza * Math.sin(unghiPunct);
				puncte.push({ x, y });
			}
			
			context.beginPath();
			
			context.moveTo(puncte[0].x, puncte[0].y);
			
			for (let i = 1; i < puncte.length; i++) {
				context.lineTo(puncte[i].x, puncte[i].y);
			}
			context.closePath(); 
			context.fillStyle = culoareNava; 
			context.fill();
			
			context.restore();
		}


	 rotatie(directie) 
	 {
		const acceleratie = 0.01;
		
    	this.vitezaRotatie = (this.vitezaRotatie || 0) + directie * acceleratie;

		const vitezaMaxima = 0.2; 
	
		if (this.vitezaRotatie > vitezaMaxima) this.vitezaRotatie = vitezaMaxima;
		if (this.vitezaRotatie < -vitezaMaxima) this.vitezaRotatie = -vitezaMaxima;
		this.unghi += this.vitezaRotatie; 
		this.vitezaRotatie *= 0.98; 
     }
	
	 miscare() {
	   if (this.deplasare.sus) this.b -= this.viteza; 
				if (this.deplasare.jos) this.b += this.viteza;
				if (this.deplasare.stanga) this.a -= this.viteza;
				if (this.deplasare.dreapta) this.a += this.viteza;
				
				this.a = (this.a + canvas.width) % canvas.width;
				this.b = (this.b + canvas.height) % canvas.height;
        }


    OmoaraAsteroizi() 
	{ 
		const unghiVariatie = 0.1; 
		
		if (tragerii.length <= trageriiMaxime - 3) 
		{ 
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
                this.a= Math.random() * canvas.width;
                this.b = Math.random() * canvas.height;
                this.vitezaa = Math.random() * 2 - 1; 
                this.vitezab = Math.random() * 2 - 1; 
                this.rachete = Math.floor(Math.random() * 4) + 1; 
				this.dim = this.rachete * 10; 
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
		
		context.save();
		
		context.shadowColor = 'rgba(0, 0, 0, 0.3)';

		context.shadowBlur = 10;

		
		const gradient = context.createRadialGradient(this.a, this.b, this.dim * 0.3, this.a, this.b, this.dim);
		gradient.addColorStop(0, 'white'); 
		gradient.addColorStop(1, this.AlegemCuloare()); 

		context.beginPath();
		context.arc(this.a, this.b, this.dim, 0, Math.PI * 2);
		context.fillStyle = gradient; 
		context.fill();
		context.lineWidth = 2;
		context.strokeStyle = 'black';  
		context.stroke();
		context.fillStyle = 'black'; 
		context.fillText(this.rachete, this.a - 5, this.b + 5)
		context.restore();
	}


    update() 
	{
		
		this.a += this.vitezaa;
		this.b += this.vitezab;

		
    	if (this.a <= 0 || this.a >= canvas.width) 
		{
			
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
        this.active = true; 
    }
    
    draw() {
        if (this.active) {
            context.fillStyle = "red";
            
            context.beginPath();
			
            context.arc(this.x - this.dim / 4, this.y, this.dim / 4, Math.PI, 0);
            context.arc(this.x + this.dim / 4, this.y, this.dim / 4, Math.PI, 0); 
            context.lineTo(this.x, this.y + this.dim / 2); 
            context.closePath();
            context.fill(); 
        }
    }
    
    checkCollision(tragere)
	{
		
        const dist = Math.hypot(tragere.a - this.x, tragere.b - this.y);
		
        if (dist < this.dim) {
            this.active = false; 
            return true; 
        }
        return false; 
    }
}

class Trageri
	{
		constructor(a, b, unghi) { 
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
		
            this.a += Math.sin(this.unghi) * this.viteza;
            this.b -= Math.cos(this.unghi) * this.viteza;
			
			// 
			const depasesteLimita = this.a < 0 || this.a > canvas.width || this.b < 0 || this.b > canvas.height;
			if (depasesteLimita) { //daca a iesit
				const index = tragerii.indexOf(this); 
				if (index !== -1) { 
					tragerii.splice(index, 1);  
				}
			}
        }
	}
	
	
	function incepeJocul() {
	
            nava= new NavaSpatiala();
			
            for (let i = 0; i < 10; i++) {
                arrayAsteroizi.push(new Asteroizi());
            }
			
            animatie();
        }
	
	
	function animatie() {
           context.clearRect(0, 0, canvas.width, canvas.height);
		   animareFundalStele(); 
            nava.desenamTriughi();
            nava.miscare(); 
			verificareColiziuniIntreAsteroizi();
	
			while (arrayAsteroizi.length < 20) {
				arrayAsteroizi.push(new Asteroizi());
			}

			
            for (let asteroid of arrayAsteroizi) {
                asteroid.desenamCerc();
                asteroid.update();
            }
            for (let trage of tragerii) {
               trage.desenamCerculete();
                trage.update();
            }
            ScadeVietiiAsteroizi();

			
			 if (figuraViata) {
				figuraViata.draw();
				}

            context.fillStyle = 'white';
            context.fillText(`Scor: ${scor}`, 10, 20); 
            context.fillText(`Vieți: ${vieti}`, canvas.width - 100, 20); 
            requestAnimationFrame(animatie);
        }
		
		function desenareStea(context, x, y, raza, colturi, adancime) 
		{
		
			const unghi = Math.PI / colturi;
			context.beginPath();//incepem
			for (let i = 0; i < 2 * colturi; i++) {
				
				const r = i % 2 === 0 ? raza : raza * adancime;
				
				const nx = x + r * Math.cos(i * unghi);
				const ny = y + r * Math.sin(i * unghi);
				context.lineTo(nx, ny);
			}
			context.closePath();
			context.fillStyle = 'white';
			context.fill();
			}

	function animareFundalStele() {
		context.fillStyle = 'rgba(0, 0, 0, 0.3)';
		context.fillRect(0, 0, canvas.width, canvas.height);

		for (let i = 0; i < stele.length; i++) {
			const star = stele[i];
			desenareStea(context, star.x, star.y, 3, 5, 0.5);
			star.y += star.viteza;
			if (star.y > canvas.height) { 
		
				star.y = Math.random() * -10;
				star.x = Math.random() * canvas.width;
			}
		}
	}
		
		function coliziuneIntreAsteroizi(asteroid1, asteroid2) 
		{
			
		const distanta = Math.hypot(asteroid1.a - asteroid2.a, asteroid1.b - asteroid2.b);
		const razaTotala = asteroid1.dim + asteroid2.dim;
		
		if (distanta < razaTotala) {
			
			const unghiColiziune = Math.atan2(asteroid2.b - asteroid1.b, asteroid2.a - asteroid1.a);

		
			const vitezaX1 = asteroid1.vitezaa;
			const vitezaY1 = asteroid1.vitezab;
			const vitezaX2 = asteroid2.vitezaa;
			const vitezaY2 = asteroid2.vitezab;

			
			asteroid1.vitezaa = vitezaX2 * Math.cos(unghiColiziune) - vitezaY2 * Math.sin(unghiColiziune);
			asteroid1.vitezab = vitezaX2 * Math.sin(unghiColiziune) + vitezaY2 * Math.cos(unghiColiziune);
			asteroid2.vitezaa = vitezaX1 * Math.cos(unghiColiziune) - vitezaY1 * Math.sin(unghiColiziune);
			asteroid2.vitezab = vitezaX1 * Math.sin(unghiColiziune) + vitezaY1 * Math.cos(unghiColiziune);
		}
}

  function verificareColiziuniIntreAsteroizi() {
    for (let i = 0; i < arrayAsteroizi.length; i++) { 
        for (let j = i + 1; j < arrayAsteroizi.length; j++) {
			
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

		
    if (scor >= pragFigViata && !figuraViata) {
        figuraViata = new FiguraViata(); 
    }
	
	if(scor>=500)
	{
	alert("Ati atins scorul maxim  de puncte!FELICITARI!");
		cresteDificultatea();
	}
    

    for (let tragere of tragerii) {
        for (let asteroid of arrayAsteroizi) {
		 
            const dist = Math.hypot(tragere.a - asteroid.a, tragere.b - asteroid.b);
            if (dist < asteroid.dim) { 
                asteroid.rachete--; 
                scor += 10; 
                tragerii.splice(tragerii.indexOf(tragere), 1); 

                if (asteroid.rachete <= 0) { 
                    arrayAsteroizi.splice(arrayAsteroizi.indexOf(asteroid), 1);
                    arrayAsteroizi.push(new Asteroizi()); 
                }
				else{
					asteroid.dim = asteroid.rachete * 10;
				}
                return; 
            }
        }
	sunetColiziune.currentTime = 0;
    sunetColiziune.play();
    }

	
    for (let asteroid of arrayAsteroizi) {
		
        const dist = Math.hypot(nava.a - asteroid.a, nava.b - asteroid.b);
        if (dist < asteroid.dim) { 
            vieti--;
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


    if (figuraViata && figuraViata.active) {
        for (let tragere of tragerii) {
            if (figuraViata.checkCollision(tragere)) {
                vieti++;
                alert(`Ai câștigat o viață! Ai acum ${vieti} vieți.`);
                figuraViata = null; 
                pragFigViata += pragFigViata; 
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
    z: () => { nava.rotatie(-1); }, 
    c: () => { nava.rotatie(1); }, 
    x: () => { nava.OmoaraAsteroizi(); } 
};


window.addEventListener('keydown', (e) => {
    const actiune = actiuni[e.key];
    if (actiune) {
        actiune();
    }
});


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