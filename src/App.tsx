import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Splash from './screens/Splash';
import Welcome from './screens/Welcome';
import Registration from './screens/Registration';
import Login from './screens/Login';
import MapScreen from './screens/MapScreen';
import RouteSelection from './screens/RouteSelection';
import Search from './screens/Search';
import Settings from './screens/Settings';
import ForgotPassword from './screens/ForgotPassword';
import DriverLogin from './screens/DriverLogin';
import DriverDashboard from './screens/DriverDashboard';
import AdminDashboard from './screens/AdminDashboard';
import AdminRegistration from './screens/AdminRegistration';
import AdminLogin from './screens/AdminLogin';
import { normalizeBasename } from './routerBasename.js';

const routerBasename = normalizeBasename(import.meta.env.BASE_URL);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter basename={routerBasename}>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/map" element={<MapScreen />} />
              <Route path="/routes" element={<RouteSelection />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/driver-login" element={<DriverLogin />} />
              <Route path="/driver-dashboard" element={<DriverDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-registration" element={<AdminRegistration />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
