import { BatteryChemistry, SimulationHourData, SimulationParameters, BessManufacturer } from "./types";

// Indian BESS manufacturers directory for B2B Sourcing & Technical Integration
export const INDIAN_BESS_MANUFACTURERS: BessManufacturer[] = [
  {
    id: "reliance-new-energy",
    name: "Reliance New Energy",
    headquarters: "Mumbai, Maharashtra",
    gigafactoryLocation: "Dhirubhai Ambani Green Energy Giga Complex, Jamnagar, Gujarat",
    chemistryFocus: "LFP (Lithium Iron Phosphate) & Sodium-Ion (via Faradion acquisition)",
    annualCapacityGwh: 20,
    bestFitUse: "Utility-scale power grids, ultra-fast EV charging plazas, national grid backup.",
    tradingAdvantage: "Extremely competitive container prices due to massive domestic vertically-integrated supply chains.",
    representativeModel: "Reliance OptiGrid-5 containerized system",
    description: "Operating India's largest planned energy storage gigacomplex. Perfect vendor choice for bulk deployment to state DISCOMs or large independent solar developers.",
    tierRating: "Tier-1 Partner"
  },
  {
    id: "tata-autocomp",
    name: "Tata AutoComp Systems",
    headquarters: "Pune, Maharashtra",
    gigafactoryLocation: "Pune Manufacturing Cluster, Maharashtra / Joint Venture with Guoxuan High-tech",
    chemistryFocus: "Industrial Liquid-Cooled LFP Storage Packs",
    annualCapacityGwh: 5,
    bestFitUse: "C&I (Commercial & Industrial) peak shaving, IT Parks, textile hubs in Coimbatore & Surat.",
    tradingAdvantage: "Pristine domestic warranty, engineering site audit support, and direct integration with Tata Power's green solutions.",
    representativeModel: "Tata PowerPack-I (Industrial C&I Series)",
    description: "Part of the prestigious Tata Group, manufacturing highly reliable liquid-cooled LFP solutions specifically optimized for high ambient temperature Indian conditions.",
    tierRating: "Tier-1 Partner"
  },
  {
    id: "exide-industries",
    name: "Exide Energy Solutions (SILA EXIDE)",
    headquarters: "Kolkata, West Bengal",
    gigafactoryLocation: "Exide Gigafactory, Bengaluru, Karnataka (supported by SVOLT tech partnership)",
    chemistryFocus: "LFP Cylindrical and Prismatic Cells & Pack Assemblies",
    annualCapacityGwh: 6,
    bestFitUse: "Telecom tower microgrids, heavy machinery plants, housing societies in Delhi NCR / Mumbai.",
    tradingAdvantage: "Unmatched pan-India dealer-distributor support network. Established supplier reliability with Indian grid operators.",
    representativeModel: "Exide BESS-Volt 500kW Smart Rack System",
    description: "Leveraging over 75 years of battery leadership in India. Their new gigafactory delivers high-cycle, robust BESS systems for commercial partners.",
    tierRating: "Tier-1 Partner"
  },
  {
    id: "amara-raja",
    name: "Amara Raja Energy & Mobility",
    headquarters: "Tirupati, Andhra Pradesh",
    gigafactoryLocation: "Amara Raja New Energy Giga Complex, Divitipally, Telangana",
    chemistryFocus: "Heavy-Cycle Lithium Iron Phosphate (LFP) & Advanced VRLA",
    annualCapacityGwh: 8,
    bestFitUse: "Solar farm co-location, manufacturing workshops, hospital backup microgrids.",
    tradingAdvantage: "Flexible container configurations allowing customization for medium-sized enterprises (MMEs), offering superior techno-economic scaling.",
    representativeModel: "Amaron GigaVolt-C1 (2 MWh Container Series)",
    description: "Makers of the famous Amaron brand. Setting up Telangana's premier BESS gigafactory with advanced active-cooling management designs.",
    tierRating: "Tier-1 Partner"
  },
  {
    id: "larsen-toubro",
    name: "L&T Green Energy Infrastructure",
    headquarters: "Mumbai, Maharashtra",
    gigafactoryLocation: "EPC Sourcing & Assembly Partner with major Tier-1 global cell manufacturers",
    chemistryFocus: "Multi-Chemistry customized integration (LFP/Flow Systems)",
    annualCapacityGwh: 3,
    bestFitUse: "Mega Smart Cities, State transmission substations, hybrid wind-solar parks.",
    tradingAdvantage: "Heavy industrial EPC engineering capabilities. Ideal partner for complex, custom tender-bidding integration projects.",
    representativeModel: "L&T Megastruct Substation Array (10 MWh+)",
    description: "The engineering landmark for Indian infrastructure. Acts as a premier turn-key system aggregator and EPC partner for grand utilities.",
    tierRating: "Specialist Manufacturer"
  },
  {
    id: "sterling-wilson",
    name: "Sterling & Wilson Renewable Energy",
    headquarters: "Mumbai, Maharashtra",
    gigafactoryLocation: "Consolidated assembly systems (sourcing globally for domestic deployment)",
    chemistryFocus: "Commercial Containerized LFP & Solid-State Lithium Systems",
    annualCapacityGwh: 2,
    bestFitUse: "Solar farm developers, multi-state commercial operations, high-end agricultural nodes.",
    tradingAdvantage: "Turnkey developer integration with global technology benchmarks, catering to custom boutique requirements.",
    representativeModel: "S&W SunStoring Container (1 MWh - 5 MWh)",
    description: "Global solar-EPC leader based in India. They act as exceptional orchestrators, helping key stakeholders supply vetted systems to private C&I clients.",
    tierRating: "Specialist Manufacturer"
  }
];

