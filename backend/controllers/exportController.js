import ExcelJS from "exceljs";
import EmissionRecord from "../models/EmissionRecord.js";
import CarbonProject from "../models/CarbonProject.js";
import Mine from "../models/Mine.js";

export const exportMineReport = async (req, res) => {
   try {
      const { mineName } = req.params;

      const mine = await Mine.findOne({ name: mineName });

      if (!mine) {
         return res.status(404).json({
            success: false,
            message: "Mine Not Found",
         });
      }

      const emissions = await EmissionRecord.find({ mine: mine._id }).sort({ period: 1 });
      const projects = await CarbonProject.find({ mineName });

      const totalEmittedTons = emissions.reduce((s, e) => s + (e.totalTonnesCO2e || 0), 0);
      const totalOffsetTons = projects.reduce((s, p) => s + (p.actualCo2ReductionTons || 0), 0);
      const netCo2Tons = totalEmittedTons - totalOffsetTons;
      const neutralityProgressPercent = totalEmittedTons > 0 ? Math.round((totalOffsetTons / totalEmittedTons) * 100) : 0;

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Coal Carbon Tracker";
      workbook.created = new Date();




     const summarySheet = workbook.addWorksheet("Summary");
      summarySheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 25 },
      ];
      summarySheet.getRow(1).font = { bold: true };
      summarySheet.addRows([
        { metric: "Mine Name", value: mine.name },
        { metric: "Generated At", value: new Date().toLocaleString("en-IN") },
        { metric: "Total Emitted (t CO2e)", value: totalEmittedTons.toFixed(2) },
        { metric: "Total Offset (t CO2e)", value: totalOffsetTons.toFixed(2) },
        { metric: "Net CO2 (t)", value: netCo2Tons.toFixed(2) },
        { metric: "Neutrality Progress (%)", value: `${neutralityProgressPercent}%` },
      ]);

    const emissionSheet = workbook.addWorksheet("Emission Trend");
      emissionSheet.columns = [
        { header: "Period", key: "period", width: 15 },
        { header: "Diesel (L)", key: "dieselLitres", width: 15 },
        { header: "Explosives (kg)", key: "explosivesKg", width: 15 },
        { header: "Grid Electricity (kWh)", key: "gridElectricityKWh", width: 20 },
        { header: "Renewable Electricity (kWh)", key: "renewableElectricityKWh", width: 22 },
        { header: "Transport (tonne-km)", key: "coalTransportedTonneKm", width: 20 },
        { header: "Scope 1 (t CO2e)", key: "scope1TonnesCO2e", width: 15 },
        { header: "Scope 2 (t CO2e)", key: "scope2TonnesCO2e", width: 15 },
        { header: "Scope 3 (t CO2e)", key: "scope3TonnesCO2e", width: 15 },
        { header: "Total (t CO2e)", key: "totalTonnesCO2e", width: 15 },
      ];
      emissionSheet.getRow(1).font = { bold: true };
      emissionSheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
      emissions.forEach((e) => emissionSheet.addRow(e.toObject()));


      const projectSheet=workbook.addWorksheet("Project Breakdown");
      projectSheet.coloumn =[
        { header: "Project Name", key: "projectName", width: 25 },
        { header: "Type", key: "type", width: 18 },
        { header: "Status", key: "status", width: 15 },
        { header: "Progress (%)", key: "progressPercent", width: 12 },
        { header: "Expected Reduction (t)", key: "expectedCo2ReductionTons", width: 20 },
        { header: "Actual Reduction (t)", key: "actualCo2ReductionTons", width: 20 },
        { header: "Budget (INR)", key: "budgetINR", width: 18 },
      ];
       projectSheet.getRow(1).font = { bold: true };
      projectSheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
      projects.forEach((e)=>projectSheet.addRow(e.toObject));


            res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${mine.name.replace(/\s+/g, "_")}_report.xlsx`
      );

      await workbook.xlsx.write(res);
      res.end();

   }
   catch (err) {
      res.status(500).json({
         success: false,
         message: err.message,
      });
   }
};



const DEFAULT_EMISSION_VALUES = {
  period: "N/A",
  scope1TonnesCO2e: 0,
  scope2TonnesCO2e: 0,
  scope3TonnesCO2e: 0,
  totalTonnesCO2e: 0,
};

export const exportAllData = async (req, res) => {
  try {
    const mines = await Mine.find();
    const emissions = await EmissionRecord.find().populate("mine", "name");

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Coal Carbon Tracker";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("All Mines Report");
    sheet.columns = [
      { header: "Mine", key: "mineName", width: 25 },
      { header: "Year/Period", key: "period", width: 15 },
      { header: "Scope 1 (t CO2e)", key: "scope1", width: 18 },
      { header: "Scope 2 (t CO2e)", key: "scope2", width: 18 },
      { header: "Scope 3 (t CO2e)", key: "scope3", width: 18 },
      { header: "Total Emissions (t CO2e)", key: "total", width: 22 },
    ];
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD9E1F2" },
    };

    mines.forEach((mine) => {
      const mineEmissions = emissions.filter(
        (e) => String(e.mine?._id) === String(mine._id)
      );

      if (mineEmissions.length === 0) {
        sheet.addRow({
          mineName: mine.name,
          period: DEFAULT_EMISSION_VALUES.period,
          scope1: DEFAULT_EMISSION_VALUES.scope1TonnesCO2e,
          scope2: DEFAULT_EMISSION_VALUES.scope2TonnesCO2e,
          scope3: DEFAULT_EMISSION_VALUES.scope3TonnesCO2e,
          total: DEFAULT_EMISSION_VALUES.totalTonnesCO2e,
        });
      } else {
        mineEmissions.forEach((e) => {
          sheet.addRow({
            mineName: mine.name,
            period: e.period ?? DEFAULT_EMISSION_VALUES.period,
            scope1: e.scope1TonnesCO2e ?? DEFAULT_EMISSION_VALUES.scope1TonnesCO2e,
            scope2: e.scope2TonnesCO2e ?? DEFAULT_EMISSION_VALUES.scope2TonnesCO2e,
            scope3: e.scope3TonnesCO2e ?? DEFAULT_EMISSION_VALUES.scope3TonnesCO2e,
            total: e.totalTonnesCO2e ?? DEFAULT_EMISSION_VALUES.totalTonnesCO2e,
          });
        });
      }
    });

    const rollupSheet = workbook.addWorksheet("Per-Mine Totals");
    rollupSheet.columns = [
      { header: "Mine", key: "mine", width: 25 },
      { header: "Total Scope 1", key: "scope1", width: 15 },
      { header: "Total Scope 2", key: "scope2", width: 15 },
      { header: "Total Scope 3", key: "scope3", width: 15 },
      { header: "Total Emissions", key: "total", width: 18 },
    ];
    rollupSheet.getRow(1).font = { bold: true };

    mines.forEach((mine) => {
      const mineEmissions = emissions.filter(
        (e) => String(e.mine?._id) === String(mine._id)
      );
      rollupSheet.addRow({
        mine: mine.name,
        scope1: mineEmissions.reduce((s, e) => s + (e.scope1TonnesCO2e || 0), 0).toFixed(2),
        scope2: mineEmissions.reduce((s, e) => s + (e.scope2TonnesCO2e || 0), 0).toFixed(2),
        scope3: mineEmissions.reduce((s, e) => s + (e.scope3TonnesCO2e || 0), 0).toFixed(2),
        total: mineEmissions.reduce((s, e) => s + (e.totalTonnesCO2e || 0), 0).toFixed(2),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=all_mines_carbon_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};