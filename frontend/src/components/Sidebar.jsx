// import { NavLink } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";
// import {
//   LayoutDashboard,
//   Pickaxe,
//   Route,
//   Leaf,
//   Target,
//   Gauge,
//   Bell,
//   TrendingUp,
//   Sparkles,
//   FolderKanban,
//   FileText,
//   ShieldCheck,
//   LogOut,
// } from "lucide-react";

// const mainLinks = [
//   { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
//   { to: "/mines", label: "Mines", icon: Pickaxe },
//   { to: "/pathway", label: "Neutrality Pathway", icon: Route },
// ];

// const carbonLinks = [
//   { to: "/carbon-management", label: "Carbon Management", icon: Leaf },
//   { to: "/carbon-targets", label: "Carbon Targets", icon: Target },
//   { to: "/carbon-score", label: "Carbon Score", icon: Gauge },
//   { to: "/alerts", label: "Alerts", icon: Bell },
//   { to: "/forecast", label: "Emission Forecast", icon: TrendingUp },
//   { to: "/carbon-advisor", label: "Carbon Advisor", icon: Sparkles },
//   { to: "/carbon-projects", label: "Carbon Projects", icon: FolderKanban },
//   { to: "/reports", label: "Reports", icon: FileText },
// ];

// function SidebarLink({ to, label, icon: Icon }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
//           isActive
//             ? "bg-ember/10 text-ember"
//             : "text-ash hover:bg-panel hover:text-chalk"
//         }`
//       }
//     >
//       {({ isActive }) => (
//         <>
//           {/* Active left accent bar */}
//           <span
//             className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-ember transition-opacity duration-200 ${
//               isActive ? "opacity-100" : "opacity-0"
//             }`}
//           />
//           <Icon
//             size={17}
//             strokeWidth={2}
//             className={`shrink-0 transition-transform duration-200 ${
//               isActive ? "" : "group-hover:scale-110"
//             }`}
//           />
//           <span className="truncate">{label}</span>
//         </>
//       )}
//     </NavLink>
//   );
// }

// export default function Sidebar() {
//   const { user, logout } = useAuth();

//   return (
//     <aside className="w-64 shrink-0 bg-seam border-r border-line h-screen sticky top-0 flex flex-col">
//       {/* Logo */}
//       <div className="px-6 py-6 border-b border-line">
//         <div className="flex items-center gap-2">
//           <div className="h-7 w-7 rounded-md bg-gradient-to-br from-ember to-ember/60 flex items-center justify-center">
//             <span className="font-display text-sm font-bold text-seam">A</span>
//           </div>
//           <div className="font-display text-xl font-semibold text-chalk">
//             Anthra
//           </div>
//         </div>
//         <div className="text-xs text-ash mt-1.5 pl-9">
//           Ministry of Coal · Carbon Tracker
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
//         <div>
//           <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
//             Main
//           </div>
//           <div className="space-y-1">
//             {mainLinks.map((link) => (
//               <SidebarLink key={link.to} {...link} />
//             ))}
//           </div>
//         </div>

//         <div>
//           <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
//             Carbon Management
//           </div>
//           <div className="space-y-1">
//             {carbonLinks.map((link) => (
//               <SidebarLink key={link.to} {...link} />
//             ))}
//           </div>
//         </div>

//         {user?.role === "moc_admin" && (
//           <div>
//             <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
//               Administration
//             </div>
//             <SidebarLink to="/audit-logs" label="Audit Logs" icon={ShieldCheck} />
//           </div>
//         )}
//       </nav>

//       {/* User */}
//       <div className="px-4 py-4 border-t border-line">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="h-9 w-9 rounded-full bg-panel border border-line flex items-center justify-center text-sm font-semibold text-chalk shrink-0">
//             {(user?.name || "U").charAt(0).toUpperCase()}
//           </div>
//           <div className="min-w-0">
//             <div className="text-sm text-chalk truncate">
//               {user?.name || "User"}
//             </div>
//             <div className="text-xs text-ash truncate">
//               {user?.role === "moc_admin" ? "Ministry Admin" : "Mine Admin"}
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={logout}
//           className="btn-secondary text-sm w-full flex items-center justify-center gap-2"
//         >
//           <LogOut size={15} />
//           Log out
//         </button>
//       </div>
//     </aside>
//   );
// }


import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";
import {
  LayoutDashboard,
  Pickaxe,
  Route,
  Leaf,
  Target,
  Gauge,
  Bell,
  TrendingUp,
  Sparkles,
  FolderKanban,
  FileText,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const mainLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/mines", label: "Mines", icon: Pickaxe },
  { to: "/pathway", label: "Neutrality Pathway", icon: Route },
];

const carbonLinks = [
  { to: "/carbon-management", label: "Carbon Management", icon: Leaf },
  { to: "/carbon-targets", label: "Carbon Targets", icon: Target },
  { to: "/carbon-score", label: "Carbon Score", icon: Gauge },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/forecast", label: "Emission Forecast", icon: TrendingUp },
  { to: "/carbon-advisor", label: "Carbon Advisor", icon: Sparkles },
  { to: "/carbon-projects", label: "Carbon Projects", icon: FolderKanban },
  { to: "/reports", label: "Reports", icon: FileText },
];

function SidebarLink({ to, label, icon: Icon, onNavigate }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
          isActive
            ? "bg-ember/10 text-ember"
            : "text-ash hover:bg-panel hover:text-chalk"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-ember transition-opacity duration-200 ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          />
          <Icon
            size={17}
            strokeWidth={2}
            className={`shrink-0 transition-transform duration-200 ${
              isActive ? "" : "group-hover:scale-110"
            }`}
          />
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-line">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-ember to-ember/60 flex items-center justify-center">
            <span className="font-display text-sm font-bold text-seam">A</span>
          </div>
          <div className="font-display text-xl font-semibold text-chalk">
            Anthra
          </div>
        </div>
        <div className="text-xs text-ash mt-1.5 pl-9">
          Ministry of Coal · Carbon Tracker
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
            Main
          </div>
          <div className="space-y-1">
            {mainLinks.map((link) => (
              <SidebarLink key={link.to} {...link} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
            Carbon Management
          </div>
          <div className="space-y-1">
            {carbonLinks.map((link) => (
              <SidebarLink key={link.to} {...link} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {user?.role === "moc_admin" && (
          <div>
            <div className="px-3 mb-2 text-[10px] uppercase tracking-wider text-ash">
              Administration
            </div>
            <SidebarLink
              to="/audit-logs"
              label="Audit Logs"
              icon={ShieldCheck}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-line">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-panel border border-line flex items-center justify-center text-sm font-semibold text-chalk shrink-0">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-chalk truncate">
              {user?.name || "User"}
            </div>
            <div className="text-xs text-ash truncate">
              {user?.role === "moc_admin" ? "Ministry Admin" : "Mine Admin"}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn-secondary text-sm w-full flex items-center justify-center gap-2"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-line bg-seam px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-ember to-ember/60 flex items-center justify-center">
            <span className="font-display text-xs font-bold text-seam">A</span>
          </div>
          <span className="font-display text-lg font-semibold text-chalk">Anthra</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-ash hover:bg-panel hover:text-chalk"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-seam border-r border-line h-screen sticky top-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* drawer panel */}
          <aside className="relative z-50 w-72 max-w-[80vw] h-full bg-seam border-r border-line flex flex-col animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-ash hover:bg-panel hover:text-chalk"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}