import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge.jsx";
import { featureApi } from "../services/featureApi";

export default function CarbonTargets() {
  const [mine, setMine] = useState("");
  const [targets, setTargets] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    baselineTonnesCO2e: "",
    targetReductionPercent: 20,
    renewableTargetPercent: 50,
    notes: "",
  });

  const load = async () => {
    try {
      setTargets(await featureApi.getTargets(mine.trim()));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [mine]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await featureApi.createTarget({
        mine: mine.trim(),
        year: Number(form.year),
        baselineTonnesCO2e: Number(form.baselineTonnesCO2e),
        targetReductionPercent: Number(form.targetReductionPercent),
        renewableTargetPercent: Number(form.renewableTargetPercent),
        notes: form.notes,
      });

      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-full bg-ink p-6 text-chalk md:p-8">
      <Header
        eyebrow="Planning"
        title="Carbon Targets"
        text="Set annual emission-reduction and renewable-energy targets."
      />

      {error && <ErrorBox message={error} />}

      <form
        onSubmit={submit}
        className="mb-6 grid gap-3 rounded-xl border border-line bg-panel p-5 md:grid-cols-3"
      >
        <Input
          value={mine}
          onChange={setMine}
          placeholder="Mine Name"
          required
        />

        <Input
          type="number"
          value={form.year}
          onChange={(value) => setForm({ ...form, year: value })}
          placeholder="Year"
        />

        <Input
          type="number"
          value={form.baselineTonnesCO2e}
          onChange={(value) =>
            setForm({ ...form, baselineTonnesCO2e: value })
          }
          placeholder="Baseline tCO2e"
          required
        />

        <Input
          type="number"
          value={form.targetReductionPercent}
          onChange={(value) =>
            setForm({ ...form, targetReductionPercent: value })
          }
          placeholder="Reduction %"
        />

        <Input
          type="number"
          value={form.renewableTargetPercent}
          onChange={(value) =>
            setForm({ ...form, renewableTargetPercent: value })
          }
          placeholder="Renewable target %"
        />

        <Input
          value={form.notes}
          onChange={(value) => setForm({ ...form, notes: value })}
          placeholder="Notes"
        />

        <button className="rounded-lg bg-ember px-5 py-3 text-sm font-semibold text-ink hover:brightness-110 md:col-span-3">
          Create Target
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-line bg-panel">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-semibold">Existing Targets</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-seam text-xs uppercase tracking-wider text-ash">
              <tr>
                <th className="p-4">Mine</th>
                <th className="p-4">Year</th>
                <th className="p-4">Baseline</th>
                <th className="p-4">Reduction</th>
                <th className="p-4">Target</th>
                <th className="p-4">Renewable</th>
              </tr>
            </thead>

            <tbody>
              {targets.map((target) => (
                <tr key={target._id} className="border-t border-line">
                  <td className="p-4 text-chalk">
                    {target.mine?.name || target.mine || "—"}
                  </td>
                  <td className="p-4 text-ash">{target.year}</td>
                  <td className="p-4 text-ash">
                    {Number(target.baselineTonnesCO2e || 0).toLocaleString()}
                  </td>
                  <td className="p-4 text-ash">
                    {target.targetReductionPercent}%
                  </td>
                  <td className="p-4 font-medium text-ember">
                    {Number(target.targetTonnesCO2e || 0).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <StatusBadge
                      status={`${target.renewableTargetPercent}%`}
                    />
                  </td>
                </tr>
              ))}

              {!targets.length && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-ash">
                    No targets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Header({ eyebrow, title, text }) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-[0.18em] text-ember">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-ash">{text}</p>
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

function ErrorBox({ message }) {
  return (
    <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
      {message}
    </div>
  );
}
