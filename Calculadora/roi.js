// Formatador de moeda
const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// Variáveis globais para os gráficos
let barChartFat, pieChartGanhos, lineChartProjecao;

// Configuração padrão dos gráficos
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: '#e0def4',
                font: { size: 12 }
            }
        }
    }
};

// Função principal de cálculo
function calcular() {
    // Inputs - Cenário Atual
    const vendasAtual = parseFloat(document.getElementById('vendas-atual').value) || 0;
    const ticketMedio = parseFloat(document.getElementById('ticket-medio').value) || 0;
    const taxaConversaoAtual = parseFloat(document.getElementById('taxa-conversao-atual').value) || 0;
    const horasManuais = parseFloat(document.getElementById('horas-manuais').value) || 0;
    const custoHora = parseFloat(document.getElementById('custo-hora').value) || 0;

    // Inputs - Cenário com IA
    const aumentoConversao = parseFloat(document.getElementById('aumento-conversao').value) || 0;
    const reducaoHoras = parseFloat(document.getElementById('reducao-horas').value) || 0;
    const investimentoIA = parseFloat(document.getElementById('investimento-ia').value) || 0;
    const manutencaoIA = parseFloat(document.getElementById('manutencao-ia').value) || 0;

    // Cálculos - Cenário Atual
    const faturamentoAtual = vendasAtual * ticketMedio;
    const faturamentoAnualAtual = faturamentoAtual * 12;
    const custoOperacionalAtual = horasManuais * custoHora;
    const custoOperacionalAnual = custoOperacionalAtual * 12;

    // Cálculos - Cenário com IA
    const novaTaxaConversao = taxaConversaoAtual * (1 + (aumentoConversao / 100));
    const novasVendas = Math.round(vendasAtual * (novaTaxaConversao / taxaConversaoAtual));
    const novoFaturamento = novasVendas * ticketMedio;
    const novoFaturamentoAnual = novoFaturamento * 12;

    const horasEconomizadas = horasManuais * (reducaoHoras / 100);
    const economiaOperacional = horasEconomizadas * custoHora;
    const economiaOperacionalAnual = economiaOperacional * 12;

    // Ganhos
    const ganhoFaturamento = novoFaturamento - faturamentoAtual;
    const ganhoMensal = ganhoFaturamento + economiaOperacional - manutencaoIA;
    const ganhoAnual = (novoFaturamentoAnual - faturamentoAnualAtual) + economiaOperacionalAnual - (manutencaoIA * 12);

    // Payback e ROI
    const custoTotalIA = investimentoIA + (manutencaoIA * 12);
    const payback = ganhoMensal > 0 ? Math.ceil(investimentoIA / ganhoMensal) : 0;
    const roi12 = custoTotalIA > 0 ? ((ganhoAnual / custoTotalIA) * 100) : 0;

    // Longo prazo
    const retorno3Anos = (ganhoAnual * 3) - investimentoIA;
    const retorno5Anos = (ganhoAnual * 5) - investimentoIA;
    const custo3Anos = investimentoIA + (manutencaoIA * 36);
    const custo5Anos = investimentoIA + (manutencaoIA * 60);
    const roi3Anos = custo3Anos > 0 ? ((retorno3Anos / custo3Anos) * 100) : 0;
    const roi5Anos = custo5Anos > 0 ? ((retorno5Anos / custo5Anos) * 100) : 0;

    // Atualizar cards
    document.getElementById('fat-atual-card').textContent = formatMoney(faturamentoAtual);
    document.getElementById('custo-op-card').textContent = formatMoney(custoOperacionalAtual);
    document.getElementById('novo-fat-card').textContent = formatMoney(novoFaturamento);
    document.getElementById('ganho-card').textContent = formatMoney(ganhoMensal);

    // Atualizar métricas
    document.getElementById('nova-taxa').textContent = `${novaTaxaConversao.toFixed(2)}%`;
    document.getElementById('novas-vendas').textContent = novasVendas;
    document.getElementById('ganho-mensal').textContent = formatMoney(ganhoMensal);
    document.getElementById('ganho-anual').textContent = formatMoney(ganhoAnual);
    document.getElementById('horas-econ').textContent = `${horasEconomizadas.toFixed(0)}h`;
    document.getElementById('econ-op').textContent = formatMoney(economiaOperacional);
    document.getElementById('payback-roi').textContent = payback > 0 ? `${payback} meses` : 'Imediato';
    document.getElementById('roi-12').textContent = `${roi12.toFixed(0)}%`;

    // Atualizar longo prazo
    document.getElementById('retorno-3anos').textContent = formatMoney(retorno3Anos);
    document.getElementById('retorno-5anos').textContent = formatMoney(retorno5Anos);
    document.getElementById('roi-3anos').textContent = `${roi3Anos.toFixed(0)}%`;
    document.getElementById('roi-5anos').textContent = `${roi5Anos.toFixed(0)}%`;

    // Atualizar gráficos
    atualizarGraficoBarrasFaturamento(faturamentoAnualAtual, novoFaturamentoAnual);
    atualizarGraficoPizzaGanhos(ganhoFaturamento * 12, economiaOperacionalAnual);
    atualizarGraficoLinhaProjecao(ganhoMensal, investimentoIA, manutencaoIA);
}

