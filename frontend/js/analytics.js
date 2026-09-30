/**
 * POLARIS Energy Analytics Controller
 * Light Theme Calibrated
 */

let analyticsCharts = {};

function initAnalyticsView() {
  const chartConfigs = [
    {
      id: 'chart-analytics-daily',
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Daily Energy (kWh)',
          data: [320, 345, 310, 360, 342, 290, 315],
          backgroundColor: '#0284c7',
          borderRadius: 4
        }]
      }
    },
    {
      id: 'chart-analytics-renew-contrib',
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Renewable Fraction (%)',
          data: [64, 71, 68, 75, 68, 82, 79],
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.12)',
          fill: true,
          tension: 0.3,
          borderWidth: 2
        }]
      }
    },
    {
      id: 'chart-analytics-battery-soc',
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Avg Battery SOC (%)',
          data: [72, 76, 74, 80, 76, 85, 78],
          borderColor: '#059669',
          fill: false,
          tension: 0.3,
          borderWidth: 2
        }]
      }
    },
    {
      id: 'chart-analytics-peak-demand',
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Peak Demand (kW)',
          data: [19.2, 21.4, 18.9, 22.0, 19.8, 17.5, 18.2],
          backgroundColor: '#e11d48',
          borderRadius: 4
        }]
      }
    },
    {
      id: 'chart-analytics-backup-usage',
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Diesel Gen Runtime (Hours)',
          data: [2.5, 1.8, 2.0, 1.2, 1.4, 0.5, 0.8],
          backgroundColor: '#7c3aed',
          borderRadius: 4
        }]
      }
    },
    {
      id: 'chart-analytics-source-dist',
      type: 'doughnut',
      data: {
        labels: ['Solar PV', 'Wind Turbines', 'Lithium Battery', 'Diesel Genset'],
        datasets: [{
          data: [45, 28, 18, 9],
          backgroundColor: ['#d97706', '#0284c7', '#059669', '#7c3aed'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      }
    }
  ];

  chartConfigs.forEach(cfg => {
    const el = document.getElementById(cfg.id);
    if (el && !analyticsCharts[cfg.id]) {
      analyticsCharts[cfg.id] = new Chart(el, {
        type: cfg.type,
        data: cfg.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#334155', font: { size: 10, weight: '600' } } },
            tooltip: { backgroundColor: '#ffffff', titleColor: '#0284c7', bodyColor: '#0f172a', borderColor: 'rgba(2, 132, 199, 0.3)', borderWidth: 1 }
          },
          scales: cfg.type === 'doughnut' ? {} : {
            x: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#64748b' } },
            y: { grid: { color: 'rgba(2, 132, 199, 0.06)' }, ticks: { color: '#64748b' } }
          }
        }
      });
    }
  });

  setupAnalyticsDateFilters();
}

function setupAnalyticsDateFilters() {
  const btns = document.querySelectorAll('.analytics-range-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initAnalyticsView();
});
