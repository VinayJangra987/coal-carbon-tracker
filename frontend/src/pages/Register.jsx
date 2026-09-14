import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "mine_admin" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-anthracite px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-2xl font-semibold text-chalk">Anthra</div>
          <div className="text-sm text-ash mt-1">Create an account</div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input-field" value={form.name} onChange={update("name")} required />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input-field"
              value={form.email}
              onChange={update("email")}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input-field"
              value={form.password}
              onChange={update("password")}
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input-field" value={form.role} onChange={update("role")}>
              <option value="mine_admin">Mine Admin</option>
              <option value="moc_admin">Ministry Admin</option>
            </select>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-ash mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-ember">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
