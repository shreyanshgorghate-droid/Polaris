/**
 * POLARIS Energy Analytics Controller
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
          backgroundColor: '#38bdf8',
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
          borderColor: '#2dd4bf',
          backgroundColor: 'rgba(45, 212, 191, 0.1)',
          fill: true,
          tension: 0.3
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
          borderColor: '#10b981',
          fill: false,
          tension: 0.3
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
          backgroundColor: '#f43f5e',
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
          backgroundColor: '#a855f7',
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
          backgroundColor: ['#f59e0b', '#38bdf8', '#10b981', '#a855f7'],
          borderWidth: 0
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
            legend: { labels: { color: '#94a3b8', font: { size: 10 } } }
          },
          scales: cfg.type === 'doughnut' ? {} : {
            x: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748b' } }
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
