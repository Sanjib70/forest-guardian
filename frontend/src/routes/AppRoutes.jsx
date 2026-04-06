import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";

// Pages
import Dashboard from "../pages/Dashboard";
import ForestGreenData from "../pages/ForestGreenData";
import HealthIndex from "../pages/HealthIndex";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MapView from "../pages/MapView";
import NotFound from "../pages/NotFound";
import ReportIssue from "../pages/ReportIssue";

// Optional protected route
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout wrapper */}
      <Route element={<Layout />}>
        
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes (remove ProtectedRoute if not needed) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/forest-data"
          element={
            <ProtectedRoute>
              <ForestGreenData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/health-index"
          element={
            <ProtectedRoute>
              <HealthIndex />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;
