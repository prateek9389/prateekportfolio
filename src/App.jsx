import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CustomCursor from './components/common/CustomCursor';

// Public Pages
import Home from './pages/Home';

// Admin Pages
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import DashboardOverview from './admin/pages/DashboardOverview';
import ProjectsManagement from './admin/pages/ProjectsManagement';
import MessagesManagement from './admin/pages/MessagesManagement';
import SkillsManagement from './admin/pages/SkillsManagement';
import ProfileManagement from './admin/pages/ProfileManagement';
import SocialProfilesManagement from './admin/pages/SocialProfilesManagement';
import ExperiencesManagement from './admin/pages/ExperiencesManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-[#030014] text-white min-h-screen selection:bg-primary/30 overflow-x-hidden w-full flex flex-col">
          <CustomCursor />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="dashboard/projects" element={<ProjectsManagement />} />
              <Route path="dashboard/messages" element={<MessagesManagement />} />
              <Route path="dashboard/skills" element={<SkillsManagement />} />
              <Route path="dashboard/profile" element={<ProfileManagement />} />
              <Route path="dashboard/socials" element={<SocialProfilesManagement />} />
              <Route path="dashboard/experience" element={<ExperiencesManagement />} />
              {/* Other admin routes can be added here */}
              <Route index element={<DashboardOverview />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
