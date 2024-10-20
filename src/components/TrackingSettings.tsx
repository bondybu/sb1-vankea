import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react';

interface TrackingSetting {
  id: string;
  site_id: string | null;
  listicle_page_id: string | null;
  listicle_item_id: string | null;
  use_msclkid: boolean;
  use_gclid: boolean;
}

interface CustomParameter {
  id: string;
  tracking_settings_id: string;
  parameter_name: string;
  parameter_slug: string;
}

const TrackingSettings: React.FC = () => {
  const [trackingSettings, setTrackingSettings] = useState<TrackingSetting[]>([]);
  const [customParameters, setCustomParameters] = useState<CustomParameter[]>([]);
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
  const [listiclePages, setListiclePages] = useState<{ id: string; title: string }[]>([]);
  const [listicleItems, setListicleItems] = useState<{ id: string; title: string }[]>([]);
  const [editingSetting, setEditingSetting] = useState<TrackingSetting | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<TrackingSetting>();

  useEffect(() => {
    fetchTrackingSettings();
    fetchCustomParameters();
    fetchSites();
    fetchListiclePages();
    fetchListicleItems();
  }, []);

  const fetchTrackingSettings = async () => {
    const { data, error } = await supabase.from('tracking_settings').select('*');
    if (error) console.error('Error fetching tracking settings:', error);
    else setTrackingSettings(data || []);
  };

  const fetchCustomParameters = async () => {
    const { data, error } = await supabase.from('custom_parameters').select('*');
    if (error) console.error('Error fetching custom parameters:', error);
    else setCustomParameters(data || []);
  };

  const fetchSites = async () => {
    const { data, error } = await supabase.from('sites').select('id, name');
    if (error) console.error('Error fetching sites:', error);
    else setSites(data || []);
  };

  const fetchListiclePages = async () => {
    const { data, error } = await supabase.from('listicle_pages').select('id, title');
    if (error) console.error('Error fetching listicle pages:', error);
    else setListiclePages(data || []);
  };

  const fetchListicleItems = async () => {
    const { data, error } = await supabase.from('listicle_items').select('id, title');
    if (error) console.error('Error fetching listicle items:', error);
    else setListicleItems(data || []);
  };

  const onSubmit = async (data: TrackingSetting) => {
    if (editingSetting) {
      const { error } = await supabase
        .from('tracking_settings')
        .update(data)
        .eq('id', editingSetting.id);
      if (error) console.error('Error updating tracking setting:', error);
      else {
        fetchTrackingSettings();
        setEditingSetting(null);
      }
    } else {
      const newSetting = {
        ...data,
        id: uuidv4(),
      };
      const { error } = await supabase.from('tracking_settings').insert(newSetting);
      if (error) console.error('Error creating tracking setting:', error);
      else fetchTrackingSettings();
    }
    reset();
  };

  const handleEdit = (setting: TrackingSetting) => {
    setEditingSetting(setting);
    Object.keys(setting).forEach((key) => {
      setValue(key as keyof TrackingSetting, setting[key as keyof TrackingSetting]);
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tracking_settings').delete().eq('id', id);
    if (error) console.error('Error deleting tracking setting:', error);
    else fetchTrackingSettings();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tracking Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <select {...register('site_id')} className="p-2 border rounded">
            <option value="">Select a site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
          <select {...register('listicle_page_id')} className="p-2 border rounded">
            <option value="">Select a listicle page</option>
            {listiclePages.map((page) => (
              <option key={page.id} value={page.id}>{page.title}</option>
            ))}
          </select>
          <select {...register('listicle_item_id')} className="p-2 border rounded">
            <option value="">Select a listicle item</option>
            {listicleItems.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          <div>
            <label className="inline-flex items-center">
              <input type="checkbox" {...register('use_msclkid')} className="form-checkbox" />
              <span className="ml-2">Use msclkid</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input type="checkbox" {...register('use_gclid')} className="form-checkbox" />
              <span className="ml-2">Use gclid</span>
            </label>
          </div>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingSetting ? 'Update Tracking Setting' : 'Create Tracking Setting'}
        </button>
        {editingSetting && (
          <button
            type="button"
            onClick={() => {
              setEditingSetting(null);
              reset();
            }}
            className="mt-4 ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Site</th>
            <th className="py-2 px-4 border-b">Listicle Page</th>
            <th className="py-2 px-4 border-b">Listicle Item</th>
            <th className="py-2 px-4 border-b">Use msclkid</th>
            <th className="py-2 px-4 border-b">Use gclid</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trackingSettings.map((setting) => (
            <tr key={setting.id}>
              <td className="py-2 px-4 border-b">{sites.find(s => s.id === setting.site_id)?.name || '-'}</td>
              <td className="py-2 px-4 border-b">{listiclePages.find(p => p.id === setting.listicle_page_id)?.title || '-'}</td>
              <td className="py-2 px-4 border-b">{listicleItems.find(i => i.id === setting.listicle_item_id)?.title || '-'}</td>
              <td className="py-2 px-4 border-b">{setting.use_msclkid ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b">{setting.use_gclid ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(setting)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(setting.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingSettings;