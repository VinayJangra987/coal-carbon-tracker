// /**
//  * Emission calculation utility.
//  *
//  * Emission factors below are simplified, illustrative defaults based on
//  * publicly documented references (IPCC 2006 Guidelines Vol.2, India CEA
//  * CO2 Baseline Database, CIL sustainability reports). For a real
//  * deployment these should be configurable per-mine / updated yearly
//  * rather than hardcoded — treat these as placeholders, and say so
//  * clearly in your project report/demo.
//  */

// const FACTORS = {
//   // Scope 1 — direct emissions
//   DIESEL_KG_CO2E_PER_LITRE: 2.68, // combustion of high speed diesel (HSD)
//   EXPLOSIVES_KG_CO2E_PER_KG: 0.21, // ANFO-type explosives, approximate
//   FUGITIVE_METHANE_OPENCAST_M3_PER_TONNE: 1.2, // coal seam gas release, opencast
//   FUGITIVE_METHANE_UNDERGROUND_M3_PER_TONNE: 10.5, // underground releases far more
//   METHANE_DENSITY_KG_PER_M3: 0.716,
//   METHANE_GWP_100YR: 28, // IPCC AR5 GWP for CH4 over 100 years

//   // Scope 2 — purchased electricity
//   GRID_KG_CO2_PER_KWH: 0.716, // India CEA all-India average grid emission factor

//   // Scope 3 — value chain (simplified to transport only for MVP)
//   TRANSPORT_KG_CO2_PER_TONNE_KM: 0.062, // rail-dominant coal logistics, approximate
// };

// /**
//  * Computes Scope 1, 2, 3 and total emissions (in tonnes CO2e) for one
//  * emission record's raw activity data.
//  * @param {Object} data - raw activity inputs
//  * @param {"opencast"|"underground"|"mixed"} mineType
//  */
// function calculateEmissions(data, mineType = "opencast") {
//   const {
//     dieselLitres = 0,
//     explosivesKg = 0,
//     coalProductionTonnes = 0,
//     gridElectricityKWh = 0,
//     coalTransportedTonneKm = 0,
//   } = data;

//   // --- Scope 1 ---
//   const dieselCO2eKg = dieselLitres * FACTORS.DIESEL_KG_CO2E_PER_LITRE;
//   const explosivesCO2eKg = explosivesKg * FACTORS.EXPLOSIVES_KG_CO2E_PER_KG;

//   const methaneFactorM3 =
//     mineType === "underground"
//       ? FACTORS.FUGITIVE_METHANE_UNDERGROUND_M3_PER_TONNE
//       : mineType === "mixed"
//       ? (FACTORS.FUGITIVE_METHANE_OPENCAST_M3_PER_TONNE +
//           FACTORS.FUGITIVE_METHANE_UNDERGROUND_M3_PER_TONNE) /
//         2
//       : FACTORS.FUGITIVE_METHANE_OPENCAST_M3_PER_TONNE;

//   const fugitiveMethaneM3 = coalProductionTonnes * methaneFactorM3;
//   const fugitiveMethaneKg = fugitiveMethaneM3 * FACTORS.METHANE_DENSITY_KG_PER_M3;
//   const fugitiveMethaneCO2eKg = fugitiveMethaneKg * FACTORS.METHANE_GWP_100YR;

//   const scope1Kg = dieselCO2eKg + explosivesCO2eKg + fugitiveMethaneCO2eKg;

//   // --- Scope 2 ---
//   const scope2Kg = gridElectricityKWh * FACTORS.GRID_KG_CO2_PER_KWH;

//   // --- Scope 3 (simplified: transport only) ---
//   const scope3Kg = coalTransportedTonneKm * FACTORS.TRANSPORT_KG_CO2_PER_TONNE_KM;

//   const toTonnes = (kg) => Math.round((kg / 1000) * 1000) / 1000;

//   const scope1TonnesCO2e = toTonnes(scope1Kg);
//   const scope2TonnesCO2e = toTonnes(scope2Kg);
//   const scope3TonnesCO2e = toTonnes(scope3Kg);
//   const totalTonnesCO2e =
//     Math.round((scope1TonnesCO2e + scope2TonnesCO2e + scope3TonnesCO2e) * 1000) / 1000;

//   return { scope1TonnesCO2e, scope2TonnesCO2e, scope3TonnesCO2e, totalTonnesCO2e };
// }

