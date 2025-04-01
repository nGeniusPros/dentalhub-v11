import React from 'react';
import MainLayout from './components/layout/MainLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import Patients from './pages/Patients/Patients';
import Appointments from './pages/Appointments/Appointments';
import Billing from './pages/Billing/Billing';
import Settings from './pages/Settings/Settings';
import AIAgents from './pages/AI Agents/AIAgents';
import Communications from './pages/Communications/Communications';
import HR from './pages/HR/HR';
import LandingPage from './pages/Landing Page/LandingPage';
import Learning from './pages/Learning/Learning';
import Logins from './pages/logins/Logins';
import Memberships from './pages/Memberships/Memberships';
import Resources from './pages/Resources/Resources';
import Staff from './pages/Staff/Staff';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-agents" element={<AIAgents />} />
          <Route path="/communications" element={<Communications />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/logins" element={<Logins />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/staff" element={<Staff />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;
