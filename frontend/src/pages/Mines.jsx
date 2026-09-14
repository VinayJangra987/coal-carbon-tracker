import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api";

const emptyForm = {
  name: "",
  code: "",
  state: "",
  district: "",
  coalfield: "",
  type: "opencast",
  annualProductionMT: "",
  renewableSharePercent: "",
  afforestationAreaHectares: "",
};

export default function Mines() {
  const { user } = useAuth();
  const [mines, setMines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => api.get("/mines").then((res) => setMines(res.data));

  useEffect(() => {
    load();
  }, []);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/mines", form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create mine");
    }
  };

  return (
    <div className="flex bg-anthracite min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-chalk">Mines</h1>
            <p className="text-ash text-sm mt-1">{mines.length} mines tracked</p>
          </div>
          {user?.role === "moc_admin" && (
            <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Cancel" : "+ Add Mine"}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Mine name</label>
              <input className="input-field" value={form.name} onChange={update("name")} required />
            </div>
            <div>
              <label className="label">Code</label>
              <input className="input-field" value={form.code} onChange={update("code")} required />
            </div>
            <div>
              <label className="label">State</label>
              <input className="input-field" value={form.state} onChange={update("state")} required />
            </div>
            <div>
              <label className="label">District</label>
              <input className="input-field" value={form.district} onChange={update("district")} />
            </div>
            <div>
              <label className="label">Coalfield</label>
              <input className="input-field" value={form.coalfield} onChange={update("coalfield")} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input-field" value={form.type} onChange={update("type")}>
                <option value="opencast">Opencast</option>
                <option value="underground">Underground</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="label">Annual production (MT)</label>
              <input
                type="number"
                step="0.01"
                className="input-field"
                value={form.annualProductionMT}
                onChange={update("annualProductionMT")}
              />
            </div>
            <div>
              <label className="label">Renewable share (%)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={form.renewableSharePercent}
                onChange={update("renewableSharePercent")}
              />
            </div>
            <div>
              <label className="label">Afforestation area (ha)</label>
              <input
                type="number"
                step="0.1"
                className="input-field"
                value={form.afforestationAreaHectares}
                onChange={update("afforestationAreaHectares")}
              />
            </div>

            {error && <div className="text-sm text-red-400 md:col-span-3">{error}</div>}

            <div className="md:col-span-3">
              <button type="submit" className="btn-primary">
                Save mine
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mines.map((m) => (
            <Link key={m._id} to={`/mines/${m._id}`} className="card p-5 hover:border-ember/40 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-base text-chalk">{m.name}</div>
                  <div className="text-xs text-ash mt-0.5">{m.code}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-panel text-ash border border-line capitalize">
                  {m.type}
                </span>
              </div>
              <div className="mt-4 text-sm text-ash space-y-1">
                <div>{m.state}{m.district ? `, ${m.district}` : ""}</div>
                <div>{m.annualProductionMT} MT / year</div>
                <div className="text-neutral">{m.renewableSharePercent}% renewable</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
