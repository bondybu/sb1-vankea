import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, Plus, X, ExternalLink } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  slug: string;
  primary_domain: string;
  additional_domains: string[] | null;
  theme: string | null;
  language: string | null;
  test_mode: boolean;
}

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [additionalDomains, setAdditionalDomains] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<Site & { newAdditionalDomain: string }>();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      console.log("Fetching sites...");
      const { data, error } = await supabase.from('sites').select('*');
      if (error) {
        throw error;
      }
      console.log("Sites fetched:", data);
      setSites(data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setError(`Error fetching sites: ${error.message}`);
    }
  };

  const onSubmit = async (data: Site & { newAdditionalDomain: string }) => {
    try {
      setError(null);
      const { newAdditionalDomain, ...siteData } = data;
      const finalSiteData = {
        ...siteData,
        additional_domains: additionalDomains.length > 0 ? additionalDomains : null,
      };

      console.log('Submitting site data:', finalSiteData);

      let result;
      if (editingSite) {
        result = await supabase
          .from('sites')
          .update(finalSiteData)
          .eq('id', editingSite.id);
      } else {
        const newSite = {
          ...finalSiteData,
          id: uuidv4(),
          created_at: new Date().toISOString(),
        };
        result = await supabase.from('sites').insert(newSite);
      }

      if (result.error) {
        throw result.error;
      }

      console.log('Site saved successfully');
      fetchSites();
      setEditingSite(null);
      reset();
      setAdditionalDomains([]);
    } catch (error) {
      console.error('Error saving site:', error);
      setError(`Error saving site: ${error.message}`);
    }
  };

  const handleEdit = (site: Site) => {
    setEditingSite(site);
    setAdditionalDomains(site.additional_domains || []);
    Object.keys(site).forEach((key) => {
      setValue(key as keyof Site, site[key as keyof Site]);
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('sites').delete().eq('id', id);
      if (error) {
        throw error;
      }
      fetchSites();
    } catch (error) {
      console.error('Error deleting site:', error);
      setError(`Error deleting site: ${error.message}`);
    }
  };

  const addAdditionalDomain = () => {
    const newDomain = watch('newAdditionalDomain');
    if (newDomain && !additionalDomains.includes(newDomain)) {
      setAdditionalDomains([...additionalDomains, newDomain]);
      setValue('newAdditionalDomain', '');
    }
  };

  const removeAdditionalDomain = (domain: string) => {
    setAdditionalDomains(additionalDomains.filter(d => d !== domain));
  };

  const handleOpenSite = (site: Site) => {
    const baseUrl = window.location.origin;
    const url = site.test_mode
      ? `${baseUrl}/${site.slug}`
      : `https://${site.primary_domain}`;
    window.open(url, '_blank');
  };

  console.log("Rendering Sites component");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sites</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input {...register('name')} placeholder="Site Name" className="p-2 border rounded" required />
          <input {...register('slug')} placeholder="Slug" className="p-2 border rounded" required />
          <div className="col-span-2">
            <label className="inline-flex items-center">
              <input type="checkbox" {...register('test_mode')} className="form-checkbox" />
              <span className="ml-2">Test Mode</span>
            </label>
          </div>
          {!watch('test_mode') && (
            <>
              <input {...register('primary_domain')} placeholder="Primary Domain" className="p-2 border rounded" required />
              <div>
                <input {...register('newAdditionalDomain')} placeholder="Additional Domain" className="p-2 border rounded" />
                <button type="button" onClick={addAdditionalDomain} className="ml-2 p-2 bg-blue-500 text-white rounded">
                  <Plus size={18} />
                </button>
              </div>
              <div className="col-span-2">
                {additionalDomains.map((domain, index) => (
                  <div key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {domain}
                    <button type="button" onClick={() => removeAdditionalDomain(domain)} className="ml-2 text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
          <select {...register('theme')} className="p-2 border rounded">
            <option value="default">Default Theme</option>
          </select>
          <input {...register('language')} placeholder="Language" className="p-2 border rounded" />
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingSite ? 'Update Site' : 'Create Site'}
        </button>
        {editingSite && (
          <button
            type="button"
            onClick={() => {
              setEditingSite(null);
              setAdditionalDomains([]);
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
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Slug</th>
            <th className="py-2 px-4 border-b">Primary Domain</th>
            <th className="py-2 px-4 border-b">Additional Domains</th>
            <th className="py-2 px-4 border-b">Theme</th>
            <th className="py-2 px-4 border-b">Language</th>
            <th className="py-2 px-4 border-b">Test Mode</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.id}>
              <td className="py-2 px-4 border-b">{site.name}</td>
              <td className="py-2 px-4 border-b">{site.slug}</td>
              <td className="py-2 px-4 border-b">{site.primary_domain}</td>
              <td className="py-2 px-4 border-b">{site.additional_domains ? site.additional_domains.join(', ') : '-'}</td>
              <td className="py-2 px-4 border-b">{site.theme || '-'}</td>
              <td className="py-2 px-4 border-b">{site.language || '-'}</td>
              <td className="py-2 px-4 border-b">{site.test_mode ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(site)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(site.id)}
                  className="mr-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => handleOpenSite(site)}
                  className="text-green-500 hover:text-green-700"
                >
                  <ExternalLink size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sites;