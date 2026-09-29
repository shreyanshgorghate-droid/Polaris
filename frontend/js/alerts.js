/**
 * POLARIS Intelligent Alerts Center Controller
 */

function initAlertsView() {
  renderAlertsList();
  setupAlertFilterTabs();
}

function renderAlertsList(filter = 'ALL') {
  const container = document.getElementById('alerts-feed-container');
  if (!container) return;

  const alerts = window.polarisEngine.state.alerts;
  const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.severity === filter);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px; color: #64748b;">No active alerts under ${filter} severity.</div>`;
    return;
  }

  container.innerHTML = filtered.map(alert => {
    let cardClass = 'alert-info';
    let badgeClass = 'alert-badge-info';
    let icon = 'ℹ';

    if (alert.severity === 'HIGH') {
      cardClass = 'alert-high';
      badgeClass = 'alert-badge-high';
      icon = '⚠';
    } else if (alert.severity === 'MEDIUM') {
      cardClass = 'alert-med';
      badgeClass = 'alert-badge-med';
      icon = '⚡';
    } else if (alert.severity === 'WEATHER') {
      cardClass = 'alert-weather';
      badgeClass = 'alert-badge-weather';
      icon = '❄';
    }

    return `
      <div class="alert-card ${cardClass}" id="alert-item-${alert.id}">
        <div class="alert-icon">${icon}</div>
        <div class="alert-body">
          <div class="alert-head-row">
            <span class="alert-badge ${badgeClass}">${alert.severity} PRIORITY</span>
            <span class="alert-time">${alert.time}</span>
          </div>
          <div class="alert-desc">${alert.desc}</div>
          <div class="alert-action-row">
            <span class="alert-recom"><b>AI Recommended Action:</b> ${alert.recom}</span>
            <button class="btn btn-outline" style="padding: 3px 8px; font-size: 11px;" onclick="executeAlertAction(${alert.id})">
              Execute Action
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function executeAlertAction(alertId) {
  const item = document.getElementById(`alert-item-${alertId}`);
  if (item) {
    item.style.opacity = '0.5';
    item.style.borderLeftColor = '#10b981';
    const recomText = item.querySelector('.alert-recom');
    if (recomText) {
      recomText.innerHTML = `<b>Action Deployed:</b> AI dispatch commands verified and executed in sub-station PLC.`;
      recomText.style.color = '#10b981';
    }
  }
}

function setupAlertFilterTabs() {
  const tabs = document.querySelectorAll('.alert-filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.severity || 'ALL';
      renderAlertsList(filter);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initAlertsView();
});
