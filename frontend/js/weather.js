/**
 * POLARIS Weather & Arctic Environment Controller
 * Light Theme Calibrated
 */

let weatherTempChart = null;
let weatherWindChart = null;
let weatherIrradianceChart = null;

function initWeatherView() {
  const ctxTemp = document.getElementById('chart-weather-temp');
  const ctxWind = document.getElementById('chart-weather-wind');
  const ctxIrr = document.getElementById('chart-weather-irradiance');

  const hist = window.polarisEngine.state.history24h;

  if (ctxTemp && !weatherTempChart) {
    weatherTempChart = new Chart(ctxTemp, {
      type: 'line',
      data: {
        labels: hist.labels,
        datasets: [{
          label: 'Ambient Temperature (°C)',
          data: hist.temp,
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.12)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { labels: { color: '#334155', font: { weight: '600' } } },
          tooltip: { backgroundColor: '#ffffff', titleColor: '#0284c7', bodyColor: '#0f172a', borderColor: 'rgba(2, 132, 199, 0.3)', borderWidth: 1 }
        },
        scales: {
          x: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#0284c7' } }
        }
      }
    });
  }

  if (ctxWind && !weatherWindChart) {
    weatherWindChart = new Chart(ctxWind, {
      type: 'line',
      data: {
        labels: hist.labels,
        datasets: [{
          label: 'Wind Speed (km/h)',
          data: hist.windSpeed,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { labels: { color: '#334155', font: { weight: '600' } } },
          tooltip: { backgroundColor: '#ffffff', titleColor: '#0d9488', bodyColor: '#0f172a', borderColor: 'rgba(13, 148, 136, 0.3)', borderWidth: 1 }
        },
        scales: {
          x: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#0d9488' } }
        }
      }
    });
  }

  if (ctxIrr && !weatherIrradianceChart) {
    weatherIrradianceChart = new Chart(ctxIrr, {
      type: 'bar',
      data: {
        labels: hist.labels,
        datasets: [{
          label: 'Solar Irradiance (W/m²)',
          data: hist.solarIrradiance,
          backgroundColor: 'rgba(217, 119, 6, 0.65)',
          borderColor: '#d97706',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { labels: { color: '#334155', font: { weight: '600' } } },
          tooltip: { backgroundColor: '#ffffff', titleColor: '#d97706', bodyColor: '#0f172a', borderColor: 'rgba(217, 119, 6, 0.3)', borderWidth: 1 }
        },
        scales: {
          x: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#d97706' } }
        }
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initWeatherView();
});
