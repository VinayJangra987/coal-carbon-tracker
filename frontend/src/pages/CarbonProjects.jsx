import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";
import { featureApi } from "../services/featureApi";

export default function CarbonProjects() {
  const [mine, setMine] = useState("");
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "renewable_energy",
    status: "planned",
    estimatedAnnualReductionTonnesCO2e: "",
    investmentAmount: "",
    description: "",
  });

  const load = async () => {
    try {
      setProjects(await featureApi.getProjects(mine.trim()));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [mine]);

  const submit = async (e) => {
    e.preventDefault();

    if (!mine.trim()) {
      setError("Enter a Mine ID.");
      return;
    }

    try {
      setError("");

      await featureApi.createProject({
        ...form,
        mine: mine.trim(),
        estimatedAnnualReductionTonnesCO2e:
          Number(form.estimatedAnnualReductionTonnesCO2e || 0),
        investmentAmount: Number(form.investmentAmount || 0),
      });

      setForm({
        name: "",
        category: "renewable_energy",
        status: "planned",
        estimatedAnnualReductionTonnesCO2e: "",
        investmentAmount: "",
        description: "",
      });

      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this carbon project?")) return;

    try {
      await featureApi.deleteProject(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ember">
          Projects
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold">
          Carbon Projects
        </h1>
        <p className="mt-2 text-sm text-ash">
          Manage projects designed to reduce mine carbon emissions.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mb-6 grid gap-3 rounded-xl border border-line bg-panel p-5 md:grid-cols-2"
      >
        <Input
          value={mine}
          onChange={setMine}
          placeholder="Mine ID"
          required
        />

        <Input
          value={form.name}
          onChange={(value) => setForm({ ...form, name: value })}
          placeholder="Project name"
          required
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none focus:border-ember"
        >
          <option value="renewable_energy">Renewable Energy</option>
          <option value="energy_efficiency">Energy Efficiency</option>
          <option value="electrification">Electrification</option>
          <option value="methane_capture">Methane Capture</option>
          <option value="afforestation">Afforestation</option>
          <option value="transport">Transport</option>
          <option value="other">Other</option>
        </select>

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none focus:border-ember"
        >
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>

        <Input
          type="number"
          value={form.estimatedAnnualReductionTonnesCO2e}
          onChange={(value) =>
            setForm({
              ...form,
              estimatedAnnualReductionTonnesCO2e: value,
            })
          }
          placeholder="Estimated annual reduction tCO2e"
        />

        <Input
          type="number"
          value={form.investmentAmount}
          onChange={(value) =>
            setForm({ ...form, investmentAmount: value })
          }
          placeholder="Investment amount"
        />

        <textarea
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          placeholder="Description"
          rows="3"
          className="rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none placeholder:text-ash focus:border-ember md:col-span-2"
        />

        <button className="rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink hover:brightness-110 md:col-span-2">
          Add Carbon Project
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project._id}
            className="rounded-xl border border-line bg-panel p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-chalk">
                  {project.name}
                </h2>
                <p className="mt-1 text-xs capitalize text-ash">
                  {project.category.replaceAll("_", " ")}
                </p>
              </div>

              <StatusBadge status={project.status} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Metric
                label="Annual reduction"
                value={`${Number(
                  project.estimatedAnnualReductionTonnesCO2e || 0
                ).toLocaleString()} tCO2e`}
              />

              <Metric
                label="Investment"
                value={Number(
                  project.investmentAmount || 0
                ).toLocaleString()}
              />
            </div>

            <p className="mt-4 text-sm leading-6 text-ash">
              {project.description || "No description provided."}
            </p>

            <button
              onClick={() => remove(project._id)}
              className="mt-4 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="rounded-lg border border-line bg-seam px-4 py-3 text-sm text-chalk outline-none placeholder:text-ash focus:border-ember"
    />
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-seam p-3">
      <p className="text-[10px] uppercase tracking-wider text-ash">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-chalk">{value}</p>
    </div>
  );
}
