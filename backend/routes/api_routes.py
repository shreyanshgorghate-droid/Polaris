from fastapi import APIRouter
from ..models.schemas import (
    TelemetryState, WeatherModel, LoadBreakdown, 
    ForecastResponse, OptimizationRequest, OptimizationResponse, AlertItem
)
from ..services.forecasting_engine import forecasting_service
from ..services.optimizer_solver import optimizer_service
from typing import List, Dict

router = APIRouter()

# Current Microgrid State
CURRENT_STATE = {
    "station_id": "ARCTIC-01",
    "status": "OPERATIONAL",
    "solar_generation_kw": 18.4,
    "wind_generation_kw": 7.2,
    "current_load_kw": 14.2,
    "battery_soc_pct": 76.0,
    "battery_health_pct": 94.0,
    "battery_charging_kw": 6.4,
    "battery_discharging_kw": 0.0,
    "battery_reserve_safe_pct": 60.0,
    "backup_fuel_pct": 82.0,
    "renewable_pct": 68.0,
    "fuel_saved_pct": 18.0,
    "weather": {
        "temperature": -28.0,
        "wind_speed": 32.0,
        "humidity": 68.0,
        "solar_irradiance": 412.0,
        "visibility": 8.4,
        "condition": "Partly Cloudy",
        "impact_solar": "MODERATE",
        "impact_wind": "HIGH",
        "impact_heating": "HIGH",
        "impact_risk": "MODERATE"
    },
    "loads": {
        "critical_heating": 6.2,
        "critical_comms": 1.8,
        "critical_life_support": 3.5,
        "flexible_water_heating": 2.8,
        "flexible_research_labs": 3.4,
        "flexible_appliances": 1.5,
        "backup_diesel_genset": 0.0
    }
}

@router.get("/status")
def get_system_status():
    return {"status": "ONLINE", "system": "POLARIS AI Polar Microgrid Controller"}

@router.get("/dashboard", response_model=TelemetryState)
def get_dashboard_telemetry():
    return CURRENT_STATE

@router.get("/forecast", response_model=ForecastResponse)
def get_forecast():
    return forecasting_service.generate_6h_forecast(
        CURRENT_STATE["solar_generation_kw"],
        CURRENT_STATE["wind_generation_kw"],
        CURRENT_STATE["current_load_kw"]
    )

@router.post("/optimization", response_model=OptimizationResponse)
def post_optimization(req: OptimizationRequest):
    return optimizer_service.optimize_dispatch(
        req,
        CURRENT_STATE["solar_generation_kw"],
        CURRENT_STATE["wind_generation_kw"],
        CURRENT_STATE["current_load_kw"],
        CURRENT_STATE["battery_soc_pct"]
    )

@router.get("/weather", response_model=WeatherModel)
def get_weather():
    return CURRENT_STATE["weather"]

@router.get("/battery")
def get_battery_info():
    return {
        "soc": CURRENT_STATE["battery_soc_pct"],
        "health": CURRENT_STATE["battery_health_pct"],
        "charging_kw": CURRENT_STATE["battery_charging_kw"],
        "discharging_kw": CURRENT_STATE["battery_discharging_kw"],
        "safe_reserve": CURRENT_STATE["battery_reserve_safe_pct"],
        "estimated_backup_hours": 8.6
    }

@router.get("/alerts", response_model=List[AlertItem])
def get_alerts():
    return [
        {
            "id": 101,
            "severity": "HIGH",
            "time": "10 mins ago",
            "description": "Solar generation expected to fall by 32% in next 3 hours due to approaching polar fog.",
            "recommended_action": "Preserve 15% battery reserve and postpone scheduled drill sampling.",
            "status": "OPEN"
        },
        {
            "id": 102,
            "severity": "WEATHER",
            "time": "24 mins ago",
            "description": "Extreme Arctic temperature dip (-31°C) detected. Primary habitat thermal load increasing.",
            "recommended_action": "Pre-heat insulated hab-zones using active wind surge.",
            "status": "IN_PROGRESS"
        },
        {
            "id": 103,
            "severity": "INFO",
            "time": "45 mins ago",
            "description": "High wind generation (32 km/h) available. Optimal window for thermal battery pre-charging.",
            "recommended_action": "Engaged auxiliary thermal storage cells.",
            "status": "RESOLVED"
        }
    ]

@router.get("/analytics")
def get_analytics():
    return {
        "renewable_utilization_pct": 68.0,
        "peak_demand_kw": 19.8,
        "avg_load_kw": 14.6,
        "battery_efficiency_pct": 91.0,
        "backup_generator_usage_pct": 12.0,
        "fuel_saved_pct": 18.0
    }
