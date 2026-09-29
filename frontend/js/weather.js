/**
 * POLARIS Weather & Arctic Environment Controller
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
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#38bdf8' } }
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
          borderColor: '#2dd4bf',
          backgroundColor: 'rgba(45, 212, 191, 0.15)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#2dd4bf' } }
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
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: '#f59e0b',
          borderWidth: 1,
          borderRadius: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#f59e0b' } }
        }
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initWeatherView();
});
