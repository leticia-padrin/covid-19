async function carregarDados() {
    // Chamando a API para obter os dados
    await fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')   // Chamando endereço da API
        .then(response => response.json())                                    // Obtendo a resposta e formatando como JSON
        .then(dados => prepararDados(dados))                                 // Chamando função para gerar HTML dinâmico
}


function prepararDados(dados) {
    dados_mapa = [['Pais', 'Casos']];
    let pais = 0;
    let casos = 0;

    dados_pizza = [['Status', 'Total']];
    let confirmados = 0;
    let mortos = 0;
    let recuperados = 0;


    for (let i = 0; i < dados['data'].length; i++) {
        pais = dados['data'][i].country;
        casos = dados['data'][i].confirmed;
        dados_mapa.push([pais, casos]);


        confirmados = confirmados + dados['data'][i].confirmed;
        mortos = mortos + dados['data'][i].deaths;
        recuperados = recuperados + dados['data'][i].recovered;
    }

    dados_pizza.push(['Confirmados', confirmados]);
    dados_pizza.push(['Mortes', mortos]);
    dados_pizza.push(['Recuperados', recuperados]);

    desenharMapa();
    desenharGráficoDePizza();

}

var dados_mapa = [
    ['Pais', 'Casos'],
    ['0', 0]
];

var dados_pizza = [
    ['Status', 'Total'],
    ['0', 0]
];

//////////////////////////////////////////////////////////////TABELA/////////////////////////////////////////////////////////////////

async function carregarOsDados() {
    await fetch('https://covid19-brazil-api.now.sh/api/report/v1')            // Chamando endereço da API
        .then(response => response.json())                                   // Obtendo a resposta e formatando como JSON
        .then(dados => prepararOsDados(dados))                              // Chamando função para gerar HTML dinâmico
}

function prepararOsDados(dados) {
    let linhas = document.getElementById('linhas');
    linhas.innerHTML = '';

    for (let i = 0; i < dados['data'].length; i++) {
        let auxLinha = '';

        auxLinha = auxLinha + '<tr>' + '<td>' + dados['data'][i].uf + '</td>'
            + '<td>' + dados['data'][i].state + '</td>'
            + '<td>' + dados['data'][i].cases + '</td>'
            + '<td>' + dados['data'][i].deaths + '</td>'
            + '<td>' + dados['data'][i].suspects + '</td>'
            + '<td>' + dados['data'][i].refuses + '</td>' + '</tr>';

        linhas.innerHTML = linhas.innerHTML + auxLinha
    }

}

var dados_tabela = [
    ['Sigla', 'Estado', 'Casos', 'Mortes', 'Suspeitos', 'Descartados'],
    ['0', 0, 0, 0, 0, 0]
];

document.addEventListener('DOMContentLoaded', function (event) {
    carregarDados();
    carregarOsDados();
    }
);


////////////////////////////////////////////////////////////////////////////MAPA///////////////////////////////////////////////////////
google.charts.load('current', { 'packages': ['geochart'], });
google.charts.setOnLoadCallback(desenharMapa);

function desenharMapa() {
    let data = google.visualization.arrayToDataTable(dados_mapa);

    let options = {
        colorAxis: { colors: ['#961b53', '#8c1127', '#1b8896'] },
        backgroundColor: 'lightblue'
    };
    let chart = new google.visualization.GeoChart(document.getElementById('graficoMapa'));
    chart.draw(data, options);
}

///////////////////////////////////////////////////////////////GRÁFICO PIZZA///////////////////////////////////////////////////////////
google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(desenharGráficoDePizza);

      function desenharGráficoDePizza() {

        let data = google.visualization.arrayToDataTable(dados_pizza);

        let options = {
          is3D: true,
        };

        let chart = new google.visualization.PieChart(document.getElementById('graficoPizza'));

        chart.draw(data, options);
      }
      document.addEventListener(  "DOMContentLoaded",
      function(event) {
          carregarDados();
          carregarOsDados();
      }
);