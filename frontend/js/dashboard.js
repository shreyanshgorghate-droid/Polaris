/**
 * POLARIS Dashboard Controller
 * Manages KPI elements, SVG Energy Flow Visualizer, Real-time Charts, and Terminal Telemetry.
 */

let realTimeEnergyChart = null;

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  initRealtimeChart();
  initEnergyFlowSvg();
  
  // Subscribe to simulation updates
  window.polarisEngine.subscribe((state) => {
    updateKpis(state);
    updateTerminalTelemetry(state);
    updateEnergyFlow(state);
    updateRealtimeChartData(state);
    updateBatteryCard(state);
  });

  // Setup Event Listeners
  setupChartFilterButtons();
  setupStormModal();
  setupScenarioSelector();
  setupPresentationMode();
  setupNavigation();
}

function updateKpis(state) {
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('kpi-solar', `${state.solarGen.toFixed(1)}`);
  setEl('kpi-wind', `${state.windGen.toFixed(1)}`);
  setEl('kpi-load', `${state.currentLoad.toFixed(1)}`);
  setEl('kpi-battery-soc', `${Math.round(state.batterySoc)}%`);
  setEl('kpi-renewable-pct', `${state.renewablePct}%`);
  setEl('kpi-backup-fuel', `${Math.round(state.backupFuel)}%`);

  const statusPill = document.getElementById('system-status-indicator');
  if (statusPill) {
    statusPill.textContent = state.status;
    if (state.status.includes('STORM')) {
      statusPill.style.color = '#f43f5e';
    } else {
      statusPill.style.color = '#10b981';
    }
  }
}

function updateTerminalTelemetry(state) {
  // Update the POLAR ENERGY MANAGER ASCII-like terminal requested
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('pem-solar', `${state.solarGen.toFixed(1)} kW`);
  setEl('pem-wind', `${state.windGen.toFixed(1)} kW`);
  setEl('pem-load', `${state.currentLoad.toFixed(1)} kW`);
  setEl('pem-battery', `${Math.round(state.batterySoc)} %`);
  setEl('pem-fuel', `${Math.round(state.backupFuel)} %`);
}

