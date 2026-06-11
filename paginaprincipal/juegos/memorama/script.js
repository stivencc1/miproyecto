let tiempoRestante = 0;
let cronometro = null;

const todosSimbolos = [

    "🐱", "🐶", "🌞", "🌙",
    "🍎", "⭐", "⚽", "🚗",
    "🐵", "🍉", "🍇", "🎈",
    "🎮", "💎", "👑", "🎲",
    "🚀", "🐼"

];

let cartas = [];

let primera = null;
let segunda = null;

let bloqueo = false;

let intentos = 0;

let parejas = 0;

let segundos = 0;

// ==========================
// AVATAR SELECCIONADO
// ==========================

let avatarSeleccionado =
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex";

function seleccionarAvatar(elemento) {

    document.querySelectorAll(".avatar").forEach(avatar => {

        avatar.classList.remove("avatar-seleccionado");

    });

    elemento.classList.add("avatar-seleccionado");

    avatarSeleccionado = elemento.dataset.avatar;

}

// ==========================
// JUEGO
// ==========================

function mezclar(cantidadParejas) {

    cartas = [];

    let seleccion = [...todosSimbolos];

    seleccion.sort(() => Math.random() - 0.5);

    seleccion = seleccion.slice(0, cantidadParejas);

    seleccion.forEach(simbolo => {

        cartas.push(simbolo);
        cartas.push(simbolo);

    });

    cartas.sort(() => Math.random() - 0.5);

}

function crearTablero() {

    const tablero = document.getElementById("tablero");

    if (cartas.length == 16) {

        tablero.style.gridTemplateColumns = "repeat(4,100px)";

    }

    if (cartas.length == 24) {

        tablero.style.gridTemplateColumns = "repeat(6,90px)";

    }

    if (cartas.length == 36) {

        tablero.style.gridTemplateColumns = "repeat(6,80px)";

    }
    if (cartas.length == 36) {

        document.querySelectorAll(".carta").forEach(carta => {

            carta.style.width = "75px";
            carta.style.height = "75px";
            carta.style.fontSize = "30px";

        });

    }

    tablero.innerHTML = "";

    cartas.forEach((simbolo, index) => {

        const carta = document.createElement("div");

        carta.classList.add("carta");

        carta.classList.add("oculta");

        carta.dataset.valor = simbolo;

        carta.dataset.id = index;

        carta.innerHTML = simbolo;

        carta.onclick = () => voltear(carta);

        tablero.appendChild(carta);

    });

}

function voltear(carta) {

    if (bloqueo) return;

    if (!carta.classList.contains("oculta")) return;

    carta.classList.remove("oculta");

    if (primera == null) {

        primera = carta;

        return;

    }

    segunda = carta;

    bloqueo = true;

    intentos++;

    document.getElementById("intentos").textContent = intentos;

    if (primera.dataset.valor == segunda.dataset.valor) {

        primera.classList.add("encontrada");

        segunda.classList.add("encontrada");

        primera = null;

        segunda = null;

        bloqueo = false;

        parejas++;

        if (parejas == cartas.length / 2) {

            setTimeout(() => {

                alert("🏆 ¡Ganaste!");

            }, 300);

        }

    }

    else {

        setTimeout(() => {

            primera.classList.add("oculta");

            segunda.classList.add("oculta");

            primera = null;

            segunda = null;

            bloqueo = false;

        }, 800);

    }

}

function reloj() {

    let min = Math.floor(tiempoRestante / 60);
    let seg = tiempoRestante % 60;

    document.getElementById("tiempo").textContent =
        String(min).padStart(2, "0") +
        ":" +
        String(seg).padStart(2, "0");

    tiempoRestante--;

    if (tiempoRestante <= 0) {

        clearInterval(cronometro);

        alert("⏰ ¡Se acabó el tiempo!");

        return;

    }

}

function reiniciar(cantidadParejas) {

    segundos = 0;

    intentos = 0;

    parejas = 0;

    primera = null;

    segunda = null;

    bloqueo = false;

    document.getElementById("intentos").textContent = "0";

    mezclar(cantidadParejas);

    crearTablero();

}

// ==========================
// BOTÓN COMENZAR
// ==========================

document.getElementById("btnComenzar").onclick = () => {

    const gamenick = document.getElementById("gamenick").value;
    const tiempoMaximo =
        parseInt(document.getElementById("tiempoMax").value);
    tiempoRestante = tiempoMaximo;

    clearInterval(cronometro);

    cronometro = setInterval(reloj, 1000);

    const cantidadParejas =
        parseInt(document.getElementById("cantidadParejas").value);

    const tiempoMemorizar =
        parseInt(document.getElementById("tiempoMemorizar").value);

    if (gamenick == "") {

        alert("Ingresa un GameNick");

        return;

    }


    // Ocultar menú
    document.getElementById("menu").style.display = "none";

    // Mostrar juego
    document.getElementById("juego").style.display = "block";

    // Mostrar tablero
    document.getElementById("tablero").style.display = "grid";

    // Reiniciar variables
    reiniciar(cantidadParejas);
    document.getElementById("nombreJugador").textContent =
        gamenick;

    document.getElementById("avatarJugador").src =
        avatarSeleccionado;

    mostrarTodas();

    setTimeout(() => {

        ocultarTodas();

    }, tiempoMemorizar * 1000);

};

// ==========================
// INICIALIZAR
// ==========================

mezclar(8);
crearTablero();

function mostrarTodas() {

    document.querySelectorAll(".carta").forEach(carta => {

        carta.classList.remove("oculta");

    });

}
function ocultarTodas() {

    document.querySelectorAll(".carta").forEach(carta => {

        carta.classList.add("oculta");

    });

}