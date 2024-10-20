import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react';

interface PostbackSetting {
  id: string;
  site_id: string | null;
  postback_url: string;
  tracking_template_id: string | null;
}

const PostbackSettings: React.FC = () => {
  const [postbackSettings, setPostbackSettings] = useState<PostbackSetting[]>([]);
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
  const [trackingTemplates, setTrackingTemplates] = useState<{ id: string; name: string }[]>([]);
  const [editingSetting, setEditingSetting] = useState<PostbackSetting | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<PostbackSetting>();

  useEffect(() => {
    fetchPostbackSettings();
    fetchSites();
    fetchTrackingTemplates();
  }, []);

  const fetchPostbackSettings = async () => {
    const { data, error } = await supabase.from('postback_settings').select('*');
    if (error) console.error('Error fetching postback settings:', error);
    else setPostbackSettings(data || []);
  };

  const fetchSites = async () => {
    const { data, error } = await supabase.from('sites').select('id, name');
    if (error) console.error('Error fetching sites:', error);
    else setSites(data || []);
  };

  const fetchTrackingTemplates = async () => {
    const { data, error } = await supabase.from('tracking_templates').select('id, name');
    if (error) console.error('Error fetching tracking templates:', error);
    else setTrackingTemplates(data || []);
  };

  const onSubmit = async (data: PostbackSetting) => {
    if (editingSetting) {
      const { error } = await supabase
        .from('postback_settings')
        .update(data)
        .eq('id', editingSetting.id);
      if (error) console.error('Error updating postback setting:', error);
      else {
        fetchPostbackSettings();
        setEditingSetting(null);
      }
    } else {
      const newSetting = {
        ...data,
        id: uuidv4(),
      };
      const { error } = await supabase.from('postback_settings').insert(newSetting);
      if (error) console.error('Error creating postback setting:', error);
      else fetchPostbackSettings();
    }
    reset();
  };

  const handleEdit = (setting: PostbackSetting) => {
    setEditingSetting(setting);
    Object.keys(setting).forEach((key) => {
      setValue(key as keyof PostbackSetting, setting[key as keyof PostbackSetting]);
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('postback_settings').delete().eq('id', id);
    if (error) console.error('Error deleting postback setting:', error);
    else fetchPostbackSettings();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Postback Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <select {...register('site_id')} className="p-2 border rounded">
            <option value="">Select a site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
          <input {...register('postback_url')} placeholder="Postback URL" className="p-2 border rounded" required />
          <select {...register('tracking_template_id')} className="p-2 border rounded">
            <option value="">Select a tracking template</option>
            {trackingTemplates.map((template) => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingSetting ? 'Update Postback Setting' : 'Create Postback Setting'}
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
            <th className="py-2 px-4 border-b">Postback URL</th>
            <th className="py-2 px-4 border-b">Tracking Template</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {postbackSettings.map((setting) => (
            <tr key={setting.id}>
              <td className="py-2 px-4 border-b">{sites.find(s => s.id === setting.site_id)?.name || '-'}</td>
              <td className="py-2 px-4 border-b">{setting.postback_url}</td>
              <td className="py-2 px-4 border-b">{trackingTemplates.find(t => t.id === setting.tracking_template_id)?.name || '-'}</td>
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

export default PostbackSettings;