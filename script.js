let tempoRestante = 15; // segundos
let intervaloContador;

async function fetchTopGainers() {
  const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h";

  try {
    const response = await fetch(url);
    const data = await response.json();

    const gainers = data.filter(c => c.price_change_percentage_24h !== null);
    const sorted = gainers.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    const top10 = sorted.slice(0, 10);

    renderTable(top10);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    document.querySelector("#crypto-table tbody").innerHTML =
      `<tr><td colspan="5">Erro ao carregar dados</td></tr>`;
  }

  // reinicia o contador
  tempoRestante = 15;
}

function renderTable(coins) {
  const tbody = document.querySelector("#crypto-table tbody");
  tbody.innerHTML = "";

  coins.forEach((coin, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td><img src="${coin.image}" width="20"> ${coin.name}</td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>$${coin.current_price.toFixed(2)}</td>
        <td style="color:${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
          ${coin.price_change_percentage_24h.toFixed(2)}%
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Função para atualizar o contador visual
function atualizarContador() {
  const contadorEl = document.getElementById("contador");
  contadorEl.textContent = tempoRestante;
  if (tempoRestante > 0) {
    tempoRestante--;
  } else {
    fetchTopGainers(); // força atualização quando chega a 0
  }
}

// Atualiza dados iniciais
fetchTopGainers();

// Configura intervalos
intervaloContador = setInterval(atualizarContador, 1000); // contador a cada 1s
setInterval(fetchTopGainers, 15000); // dados a cada 15s
