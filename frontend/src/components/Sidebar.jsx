// import { NavLink } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";

// const links = [
//   { to: "/dashboard", label: "Overview" },
//   { to: "/mines", label: "Mines" },
//   { to: "/pathway", label: "Neutrality Pathway" },
// ];

// export default function Sidebar() {
//   const { user, logout } = useAuth();

//   return (
//     <aside className="w-64 shrink-0 bg-seam border-r border-line h-screen sticky top-0 flex flex-col">
//       <div className="px-6 py-6 border-b border-line">
//         <div className="font-display text-xl font-semibold text-chalk">Anthra</div>
//         <div className="text-xs text-ash mt-1">Ministry of Coal · Carbon Tracker</div>
//       </div>

//       <nav className="flex-1 px-3 py-4 space-y-1">
//         {links.map((l) => (
//           <NavLink
//             key={l.to}
//             to={l.to}
//             className={({ isActive }) =>
//               `block px-3 py-2.5 rounded-lg text-sm transition-colors ${
//                 isActive
//                   ? "bg-ember/10 text-ember border border-ember/30"
//                   : "text-ash hover:bg-panel hover:text-chalk"
//               }`
//             }
//           >
//             {l.label}
//           </NavLink>
//         ))}
//       </nav>

//       <div className="px-4 py-4 border-t border-line">
//         <div className="text-sm text-chalk truncate">{user?.name}</div>
//         <div className="text-xs text-ash mb-3">
//           {user?.role === "moc_admin" ? "Ministry Admin" : "Mine Admin"}
//         </div>
//         <button onClick={logout} className="btn-secondary text-sm w-full">
//           Log out
//         </button>
//       </div>
//     </aside>
//   );
// }



import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const mainLinks = [
  {
    to: "/dashboard",
    label: "Overview",
  },
  {
    to: "/mines",
    label: "Mines",
  },
  {
    to: "/pathway",
    label: "Neutrality Pathway",
  },
];

const carbonLinks = [
  {
    to: "/carbon-management",
    label: "Carbon Management",
  },
  {
    to: "/carbon-targets",
    label: "Carbon Targets",
  },
  {
    to: "/carbon-score",
    label: "Carbon Score",
  },
  {
    to: "/alerts",
    label: "Alerts",
  },
  {
    to: "/forecast",
    label: "Emission Forecast",
  },
  {
    to: "/carbon-advisor",
    label: "Carbon Advisor",
  },
  {
    to: "/carbon-projects",
    label: "Carbon Projects",
  },
  {
    to: "/reports",
    label: "Reports",
  },
];

function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2.5 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-ember/10 text-ember border border-ember/30"
            : "text-ash hover:bg-panel hover:text-chalk"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 bg-seam border-r border-line h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-line">
        <div className="font-display text-xl font-semibold text-chalk">
          Anthra
        </div>

        <div className="text-xs text-ash mt-1">
          Ministry of Coal · Carbon Tracker
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Main */}
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
            Main
          </div>

          <div className="space-y-1">
            {mainLinks.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                label={link.label}
              />
            ))}
          </div>
        </div>

        {/* Carbon Management */}
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
            Carbon Management
          </div>

          <div className="space-y-1">
            {carbonLinks.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                label={link.label}
              />
            ))}
          </div>
        </div>

        {/* Admin */}
        {user?.role === "moc_admin" && (
          <div>
            <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
              Administration
            </div>

            <SidebarLink
              to="/audit-logs"
              label="Audit Logs"
            />
          </div>
        )}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-line">
        <div className="text-sm text-chalk truncate">
          {user?.name || "User"}
        </div>

        <div className="text-xs text-ash mb-3">
          {user?.role === "moc_admin"
            ? "Ministry Admin"
            : "Mine Admin"}
        </div>

        <button
          onClick={logout}
          className="btn-secondary text-sm w-full"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}