// /**
//  * Projects a simple year-by-year pathway to carbon neutrality given
//  * levers the mine can pull. This is intentionally a straightforward
//  * linear/compounding model, not a full optimization — good enough for
//  * an MVP "what-if" planner.
//  */
// function projectNeutralityPathway({
//   baselineTonnesCO2e,
//   currentRenewablePercent = 0,
//   targetRenewablePercent = 80,
//   renewableRampYears = 10,
//   afforestationHectares = 0,
//   offsetTonnesCO2ePerHectarePerYear = 8, // rough sequestration rate for mixed plantation
//   annualEfficiencyGainPercent = 1.5, // process efficiency improvements
//   years = 15,
// }) {
//   const timeline = [];
//   let remainingEmissions = baselineTonnesCO2e;
//   const renewableStep =
//     (targetRenewablePercent - currentRenewablePercent) / Math.max(renewableRampYears, 1);

//   for (let year = 1; year <= years; year++) {
//     const renewableShare = Math.min(
//       currentRenewablePercent + renewableStep * year,
//       targetRenewablePercent
//     );
//     const efficiencyFactor = Math.pow(1 - annualEfficiencyGainPercent / 100, year);
//     const renewableFactor = 1 - renewableShare / 100 / 2; // renewables mainly offset Scope 2 portion

//     const grossEmissions = baselineTonnesCO2e * efficiencyFactor * renewableFactor;
//     const offset = afforestationHectares * offsetTonnesCO2ePerHectarePerYear * year;
//     const netEmissions = Math.max(grossEmissions - offset, 0);

//     timeline.push({
//       year,
//       renewableSharePercent: Math.round(renewableShare * 10) / 10,
//       grossEmissionsTonnesCO2e: Math.round(grossEmissions),
//       offsetTonnesCO2e: Math.round(offset),
//       netEmissionsTonnesCO2e: Math.round(netEmissions),
//     });

//     remainingEmissions = netEmissions;
//   }

//   const neutralYear = timeline.find((t) => t.netEmissionsTonnesCO2e <= 0);

//   return {
//     timeline,
//     estimatedNeutralityYear: neutralYear ? neutralYear.year : null,
//   };
// }

// module.exports = { calculateEmissions, projectNeutralityPathway, FACTORS };

// backend/utils/emissionCalculator.js

/**
 * Emission calculation utility.
 *
 * Emission factors below are simplified, illustrative defaults based on
 * publicly documented references. For a real deployment, these should be
 * configurable per mine and updated periodically.
 */

export const FACTORS = {
  // Scope 1 — direct emissions
  DIESEL_KG_CO2E_PER_LITRE: 2.68,
  EXPLOSIVES_KG_CO2E_PER_KG: 0.21,

  FUGITIVE_METHANE_OPENCAST_M3_PER_TONNE: 1.2,
  FUGITIVE_METHANE_UNDERGROUND_M3_PER_TONNE: 10.5,

  METHANE_DENSITY_KG_PER_M3: 0.716,
  METHANE_GWP_100YR: 28,

  // Scope 2 — purchased electricity
  GRID_KG_CO2_PER_KWH: 0.716,

  // Scope 3 — simplified transport only
  TRANSPORT_KG_CO2_PER_TONNE_KM: 0.062,
};

/**
 * Computes Scope 1, Scope 2, Scope 3 and total emissions.
 *
 * @param {Object} data - Raw activity inputs
 * @param {"opencast"|"underground"|"mixed"} mineType
 */
