document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const capitalInicialInput = document.getElementById('capitalInicial');
    const tasaInteresDiariaInput = document.getElementById('tasaInteresDiaria');
    const tiempoDiasInput = document.getElementById('tiempoDias');
    const calcularBtn = document.getElementById('calcularBtn');
    const capitalFinalSpan = document.getElementById('capitalFinal');
    const interesesTotalesSpan = document.getElementById('interesesTotales');
    const crecimientoPorcentualSpan = document.getElementById('crecimientoPorcentual');
    const ctx = document.getElementById('crecimientoChart').getContext('2d');

    // Inicializar el gráfico (vacío por ahora)
    let crecimientoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Días
            datasets: [
                {
                    label: 'Interés Compuesto',
                    data: [], // Montos acumulados
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Interés Simple (Referencia)',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5], // Línea punteada
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Permitir que el gráfico se ajuste al contenedor
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Días'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Monto Acumulado ($)'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Función principal para calcular y actualizar
    function calcularCrecimiento() {
        const capitalInicial = parseFloat(capitalInicialInput.value);
        const tasaDiariaPorcentual = parseFloat(tasaInteresDiariaInput.value);
        const tiempoDias = parseInt(tiempoDiasInput.value);

        // Validaciones básicas
        if (isNaN(capitalInicial) || capitalInicial <= 0) {
            alert('Por favor, ingrese un Capital Inicial válido y mayor que cero.');
            return;
        }
        if (isNaN(tasaDiariaPorcentual) || tasaDiariaPorcentual <= 0) {
            alert('Por favor, ingrese una Tasa de Interés Diaria válida y mayor que cero.');
            return;
        }
        if (isNaN(tiempoDias) || tiempoDias <= 0) {
            alert('Por favor, ingrese una Duración en Días válida y mayor que cero.');
            return;
        }

        const tasaDiariaDecimal = tasaDiariaPorcentual / 100;
        let montoActualCompuesto = capitalInicial;
        let montoActualSimple = capitalInicial;

        const dias = [];
        const montosCompuestos = [];
        const montosSimples = [];

        for (let dia = 0; dia <= tiempoDias; dia++) {
            dias.push(dia); // El día 0 es el capital inicial
            if (dia === 0) {
                montosCompuestos.push(capitalInicial);
                montosSimples.push(capitalInicial);
            } else {
                // Cálculo del Interés Compuesto
                montoActualCompuesto *= (1 + tasaDiariaDecimal);
                montosCompuestos.push(montoActualCompuesto);

                // Cálculo del Interés Simple (para comparación)
                montoActualSimple = capitalInicial * (1 + tasaDiariaDecimal * dia);
                montosSimples.push(montoActualSimple);
            }
        }

        // Actualizar el gráfico
        crecimientoChart.data.labels = dias;
        crecimientoChart.data.datasets[0].data = montosCompuestos;
        crecimientoChart.data.datasets[1].data = montosSimples;
        crecimientoChart.update();

        // Actualizar los resultados numéricos
        const finalCompuesto = montosCompuestos[montosCompuestos.length - 1];
        const interesesGenerados = finalCompuesto - capitalInicial;
        const crecimientoPorcentual = (interesesGenerados / capitalInicial) * 100;

        capitalFinalSpan.textContent = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(finalCompuesto);
        interesesTotalesSpan.textContent = new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(interesesGenerados);
        crecimientoPorcentualSpan.textContent = crecimientoPorcentual.toFixed(2) + '%';
    }

    // Escuchar el evento click del botón
    calcularBtn.addEventListener('click', calcularCrecimiento);

    // Opcional: Calcular al cargar la página con valores por defecto
    // Esto es útil para que el cliente vea algo al abrir la herramienta
    calcularCrecimiento();

    // Mejoras: Calcular automáticamente al cambiar los valores de los inputs
    capitalInicialInput.addEventListener('input', calcularCrecimiento);
    tasaInteresDiariaInput.addEventListener('input', calcularCrecimiento);
    tiempoDiasInput.addEventListener('input', calcularCrecimiento);
});