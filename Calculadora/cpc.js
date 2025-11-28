// Formatador de moeda
const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// Variáveis globais para os gráficos
let pieChart, barChart, lineChart;

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
    // Inputs
    const numFuncionarios = parseFloat(document.getElementById('num-funcionarios').value) || 0;
    const salario = parseFloat(document.getElementById('salario').value) || 0;
    const investimentoInicial = parseFloat(document.getElementById('investimento-inicial').value) || 0;
    const mensalidade = parseFloat(document.getElementById('mensalidade').value) || 0;

    // Cálculos de encargos (por funcionário)
    const inss = salario * 0.20;
    const fgts = salario * 0.08;
    const decimoTerceiro = salario / 12;
    const ferias = (salario * 1.33) / 12;
    const multaFgts = salario * 0.04;
    const pis = salario * 0.01;
    const seguro = salario * 0.03;
    const salarioEducacao = salario * 0.025;
    const sistemaS = salario * 0.033;

    const encargosTotais = inss + fgts + decimoTerceiro + ferias + multaFgts + pis + seguro + salarioEducacao + sistemaS;
    const custoMensal = salario + encargosTotais;
    const percentualEncargos = salario > 0 ? (encargosTotais / salario) * 100 : 0;

    // Custo total considerando todos os funcionários
    const custoTotalMensal = custoMensal * numFuncionarios;
    const custoAnual = custoTotalMensal * 12;

    // Custos da automação
    const custoAutomacaoMensal = mensalidade;
    const custoAutomacaoAnual = investimentoInicial + (mensalidade * 12);

    // Economia
    const economiaMensal = custoTotalMensal - custoAutomacaoMensal;
    const economiaAnual = custoAnual - custoAutomacaoAnual;
    const economia3Anos = (custoAnual * 3) - (investimentoInicial + (mensalidade * 36));
    const economia5Anos = (custoAnual * 5) - (investimentoInicial + (mensalidade * 60));

    // Payback e ROI
    const payback = economiaMensal > 0 ? Math.ceil(investimentoInicial / economiaMensal) : 0;
    const roi = custoAutomacaoAnual > 0 ? ((economiaAnual / custoAutomacaoAnual) * 100) : 0;
    const reducaoCusto = custoTotalMensal > 0 ? ((economiaMensal / custoTotalMensal) * 100) : 0;

    // Atualizar cards de métricas
    document.getElementById('salario-bruto').textContent = formatMoney(salario);
    document.getElementById('encargos-totais').textContent = formatMoney(encargosTotais);
    document.getElementById('custo-real').textContent = formatMoney(custoMensal);
    document.getElementById('percentual-encargos').textContent = `${percentualEncargos.toFixed(1)}%`;

    // Atualizar detalhamento
    document.getElementById('inss').textContent = formatMoney(inss);
    document.getElementById('fgts').textContent = formatMoney(fgts);
    document.getElementById('decimo-terceiro').textContent = formatMoney(decimoTerceiro);
    document.getElementById('ferias').textContent = formatMoney(ferias);
    document.getElementById('multa-fgts').textContent = formatMoney(multaFgts);
    document.getElementById('pis').textContent = formatMoney(pis);
    document.getElementById('seguro').textContent = formatMoney(seguro);
    document.getElementById('salario-educacao').textContent = formatMoney(salarioEducacao);
    document.getElementById('sistema-s').textContent = formatMoney(sistemaS);

    // Atualizar totais
    document.getElementById('custo-total-mensal').textContent = formatMoney(custoTotalMensal);
    document.getElementById('custo-anual').textContent = formatMoney(custoAnual);
    document.getElementById('custo-automacao-mensal').textContent = formatMoney(custoAutomacaoMensal);
    document.getElementById('custo-automacao-anual').textContent = formatMoney(custoAutomacaoAnual);
    document.getElementById('economia-mensal').textContent = formatMoney(economiaMensal);
    document.getElementById('economia-anual').textContent = formatMoney(economiaAnual);
    document.getElementById('payback').textContent = payback > 0 ? `${payback} meses` : 'Imediato';
    document.getElementById('roi').textContent = `${roi.toFixed(0)}%`;

    // Atualizar métricas adicionais
    document.getElementById('economia-3anos').textContent = formatMoney(economia3Anos);
    document.getElementById('economia-5anos').textContent = formatMoney(economia5Anos);
    document.getElementById('reducao-custo').textContent = `${reducaoCusto.toFixed(0)}%`;
    document.getElementById('break-even').textContent = `${payback} meses`;

    // Atualizar gráficos
    atualizarGraficoPizza(salario, inss, fgts, decimoTerceiro, ferias, multaFgts, pis, seguro, salarioEducacao, sistemaS);
    atualizarGraficoBarras(custoTotalMensal, custoAutomacaoMensal);
    atualizarGraficoLinhas(economiaMensal, investimentoInicial);
}

// Gráfico de Pizza: Composição do Custo
function atualizarGraficoPizza(salario, inss, fgts, decimoTerceiro, ferias, multaFgts, pis, seguro, salarioEducacao, sistemaS) {
    const ctx = document.getElementById('pieChart');
    
    if (pieChart) pieChart.destroy();

    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Salário Base', 'INSS', 'FGTS', '13º', 'Férias', 'Multa FGTS', 'PIS', 'Seguro', 'Sal. Educação', 'Sistema S'],
            datasets: [{
                data: [salario, inss, fgts, decimoTerceiro, ferias, multaFgts, pis, seguro, salarioEducacao, sistemaS],
                backgroundColor: [
                    '#c4a7e7',
                    '#ebbcba',
                    '#f6c177',
                    '#ea9a97',
                    '#9ccfd8',
                    '#c4a7e7',
                    '#ebbcba',
                    '#f6c177',
                    '#ea9a97',
                    '#9ccfd8'
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
                        font: { size: 10 },
                        padding: 10
                    }
                }
            }
        }
    });
}

// Gráfico de Barras: Comparativo
function atualizarGraficoBarras(custoMO, custoAuto) {
    const ctx = document.getElementById('barChart');
    
    if (barChart) barChart.destroy();

    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mão de Obra', 'Automação MTC'],
            datasets: [{
                label: 'Custo Mensal (R$)',
                data: [custoMO, custoAuto],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(72, 187, 120, 0.7)'
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
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
                            return 'R$ ' + value.toLocaleString('pt-BR');
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

// Gráfico de Linhas: Projeção de Economia
function atualizarGraficoLinhas(economiaMensal, investimentoInicial) {
    const ctx = document.getElementById('lineChart');
    
    if (lineChart) lineChart.destroy();

    // Calcular economia acumulada mês a mês
    const meses = [];
    const economiaAcumulada = [];
    let acumulado = -investimentoInicial;

    for (let i = 1; i <= 12; i++) {
        meses.push(`Mês ${i}`);
        acumulado += economiaMensal;
        economiaAcumulada.push(acumulado);
    }

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Economia Acumulada (R$)',
                data: economiaAcumulada,
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#48bb78',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            ...chartDefaults,
            scales: {
                y: {
                    ticks: {
                        color: '#908caa',
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
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
            },
            plugins: {
                ...chartDefaults.plugins,
                legend: {
                    display: false
                }
            }
        }
    });
}

// Event listeners
document.getElementById('num-funcionarios').addEventListener('input', calcular);
document.getElementById('salario').addEventListener('input', calcular);
document.getElementById('investimento-inicial').addEventListener('input', calcular);
document.getElementById('mensalidade').addEventListener('input', calcular);

// Calcular ao carregar
calcular();