export const calculateEmissions = (
  data,
  mineType = "opencast"
) => {
  const {
    dieselLitres = 0,
    explosivesKg = 0,
    coalProductionTonnes = 0,
    gridElectricityKWh = 0,
    coalTransportedTonneKm = 0,
  } = data;

  // --- Scope 1 ---

  const dieselCO2eKg =
    Number(dieselLitres) *
    FACTORS.DIESEL_KG_CO2E_PER_LITRE;

  const explosivesCO2eKg =
    Number(explosivesKg) *
    FACTORS.EXPLOSIVES_KG_CO2E_PER_KG;

  const methaneFactorM3 =
    mineType === "underground"
      ? FACTORS.FUGITIVE_METHANE_UNDERGROUND_M3_PER_TONNE
      : mineType === "mixed"
        ? (
            FACTORS.FUGITIVE_METHANE_OPENCAST_M3_PER_TONNE +
            FACTORS.FUGITIVE_METHANE_UNDERGROUND_M3_PER_TONNE
          ) / 2
        : FACTORS.FUGITIVE_METHANE_OPENCAST_M3_PER_TONNE;

  const fugitiveMethaneM3 =
    Number(coalProductionTonnes) *
    methaneFactorM3;

  const fugitiveMethaneKg =
    fugitiveMethaneM3 *
    FACTORS.METHANE_DENSITY_KG_PER_M3;

  const fugitiveMethaneCO2eKg =
    fugitiveMethaneKg *
    FACTORS.METHANE_GWP_100YR;

  const scope1Kg =
    dieselCO2eKg +
    explosivesCO2eKg +
    fugitiveMethaneCO2eKg;

  // --- Scope 2 ---

  const scope2Kg =
    Number(gridElectricityKWh) *
    FACTORS.GRID_KG_CO2_PER_KWH;

  // --- Scope 3 ---

  const scope3Kg =
    Number(coalTransportedTonneKm) *
    FACTORS.TRANSPORT_KG_CO2_PER_TONNE_KM;

  const toTonnes = (kg) =>
    Math.round((kg / 1000) * 1000) / 1000;

  const scope1TonnesCO2e = toTonnes(scope1Kg);
  const scope2TonnesCO2e = toTonnes(scope2Kg);
  const scope3TonnesCO2e = toTonnes(scope3Kg);

  const totalTonnesCO2e =
    Math.round(
      (
        scope1TonnesCO2e +
        scope2TonnesCO2e +
        scope3TonnesCO2e
      ) * 1000
    ) / 1000;

  return {
    scope1TonnesCO2e,
    scope2TonnesCO2e,
    scope3TonnesCO2e,
    totalTonnesCO2e,
  };
};

/**
 * Projects a simple year-by-year pathway to carbon neutrality.
 */
export const projectNeutralityPathway = ({
  baselineTonnesCO2e,
  currentRenewablePercent = 0,
  targetRenewablePercent = 80,
  renewableRampYears = 10,
  afforestationHectares = 0,
  offsetTonnesCO2ePerHectarePerYear = 8,
  annualEfficiencyGainPercent = 1.5,
  years = 15,
}) => {
  const timeline = [];

  const baseline = Number(baselineTonnesCO2e || 0);
  const currentRenewable = Number(
    currentRenewablePercent || 0
  );
  const targetRenewable = Number(
    targetRenewablePercent || 80
  );
  const rampYears = Math.max(
    Number(renewableRampYears || 1),
    1
  );
  const hectares = Number(
    afforestationHectares || 0
  );
  const offsetRate = Number(
    offsetTonnesCO2ePerHectarePerYear || 0
  );
  const efficiencyRate = Number(
    annualEfficiencyGainPercent || 0
  );
  const projectionYears = Math.max(
    Number(years || 1),
    1
  );

  const renewableStep =
    (targetRenewable - currentRenewable) /
    rampYears;

  for (
    let year = 1;
    year <= projectionYears;
    year++
  ) {
    const renewableShare = Math.min(
      currentRenewable +
        renewableStep * year,
      targetRenewable
    );

    const efficiencyFactor = Math.pow(
      1 - efficiencyRate / 100,
      year
    );

    // Renewables mainly offset Scope 2 electricity emissions.
    const renewableFactor =
      1 - renewableShare / 100 / 2;

    const grossEmissions =
      baseline *
      efficiencyFactor *
      renewableFactor;

    const offset =
      hectares *
      offsetRate *
      year;

    const netEmissions = Math.max(
      grossEmissions - offset,
      0
    );

    timeline.push({
      year,
      renewableSharePercent:
        Math.round(renewableShare * 10) / 10,

      grossEmissionsTonnesCO2e:
        Math.round(grossEmissions),

      offsetTonnesCO2e:
        Math.round(offset),

      netEmissionsTonnesCO2e:
        Math.round(netEmissions),
    });
  }

  const neutralYear = timeline.find(
    (t) => t.netEmissionsTonnesCO2e <= 0
  );

  return {
    timeline,
    estimatedNeutralityYear:
      neutralYear ? neutralYear.year : null,
  };
};