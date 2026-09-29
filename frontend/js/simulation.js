/**
 * POLARIS Simulation & State Management Engine
 * Handles real-time telemetry, scenarios, storm events, AI algorithms, and backend API sync.
 */

class PolarisSimulationEngine {
  constructor() {
    this.isLive = true;
    this.intervalId = null;
    this.tickInterval = 2500; // ms
    this.scenario = 'normal'; // 'normal', 'cloudy', 'extreme_cold', 'high_wind', 'storm', 'low_battery'
    this.backendAvailable = false;
    this.backendUrl = window.location.origin || 'http://localhost:8008';

    // Core System State
    this.state = {
      timestamp: new Date(),
      stationId: "ARCTIC-01",
      location: "Polar Research Zone (78°13'N, 15°38'E)",
      status: "OPERATIONAL",
      
      // Energy Telemetry
      solarGen: 18.4,       // kW
      windGen: 7.2,         // kW
      currentLoad: 14.2,     // kW
      batterySoc: 76.0,     // %
      batteryHealth: 94.0,  // %
      batteryCharging: 6.4, // kW
      batteryDischarging: 0.0, // kW
      batteryReserveSafe: 60.0, // %
      batteryBackupHours: 8.6, // hours
      backupFuel: 82.0,     // %
      backupGenKw: 0.0,     // kW
      renewablePct: 68.0,    // %
      fuelSavedPct: 18.0,   // %
      
      // Load Breakdown (kW)
      loads: {
        critical: {
          heating: 6.2,
          communication: 1.8,
          lifeSupport: 3.5,
          emergency: 1.0,
          total: 12.5
        },
        flexible: {
          waterHeating: 2.8,
          researchEquipment: 3.4,
          nonCriticalAppliances: 1.5,
          total: 7.7
        },
        backup: {
          dieselGenset: 0.0,
          emergencyReserve: 0.0,
          total: 0.0
        }
      },

      // Weather & Environmental Conditions
      weather: {
        temp: -28.0,           // °C
        windSpeed: 32.0,       // km/h
        humidity: 68.0,        // %
        solarIrradiance: 412.0,// W/m²
        visibility: 8.4,       // km
        condition: "Partly Cloudy",
        auroraActivity: "Moderate (KP 4.2)",
        impact: {
          solar: "MODERATE",
          wind: "HIGH",
          heating: "HIGH",
          risk: "MODERATE"
        }
      },

      // AI Forecasting Engine Outputs
      forecast: {
        confidence: 92,
        modelStatus: "ACTIVE",
        modelName: "LSTM-XGBoost Polar Ensemble v2.4",
        demand: {
          current: 14.2,
          next1h: 15.1,
          next6h: 16.8,
          next24hAvg: 15.9,
          hourly6: [20, 22, 24, 26, 25, 23]
        },
        renewable: {
          solarTrendPct: -18,
          windTrendPct: +9,
          hourly6: [18, 20, 16, 12, 10, 14]
        }
      },

      // AI Optimization Decisions
      optimization: {
        headline: "Maintain battery reserve above 60% and shift flexible loads during the predicted low-generation period.",
        loadShiftHours: 2,
        batteryStrategy: "PEAK_PRESERVE",
        generatorStrategy: "AUTO_STANDBY",
        recommendations: [
          {
            id: 1,
            title: "Renewable Priority Dispatch",
            action: "Power 100% of critical life-support and heating from renewable generation.",
            type: "success",
            status: "APPLIED"
          },
          {
            id: 2,
            title: "Intelligent Battery Buffering",
            action: "Buffer excess 6.4 kW solar/wind into lithium-titanate storage banks.",
            type: "info",
            status: "ACTIVE"
          },
          {
            id: 3,
            title: "Flexible Load Shift",
            action: "Shift flexible research labs & secondary heating cycle by +2 hours to match peak wind availability.",
            type: "warning",
            status: "QUEUED"
          },
          {
            id: 4,
            title: "Reserve Protection Rule",
            action: "Lock 60% minimum battery state of charge against potential sudden cold-front dips.",
            type: "success",
            status: "ENFORCED"
          }
        ]
      },

      // Intelligent Alerts Center
      alerts: [
        {
          id: 101,
          severity: "HIGH",
          time: "10 mins ago",
          desc: "Solar generation expected to fall by 32% in next 3 hours due to approaching polar fog.",
          recom: "Preserve 15% battery reserve and postpone scheduled drill sampling.",
          status: "OPEN"
        },
        {
          id: 102,
          severity: "WEATHER",
          time: "24 mins ago",
          desc: "Extreme Arctic temperature dip (-31°C) detected. Primary habitat thermal load increasing by 1.8 kW.",
          recom: "Pre-heat insulated hab-zones using active wind surge.",
          status: "IN_PROGRESS"
        },
        {
          id: 103,
          severity: "INFO",
          time: "45 mins ago",
          desc: "High wind generation (32 km/h) available. Optimal window for thermal battery pre-charging.",
          recom: "Engaged auxiliary thermal storage cells.",
          status: "RESOLVED"
        },
        {
          id: 104,
          severity: "MEDIUM",
          time: "1 hour ago",
          desc: "Battery bank B-02 temperature at -12°C. Internal trace heating active.",
          recom: "Monitor battery thermal management circuits.",
          status: "OPEN"
        }
      ],

      // Historical timeseries buffer for interactive charts (past 24h data)
      history24h: this.generateHistoricalData()
    };

    this.subscribers = [];
    this.init();
  }

