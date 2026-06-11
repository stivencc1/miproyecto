let minNumero = 1;
let maxNumero = 100;

let numeroSecreto =
    Math.floor(
        Math.random() *
        (maxNumero - minNumero + 1)
    ) + minNumero;

let intentos = 0;

let maxIntentos = 10;
let avatarSeleccionado =
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex";

mostrarTabla();
mostrarPerdedores();

function adivinar() {

    const gamenick =
        document.getElementById("gamenick")
            .value.trim();

    const numero =
        parseInt(
            document.getElementById("adivinanza").value
        );

    const maxInput =
        parseInt(
            document.getElementById("maxIntentosInput").value
        );

    const minInput =
        parseInt(
            document.getElementById("minNumero").value
        );

    const maxNumeroInput =
        parseInt(
            document.getElementById("maxNumero").value
        );

    const resultado =
        document.getElementById("resultado");

    const intentosDiv =
        document.getElementById("intentos");

    /* ===== VALIDACIONES ===== */

    if (gamenick === "") {

        resultado.textContent =
            "⚠️ Ingresa un GameNick.";

        return;
    }

    if (
        isNaN(minInput) ||
        isNaN(maxNumeroInput) ||
        minInput >= maxNumeroInput
    ) {

        resultado.textContent =
            "⚠️ El rango es inválido.";

        return;
    }

    if (
        isNaN(numero) ||
        numero < minInput ||
        numero > maxNumeroInput
    ) {

        resultado.textContent =
            `⚠️ Ingresa un número entre ${minInput} y ${maxNumeroInput}.`;

        return;
    }

    maxIntentos = maxInput || 10;

    minNumero = minInput;
    maxNumero = maxNumeroInput;
    // Si es el primer intento, generar el número según el rango elegido
    if (intentos === 0) {

        numeroSecreto =
            Math.floor(
                Math.random() *
                (maxNumero - minNumero + 1)
            ) + minNumero;

        console.log("Número secreto:", numeroSecreto);
    }

    intentos++;

    /* ===== COMPROBAR ===== */

    if (numero === numeroSecreto) {

        resultado.textContent =
            `🎉 ${gamenick} adivinó el número en ${intentos} intento(s).`;

        guardarPuntaje(
            gamenick,
            intentos,
            maxIntentos,
            minNumero,
            maxNumero
        );

        mostrarTabla();

        reiniciarJuego();
    }

    else if (intentos >= maxIntentos) {

        resultado.textContent =
            `💀 ${gamenick} perdió. El número era ${numeroSecreto}.`;

        guardarPerdedor(
            gamenick,
            maxIntentos
        );

        mostrarPerdedores();

        reiniciarJuego();
    }

    else {

        resultado.textContent =
            numero < numeroSecreto
                ? "📉 El número es más alto."
                : "📈 El número es más bajo.";

        intentosDiv.textContent =
            `🎯 Intentos usados: ${intentos} de ${maxIntentos}`;
    }

    document.getElementById("adivinanza").value = "";
}

/* ===== GANADORES ===== */

function guardarPuntaje(
    gamenick,
    intentos,
    maxIntentos,
    minNumero,
    maxNumero
) {

    let puntajes =
        JSON.parse(localStorage.getItem("puntajes")) || [];

    /* ===== DIFICULTAD ===== */

    let rango =
        maxNumero - minNumero;

    // Menos intentos = más difícil
    let dificultadIntentos =
        101 - maxIntentos;

    // Mayor rango = más difícil
    let dificultadRango =
        Math.floor(rango / 10);

    // Bonus por usar pocos intentos
    let bonusIntentos =
        (maxIntentos - intentos) + 1;

    // Puntos finales
    let puntuacion =
        (
            dificultadIntentos +
            dificultadRango
        ) * bonusIntentos;

    puntajes.push({

        avatar: avatarSeleccionado,

        gamenick: gamenick,

        intentos: intentos,

        maxIntentos: maxIntentos,

        puntuacion: puntuacion,

        rango:
            `${minNumero} - ${maxNumero}`
    });

    /* ===== ORDENAR ===== */

    puntajes.sort((a, b) =>
        b.puntuacion - a.puntuacion
    );

    /* ===== TOP 10 ===== */

    puntajes = puntajes.slice(0, 10);

    localStorage.setItem(
        "puntajes",
        JSON.stringify(puntajes)
    );
    actualizarRanking(
        gamenick,
        avatarSeleccionado,
        true
    );
    actualizarRanking(
        gamenick,
        avatarSeleccionado,
        false
    );
}

