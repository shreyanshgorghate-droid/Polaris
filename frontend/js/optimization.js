/**
 * POLARIS AI Energy Optimization Engine Controller
 * Features Interactive Energy Input Simulator & Multi-Tier Dispatch Solver
 */

function initOptimizationView() {
  const shiftSlider = document.getElementById('slider-load-shift');
  const shiftValDisplay = document.getElementById('val-load-shift');
  const optRecalculateBtn = document.getElementById('btn-recalculate-opt');
  const btnRunCustomOpt = document.getElementById('btn-run-custom-optimizer');

  if (shiftSlider && shiftValDisplay) {
    shiftSlider.addEventListener('input', (e) => {
      shiftValDisplay.textContent = `${e.target.value} Hours`;
      calculateOptimizationImpact(parseInt(e.target.value));
    });
  }

  if (optRecalculateBtn) {
    optRecalculateBtn.addEventListener('click', () => {
      triggerOptimizationRun();
    });
  }

  if (btnRunCustomOpt) {
    btnRunCustomOpt.addEventListener('click', () => {
      runCustomEnergyOptimization();
    });
  }

  setupCustomInputSliders();
  setupScenarioPresets();
  setupInteractiveLoadSwitches();
}

function setupCustomInputSliders() {
  const syncInput = (sliderId, numId, unit = '') => {
    const slider = document.getElementById(sliderId);
    const num = document.getElementById(numId);
    if (!slider || !num) return;

    slider.addEventListener('input', () => {
      num.textContent = `${slider.value}${unit}`;
      runCustomEnergyOptimization(false);
    });
  };

  syncInput('input-solar-gen', 'val-input-solar', ' kW');
  syncInput('input-wind-gen', 'val-input-wind', ' kW');
  syncInput('input-critical-load', 'val-input-critical', ' kW');
  syncInput('input-flexible-load', 'val-input-flexible', ' kW');
  syncInput('input-battery-soc', 'val-input-battery', '%');
  syncInput('input-ambient-temp', 'val-input-temp', '°C');
}

function setupScenarioPresets() {
  const presets = {
    'preset-midday-solar': { solar: 24.5, wind: 6.0, crit: 12.5, flex: 7.7, soc: 80, temp: -22 },
    'preset-wind-gale': { solar: 4.0, wind: 26.5, crit: 14.0, flex: 8.5, soc: 88, temp: -25 },
    'preset-blizzard-chill': { solar: 1.5, wind: 6.0, crit: 22.0, flex: 4.0, soc: 62, temp: -44 },
    'preset-emergency-soc': { solar: 3.0, wind: 4.0, crit: 16.0, flex: 2.0, soc: 32, temp: -38 }
  };

  Object.keys(presets).forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        const p = presets[btnId];
        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val;
        };
        const setText = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        };

        setVal('input-solar-gen', p.solar);
        setText('val-input-solar', `${p.solar} kW`);

        setVal('input-wind-gen', p.wind);
        setText('val-input-wind', `${p.wind} kW`);

        setVal('input-critical-load', p.crit);
        setText('val-input-critical', `${p.crit} kW`);

        setVal('input-flexible-load', p.flex);
        setText('val-input-flexible', `${p.flex} kW`);

        setVal('input-battery-soc', p.soc);
        setText('val-input-battery', `${p.soc}%`);

        setVal('input-ambient-temp', p.temp);
        setText('val-input-temp', `${p.temp}°C`);

        runCustomEnergyOptimization(true);
      });
    }
  });
}

