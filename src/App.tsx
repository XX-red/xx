/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase";
import { seedInitialData } from "./services/dataService";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Monitor from "./pages/Monitor";
import MonitorBigScreen from "./pages/MonitorBigScreen";
import Alerts from "./pages/Alerts";
import Devices from "./pages/Devices";
import Evidence from "./pages/Evidence";
import Analysis from "./pages/Analysis";
import Maintenance from "./pages/Maintenance";
import Audit from "./pages/Audit";
import Layout from "./components/Layout";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [localAuth, setLocalAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for local software session first
    const targetUid = localStorage.getItem("app_target_uid");
    if (targetUid) {
      setLocalAuth(true);
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // Seed initial data if needed when a user is logged in
        try {
          await seedInitialData();
        } catch (error) {
          console.error("Failed to seed data:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = user || localAuth;

  if (loading && !localAuth) {
    return (
      <div className="h-screen w-screen bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/monitor" /> : <Login onLogin={() => setLocalAuth(true)} />} 
        />
        
        <Route element={isLoggedIn ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/evidence" element={<Evidence />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/" element={<Navigate to="/monitor" />} />
        </Route>

        <Route path="/monitor/fullscreen" element={isLoggedIn ? <MonitorBigScreen /> : <Navigate to="/login" />} />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

