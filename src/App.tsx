import React from 'react';
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import RevenueDashboard from './pages/dashboard/RevenueDashboard';
import MonthlyReport from './pages/dashboard/MonthlyReport';
import ActivePatients from './pages/dashboard/ActivePatients';
import TreatmentSuccess from './pages/dashboard/TreatmentSuccess';
import PatientSatisfaction from './pages/dashboard/PatientSatisfaction';
import DailyHuddle from './pages/dashboard/DailyHuddle';

// Main pages
import Patients from './pages/Patients/Patients';
import Appointments from './pages/Appointments/Appointments';
import Billing from './pages/Billing/Billing';
import Settings from './pages/Settings/Settings';
import AIAgents from './pages/AI Agents/AIAgents';
import Communications from './pages/Communications/Communications';
import HR from './pages/HR/HR';
import LandingPage from './pages/Landing Page/LandingPage';
import Learning from './pages/Learning/Learning';
import Memberships from './pages/Memberships/Memberships';
import Resources from './pages/Resources/Resources';
import Staff from './pages/Staff/Staff';

// Communications pages
import Pipeline from './pages/Communications/Pipeline';
import Conversations from './pages/Communications/Conversations';
import Prospects from './pages/Communications/Prospects';
import Campaigns from './pages/Communications/Campaigns';
import SMSCampaigns from './pages/Communications/SMSCampaigns';
import EmailDashboard from './pages/Communications/EmailDashboard';
import { VoiceCampaignsPage } from './features/communications/voice';
import SocialMedia from './pages/Communications/SocialMedia';
import TestPage from './pages/admin/TestPage';
import SidebarTest from './pages/admin/SidebarTest';
import IconTest from './pages/admin/IconTest';
import DatabaseExample from './components/examples/DatabaseExample';

// Resources pages
import KnowledgeBase from './pages/Resources/KnowledgeBase';
import Marketplace from './pages/Resources/Marketplace';

// Settings pages
import AIFeedback from './pages/Settings/AIFeedback';
import AIAnalytics from './pages/Settings/AIAnalytics';
import ContactManager from './pages/Settings/ContactManager';
import Claims from './pages/Settings/Claims';

// Login pages
import Logins from './pages/logins/Logins';
import AdminLogin from './pages/logins/AdminLogin';
import PatientLogin from './pages/logins/PatientLogin';
import StaffLogin from './pages/logins/StaffLogin';
import ForgotPassword from './pages/logins/ForgotPassword';
import NewLocation from './pages/logins/NewLocation';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
        <Route path="/signup" element={<PublicLayout><LandingPage /></PublicLayout>} />

        {/* Updated Login Routes with /login base path */}
        <Route path="/login" element={<PublicLayout><Logins /></PublicLayout>}>
          <Route path="admin" element={<AdminLogin />} />
          <Route path="patient" element={<PatientLogin />} />
          <Route path="staff" element={<StaffLogin />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="new-location" element={<NewLocation />} />
        </Route>

        {/* Main Application Routes */}
        {/* Updated Dashboard Route to be a parent */}
        <Route path="/dashboard" element={<MainLayout role="admin"><Outlet /></MainLayout>}> {/* Use Outlet with admin role */}
          <Route index element={<Dashboard />} /> {/* Main dashboard */}
          {/* Quick Access Routes */}
          <Route path="revenue-dashboard" element={<RevenueDashboard />} />
          <Route path="monthly-report" element={<MonthlyReport />} />
          <Route path="active-patients" element={<ActivePatients />} />
          <Route path="treatment-success" element={<TreatmentSuccess />} />
          <Route path="patient-satisfaction" element={<PatientSatisfaction />} />
          <Route path="daily-huddle" element={<DailyHuddle />} />
          <Route path="test" element={<TestPage />} />
          <Route path="database-example" element={<DatabaseExample />} />
        </Route>
        <Route path="/sidebar-test" element={<SidebarTest />} />
        <Route path="/icon-test" element={<IconTest />} />
        <Route path="/patients" element={<MainLayout role="admin"><Patients /></MainLayout>} />
        <Route path="/appointments" element={<MainLayout role="admin"><Appointments /></MainLayout>} />
        <Route path="/billing" element={<MainLayout role="admin"><Billing /></MainLayout>} />

        {/* Settings Routes */}
        <Route path="/settings" element={<MainLayout role="admin"><Outlet /></MainLayout>}>
          <Route index element={<Settings />} />
          <Route path="ai-feedback" element={<AIFeedback />} />
          <Route path="ai-analytics" element={<AIAnalytics />} />
          <Route path="contact-manager" element={<ContactManager />} />
          <Route path="claims" element={<Claims />} />
        </Route>

        <Route path="/ai-agents" element={<MainLayout role="admin"><AIAgents /></MainLayout>} />

        {/* Communications Routes */}
        <Route path="/communications" element={<MainLayout role="admin"><Outlet /></MainLayout>}>
          <Route index element={<Communications />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="prospects" element={<Prospects />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="sms-campaigns" element={<SMSCampaigns />} />
          <Route path="email-dashboard" element={<EmailDashboard />} />
          <Route path="voice-campaigns" element={<VoiceCampaignsPage />} />
          <Route path="social-media" element={<SocialMedia />} />
        </Route>

        <Route path="/hr" element={<MainLayout role="admin"><HR /></MainLayout>} />
        <Route path="/learning" element={<MainLayout role="admin"><Learning /></MainLayout>} />
        <Route path="/memberships" element={<MainLayout role="admin"><Memberships /></MainLayout>} />

        {/* Resources Routes */}
        <Route path="/resources" element={<MainLayout role="admin"><Outlet /></MainLayout>}>
          <Route index element={<Resources />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="marketplace" element={<Marketplace />} />
        </Route>

        <Route path="/staff" element={<MainLayout role="admin"><Staff /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