function initEnergyFlowSvg() {
  const container = document.getElementById('energy-flow-container');
  if (!container) return;

  container.innerHTML = `
    <svg class="flow-svg-canvas" viewBox="0 0 800 360" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="grad-solar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#d97706" />
        </linearGradient>
        <linearGradient id="grad-wind" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
        <linearGradient id="grad-ems" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f2fe" />
          <stop offset="100%" stop-color="#0369a1" />
        </linearGradient>
        <linearGradient id="grad-batt" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="100%" stop-color="#059669" />
        </linearGradient>
        <linearGradient id="grad-load" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f43f5e" />
          <stop offset="100%" stop-color="#e11d48" />
        </linearGradient>
        <linearGradient id="grad-gen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#7e22ce" />
        </linearGradient>
        
        <!-- Filter glow -->
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
      </defs>

      <!-- Connection Lines with Dashed Animation -->
      <!-- Solar to EMS -->
      <path id="path-solar-ems" d="M 170 80 L 350 180" stroke="#f59e0b" stroke-width="2.5" fill="none" class="flow-wire" opacity="0.85"/>
      <!-- Wind to EMS -->
      <path id="path-wind-ems" d="M 170 280 L 350 180" stroke="#38bdf8" stroke-width="2.5" fill="none" class="flow-wire" opacity="0.85"/>
      
      <!-- EMS to Battery -->
      <path id="path-ems-batt" d="M 450 180 L 630 80" stroke="#10b981" stroke-width="2.5" fill="none" class="flow-wire" opacity="0.85"/>
      <!-- EMS to Station Load -->
      <path id="path-ems-load" d="M 450 180 L 630 280" stroke="#f43f5e" stroke-width="2.5" fill="none" class="flow-wire" opacity="0.85"/>

      <!-- Backup Generator to EMS / Station Load -->
      <path id="path-gen-ems" d="M 400 330 L 400 230" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 4" fill="none" opacity="0.4"/>

      <!-- Central EMS Hub -->
      <g class="flow-node" transform="translate(340, 130)">
        <rect class="node-box" width="120" height="100" fill="url(#grad-ems)" filter="url(#glow)" opacity="0.95"/>
        <text x="60" y="38" text-anchor="middle" fill="#030712" font-weight="800" font-size="12" font-family="Rajdhani, sans-serif">POLARIS EMS</text>
        <text x="60" y="56" text-anchor="middle" fill="#030712" font-weight="700" font-size="11">SMART DISPATCH</text>
        <text id="node-ems-balance" x="60" y="80" text-anchor="middle" fill="#ffffff" font-weight="700" font-size="13" font-family="JetBrains Mono, monospace">BALANCED</text>
      </g>

      <!-- Source 1: Solar -->
      <g class="flow-node" transform="translate(40, 40)">
        <rect class="node-box" width="130" height="80" fill="#0f1f38" stroke="#f59e0b" stroke-width="1.5"/>
        <circle cx="28" cy="40" r="16" fill="rgba(245, 158, 11, 0.2)" />
        <text x="28" y="45" text-anchor="middle" fill="#f59e0b" font-size="14">☀</text>
        <text x="75" y="32" fill="#94a3b8" font-size="11" font-weight="600">SOLAR PV</text>
        <text id="node-solar-val" x="75" y="55" fill="#f59e0b" font-size="16" font-weight="700" font-family="JetBrains Mono, monospace">18.4 kW</text>
      </g>

      <!-- Source 2: Wind -->
      <g class="flow-node" transform="translate(40, 240)">
        <rect class="node-box" width="130" height="80" fill="#0f1f38" stroke="#38bdf8" stroke-width="1.5"/>
        <circle cx="28" cy="40" r="16" fill="rgba(56, 189, 248, 0.2)" />
        <text x="28" y="45" text-anchor="middle" fill="#38bdf8" font-size="14">༄</text>
        <text x="75" y="32" fill="#94a3b8" font-size="11" font-weight="600">WIND TURBINE</text>
        <text id="node-wind-val" x="75" y="55" fill="#38bdf8" font-size="16" font-weight="700" font-family="JetBrains Mono, monospace">7.2 kW</text>
      </g>

      <!-- Sink 1: Battery Storage -->
      <g class="flow-node" transform="translate(630, 40)">
        <rect class="node-box" width="130" height="80" fill="#0f1f38" stroke="#10b981" stroke-width="1.5"/>
        <circle cx="28" cy="40" r="16" fill="rgba(16, 185, 129, 0.2)" />
        <text x="28" y="45" text-anchor="middle" fill="#10b981" font-size="14">⚡</text>
        <text x="75" y="32" fill="#94a3b8" font-size="11" font-weight="600">BATTERY SOC</text>
        <text id="node-batt-val" x="75" y="55" fill="#10b981" font-size="16" font-weight="700" font-family="JetBrains Mono, monospace">76%</text>
        <text id="node-batt-sub" x="75" y="70" fill="#64748b" font-size="10">+6.4 kW Chg</text>
      </g>

      <!-- Sink 2: Station Load -->
      <g class="flow-node" transform="translate(630, 240)">
        <rect class="node-box" width="130" height="80" fill="#0f1f38" stroke="#f43f5e" stroke-width="1.5"/>
        <circle cx="28" cy="40" r="16" fill="rgba(244, 63, 94, 0.2)" />
        <text x="28" y="45" text-anchor="middle" fill="#f43f5e" font-size="14">⌂</text>
        <text x="75" y="32" fill="#94a3b8" font-size="11" font-weight="600">STATION LOAD</text>
        <text id="node-load-val" x="75" y="55" fill="#f43f5e" font-size="16" font-weight="700" font-family="JetBrains Mono, monospace">14.2 kW</text>
        <text x="75" y="70" fill="#64748b" font-size="10">Life & Science</text>
      </g>

      <!-- Backup Generator -->
      <g class="flow-node" transform="translate(340, 290)">
        <rect class="node-box" width="120" height="50" fill="#0a1224" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="3 3"/>
        <text x="60" y="22" text-anchor="middle" fill="#c084fc" font-size="10" font-weight="700">BACKUP GENERATOR</text>
        <text id="node-gen-val" x="60" y="38" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="JetBrains Mono, monospace">STANDBY (0 kW)</text>
      </g>
    </svg>
  `;
}