// Simplified Static Battery Chemistry Information comparison
export const BESS_CHEMISTRIES: BatteryChemistry[] = [
  {
    id: "lfp",
    name: "LFP",
    fullName: "Lithium Iron Phosphate (LiFePO4)",
    energyDensity: "140 - 180 Wh/kg",
    cycleLife: 6000,
    thermalRunawayTemp: "270 °C",
    safetyRating: "Excellent",
    costFactor: "Medium",
    typicalUse: "Highly recommended for India. Commercial workshops, high-rise buildings, solar parks.",
    description: "The absolute gold standard for stationary energy storage in India. With high thermal runaway threshold (270°C), LFP resists hot climates. It contains zero cobalt, ensuring stable ethical pricing."
  },
  {
    id: "na-ion",
    name: "Sodium-Ion",
    fullName: "Sodium-Ion (Na-Ion)",
    energyDensity: "100 - 150 Wh/kg",
    cycleLife: 4000,
    thermalRunawayTemp: "250 °C",
    safetyRating: "High",
    costFactor: "Low",
    typicalUse: "Emerging low-cost storage, solar streetlights, telecom towers, agricultural microgrids.",
    description: "The next big commercial technology in India. Relies on abundant, domestic sodium (salt-derived) rather than imported lithium. Completely fire-resilient and highly affordable for price-sensitive Indian buyers."
  },
  {
    id: "vrfb",
    name: "VRFB (Flow)",
    fullName: "Vanadium Redox Flow Battery",
    energyDensity: "25 - 40 Wh/kg",
    cycleLife: 20000,
    thermalRunawayTemp: "Non-flammable (Water-based)",
    safetyRating: "Excellent",
    costFactor: "High",
    typicalUse: "Grid substations, multi-megawatt solar plants with 6+ hour discharge needs.",
    description: "Provides near-infinite cycles (20+ years of active daily charging) with zero degradation. Stored in large liquid tanks. Highly secure, though requires a larger physical footprint."
  },
  {
    id: "nmc",
    name: "NMC",
    fullName: "Nickel Manganese Cobalt (LiNiMnCoO2)",
    energyDensity: "200 - 250 Wh/kg",
    cycleLife: 2500,
    thermalRunawayTemp: "210 °C",
    safetyRating: "Moderate",
    costFactor: "High",
    typicalUse: "Electric Vehicles (EV), compact consumer devices, short-burst backup in tight urban centers.",
    description: "Highly energy-dense but decays quicker and triggers thermal risks at lower temperatures (210°C). Less favored for Indian stationary storage due to intense summer heat loads and cobalt pricing volatility."
  }
];

