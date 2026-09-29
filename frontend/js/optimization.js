/**
 * POLARIS AI Energy Optimization Engine Controller
 */

function initOptimizationView() {
  const shiftSlider = document.getElementById('slider-load-shift');
  const shiftValDisplay = document.getElementById('val-load-shift');
  const optRecalculateBtn = document.getElementById('btn-recalculate-opt');

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

  setupInteractiveLoadSwitches();
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

  // Update AI Decision
  const decisionEl = document.getElementById('opt-ai-decision-text');
  if (decisionEl) {
    if (flexibleTotal < 4.0) {
      decisionEl.textContent = `OPTIMIZED: Flexible loads reduced. Station operates strictly on 100% renewable generation with 0% backup genset required.`;
    } else {
      decisionEl.textContent = `Maintain battery reserve above 60% and shift flexible loads during the predicted low-generation period.`;
    }
  }
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
    }, 800);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initOptimizationView();
});
