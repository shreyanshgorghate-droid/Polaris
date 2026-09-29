/**
 * POLARIS AI Forecasting Engine View Controller
 */

let forecastDemandChart = null;
let forecastRenewableChart = null;

function initForecastView() {
  const ctxDemand = document.getElementById('chart-forecast-demand');
  const ctxRenew = document.getElementById('chart-forecast-renewable');

  if (ctxDemand && !forecastDemandChart) {
    const hours = ['Now', '+1h', '+2h', '+3h', '+4h', '+5h', '+6h'];
    forecastDemandChart = new Chart(ctxDemand, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [
          {
            label: 'Predicted Demand (kW)',
            data: [14.2, 15.1, 15.9, 16.8, 16.4, 15.8, 15.2],
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#f43f5e',
            pointRadius: 4
          },
          {
            label: '95% Confidence Upper Bound',
            data: [14.8, 16.0, 17.1, 18.0, 17.6, 17.0, 16.4],
            borderColor: 'rgba(244, 63, 94, 0.3)',
            borderDash: [3, 3],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0
          },
          {
            label: '95% Confidence Lower Bound',
            data: [13.6, 14.2, 14.7, 15.6, 15.2, 14.6, 14.0],
            borderColor: 'rgba(244, 63, 94, 0.3)',
            borderDash: [3, 3],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
          tooltip: { backgroundColor: '#0d172e', borderColor: '#38bdf8', borderWidth: 1 }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
          y: { 
            title: { display: true, text: 'Demand (kW)', color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
            ticks: { color: '#64748b' } 
          }
        }
      }
    });
  }

  if (ctxRenew && !forecastRenewableChart) {
    const hours = ['Now', '+1h', '+2h', '+3h', '+4h', '+5h', '+6h'];
    forecastRenewableChart = new Chart(ctxRenew, {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [
          {
            label: 'Solar Forecast (kW)',
            data: [18.4, 17.2, 15.0, 12.4, 8.1, 4.0, 0.5],
            backgroundColor: 'rgba(245, 158, 11, 0.7)',
            borderColor: '#f59e0b',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Wind Forecast (kW)',
            data: [7.2, 8.5, 9.8, 11.2, 12.0, 10.5, 8.4],
            backgroundColor: 'rgba(56, 189, 248, 0.7)',
            borderColor: '#38bdf8',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
          tooltip: { backgroundColor: '#0d172e', borderColor: '#38bdf8', borderWidth: 1 }
        },
        scales: {
          x: { stacked: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748b' } },
          y: { 
            stacked: true,
            title: { display: true, text: 'Renewable Power (kW)', color: '#94a3b8' },
            grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
            ticks: { color: '#64748b' } 
          }
        }
      }
    });
  }
}

// Attach listener when page is shown
window.addEventListener('DOMContentLoaded', () => {
  initForecastView();
});
