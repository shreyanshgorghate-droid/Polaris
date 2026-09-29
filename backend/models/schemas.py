from pydantic import BaseModel
from typing import List, Dict, Optional

class WeatherModel(BaseModel):
    temperature: float
    wind_speed: float
    humidity: float
    solar_irradiance: float
    visibility: float
    condition: str
    impact_solar: str
    impact_wind: str
    impact_heating: str
    impact_risk: str

class LoadBreakdown(BaseModel):
    critical_heating: float
    critical_comms: float
    critical_life_support: float
    flexible_water_heating: float
    flexible_research_labs: float
    flexible_appliances: float
    backup_diesel_genset: float

class TelemetryState(BaseModel):
    station_id: str
    status: str
    solar_generation_kw: float
    wind_generation_kw: float
    current_load_kw: float
    battery_soc_pct: float
    battery_health_pct: float
    battery_charging_kw: float
    battery_discharging_kw: float
    battery_reserve_safe_pct: float
    backup_fuel_pct: float
    renewable_pct: float
    fuel_saved_pct: float
    weather: WeatherModel
    loads: LoadBreakdown

class ForecastPoint(BaseModel):
    time_offset: str
    demand_kw: float
    solar_kw: float
    wind_kw: float
    confidence_pct: float

class ForecastResponse(BaseModel):
    model_name: str
    status: str
    confidence: float
    forecast_points: List[ForecastPoint]

class OptimizationRequest(BaseModel):
    shift_hours: int = 2
    battery_safe_reserve: float = 60.0
    shed_flexible_loads: bool = False
    solar_kw: Optional[float] = None
    wind_kw: Optional[float] = None
    critical_load_kw: Optional[float] = None
    flexible_load_kw: Optional[float] = None
    battery_soc_pct: Optional[float] = None
    temp_celsius: Optional[float] = None

class OptimizationResponse(BaseModel):
    decision_headline: str
    renewable_allocation_kw: float
    battery_charge_kw: float
    generator_dispatch_kw: float
    fuel_saved_pct: float
    peak_shaved_kw: float
    recommendations: List[str]

class AlertItem(BaseModel):
    id: int
    severity: str
    time: str
    description: str
    recommended_action: str
    status: str