function mostrarTabla() {

    const tbody =
        document.querySelector("#tablaPosiciones tbody");

    tbody.innerHTML = "";

    const puntajes =
        JSON.parse(localStorage.getItem("puntajes")) || [];

    if (puntajes.length === 0) {

        tbody.innerHTML =
            `<tr>
                <td colspan="5">
                    No hay registros.
                </td>
            </tr>`;

        return;
    }

    puntajes.forEach((jugador, index) => {

        let medalla = "";

        if (index === 0) {

            medalla = "🥇";
        }

        else if (index === 1) {

            medalla = "🥈";
        }

        else if (index === 2) {

            medalla = "🥉";
        }

        else {

            medalla = `#${index + 1}`;
        }

        const fila =
            document.createElement("tr");

        fila.innerHTML = `
            <td>${medalla}</td>

            <td class="jugador-info">

    <img
        src="${jugador.avatar}"
        class="mini-avatar"
    >

    ${jugador.gamenick}

</td>

            <td>
                ${jugador.intentos}
                /
                ${jugador.maxIntentos}
            </td>

            <td>
                 ${jugador.rango || "1 - 100"}
            </td>

            <td>
                ${jugador.puntuacion}
                pts
            </td>
        `;

        tbody.appendChild(fila);
    });
}

/* ===== PERDEDORES ===== */

function guardarPerdedor(gamenick, maxIntentos) {

    let perdedores =
        JSON.parse(localStorage.getItem("perdedores")) || [];

    perdedores.push({

        avatar: avatarSeleccionado,

        gamenick,

        maxIntentos
    });

    localStorage.setItem(
        "perdedores",
        JSON.stringify(perdedores)
    );
}

function mostrarPerdedores() {

    const tbody =
        document.querySelector("#tablaPerdedores tbody");

    tbody.innerHTML = "";

    const perdedores =
        JSON.parse(localStorage.getItem("perdedores")) || [];

    if (perdedores.length === 0) {

        tbody.innerHTML =
            `<tr>
                <td colspan="3">
                    No hay jugadores eliminados.
                </td>
            </tr>`;

        return;
    }

    perdedores.forEach((jugador, index) => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `
            <td>${index + 1}</td>

            <td class="jugador-info">

    <img
        src="${jugador.avatar}"
        class="mini-avatar"
    >

    ${jugador.gamenick}

</td>

            <td>${jugador.maxIntentos}</td>
        `;

        tbody.appendChild(fila);
    });
}

/* ===== LIMPIAR TABLAS ===== */

function limpiarGanadores() {

    const confirmar =
        confirm("¿Eliminar tabla de ganadores?");

    if (confirmar) {

        localStorage.removeItem("puntajes");

        mostrarTabla();

        alert("🏆 Tabla eliminada.");
    }
}

function limpiarPerdedores() {

    const confirmar =
        confirm("¿Eliminar tabla de perdedores?");

    if (confirmar) {

        localStorage.removeItem("perdedores");

        mostrarPerdedores();

        alert("💀 Tabla eliminada.");
    }
}

function limpiarTodo() {

    const confirmar =
        confirm("¿Eliminar TODAS las tablas?");

    if (confirmar) {

        localStorage.removeItem("puntajes");

        localStorage.removeItem("perdedores");

        mostrarTabla();

        mostrarPerdedores();

        alert("🗑 Todas las tablas fueron eliminadas.");
    }
}

/* ===== REINICIAR ===== */

function reiniciarJuego() {

    numeroSecreto =
        Math.floor(
            Math.random() *
            (maxNumero - minNumero + 1)
        ) + minNumero;

    intentos = 0;

    document.getElementById("adivinanza").value = "";

    document.getElementById("gamenick").value = "";

    document.getElementById("maxIntentosInput").value = 10;

    document.getElementById("minNumero").value = 1;

    document.getElementById("maxNumero").value = 100;

    maxIntentos = 10;

    minNumero = 1;

    maxNumero = 100;

    document.getElementById("intentos").textContent = "";

    setTimeout(() => {

        document.getElementById("resultado").textContent = "";

    }, 4000);

    document.getElementById("gamenick").focus();

    console.log("🎮 Juego reiniciado");
}
function seleccionarAvatar(elemento) {

    document
        .querySelectorAll(".avatar")
        .forEach(avatar => {

            avatar.classList.remove(
                "avatar-seleccionado"
            );
        });

    elemento.classList.add(
        "avatar-seleccionado"
    );

    avatarSeleccionado =
        elemento.dataset.avatar;
} function seleccionarAvatar(elemento) {

    document
        .querySelectorAll(".avatar")
        .forEach(avatar => {

            avatar.classList.remove(
                "avatar-seleccionado"
            );
        });

    elemento.classList.add(
        "avatar-seleccionado"
    );

    avatarSeleccionado =
        elemento.dataset.avatar;
}
function actualizarRanking(gamenick, avatar, gano) {

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    let jugador = ranking.find(j => j.gamenick === gamenick);

    if (!jugador) {

        jugador = {

            gamenick: gamenick,

            avatar: avatar,

            victorias: 0,

            partidas: 0

        };

        ranking.push(jugador);

    }

    jugador.partidas++;

    if (gano) {

        jugador.victorias++;

    }

    localStorage.setItem("ranking", JSON.stringify(ranking));

}