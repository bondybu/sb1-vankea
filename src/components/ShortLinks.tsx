import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react';

interface ShortLink {
  id: string;
  original_url: string;
  short_code: string;
  listicle_item_id: string | null;
  tracking_template_id: string | null;
  site_id: string | null;
}

const ShortLinks: React.FC = () => {
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [listicleItems, setListicleItems] = useState<{ id: string; title: string }[]>([]);
  const [trackingTemplates, setTrackingTemplates] = useState<{ id: string; name: string }[]>([]);
  const [sites, setSites] = useState<{ id: string; name: string }[]>([]);
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { register, handleSubmit, reset, setValue } = useForm<ShortLink>();

  useEffect(() => {
    fetchShortLinks();
    fetchListicleItems();
    fetchTrackingTemplates();
    fetchSites();
  }, []);

  const fetchShortLinks = async () => {
    const { data, error } = await supabase.from('short_links').select('*');
    if (error) console.error('Error fetching short links:', error);
    else setShortLinks(data || []);
  };

  const fetchListicleItems = async () => {
    const { data, error } = await supabase.from('listicle_items').select('id, title');
    if (error) console.error('Error fetching listicle items:', error);
    else setListicleItems(data || []);
  };

  const fetchTrackingTemplates = async () => {
    const { data, error } = await supabase.from('tracking_templates').select('id, name');
    if (error) console.error('Error fetching tracking templates:', error);
    else setTrackingTemplates(data || []);
  };

  const fetchSites = async () => {
    const { data, error } = await supabase.from('sites').select('id, name');
    if (error) console.error('Error fetching sites:', error);
    else setSites(data || []);
  };

  const onSubmit = async (data: ShortLink) => {
    try {
      if (editingLink) {
        const { error } = await supabase
          .from('short_links')
          .update(data)
          .eq('id', editingLink.id);
        if (error) throw error;
      } else {
        const newShortLink = {
          ...data,
          id: uuidv4(),
          created_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('short_links').insert(newShortLink);
        if (error) throw error;
      }
      fetchShortLinks();
      setEditingLink(null);
      reset();
    } catch (error) {
      console.error('Error saving short link:', error);
      alert('Error saving short link. Please try again.');
    }
  };

  const handleEdit = (link: ShortLink) => {
    setEditingLink(link);
    Object.keys(link).forEach((key) => {
      setValue(key as keyof ShortLink, link[key as keyof ShortLink]);
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('short_links').delete().eq('id', id);
      if (error) throw error;
      fetchShortLinks();
    } catch (error) {
      console.error('Error deleting short link:', error);
      alert('Error deleting short link. Please try again.');
    }
  };

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const filteredShortLinks = shortLinks.filter(link => {
    if (filter === 'all') return true;
    if (filter === 'global') return link.site_id === null;
    return link.site_id === filter;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Short Links</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input {...register('original_url')} placeholder="Original URL" className="p-2 border rounded" required />
          <input
            {...register('short_code')}
            placeholder="Short Code (optional)"
            className="p-2 border rounded"
            defaultValue={generateShortCode()}
          />
          <select {...register('listicle_item_id')} className="p-2 border rounded">
            <option value="">Select a listicle item (optional)</option>
            {listicleItems.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
          <select {...register('tracking_template_id')} className="p-2 border rounded">
            <option value="">Select a tracking template (optional)</option>
            {trackingTemplates.map((template) => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>
          <select {...register('site_id')} className="p-2 border rounded">
            <option value="">Global (All Sites)</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingLink ? 'Update Short Link' : 'Create Short Link'}
        </button>
        {editingLink && (
          <button
            type="button"
            onClick={() => {
              setEditingLink(null);
              reset();
            }}
            className="mt-4 ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="mb-4">
        <label htmlFor="filter" className="mr-2">Filter by Site:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All Short Links</option>
          <option value="global">Global Short Links</option>
          {sites.map((site) => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Short Code</th>
            <th className="py-2 px-4 border-b">Original URL</th>
            <th className="py-2 px-4 border-b">Listicle Item</th>
            <th className="py-2 px-4 border-b">Tracking Template</th>
            <th className="py-2 px-4 border-b">Site</th>
            <th className="py-2 px-4 border-b">Full Short URL</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredShortLinks.map((link) => (
            <tr key={link.id}>
              <td className="py-2 px-4 border-b">{link.short_code}</td>
              <td className="py-2 px-4 border-b truncate max-w-xs">{link.original_url}</td>
              <td className="py-2 px-4 border-b">
                {listicleItems.find(item => item.id === link.listicle_item_id)?.title || '-'}
              </td>
              <td className="py-2 px-4 border-b">
                {trackingTemplates.find(template => template.id === link.tracking_template_id)?.name || '-'}
              </td>
              <td className="py-2 px-4 border-b">
                {sites.find(site => site.id === link.site_id)?.name || 'Global'}
              </td>
              <td className="py-2 px-4 border-b">
                {`${window.location.origin}/go/${link.short_code}`}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(link)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
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

export default ShortLinks;