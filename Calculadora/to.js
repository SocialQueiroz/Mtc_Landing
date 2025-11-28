// Formatador de moeda
const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// Formatador de tempo
const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
};

// Função principal de cálculo
function calcular() {
    // Inputs
    const tempoExecucao = parseFloat(document.getElementById('tempo-execucao').value) || 0;
    const execucoesDia = parseFloat(document.getElementById('execucoes-dia').value) || 0;
    const diasUteis = parseFloat(document.getElementById('dias-uteis').value) || 0;
    const custoHora = parseFloat(document.getElementById('custo-hora-to').value) || 0;
    const tempoIA = parseFloat(document.getElementById('tempo-ia').value) || 0;
    const reducaoIntervencao = parseFloat(document.getElementById('reducao-intervencao').value) || 0;

    // Cálculos - Tempo Manual
    const tempoDia = tempoExecucao * execucoesDia; // em minutos
    const tempoSemana = tempoDia * 5; // 5 dias úteis
    const tempoMes = tempoDia * diasUteis;
    const tempoAno = tempoMes * 12;

    // Cálculos - Custo Manual
    const custoMensal = (tempoMes / 60) * custoHora;
    const custoAnual = custoMensal * 12;

    // Cálculos - Tempo com IA
    const tempoIADia = (tempoIA * execucoesDia) + (tempoDia * (1 - reducaoIntervencao / 100));
    const tempoIAMes = tempoIADia * diasUteis;

    // Economia de Tempo
    const economiaDia = tempoDia - tempoIADia;
    const economiaSemana = economiaDia * 5;
    const economiaMes = economiaDia * diasUteis;
    const economiaAno = economiaMes * 12;

    // Dias economizados (considerando 8h/dia)
    const diasEconomizados = (economiaAno / 60) / 8;

    // Economia Financeira
    const economiaFinanceiraMensal = (economiaMes / 60) * custoHora;
    const economiaFinanceiraAnual = economiaFinanceiraMensal * 12;

    // Produtividade
    const produtividade = tempoDia > 0 ? ((economiaDia / tempoDia) * 100) : 0;

    // Atualizar valores - Tempo Manual
    document.getElementById('tempo-dia').textContent = formatTime(tempoDia);
    document.getElementById('tempo-semana').textContent = formatTime(tempoSemana);
    document.getElementById('tempo-mes').textContent = formatTime(tempoMes);
    document.getElementById('tempo-ano').textContent = formatTime(tempoAno);
    document.getElementById('custo-mensal-to').textContent = formatMoney(custoMensal);
    document.getElementById('custo-anual-to').textContent = formatMoney(custoAnual);

    // Atualizar valores - Economia
    document.getElementById('economia-dia').textContent = formatTime(economiaDia);
    document.getElementById('economia-semana').textContent = formatTime(economiaSemana);
    document.getElementById('economia-mes').textContent = formatTime(economiaMes);
    document.getElementById('economia-ano').textContent = formatTime(economiaAno);
    document.getElementById('dias-economizados').textContent = `${diasEconomizados.toFixed(1)} dias`;
    document.getElementById('economia-financeira-mensal').textContent = formatMoney(economiaFinanceiraMensal);
    document.getElementById('economia-financeira-anual').textContent = formatMoney(economiaFinanceiraAnual);
    document.getElementById('produtividade').textContent = `${produtividade.toFixed(0)}%`;

    // Atualizar gráfico
    const maxTempo = Math.max(tempoMes, tempoIAMes);
    const widthManual = (tempoMes / maxTempo) * 100;
    const widthIA = (tempoIAMes / maxTempo) * 100;

    document.getElementById('bar-tempo-manual').style.width = `${widthManual}%`;
    document.getElementById('bar-tempo-ia').style.width = `${widthIA}%`;
    document.getElementById('bar-tempo-manual-value').textContent = formatTime(tempoMes);
    document.getElementById('bar-tempo-ia-value').textContent = formatTime(tempoIAMes);
}

// Event listeners
document.getElementById('tempo-execucao').addEventListener('input', calcular);
document.getElementById('execucoes-dia').addEventListener('input', calcular);
document.getElementById('dias-uteis').addEventListener('input', calcular);
document.getElementById('custo-hora-to').addEventListener('input', calcular);
document.getElementById('tempo-ia').addEventListener('input', calcular);
document.getElementById('reducao-intervencao').addEventListener('input', calcular);

// Calcular ao carregar
calcular();