function updateEnergyFlow(state) {
  const setSvgText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setSvgText('node-solar-val', `${state.solarGen.toFixed(1)} kW`);
  setSvgText('node-wind-val', `${state.windGen.toFixed(1)} kW`);
  setSvgText('node-batt-val', `${Math.round(state.batterySoc)}%`);
  setSvgText('node-load-val', `${state.currentLoad.toFixed(1)} kW`);
  
  if (state.batteryCharging > 0) {
    setSvgText('node-batt-sub', `+${state.batteryCharging.toFixed(1)} kW Chg`);
  } else if (state.batteryDischarging > 0) {
    setSvgText('node-batt-sub', `-${state.batteryDischarging.toFixed(1)} kW Dis`);
  } else {
    setSvgText('node-batt-sub', `IDLE`);
  }

  if (state.backupGenKw > 0) {
    setSvgText('node-gen-val', `ACTIVE (${state.backupGenKw.toFixed(1)} kW)`);
  } else {
    setSvgText('node-gen-val', `STANDBY (0 kW)`);
  }
}

function initRealtimeChart() {
  const ctx = document.getElementById('chart-generation-consumption');
  if (!ctx) return;

  const hist = window.polarisEngine.state.history24h;

  realTimeEnergyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hist.labels.slice(-12),
      datasets: [
        {
          label: 'Solar Gen (kW)',
          data: hist.solar.slice(-12),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: 'Wind Gen (kW)',
          data: hist.wind.slice(-12),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: 'Total Load (kW)',
          data: hist.load.slice(-12),
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.05)',
          fill: false,
          tension: 0.35,
          borderWidth: 2.5,
          pointRadius: 3,
          borderDash: [4, 4]
        },
        {
          label: 'Battery SOC (%)',
          data: hist.batterySoc.slice(-12),
          borderColor: '#10b981',
          yAxisID: 'y1',
          fill: false,
          tension: 0.35,
          borderWidth: 1.5,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11 }
          }
        },
        tooltip: {
          backgroundColor: '#0d172e',
          titleColor: '#00f2fe',
          bodyColor: '#f1f5f9',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#64748b', font: { size: 10 } }
        },
        y: {
          title: { display: true, text: 'Power (kW)', color: '#94a3b8', font: { size: 11 } },
          grid: { color: 'rgba(255, 255, 255, 0.04)' },
          ticks: { color: '#64748b' }
        },
        y1: {
          type: 'linear',
          position: 'right',
          min: 0,
          max: 100,
          title: { display: true, text: 'SOC (%)', color: '#10b981', font: { size: 11 } },
          grid: { drawOnChartArea: false },
          ticks: { color: '#10b981' }
        }
      }
    }
  });
}

function updateRealtimeChartData(state) {
  if (!realTimeEnergyChart) return;
  // Update last points dynamically
  const len = realTimeEnergyChart.data.labels.length;
  if (len > 0) {
    realTimeEnergyChart.data.datasets[0].data[len - 1] = state.solarGen;
    realTimeEnergyChart.data.datasets[1].data[len - 1] = state.windGen;
    realTimeEnergyChart.data.datasets[2].data[len - 1] = state.currentLoad;
    realTimeEnergyChart.data.datasets[3].data[len - 1] = state.batterySoc;
    realTimeEnergyChart.update('none');
  }
}

function setupChartFilterButtons() {
  const buttons = document.querySelectorAll('.chart-filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const hours = parseInt(btn.dataset.range || '12');
      if (realTimeEnergyChart) {
        const hist = window.polarisEngine.state.history24h;
        realTimeEnergyChart.data.labels = hist.labels.slice(-hours);
        realTimeEnergyChart.data.datasets[0].data = hist.solar.slice(-hours);
        realTimeEnergyChart.data.datasets[1].data = hist.wind.slice(-hours);
        realTimeEnergyChart.data.datasets[2].data = hist.load.slice(-hours);
        realTimeEnergyChart.data.datasets[3].data = hist.batterySoc.slice(-hours);
        realTimeEnergyChart.update();
      }
    });
  });
}

