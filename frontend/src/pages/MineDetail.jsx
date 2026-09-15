import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Sidebar from "../components/Sidebar.jsx";
import api from "../utils/api";

const emptyForm = {
  period: "",
  dieselLitres: "",
  explosivesKg: "",
  coalProductionTonnes: "",
  gridElectricityKWh: "",
  renewableElectricityKWh: "",
  coalTransportedTonneKm: "",
};

export default function MineDetail() {
  const { id } = useParams();
  const [mine, setMine] = useState(null);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get(`/mines/${id}`).then((res) => setMine(res.data));
    api.get(`/emissions?mine=${id}`).then((res) => setRecords(res.data));
  };

  useEffect(() => {
    load();
  }, [id]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     await api.post("/emissions", { ...form, mine: id });
  //     setForm(emptyForm);
  //     setShowForm(false);
  //     load();
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to save record");
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/emissions", form);

    setForm({
      dieselLitres: "",
      explosivesKg: "",
      coalProductionTonnes: "",
      gridElectricityKWh: "",
      renewableElectricityKWh: "",
      coalTransportedTonneKm: "",
      notes: "",
    });
  } catch (error) {
    console.error(error);
  }
};



  const chartData = records.map((r) => ({
    period: r.period,
    "Scope 1": Math.round(r.scope1TonnesCO2e),
    "Scope 2": Math.round(r.scope2TonnesCO2e),
    "Scope 3": Math.round(r.scope3TonnesCO2e),
  }));

  return (
    <div className="flex bg-anthracite min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <Link to="/mines" className="text-ash text-sm hover:text-ember">
          ← Back to mines
        </Link>

        {mine && (
          <div className="flex items-center justify-between mt-4 mb-8">
            <div>
              <h1 className="font-display text-2xl font-semibold text-chalk">{mine.name}</h1>
              <p className="text-ash text-sm mt-1">
                {mine.code} · {mine.state} · {mine.type} · {mine.annualProductionMT} MT/yr
              </p>
            </div>
            <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Cancel" : "+ Add Emission Record"}
            </button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Period (YYYY-MM)</label>
              <input className="input-field" placeholder="2026-08" value={form.period} onChange={update("period")} required />
            </div>
            <div>
              <label className="label">Diesel used (litres)</label>
              <input type="number" className="input-field" value={form.dieselLitres} onChange={update("dieselLitres")} />
            </div>
            <div>
              <label className="label">Explosives used (kg)</label>
              <input type="number" className="input-field" value={form.explosivesKg} onChange={update("explosivesKg")} />
            </div>
            <div>
              <label className="label">Coal production (tonnes)</label>
              <input type="number" className="input-field" value={form.coalProductionTonnes} onChange={update("coalProductionTonnes")} />
            </div>
            <div>
              <label className="label">Grid electricity (kWh)</label>
              <input type="number" className="input-field" value={form.gridElectricityKWh} onChange={update("gridElectricityKWh")} />
            </div>
            <div>
              <label className="label">Renewable electricity (kWh)</label>
              <input type="number" className="input-field" value={form.renewableElectricityKWh} onChange={update("renewableElectricityKWh")} />
            </div>
            <div>
              <label className="label">Coal transported (tonne-km)</label>
              <input type="number" className="input-field" value={form.coalTransportedTonneKm} onChange={update("coalTransportedTonneKm")} />
            </div>

            {error && <div className="text-sm text-red-400 md:col-span-3">{error}</div>}

            <div className="md:col-span-3">
              <button type="submit" className="btn-primary">
                Save & calculate
              </button>
            </div>
          </form>
        )}

        {chartData.length > 0 && (
          <div className="card p-5 mb-8">
            <h3 className="font-display text-base text-chalk mb-4">Monthly Emissions by Scope</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid stroke="#2A3138" strokeDasharray="3 3" />
                <XAxis dataKey="period" stroke="#8B95A1" fontSize={12} />
                <YAxis stroke="#8B95A1" fontSize={12} />
                <Tooltip contentStyle={{ background: "#1B2126", border: "1px solid #2A3138", borderRadius: 10 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#8B95A1" }} />
                <Bar dataKey="Scope 1" stackId="a" fill="#E8964A" />
                <Bar dataKey="Scope 2" stackId="a" fill="#4F9D69" />
                <Bar dataKey="Scope 3" stackId="a" fill="#8B95A1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-panel text-ash text-left">
              <tr>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Scope 1</th>
                <th className="px-4 py-3">Scope 2</th>
                <th className="px-4 py-3">Scope 3</th>
                <th className="px-4 py-3">Total (t CO2e)</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r._id} className="border-t border-line">
                  <td className="px-4 py-3 text-chalk">{r.period}</td>
                  <td className="px-4 py-3 text-ash">{Math.round(r.scope1TonnesCO2e)}</td>
                  <td className="px-4 py-3 text-ash">{Math.round(r.scope2TonnesCO2e)}</td>
                  <td className="px-4 py-3 text-ash">{Math.round(r.scope3TonnesCO2e)}</td>
                  <td className="px-4 py-3 text-ember font-medium">{Math.round(r.totalTonnesCO2e)}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-ash text-center" colSpan={5}>
                    No emission records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