// Hour tags for displaying in tables and graphs
const HOURS_LABELS = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
  "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"
];

// Indian Electricity Tariff Profile: expressed in Rupees per Unit/kWh (₹/kWh)
// High peak rates during morning/evening surge, cheap solar tariff during the afternoon
const ELECTRICITY_PRICE_PROFILE_INR = [
  5.5, 5.0, 4.5, 4.5, 5.0, 6.0, 7.5, 10.0, 11.5, 9.5, 6.5, 5.0, // 12 AM - 11 AM (Normal & Morning Peak)
  4.5, 4.0, 4.0, 5.5, 8.0, 12.0, 14.0, 15.0, 12.5, 9.5, 7.5, 6.0  // 12 PM - 11 PM (Cheap Solar Mid-day & Heavy Evening Peak ₹15/unit)
];

// Solar irradiance peak ratio
const SOLAR_PV_PROFILE = [
  0, 0, 0, 0, 0, 0, 0.05, 0.25, 0.55, 0.80, 0.95, 1.00, // 12 AM - 11 AM
  0.98, 0.85, 0.65, 0.40, 0.15, 0.02, 0, 0, 0, 0, 0, 0  // 12 PM - 11 PM
];

// Grid demand profile in MW (for a typical Indian commercial plant/textile cluster)
const GRID_DEMAND_PROFILE = [
  0.8, 0.7, 0.6, 0.6, 0.7, 0.9, 1.3, 1.8, 2.2, 2.5, 2.6, 2.5, // 12 AM - 11 AM
  2.4, 2.3, 2.3, 2.4, 2.6, 2.8, 2.9, 2.8, 2.4, 1.9, 1.4, 1.0  // 12 PM - 11 PM
];

