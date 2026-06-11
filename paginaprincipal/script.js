function abrirJuego(ruta) {
    window.location.href = ruta;
}

function mostrarRanking() {

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.sort((a, b) => {
        return (b.victorias / b.partidas) - (a.victorias / a.partidas);
    });

    const tbody = document.querySelector("#rankingGlobal tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    ranking.forEach((jugador, index) => {

        let efectividad = 0;

        if (jugador.partidas > 0) {
            efectividad = ((jugador.victorias / jugador.partidas) * 100).toFixed(1);
        }

        tbody.innerHTML += `

<tr>

    <td>${index + 1}</td>

    <td class="jugador">

        <img src="${jugador.avatar}" class="avatarRanking">

        ${jugador.gamenick}

    </td>

    <td>${jugador.victorias}</td>

    <td>${jugador.partidas}</td>

    <td>${efectividad}%</td>

</tr>

`;

    });

}

mostrarRanking();