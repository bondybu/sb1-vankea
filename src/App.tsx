import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import PublicSite from './components/PublicSite';
import { Site } from './types';

function App() {
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const loadSiteData = async () => {
      try {
        const domain = window.location.hostname;
        const path = window.location.pathname.split('/')[1];
        
        console.log('Current domain:', domain);
        console.log('Current path:', path);

        let siteQuery = supabase.from('sites').select('*');
        
        if (domain === 'localhost' || domain.includes('netlify.app')) {
          console.log('Test mode detected');
          // Test mode: check for site with matching slug
          siteQuery = siteQuery.eq('test_mode', true).eq('slug', path);
        } else {
          console.log('Production mode detected');
          // Production mode: check for site with matching domain
          siteQuery = siteQuery.or(`primary_domain.eq.${domain},additional_domains.cs.{${domain}}`);
        }
        
        const { data, error } = await siteQuery.maybeSingle();
        
        if (error) throw error;
        console.log('Site data fetched:', data);
        setCurrentSite(data);
      } catch (error) {
        console.error('Error loading site data:', error);
        // Handle the error gracefully, maybe set an error state
      } finally {
        setLoading(false);
      }
    };

    loadSiteData();
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Handle successful sign in
      } else if (event === 'SIGNED_OUT') {
        // Handle sign out
      }
    });

    return () => {
      if (authListener && authListener.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log('Rendering App component, currentSite:', currentSite);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          {currentSite ? (
            <Route path="/*" element={<PublicSite site={currentSite} />} />
          ) : (
            <>
              <Route path="/login" element={<Login setAuthError={setAuthError} />} />
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
  );
}

export default App;