// Gráfico de Barras: Faturamento
function atualizarGraficoBarrasFaturamento(fatAtual, fatNovo) {
    const ctx = document.getElementById('barChartFat');
    
    if (barChartFat) barChartFat.destroy();

    barChartFat = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Faturamento Atual', 'Faturamento com IA'],
            datasets: [{
                label: 'Faturamento Anual (R$)',
                data: [fatAtual, fatNovo],
                backgroundColor: [
                    'rgba(196, 167, 231, 0.7)',
                    'rgba(72, 187, 120, 0.7)'
                ],
                borderColor: [
                    'rgba(196, 167, 231, 1)',
                    'rgba(72, 187, 120, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#908caa',
                        callback: function(value) {
                            return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                x: {
                    ticks: { color: '#e0def4' },
                    grid: { display: false }
                }
            }
        }
    });
}

// Gráfico de Pizza: Composição do Ganho
function atualizarGraficoPizzaGanhos(ganhoFat, ganhoOp) {
    const ctx = document.getElementById('pieChartGanhos');
    
    if (pieChartGanhos) pieChartGanhos.destroy();

    pieChartGanhos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ganho em Faturamento', 'Economia Operacional'],
            datasets: [{
                data: [ganhoFat, ganhoOp],
                backgroundColor: [
                    '#48bb78',
                    '#c4a7e7'
                ],
                borderWidth: 0
            }]
        },
        options: {
            ...chartDefaults,
            plugins: {
                ...chartDefaults.plugins,
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e0def4',
                        font: { size: 11 },
                        padding: 15
                    }
                }
            }
        }
    });
}

// Gráfico de Linhas: Projeção 24 meses
function atualizarGraficoLinhaProjecao(ganhoMensal, investimento, manutencao) {
    const ctx = document.getElementById('lineChartProjecao');
    
    if (lineChartProjecao) lineChartProjecao.destroy();

    // Calcular retorno acumulado
    const meses = [];
    const retornoAcumulado = [];
    let acumulado = -investimento;

    for (let i = 1; i <= 24; i++) {
        meses.push(i);
        acumulado += (ganhoMensal - manutencao);
        retornoAcumulado.push(acumulado);
    }

    lineChartProjecao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Retorno Acumulado (R$)',
                data: retornoAcumulado,
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#48bb78',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 3
            }, {
                label: 'Break-even (R$ 0)',
                data: Array(24).fill(0),
                borderColor: '#ef4444',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                y: {
                    ticks: {
                        color: '#908caa',
                        callback: function(value) {
                            return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Meses',
                        color: '#e0def4'
                    },
                    ticks: { color: '#e0def4' },
                    grid: { display: false }
                }
            }
        }
    });
}

// Event listeners
document.getElementById('vendas-atual').addEventListener('input', calcular);
document.getElementById('ticket-medio').addEventListener('input', calcular);
document.getElementById('taxa-conversao-atual').addEventListener('input', calcular);
document.getElementById('horas-manuais').addEventListener('input', calcular);
document.getElementById('custo-hora').addEventListener('input', calcular);
document.getElementById('aumento-conversao').addEventListener('input', calcular);
document.getElementById('reducao-horas').addEventListener('input', calcular);
document.getElementById('investimento-ia').addEventListener('input', calcular);
document.getElementById('manutencao-ia').addEventListener('input', calcular);

// Calcular ao carregar
calcular();
