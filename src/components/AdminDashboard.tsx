import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ListPlus, FileText, Link as LinkIcon, Globe, Settings, Bell, LogOut, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ListiclePages from './ListiclePages';
import ListicleItems from './ListicleItems';
import ShortLinks from './ShortLinks';
import Sites from './Sites';
import TrackingSettings from './TrackingSettings';
import TrackingTemplates from './TrackingTemplates';
import PostbackSettings from './PostbackSettings';
import Help from './Help';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <Link to="/admin/listicle-pages" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <FileText className="inline-block mr-2" size={18} />
            Listicle Pages
          </Link>
          <Link to="/admin/listicle-items" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <ListPlus className="inline-block mr-2" size={18} />
            Listicle Items
          </Link>
          <Link to="/admin/short-links" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <LinkIcon className="inline-block mr-2" size={18} />
            Short Links
          </Link>
          <Link to="/admin/sites" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Globe className="inline-block mr-2" size={18} />
            Sites
          </Link>
          <Link to="/admin/tracking-settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Settings className="inline-block mr-2" size={18} />
            Tracking Settings
          </Link>
          <Link to="/admin/tracking-templates" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <FileText className="inline-block mr-2" size={18} />
            Tracking Templates
          </Link>
          <Link to="/admin/postback-settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <Bell className="inline-block mr-2" size={18} />
            Postback Settings
          </Link>
          <Link to="/admin/help" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">
            <HelpCircle className="inline-block mr-2" size={18} />
            Help
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-200"
          >
            <LogOut className="inline-block mr-2" size={18} />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="listicle-pages" element={<ListiclePages />} />
          <Route path="listicle-items" element={<ListicleItems />} />
          <Route path="short-links" element={<ShortLinks />} />
          <Route path="sites" element={<Sites />} />
          <Route path="tracking-settings" element={<TrackingSettings />} />
          <Route path="tracking-templates" element={<TrackingTemplates />} />
          <Route path="postback-settings" element={<PostbackSettings />} />
          <Route path="help" element={<Help />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;