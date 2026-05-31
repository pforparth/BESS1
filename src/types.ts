export type FacilityType = "residential" | "commercial" | "utility";

export interface SimulationParameters {
  batteryCapacityMwh: number; // e.g. 5 MWh
  maxPowerMw: number; // e.g. 2 MW
  solarCapacityMw: number; // e.g. 3 MW
  strategy: "shaving" | "arbitrage" | "backup";
}

export interface SimulationHourData {
  hour: number;
  timeLabel: string;
  solarGenMw: number;
  gridDemandMw: number;
  batterySoc: number; // 0% to 100%
  batteryChargeDischargeMw: number; // positive = charging, negative = discharging
  gridImportMw: number; // power taken from grid
  marginalCostUSD: number; // price at this hour ($/MWh)
}

export type BatteryChemistry = {
  id: string;
  name: string;
  fullName: string;
  energyDensity: string; // Wh/kg
  cycleLife: number; // number of cycles
  thermalRunawayTemp: string; // Celsius
  safetyRating: "Excellent" | "High" | "Moderate" | "Fair";
  costFactor: "Low" | "Medium" | "High";
  typicalUse: string;
  description: string;
};

export interface EstimatorInputs {
  facilityType: FacilityType;
  avgDailyConsumptionKwh: number;
  peakDemandKw: number;
  solarOutputKw: number;
  backupRequirementHours: number;
  primaryGoal: "arbitrage" | "shaving" | "resilience";
}

export interface EstimatorOutput {
  systemType: string;
  recommendedCapacityMwh: number;
  recommendedPowerMw: number;
  durationHours: number;
  estimatedFootprintSqM: number;
  estimatedCostSavingsYearlyUSD: number;
  estimatedCo2ReductionTonnes: number;
  roiYears: number;
  chemistryRecommendation: string;
  reasoning: string;
  bmsSettingsSummary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

export interface BessManufacturer {
  id: string;
  name: string;
  headquarters: string;
  gigafactoryLocation: string;
  chemistryFocus: string;
  annualCapacityGwh: number;
  bestFitUse: string;
  tradingAdvantage: string;
  representativeModel: string;
  description: string;
  tierRating: "Tier-1 Partner" | "Specialist Manufacturer" | "Emerging Gigafactory";
}