// Run the simulation matching standard physical characteristics
export function runBessSimulation(params: SimulationParameters): SimulationHourData[] {
  const { batteryCapacityMwh, maxPowerMw, solarCapacityMw, strategy } = params;
  
  const totalHours = 24;
  const data: SimulationHourData[] = [];
  
  let currentSoC = 50.0; // Startup state: half full
  
  const chargingEfficiency = 0.95;
  const dischargingEfficiency = 0.95;

  for (let hour = 0; hour < totalHours; hour++) {
    const timeLabel = HOURS_LABELS[hour];
    const rawSolar = SOLAR_PV_PROFILE[hour] * solarCapacityMw;
    const baseDemand = GRID_DEMAND_PROFILE[hour];
    const price = ELECTRICITY_PRICE_PROFILE_INR[hour];

    let chargeDischargeRate = 0; // Positive = Charging, Negative = Discharging

    if (strategy === "shaving") {
      // Shave peak loads exceeding 1.6 MW to save heavy Indian peak demand charges (MSEDCL/BESCOM rules)
      const shavingThreshold = 1.6; 
      const netLoadWithSolar = baseDemand - rawSolar;

      if (netLoadWithSolar > shavingThreshold && currentSoC > 10) {
        const neededMw = netLoadWithSolar - shavingThreshold;
        const availableCapacityMw = ((currentSoC - 10) / 100) * batteryCapacityMwh;
        chargeDischargeRate = -Math.min(neededMw, maxPowerMw, availableCapacityMw) * dischargingEfficiency;
      } else if (netLoadWithSolar < 1.0 && currentSoC < 95) {
        // Recharge during solar surplus or cheap night/midday slots
        const excessSolar = Math.max(0, rawSolar - baseDemand);
        const capacityToFillMw = ((95 - currentSoC) / 100) * batteryCapacityMwh;
        
        if (excessSolar > 0) {
          chargeDischargeRate = Math.min(excessSolar, maxPowerMw, capacityToFillMw) / chargingEfficiency;
        } else {
          chargeDischargeRate = Math.min(0.25 * maxPowerMw, capacityToFillMw) / chargingEfficiency;
        }
      }
    } else if (strategy === "arbitrage") {
      // Charge at low prices (₹4-5/unit solar high) and discharge in heavy peaks (₹12-15/unit)
      if (price >= 11.5 && currentSoC > 10) {
        const energyToSellMw = ((currentSoC - 10) / 100) * batteryCapacityMwh;
        chargeDischargeRate = -Math.min(maxPowerMw, energyToSellMw) * dischargingEfficiency;
      } else if (price <= 5.0 && currentSoC < 95) {
        const inputEnergyMw = ((95 - currentSoC) / 100) * batteryCapacityMwh;
        chargeDischargeRate = Math.min(maxPowerMw, inputEnergyMw) / chargingEfficiency;
      } else if (rawSolar > baseDemand && currentSoC < 95) {
        const solarSurplus = rawSolar - baseDemand;
        const inputEnergyMw = ((95 - currentSoC) / 100) * batteryCapacityMwh;
        chargeDischargeRate = Math.min(maxPowerMw, solarSurplus, inputEnergyMw) / chargingEfficiency;
      }
    } else {
      // Backup Protection mode (safeguard against erratic power-cuts by maintaining 95% charge)
      if (currentSoC < 95) {
        const chargingNeeded = ((95 - currentSoC) / 100) * batteryCapacityMwh;
        const chargePower = rawSolar > 0 ? Math.min(rawSolar, maxPowerMw) : Math.min(0.15 * maxPowerMw, chargingNeeded);
        chargeDischargeRate = Math.min(chargePower, chargingNeeded) / chargingEfficiency;
      } else {
        chargeDischargeRate = 0;
      }
    }

    // Physical constraint capping
    if (chargeDischargeRate > 0) {
      const currentEnergy = (currentSoC / 100) * batteryCapacityMwh;
      const energyAdded = chargeDischargeRate * chargingEfficiency * 1;
      let nextEnergy = currentEnergy + energyAdded;
      if (nextEnergy > batteryCapacityMwh) {
        chargeDischargeRate = (batteryCapacityMwh - currentEnergy) / chargingEfficiency;
        currentSoC = 100.0;
      } else {
        currentSoC = (nextEnergy/batteryCapacityMwh)*100;
      }
    } else if (chargeDischargeRate < 0) {
      const currentEnergy = (currentSoC / 100) * batteryCapacityMwh;
      const energyPulled = Math.abs(chargeDischargeRate) / dischargingEfficiency * 1;
      let nextEnergy = currentEnergy - energyPulled;
      if (nextEnergy < 0) {
        chargeDischargeRate = -(currentEnergy * dischargingEfficiency);
        currentSoC = 0.0;
      } else {
        currentSoC = (nextEnergy/batteryCapacityMwh)*100;
      }
    }

    const netGridImport = baseDemand + (chargeDischargeRate > 0 ? chargeDischargeRate : chargeDischargeRate) - rawSolar;
    const gridImportMw = Math.max(0, netGridImport);

    data.push({
      hour,
      timeLabel,
      solarGenMw: Math.round(rawSolar * 100) / 100,
      gridDemandMw: Math.round(baseDemand * 100) / 100,
      batterySoc: Math.round(currentSoC * 10) / 10,
      batteryChargeDischargeMw: Math.round(chargeDischargeRate * 100) / 100,
      gridImportMw: Math.round(gridImportMw * 100) / 100,
      marginalCostUSD: price // Note: Stored in variable but represents INR (₹/kWh) for UI clarity 
    });
  }

  return data;
}

// Custom India-focused questions
export const FAQ_PROMPTS = [
  "Who are the top tier BESS manufacturers supplying in India?",
  "What are the main techno-economic drivers of battery storage payback in India?",
  "What is the average ROI of BESS for an Indian textile mill?",
  "How does BESS solve grid voltage sag issues in Noida/Gujarat industrial zones?",
  "Which battery chemistry is best suited for 45°C Indian summers?"
];
