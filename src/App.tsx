import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicSite from './components/PublicSite';
import { Site } from './types';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {currentSite ? (
              <Route path="/*" element={<PublicSite site={currentSite} />} />
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
