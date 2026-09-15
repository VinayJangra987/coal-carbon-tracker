// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Sidebar from "../components/Sidebar.jsx";
// import { useAuth } from "../context/AuthContext.jsx";
// import api from "../utils/api";

// const emptyForm = {
//   name: "",
//   code: "",
//   state: "",
//   district: "",
//   coalfield: "",
//   type: "opencast",
//   annualProductionMT: "",
//   renewableSharePercent: "",
//   afforestationAreaHectares: "",
// };

// export default function Mines() {
//   const { user } = useAuth();
//   const [mines, setMines] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [error, setError] = useState("");

//   const load = () => api.get("/mines").then((res) => setMines(res.data));

//   useEffect(() => {
//     load();
//   }, []);

//   const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await api.post("/mines", form);
//       setForm(emptyForm);
//       setShowForm(false);
//       load();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to create mine");
//     }
//   };

//   return (
//     <div className="flex bg-anthracite min-h-screen">
//       <Sidebar />
//       <main className="flex-1 p-8">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="font-display text-2xl font-semibold text-chalk">Mines</h1>
//             <p className="text-ash text-sm mt-1">{mines.length} mines tracked</p>
//           </div>
//           {user?.role === "moc_admin" && (
//             <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
//               {showForm ? "Cancel" : "+ Add Mine"}
//             </button>
//           )}
//         </div>

//         {showForm && (
//           <form onSubmit={handleCreate} className="card p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="label">Mine name</label>
//               <input className="input-field" value={form.name} onChange={update("name")} required />
//             </div>
//             <div>
//               <label className="label">Code</label>
//               <input className="input-field" value={form.code} onChange={update("code")} required />
//             </div>
//             <div>
//               <label className="label">State</label>
//               <input className="input-field" value={form.state} onChange={update("state")} required />
//             </div>
//             <div>
//               <label className="label">District</label>
//               <input className="input-field" value={form.district} onChange={update("district")} />
//             </div>
//             <div>
//               <label className="label">Coalfield</label>
//               <input className="input-field" value={form.coalfield} onChange={update("coalfield")} />
//             </div>
//             <div>
//               <label className="label">Type</label>
//               <select className="input-field" value={form.type} onChange={update("type")}>
//                 <option value="opencast">Opencast</option>
//                 <option value="underground">Underground</option>
//                 <option value="mixed">Mixed</option>
//               </select>
//             </div>
//             <div>
//               <label className="label">Annual production (MT)</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 className="input-field"
//                 value={form.annualProductionMT}
//                 onChange={update("annualProductionMT")}
//               />
//             </div>
//             <div>
//               <label className="label">Renewable share (%)</label>
//               <input
//                 type="number"
//                 step="0.1"
//                 className="input-field"
//                 value={form.renewableSharePercent}
//                 onChange={update("renewableSharePercent")}
//               />
//             </div>
//             <div>
//               <label className="label">Afforestation area (ha)</label>
//               <input
//                 type="number"
//                 step="0.1"
//                 className="input-field"
//                 value={form.afforestationAreaHectares}
//                 onChange={update("afforestationAreaHectares")}
//               />
//             </div>

//             {error && <div className="text-sm text-red-400 md:col-span-3">{error}</div>}

//             <div className="md:col-span-3">
//               <button type="submit" className="btn-primary">
//                 Save mine
//               </button>
//             </div>
//           </form>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {mines.map((m) => (
//             <Link key={m._id} to={`/mines/${m._id}`} className="card p-5 hover:border-ember/40 transition-colors">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <div className="font-display text-base text-chalk">{m.name}</div>
//                   <div className="text-xs text-ash mt-0.5">{m.code}</div>
//                 </div>
//                 <span className="text-xs px-2 py-1 rounded-full bg-panel text-ash border border-line capitalize">
//                   {m.type}
//                 </span>
//               </div>
//               <div className="mt-4 text-sm text-ash space-y-1">
//                 <div>{m.state}{m.district ? `, ${m.district}` : ""}</div>
//                 <div>{m.annualProductionMT} MT / year</div>
//                 <div className="text-neutral">{m.renewableSharePercent}% renewable</div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }




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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/mines")
      .then((res) => setMines(res.data))
      .finally(() => setLoading(false));
  };

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
    <div className="flex min-h-screen bg-anthracite">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ember">Registry</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-chalk">Mines</h1>
            <p className="mt-1 text-sm text-ash">
              {loading ? "Loading…" : `${mines.length} mines tracked`}
            </p>
          </div>
          {user?.role === "moc_admin" && (
            <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Cancel" : "+ Add Mine"}
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="card-premium mb-8 grid grid-cols-1 gap-4 p-6 md:grid-cols-3"
          >
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

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-premium h-[150px] animate-pulse p-5">
                <div className="h-4 w-2/3 rounded bg-line/60" />
                <div className="mt-3 h-3 w-1/3 rounded bg-line/40" />
                <div className="mt-6 space-y-2">
                  <div className="h-3 w-full rounded bg-line/30" />
                  <div className="h-3 w-1/2 rounded bg-line/30" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mines.map((m) => (
              <Link
                key={m._id}
                to={`/mines/${m._id}`}
                className="card-premium group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display text-base text-chalk transition-colors group-hover:text-ember">
                      {m.name}
                    </div>
                    <div className="mt-0.5 text-xs text-ash">{m.code}</div>
                  </div>
                  <span className="rounded-full border border-line bg-panel px-2 py-1 text-xs capitalize text-ash">
                    {m.type}
                  </span>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-ash">
                  <div>
                    {m.state}
                    {m.district ? `, ${m.district}` : ""}
                  </div>
                  <div>{m.annualProductionMT} MT / year</div>
                  <div className="flex items-center gap-1.5 text-neutral">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral" />
                    {m.renewableSharePercent}% renewable
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}