  generateHistoricalData() {
    const data = {
      labels: [],
      solar: [],
      wind: [],
      load: [],
      batterySoc: [],
      backupGen: [],
      temp: [],
      windSpeed: [],
      solarIrradiance: []
    };

    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStr = t.getHours().toString().padStart(2, '0') + ':00';
      data.labels.push(hourStr);

      const solarBase = Math.max(0, 16 * Math.sin(((t.getHours() - 6) / 12) * Math.PI) + (Math.random() * 2 - 1));
      const windBase = 8 + 4 * Math.sin(i * 0.3) + (Math.random() * 2 - 1);
      const loadBase = 14 + 5 * Math.sin(i * 0.5) + (Math.random() * 1.5);
      const socBase = Math.min(95, Math.max(45, 75 + 15 * Math.sin(i * 0.4)));

      data.solar.push(parseFloat(solarBase.toFixed(1)));
      data.wind.push(parseFloat(windBase.toFixed(1)));
      data.load.push(parseFloat(loadBase.toFixed(1)));
      data.batterySoc.push(parseFloat(socBase.toFixed(1)));
      data.backupGen.push(loadBase > (solarBase + windBase + 10) ? 5.5 : 0.0);
      
      data.temp.push(parseFloat((-26 + 4 * Math.sin(i * 0.25) + (Math.random() - 0.5)).toFixed(1)));
      data.windSpeed.push(parseFloat((28 + 8 * Math.cos(i * 0.3)).toFixed(1)));
      data.solarIrradiance.push(parseFloat((solarBase * 25).toFixed(1)));
    }
    return data;
  }

  init() {
    this.checkBackendConnection();
    this.startSimulationLoop();
  }

  async checkBackendConnection() {
    try {
      const res = await fetch(`${this.backendUrl}/api/status`, { method: 'GET', signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        this.backendAvailable = true;
        console.log("⚡ Connected to POLARIS FastAPI AI Backend!");
      }
    } catch (e) {
      this.backendAvailable = false;
      console.log("ℹ POLARIS running in High-Fidelity Client Simulation Mode.");
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.state);
  }

  notify() {
    for (const sub of this.subscribers) {
      try {
        sub(this.state);
      } catch (err) {
        console.error("Subscriber notification error:", err);
      }
    }
  }

  startSimulationLoop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.isLive) {
        this.tick();
      }
    }, this.tickInterval);
  }

  tick() {
    this.state.timestamp = new Date();

    // Minor stochastic variance to emulate live sensors
    const noise = (Math.random() - 0.5) * 0.4;
    const windNoise = (Math.random() - 0.5) * 0.6;
    const loadNoise = (Math.random() - 0.5) * 0.3;

    if (this.scenario === 'normal') {
      this.state.solarGen = Math.max(12, Math.min(24, +(this.state.solarGen + noise).toFixed(1)));
      this.state.windGen = Math.max(4, Math.min(14, +(this.state.windGen + windNoise).toFixed(1)));
      this.state.currentLoad = Math.max(12, Math.min(22, +(this.state.currentLoad + loadNoise).toFixed(1)));
      this.state.weather.temp = +(-28 + noise * 0.5).toFixed(1);
      this.state.weather.windSpeed = +(32 + windNoise * 2).toFixed(1);
      this.state.weather.condition = "Partly Cloudy";
      this.state.status = "OPERATIONAL";
    }

    // Energy Balance Computation
    const totalGen = this.state.solarGen + this.state.windGen;
    const balance = totalGen - this.state.currentLoad;

    if (balance > 0) {
      // Excess energy charges battery
      this.state.batteryCharging = +Math.min(12, balance).toFixed(1);
      this.state.batteryDischarging = 0.0;
      this.state.batterySoc = Math.min(98, +(this.state.batterySoc + 0.05).toFixed(1));
      this.state.backupGenKw = 0.0;
    } else {
      // Deficit drawn from battery or generator
      const deficit = Math.abs(balance);
      this.state.batteryCharging = 0.0;
      if (this.state.batterySoc > this.state.batteryReserveSafe) {
        this.state.batteryDischarging = +deficit.toFixed(1);
        this.state.batterySoc = Math.max(10, +(this.state.batterySoc - 0.08).toFixed(1));
        this.state.backupGenKw = 0.0;
      } else {
        // Safe reserve reached, generator steps in
        this.state.batteryDischarging = +Math.min(deficit, 2.0).toFixed(1);
        this.state.backupGenKw = +(deficit - this.state.batteryDischarging).toFixed(1);
      }
    }

    this.state.renewablePct = Math.min(100, Math.round((totalGen / (this.state.currentLoad || 1)) * 100));
    this.notify();
  }

  applyCustomInputs(custom) {
    this.scenario = 'custom';
    if (custom.solar !== undefined) this.state.solarGen = parseFloat(custom.solar);
    if (custom.wind !== undefined) this.state.windGen = parseFloat(custom.wind);
    if (custom.criticalLoad !== undefined) this.state.loads.critical.total = parseFloat(custom.criticalLoad);
    if (custom.flexibleLoad !== undefined) this.state.loads.flexible.total = parseFloat(custom.flexibleLoad);
    
    // Compute total load
    const crit = this.state.loads.critical.total || 12.5;
    const flex = this.state.loads.flexible.total || 7.7;
    this.state.currentLoad = parseFloat((crit + flex).toFixed(1));

    if (custom.batterySoc !== undefined) this.state.batterySoc = parseFloat(custom.batterySoc);
    if (custom.temp !== undefined) {
      this.state.weather.temp = parseFloat(custom.temp);
      if (custom.temp < -40) {
        this.state.weather.condition = "Extreme Arctic Chill";
        this.state.weather.impact.heating = "CRITICAL";
        this.state.weather.impact.risk = "HIGH";
      } else if (custom.temp < -25) {
        this.state.weather.condition = "Partly Cloudy";
        this.state.weather.impact.heating = "HIGH";
        this.state.weather.impact.risk = "MODERATE";
      } else {
        this.state.weather.condition = "Mild Polar Clear";
        this.state.weather.impact.heating = "MODERATE";
        this.state.weather.impact.risk = "LOW";
      }
    }
    if (custom.windSpeed !== undefined) {
      this.state.weather.windSpeed = parseFloat(custom.windSpeed);
    }

    // Recalculate Energy Balance & AI Allocation
    const totalGen = this.state.solarGen + this.state.windGen;
    const balance = totalGen - this.state.currentLoad;

    if (balance >= 0) {
      // Surplus: 100% renewable, battery charging, genset off
      this.state.batteryCharging = parseFloat(Math.min(12, balance).toFixed(1));
      this.state.batteryDischarging = 0.0;
      this.state.backupGenKw = 0.0;
      this.state.renewablePct = 100;
      this.state.fuelSavedPct = 34.0;
      this.state.status = "OPTIMAL RENEWABLE SURPLUS";
      this.state.optimization.headline = `SURPLUS DETECTED: +${balance.toFixed(1)} kW surplus. 100% of station powered by renewables. Excess routed to lithium battery storage.`;
    } else {
      // Deficit: Evaluate battery vs generator
      const deficit = Math.abs(balance);
      this.state.batteryCharging = 0.0;
      
      if (this.state.batterySoc > this.state.batteryReserveSafe) {
        // Battery can cover deficit
        this.state.batteryDischarging = parseFloat(deficit.toFixed(1));
        this.state.backupGenKw = 0.0;
        this.state.renewablePct = Math.round((totalGen / (this.state.currentLoad || 1)) * 100);
        this.state.fuelSavedPct = 22.0;
        this.state.status = "BATTERY BUFFERED";
        this.state.optimization.headline = `DEFICIT COVERED BY BESS: Deficit of ${deficit.toFixed(1)} kW drawn safely from battery. SOC (${this.state.batterySoc}%) remains above ${this.state.batteryReserveSafe}% safe reserve limit.`;
      } else {
        // Battery below safe reserve! AI triggers load shifting and genset
        const batteryHelp = Math.min(deficit, 2.0);
        this.state.batteryDischarging = parseFloat(batteryHelp.toFixed(1));
        this.state.backupGenKw = parseFloat((deficit - batteryHelp).toFixed(1));
        this.state.renewablePct = Math.round((totalGen / (this.state.currentLoad || 1)) * 100);
        this.state.fuelSavedPct = 8.0;
        this.state.status = "BACKUP GENSET ENGAGED";
        this.state.optimization.headline = `RESERVE PROTECTION ACTIVE: Battery SOC at ${this.state.batterySoc}%. Shift flexible loads immediately (-${flex} kW) and dispatch backup generator at ${this.state.backupGenKw} kW to protect life-support.`;
      }
    }

    // Update estimated backup hours based on active load and SOC
    const remainingKwh = (this.state.batterySoc / 100) * 500;
    this.state.batteryBackupHours = parseFloat((remainingKwh / Math.max(crit, 1)).toFixed(1));

    this.notify();
    return this.state;
  }

  setScenario(scenarioName) {
    this.scenario = scenarioName;
    console.log(`Setting scenario: ${scenarioName}`);

    switch (scenarioName) {
      case 'normal':
        this.state.solarGen = 18.4;
        this.state.windGen = 7.2;
        this.state.currentLoad = 14.2;
        this.state.batterySoc = 76.0;
        this.state.backupFuel = 82.0;
        this.state.weather.temp = -28.0;
        this.state.weather.windSpeed = 32.0;
        this.state.weather.solarIrradiance = 412.0;
        this.state.weather.condition = "Partly Cloudy";
        this.state.weather.impact = { solar: "MODERATE", wind: "HIGH", heating: "HIGH", risk: "MODERATE" };
        this.state.optimization.headline = "Maintain battery reserve above 60% and shift flexible loads during the predicted low-generation period.";
        break;

      case 'cloudy':
        this.state.solarGen = 5.2;
        this.state.windGen = 11.4;
        this.state.currentLoad = 15.8;
        this.state.batterySoc = 68.0;
        this.state.weather.temp = -26.0;
        this.state.weather.windSpeed = 44.0;
        this.state.weather.solarIrradiance = 110.0;
        this.state.weather.condition = "Heavy Overcast & Mist";
        this.state.weather.impact = { solar: "LOW", wind: "VERY HIGH", heating: "HIGH", risk: "MODERATE" };
        this.state.optimization.headline = "Maximize Wind Turbine capture. Delay non-critical solar-aligned battery boost cycles.";
        break;

      case 'extreme_cold':
        this.state.solarGen = 14.0;
        this.state.windGen = 6.0;
        this.state.currentLoad = 26.5; // High heating load
        this.state.batterySoc = 58.0;
        this.state.weather.temp = -44.0;
        this.state.weather.windSpeed = 22.0;
        this.state.weather.solarIrradiance = 320.0;
        this.state.weather.condition = "Extreme Arctic Chill (-44°C)";
        this.state.weather.impact = { solar: "MODERATE", wind: "MODERATE", heating: "CRITICAL", risk: "HIGH" };
        this.state.optimization.headline = "Priority 1: Life-Support & Thermal Envelope protection. Automated shedding of secondary science compute racks.";
        break;

      case 'high_wind':
        this.state.solarGen = 12.5;
        this.state.windGen = 28.4;
        this.state.currentLoad = 16.0;
        this.state.batterySoc = 92.0;
        this.state.weather.temp = -22.0;
        this.state.weather.windSpeed = 62.0;
        this.state.weather.solarIrradiance = 280.0;
        this.state.weather.condition = "Gale Winds / Aurora Active";
        this.state.weather.impact = { solar: "MODERATE", wind: "MAXIMUM", heating: "MODERATE", risk: "LOW" };
        this.state.optimization.headline = "Surplus Wind Available. Fast-charging primary battery banks and preheating thermal energy buffers.";
        break;

      case 'storm':
        this.triggerStormEvent();
        return;

      case 'low_battery':
        this.state.solarGen = 4.1;
        this.state.windGen = 3.2;
        this.state.currentLoad = 18.0;
        this.state.batterySoc = 28.0; // Critical battery
        this.state.backupFuel = 74.0;
        this.state.backupGenKw = 11.5;
        this.state.weather.temp = -35.0;
        this.state.weather.condition = "Blizzard Surge";
        this.state.weather.impact = { solar: "CRITICAL LOW", wind: "LOW", heating: "HIGH", risk: "CRITICAL" };
        this.state.optimization.headline = "CRITICAL BATTERY PROTOCOL: Emergency diesel genset active. Shedding all flexible loads.";
        break;
    }

    this.notify();
  }

  triggerStormEvent() {
    this.scenario = 'storm';
    
    // Save previous snapshot for before/after comparison
    this.stormSnapshot = {
      before: {
        renewable: 72,
        battery: 78,
        backup: "OFF",
        load: 14.2,
        temp: -28,
        wind: 32,
        solar: 18.4,
        windGen: 7.2
      },
      after: {
        renewable: 41,
        battery: 63,
        backup: "STANDBY (Warm)",
        load: 23.8,
        temp: -42,
        wind: 68,
        solar: 2.1,
        windGen: 8.4
      },
      aiRecommendation: "Preserve battery reserve (>= 60%), postpone flexible research loads, and spin up backup genset into automatic standby."
    };

    // Apply storm changes to live telemetry
    this.state.solarGen = 2.1;
    this.state.windGen = 8.4;
    this.state.currentLoad = 23.8;
    this.state.batterySoc = 63.0;
    this.state.weather.temp = -42.0;
    this.state.weather.windSpeed = 68.0;
    this.state.weather.solarIrradiance = 45.0;
    this.state.weather.visibility = 0.6;
    this.state.weather.condition = "Severe Arctic Blizzard & Whiteout";
    this.state.status = "STORM PROTOCOL ACTIVE";
    this.state.weather.impact = { solar: "CRITICAL LOW", wind: "TURBULENT", heating: "MAXIMUM", risk: "VERY HIGH" };
    
    this.state.optimization.headline = "STORM RESPONSE: Lock 60% minimum battery reserve, shift 7.7 kW flexible load, backup genset on HOT STANDBY.";

    // Prepend high severity storm alert
    this.state.alerts.unshift({
      id: Date.now(),
      severity: "HIGH",
      time: "Just now",
      desc: "Severe Arctic Blizzard incoming. Solar dropping to 2.1 kW, thermal demand surging by +9.6 kW.",
      recom: "Automated flexible load shedding initiated. Battery reserve locked at 60%.",
      status: "OPEN"
    });

    this.notify();
    return this.stormSnapshot;
  }
}

// Global instance
window.polarisEngine = new PolarisSimulationEngine();
