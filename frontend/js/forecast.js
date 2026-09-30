/**
 * POLARIS AI Forecasting Engine View Controller
 * Light Theme Calibrated
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
            borderColor: '#e11d48',
            backgroundColor: 'rgba(225, 29, 72, 0.12)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#e11d48',
            pointRadius: 4
          },
          {
            label: '95% Confidence Upper Bound',
            data: [14.8, 16.0, 17.1, 18.0, 17.6, 17.0, 16.4],
            borderColor: 'rgba(225, 29, 72, 0.35)',
            borderDash: [3, 3],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0
          },
          {
            label: '95% Confidence Lower Bound',
            data: [13.6, 14.2, 14.7, 15.6, 15.2, 14.6, 14.0],
            borderColor: 'rgba(225, 29, 72, 0.35)',
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
          legend: { labels: { color: '#334155', font: { size: 11, weight: '600' } } },
          tooltip: { backgroundColor: '#ffffff', titleColor: '#0284c7', bodyColor: '#0f172a', borderColor: 'rgba(2, 132, 199, 0.3)', borderWidth: 1 }
        },
        scales: {
          x: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#64748b' } },
          y: { 
            title: { display: true, text: 'Demand (kW)', color: '#334155', font: { weight: '600' } },
            grid: { color: 'rgba(2, 132, 199, 0.06)' }, 
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
            backgroundColor: 'rgba(217, 119, 6, 0.75)',
            borderColor: '#d97706',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Wind Forecast (kW)',
            data: [7.2, 8.5, 9.8, 11.2, 12.0, 10.5, 8.4],
            backgroundColor: 'rgba(2, 132, 199, 0.75)',
            borderColor: '#0284c7',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#334155', font: { size: 11, weight: '600' } } },
          tooltip: { backgroundColor: '#ffffff', titleColor: '#0284c7', bodyColor: '#0f172a', borderColor: 'rgba(2, 132, 199, 0.3)', borderWidth: 1 }
        },
        scales: {
          x: { stacked: true, grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#64748b' } },
          y: { 
            stacked: true,
            title: { display: true, text: 'Renewable Power (kW)', color: '#334155', font: { weight: '600' } },
            grid: { color: 'rgba(2, 132, 199, 0.06)' }, 
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