function updateBatteryCard(state) {
  const socEl = document.getElementById('battery-soc-circle-val');
  const backupEl = document.getElementById('battery-backup-hours');
  const healthEl = document.getElementById('battery-health-val');
  const chargeDischargeEl = document.getElementById('battery-chg-dis');

  if (socEl) socEl.textContent = `${Math.round(state.batterySoc)}%`;
  if (backupEl) backupEl.textContent = `${state.batteryBackupHours} hrs`;
  if (healthEl) healthEl.textContent = `${state.batteryHealth}%`;
  
  if (chargeDischargeEl) {
    if (state.batteryCharging > 0) {
      chargeDischargeEl.textContent = `+${state.batteryCharging.toFixed(1)} kW (Charging)`;
      chargeDischargeEl.style.color = '#10b981';
    } else if (state.batteryDischarging > 0) {
      chargeDischargeEl.textContent = `-${state.batteryDischarging.toFixed(1)} kW (Discharging)`;
      chargeDischargeEl.style.color = '#f43f5e';
    } else {
      chargeDischargeEl.textContent = `Idle / Floating`;
      chargeDischargeEl.style.color = '#94a3b8';
    }
  }

  // Update battery circle progress stroke
  const circleProgress = document.getElementById('battery-circle-svg-stroke');
  if (circleProgress) {
    const circumference = 2 * Math.PI * 70; // r=70
    const offset = circumference - (state.batterySoc / 100) * circumference;
    circleProgress.style.strokeDashoffset = offset;
    if (state.batterySoc <= 60) {
      circleProgress.style.stroke = '#f59e0b';
    } else if (state.batterySoc <= 30) {
      circleProgress.style.stroke = '#f43f5e';
    } else {
      circleProgress.style.stroke = '#00f2fe';
    }
  }
}

function setupScenarioSelector() {
  const select = document.getElementById('scenario-select');
  if (select) {
    select.addEventListener('change', (e) => {
      window.polarisEngine.setScenario(e.target.value);
    });
  }
}

function setupStormModal() {
  const stormBtn = document.getElementById('btn-simulate-storm');
  const modal = document.getElementById('modal-storm-simulation');
  const closeBtn = document.getElementById('close-storm-modal');
  const applyBtn = document.getElementById('btn-apply-storm-action');

  if (stormBtn && modal) {
    stormBtn.addEventListener('click', () => {
      const snap = window.polarisEngine.triggerStormEvent();
      
      // Populate modal diff values
      document.getElementById('storm-before-renew').textContent = `${snap.before.renewable}%`;
      document.getElementById('storm-before-batt').textContent = `${snap.before.battery}%`;
      document.getElementById('storm-before-gen').textContent = `${snap.before.backup}`;
      
      document.getElementById('storm-after-renew').textContent = `${snap.after.renewable}%`;
      document.getElementById('storm-after-batt').textContent = `${snap.after.battery}%`;
      document.getElementById('storm-after-gen').textContent = `${snap.after.backup}`;
      
      document.getElementById('storm-ai-recom-text').textContent = snap.aiRecommendation;

      modal.classList.add('active');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (applyBtn && modal) {
    applyBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      // Navigate to optimization page
      switchPage('optimization');
    });
  }
}

function setupPresentationMode() {
  const presBtn = document.getElementById('btn-presentation-mode');
  const modal = document.getElementById('modal-presentation-mode');
  const closeBtn = document.getElementById('close-pres-modal');
  const nextBtn = document.getElementById('btn-pres-next');
  const prevBtn = document.getElementById('btn-pres-prev');

  let currentSlide = 1;
  const totalSlides = 7;

  function showSlide(n) {
    currentSlide = n;
    document.querySelectorAll('.presentation-slide').forEach((s, idx) => {
      s.classList.toggle('active', idx + 1 === currentSlide);
    });
    document.querySelectorAll('.progress-step-pill').forEach((p, idx) => {
      p.classList.toggle('completed', idx + 1 <= currentSlide);
    });
    
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) {
      nextBtn.textContent = currentSlide === totalSlides ? "Finish Presentation" : "Next Slide →";
    }
  }

  if (presBtn && modal) {
    presBtn.addEventListener('click', () => {
      modal.classList.add('active');
      showSlide(1);
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
      } else {
        modal.classList.remove('active');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlide > 1) {
        showSlide(currentSlide - 1);
      }
    });
  }
}

function setupNavigation() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (page) {
        switchPage(page);
      }
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

function switchPage(pageId) {
  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageId);
  });

  // Show corresponding page container
  document.querySelectorAll('.page-container').forEach(page => {
    page.classList.toggle('active', page.id === `page-${pageId}`);
  });

  // Close mobile sidebar if open
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('open');

  // Trigger chart re-renders if needed for sub-pages
  window.dispatchEvent(new Event('resize'));
  if (window.onPageActivated) {
    window.onPageActivated(pageId);
  }
}
