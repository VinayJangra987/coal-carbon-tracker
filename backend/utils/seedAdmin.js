// backend/utils/seedAdmin.js

import dns from "dns";
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Mine from "../models/Mine.js";
import EmissionRecord from "../models/EmissionRecord.js";
import { calculateEmissions } from "../utils/emissionCalculator.js";

dotenv.config();

dns.setDefaultResultOrder("ipv4first");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

const run = async () => {
  try {
    await connectDB();

    // ============================================================
    // ADMIN USER
    // ============================================================

    const adminEmail = "moc.admin@coaltracker.gov.in";

    let admin = await User.findOne({
      email: adminEmail,
    });

    if (!admin) {
      admin = await User.create({
        name: "MoC Admin",
        email: adminEmail,
        password: "ChangeMe123!",
        role: "moc_admin",
      });

      console.log(
        "Created MoC admin:",
        adminEmail,
        "/ ChangeMe123!"
      );
    } else {
      console.log("MoC admin already exists");
    }

    // ============================================================
    // MINE DATA
    // ============================================================

    const sampleMines = [
      {
        name: "Jharia Coalfield Mine A",
        code: "CIL-BCCL-001",
        state: "Jharkhand",
        district: "Dhanbad",
        coalfield: "Jharia",
        type: "underground",
        annualProductionMT: 2.4,
        renewableSharePercent: 8,
        afforestationAreaHectares: 45,
      },
      {
        name: "Korba Opencast Mine",
        code: "CIL-SECL-014",
        state: "Chhattisgarh",
        district: "Korba",
        coalfield: "Korba",
        type: "opencast",
        annualProductionMT: 5.1,
        renewableSharePercent: 15,
        afforestationAreaHectares: 120,
      },
      {
        name: "Talcher Coalfield Mine",
        code: "CIL-MCL-007",
        state: "Odisha",
        district: "Angul",
        coalfield: "Talcher",
        type: "mixed",
        annualProductionMT: 3.8,
        renewableSharePercent: 5,
        afforestationAreaHectares: 60,
      },
      {
        name: "Singrauli Opencast Mine",
        code: "CIL-NCL-021",
        state: "Madhya Pradesh",
        district: "Singrauli",
        coalfield: "Singrauli",
        type: "opencast",
        annualProductionMT: 6.2,
        renewableSharePercent: 18,
        afforestationAreaHectares: 185,
      },
      {
        name: "Bokaro Underground Mine",
        code: "CIL-CCL-011",
        state: "Jharkhand",
        district: "Bokaro",
        coalfield: "Bokaro",
        type: "underground",
        annualProductionMT: 1.9,
        renewableSharePercent: 7,
        afforestationAreaHectares: 38,
      },
      {
        name: "Raniganj Mixed Mine",
        code: "CIL-ECL-009",
        state: "West Bengal",
        district: "Paschim Bardhaman",
        coalfield: "Raniganj",
        type: "mixed",
        annualProductionMT: 3.1,
        renewableSharePercent: 12,
        afforestationAreaHectares: 72,
      },
      {
        name: "Ib Valley Opencast Mine",
        code: "CIL-MCL-019",
        state: "Odisha",
        district: "Jharsuguda",
        coalfield: "Ib Valley",
        type: "opencast",
        annualProductionMT: 4.7,
        renewableSharePercent: 20,
        afforestationAreaHectares: 140,
      },
      {
        name: "Wardha Valley Mine",
        code: "WCL-WV-005",
        state: "Maharashtra",
        district: "Chandrapur",
        coalfield: "Wardha Valley",
        type: "opencast",
        annualProductionMT: 3.6,
        renewableSharePercent: 16,
        afforestationAreaHectares: 95,
      },
      {
        name: "Godavari Underground Mine",
        code: "CIL-SCCL-004",
        state: "Telangana",
        district: "Peddapalli",
        coalfield: "Godavari Valley",
        type: "underground",
        annualProductionMT: 2.2,
        renewableSharePercent: 10,
        afforestationAreaHectares: 52,
      },
      {
        name: "Korba Deep Mine",
        code: "CIL-SECL-022",
        state: "Chhattisgarh",
        district: "Korba",
        coalfield: "Korba",
        type: "underground",
        annualProductionMT: 2.8,
        renewableSharePercent: 11,
        afforestationAreaHectares: 65,
      },
    ];

    const mines = [];

    for (const mineData of sampleMines) {
      let mine = await Mine.findOne({
        code: mineData.code,
      });

      if (!mine) {
        mine = await Mine.create(mineData);
        console.log("Created mine:", mineData.name);
      } else {
        console.log("Mine already exists:", mineData.name);
      }

      mines.push(mine);
    }

    // ============================================================
    // EMISSION DATA
    // 12 MONTHS FOR EVERY MINE
    // ============================================================

    console.log("\nCreating emission records...");

    const months = [
      "2025-10",
      "2025-11",
      "2025-12",
      "2026-01",
      "2026-02",
      "2026-03",
      "2026-04",
      "2026-05",
      "2026-06",
      "2026-07",
      "2026-08",
      "2026-09",
    ];

    let createdEmissions = 0;
    let existingEmissions = 0;

    for (const mine of mines) {
      for (let i = 0; i < months.length; i++) {
        const period = months[i];

        const exists = await EmissionRecord.findOne({
          mine: mine._id,
          period,
        });

        if (exists) {
          existingEmissions++;
          continue;
        }

        // Monthly production based on annual production.
        // Small monthly variation makes dashboard charts more realistic.
        const productionVariation =
          0.90 + ((i * 7) % 15) / 100;

        const coalProductionTonnes =
          (mine.annualProductionMT * 1000000 / 12) *
          productionVariation;

        const dieselLitres =
          coalProductionTonnes *
          (mine.type === "underground" ? 8.5 : 6.5);

        const explosivesKg =
          coalProductionTonnes *
          (mine.type === "underground" ? 0.055 : 0.075);

        const gridElectricityKWh =
          coalProductionTonnes *
          (mine.type === "underground" ? 38 : 28);

        const renewableElectricityKWh =
          gridElectricityKWh *
          (mine.renewableSharePercent / 100);

        const coalTransportedTonneKm =
          coalProductionTonnes *
          (420 + ((i * 25) % 120));

        const rawData = {
          dieselLitres: Math.round(dieselLitres),
          explosivesKg: Math.round(explosivesKg),
          coalProductionTonnes:
            Math.round(coalProductionTonnes),
          gridElectricityKWh:
            Math.round(gridElectricityKWh),
          renewableElectricityKWh:
            Math.round(renewableElectricityKWh),
          coalTransportedTonneKm:
            Math.round(coalTransportedTonneKm),
        };

        const computed = calculateEmissions(
          rawData,
          mine.type
        );

        await EmissionRecord.create({
          mine: mine._id,
          period,

          ...rawData,
          ...computed,

          notes: `Seeded monthly emission data for ${mine.name}`,
          submittedBy: admin._id,
        });

        createdEmissions++;
      }
    }

    // ============================================================
    // SUMMARY
    // ============================================================

    console.log("\n========================================");
    console.log("SEEDING COMPLETE");
    console.log("========================================");
    console.log(`Mines: ${mines.length}`);
    console.log(
      `Emission records created: ${createdEmissions}`
    );
    console.log(
      `Emission records already existed: ${existingEmissions}`
    );
    console.log(
      `Expected total records: ${mines.length * months.length}`
    );
    console.log("========================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (err) {
    console.error("\nSeed failed:", err);

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      // Ignore connection-close errors
    }

    process.exit(1);
  }
};

run();