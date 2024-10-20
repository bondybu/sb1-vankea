import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, Copy, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ListiclePage {
  id: string;
  title: string;
  slug: string;
  description: string;
  site_id: string | null;
  faq1: string | null;
  faq1_answer: string | null;
  faq2: string | null;
  faq2_answer: string | null;
  faq3: string | null;
  faq3_answer: string | null;
  faq4: string | null;
  faq4_answer: string | null;
  faq5: string | null;
  faq5_answer: string | null;
  language: string | null;
  users_text: string | null;
  overlay_heading: string | null;
  overlay_deal_title: string | null;
  overlay_subheading: string | null;
  overlay_description: string | null;
  overlay_button_text: string | null;
  notification_deal_title: string | null;
  notification_body_text: string | null;
}

interface Site {
  id: string;
  name: string;
  slug: string;
  primary_domain: string;
  test_mode: boolean;
}

const ListiclePages: React.FC = () => {
  const [pages, setPages] = useState<ListiclePage[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [editingPage, setEditingPage] = useState<ListiclePage | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<ListiclePage>();
  const { user } = useAuth();

  useEffect(() => {
    fetchPages();
    fetchSites();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase.from('listicle_pages').select('*');
    if (error) console.error('Error fetching pages:', error);
    else setPages(data || []);
  };

  const fetchSites = async () => {
    const { data, error } = await supabase.from('sites').select('id, name, slug, primary_domain, test_mode');
    if (error) console.error('Error fetching sites:', error);
    else setSites(data || []);
  };

  const onSubmit = async (data: ListiclePage) => {
    try {
      if (editingPage) {
        const { error } = await supabase
          .from('listicle_pages')
          .update(data)
          .eq('id', editingPage.id);
        if (error) throw error;
      } else {
        const newPage = {
          ...data,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          created_by: user?.id,
        };
        const { error } = await supabase.from('listicle_pages').insert(newPage);
        if (error) throw error;
      }
      fetchPages();
      setEditingPage(null);
      reset();
    } catch (error) {
      console.error('Error saving listicle page:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleEdit = (page: ListiclePage) => {
    setEditingPage(page);
    Object.keys(page).forEach((key) => {
      setValue(key as keyof ListiclePage, page[key as keyof ListiclePage]);
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('listicle_pages').delete().eq('id', id);
    if (error) console.error('Error deleting page:', error);
    else fetchPages();
  };

  const handleDuplicate = async (page: ListiclePage) => {
    const { id, created_at, updated_at, ...pageData } = page;
    const newPage = {
      ...pageData,
      id: uuidv4(),
      title: `${page.title} (Copy)`,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('listicle_pages').insert(newPage);
    if (error) console.error('Error duplicating page:', error);
    else fetchPages();
  };

  const handleOpenUrl = (page: ListiclePage) => {
    const site = sites.find(s => s.id === page.site_id);
    if (site) {
      const baseUrl = window.location.origin;
      const url = site.test_mode
        ? `${baseUrl}/${site.slug}/${page.slug}`
        : `https://${site.primary_domain}/${page.slug}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Listicle Pages</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input {...register('title')} placeholder="Title" className="p-2 border rounded" required />
          <input {...register('slug')} placeholder="Slug" className="p-2 border rounded" required />
          <textarea {...register('description')} placeholder="Description" className="p-2 border rounded" rows={3} />
          <select {...register('site_id')} className="p-2 border rounded">
            <option value="">Select a site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
          <input {...register('language')} placeholder="Language" className="p-2 border rounded" />
          <input {...register('users_text')} placeholder="Users Text" className="p-2 border rounded" />
          
          {/* FAQ Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-2">FAQs</h3>
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="mb-2">
                <input {...register(`faq${num}` as keyof ListiclePage)} placeholder={`FAQ ${num}`} className="p-2 border rounded w-full mb-1" />
                <textarea {...register(`faq${num}_answer` as keyof ListiclePage)} placeholder={`FAQ ${num} Answer`} className="p-2 border rounded w-full" rows={2} />
              </div>
            ))}
          </div>

          {/* Overlay Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-2">Overlay</h3>
            <input {...register('overlay_heading')} placeholder="Overlay Heading" className="p-2 border rounded w-full mb-2" />
            <input {...register('overlay_deal_title')} placeholder="Overlay Deal Title" className="p-2 border rounded w-full mb-2" />
            <input {...register('overlay_subheading')} placeholder="Overlay Subheading" className="p-2 border rounded w-full mb-2" />
            <textarea {...register('overlay_description')} placeholder="Overlay Description" className="p-2 border rounded w-full mb-2" rows={3} />
            <input {...register('overlay_button_text')} placeholder="Overlay Button Text" className="p-2 border rounded w-full mb-2" />
          </div>

          {/* Notification Section */}
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-2">Notification</h3>
            <input {...register('notification_deal_title')} placeholder="Notification Deal Title" className="p-2 border rounded w-full mb-2" />
            <textarea {...register('notification_body_text')} placeholder="Notification Body Text" className="p-2 border rounded w-full mb-2" rows={3} />
          </div>
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingPage ? 'Update Page' : 'Create Page'}
        </button>
        {editingPage && (
          <button
            type="button"
            onClick={() => {
              setEditingPage(null);
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
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Slug</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Language</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.id}>
              <td className="py-2 px-4 border-b">{page.title}</td>
              <td className="py-2 px-4 border-b">{page.slug}</td>
              <td className="py-2 px-4 border-b">{page.description}</td>
              <td className="py-2 px-4 border-b">{page.language}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(page)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="mr-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => handleDuplicate(page)}
                  className="mr-2 text-green-500 hover:text-green-700"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={() => handleOpenUrl(page)}
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

export default ListiclePages;