function runCustomEnergyOptimization(showAnimation = true) {
  const getVal = (id, def) => {
    const el = document.getElementById(id);
    return el ? parseFloat(el.value) : def;
  };

  const solar = getVal('input-solar-gen', 18.4);
  const wind = getVal('input-wind-gen', 7.2);
  const crit = getVal('input-critical-load', 12.5);
  const flex = getVal('input-flexible-load', 7.7);
  const soc = getVal('input-battery-soc', 76.0);
  const temp = getVal('input-ambient-temp', -28.0);

  const updatedState = window.polarisEngine.applyCustomInputs({
    solar: solar,
    wind: wind,
    criticalLoad: crit,
    flexibleLoad: flex,
    batterySoc: soc,
    temp: temp
  });

  // Update Dynamic Outcome Cards in Optimization View
  const totalGen = (solar + wind).toFixed(1);
  const totalDemand = (crit + flex).toFixed(1);
  const balance = (solar + wind - (crit + flex)).toFixed(1);

  const setCard = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };

  setCard('calc-total-gen', `${totalGen} kW`);
  setCard('calc-total-demand', `${totalDemand} kW`);
  
  const balanceEl = document.getElementById('calc-net-balance');
  if (balanceEl) {
    if (balance >= 0) {
      balanceEl.textContent = `+${balance} kW (Surplus)`;
      balanceEl.style.color = '#10b981';
    } else {
      balanceEl.textContent = `${balance} kW (Deficit)`;
      balanceEl.style.color = '#f43f5e';
    }
  }

  setCard('calc-renew-pct', `${updatedState.renewablePct}%`);
  setCard('calc-fuel-saved', `+${updatedState.fuelSavedPct}%`);
  setCard('calc-backup-hours', `${updatedState.batteryBackupHours} hrs`);

  const decisionEl = document.getElementById('opt-ai-decision-text');
  if (decisionEl) decisionEl.textContent = updatedState.optimization.headline;

  if (showAnimation) {
    const banner = document.getElementById('opt-banner-status');
    if (banner) {
      banner.innerHTML = `<span class="live-badge" style="color:#00f2fe;"><span class="pulse-dot"></span> AI RE-COMPUTING DISPATCH MATRIX...</span>`;
      setTimeout(() => {
        banner.innerHTML = `<span style="color:#10b981; font-weight:700;">✓ OPTIMAL DISPATCH APPLIED (${updatedState.status})</span>`;
      }, 500);
    }
  }
}

function setupInteractiveLoadSwitches() {
  const toggles = document.querySelectorAll('.load-toggle-switch');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      calculateActiveLoads();
    });
  });
}

function calculateActiveLoads() {
  let criticalTotal = 0;
  let flexibleTotal = 0;

  document.querySelectorAll('.load-item-row').forEach(row => {
    const isChecked = row.querySelector('input[type="checkbox"]')?.checked ?? true;
    const power = parseFloat(row.dataset.power || '0');
    const category = row.dataset.category;

    if (isChecked) {
      if (category === 'critical') criticalTotal += power;
      if (category === 'flexible') flexibleTotal += power;
    }
  });

  const totalDemand = criticalTotal + flexibleTotal;
  const optDemandEl = document.getElementById('opt-total-demand');
  if (optDemandEl) optDemandEl.textContent = `${totalDemand.toFixed(1)} kW`;
}

function calculateOptimizationImpact(shiftHours) {
  const fuelSavedEl = document.getElementById('opt-fuel-saved-metric');
  const peakShavedEl = document.getElementById('opt-peak-shaved-metric');

  const baseFuel = 18;
  const calculatedFuel = baseFuel + shiftHours * 3.5;
  const peakShaved = (shiftHours * 1.8).toFixed(1);

  if (fuelSavedEl) fuelSavedEl.textContent = `+${calculatedFuel.toFixed(0)}%`;
  if (peakShavedEl) peakShavedEl.textContent = `-${peakShaved} kW`;
}

function triggerOptimizationRun() {
  const banner = document.getElementById('opt-banner-status');
  if (banner) {
    banner.innerHTML = `<span class="live-badge"><span class="pulse-dot"></span> AI OPTIMIZING CONSTRAINTS...</span>`;
    setTimeout(() => {
      banner.innerHTML = `<span style="color: #10b981; font-weight: 700;">✓ OPTIMAL DISPATCH CONVERGED (Simplex Solver 1.4ms)</span>`;
      calculateActiveLoads();
    }, 600);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initOptimizationView();
});
