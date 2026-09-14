// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login.jsx";
// import Register from "./pages/Register.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import Mines from "./pages/Mines.jsx";
// import MineDetail from "./pages/MineDetail.jsx";
// import PathwayPlanner from "./pages/PathwayPlanner.jsx";
// import ProtectedRoute from "./components/ProtectedRoute.jsx";

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />

//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/mines"
//         element={
//           <ProtectedRoute>
//             <Mines />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/mines/:id"
//         element={
//           <ProtectedRoute>
//             <MineDetail />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/pathway"
//         element={
//           <ProtectedRoute>
//             <PathwayPlanner />
//           </ProtectedRoute>
//         }
//       />

//       <Route path="/" element={<Navigate to="/dashboard" replace />} />
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// }



import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Mines from "./pages/Mines.jsx";
import MineDetail from "./pages/MineDetail.jsx";
import PathwayPlanner from "./pages/PathwayPlanner.jsx";

import CarbonTargets from "./pages/CarbonTargets.jsx";
import CarbonScore from "./pages/CarbonScore.jsx";
import Alerts from "./pages/Alerts.jsx";
import Forecast from "./pages/Forecast.jsx";
import CarbonAdvisor from "./pages/CarbonAdvisor.jsx";
import CarbonProjects from "./pages/CarbonProjects.jsx";
import Reports from "./pages/Reports.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import FeatureHub from "./pages/FeatureHub.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Existing Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mines"
        element={
          <ProtectedRoute>
            <Mines />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mines/:id"
        element={
          <ProtectedRoute>
            <MineDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pathway"
        element={
          <ProtectedRoute>
            <PathwayPlanner />
          </ProtectedRoute>
        }
      />

      {/* New Carbon Management Hub */}
      <Route
        path="/carbon-management"
        element={
          <ProtectedRoute>
            <FeatureHub />
          </ProtectedRoute>
        }
      />

      {/* Carbon Targets */}
      <Route
        path="/carbon-targets"
        element={
          <ProtectedRoute>
            <CarbonTargets />
          </ProtectedRoute>
        }
      />

      {/* Carbon Score */}
      <Route
        path="/carbon-score"
        element={
          <ProtectedRoute>
            <CarbonScore />
          </ProtectedRoute>
        }
      />

      {/* Alerts */}
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <Alerts />
          </ProtectedRoute>
        }
      />

      {/* Forecast */}
      <Route
        path="/forecast"
        element={
          <ProtectedRoute>
            <Forecast />
          </ProtectedRoute>
        }
      />

      {/* Carbon Advisor */}
      <Route
        path="/carbon-advisor"
        element={
          <ProtectedRoute>
            <CarbonAdvisor />
          </ProtectedRoute>
        }
      />

      {/* Carbon Projects */}
      <Route
        path="/carbon-projects"
        element={
          <ProtectedRoute>
            <CarbonProjects />
          </ProtectedRoute>
        }
      />

      {/* Reports */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Audit Logs */}
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute>
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}