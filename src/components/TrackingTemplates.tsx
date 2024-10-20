import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2 } from 'lucide-react';

interface TrackingTemplate {
  id: string;
  name: string;
  template: string;
}

const TrackingTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<TrackingTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<TrackingTemplate | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<TrackingTemplate>();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase.from('tracking_templates').select('*');
    if (error) console.error('Error fetching tracking templates:', error);
    else setTemplates(data || []);
  };

  const onSubmit = async (data: TrackingTemplate) => {
    if (editingTemplate) {
      const { error } = await supabase
        .from('tracking_templates')
        .update(data)
        .eq('id', editingTemplate.id);
      if (error) console.error('Error updating tracking template:', error);
      else {
        fetchTemplates();
        setEditingTemplate(null);
      }
    } else {
      const newTemplate = {
        ...data,
        id: uuidv4(),
      };
      const { error } = await supabase.from('tracking_templates').insert(newTemplate);
      if (error) console.error('Error creating tracking template:', error);
      else fetchTemplates();
    }
    reset();
  };

  const handleEdit = (template: TrackingTemplate) => {
    setEditingTemplate(template);
    Object.keys(template).forEach((key) => {
      setValue(key as keyof TrackingTemplate, template[key as keyof TrackingTemplate]);
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tracking_templates').delete().eq('id', id);
    if (error) console.error('Error deleting tracking template:', error);
    else fetchTemplates();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tracking Templates</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-1 gap-4">
          <input {...register('name')} placeholder="Template Name" className="p-2 border rounded" required />
          <textarea
            {...register('template')}
            placeholder="Template (e.g., ?msclkid=[msclkid]&gclid=[gclid]&custom1=[custom1])"
            className="p-2 border rounded"
            rows={4}
            required
          />
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingTemplate ? 'Update Template' : 'Create Template'}
        </button>
        {editingTemplate && (
          <button
            type="button"
            onClick={() => {
              setEditingTemplate(null);
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
            <th className="py-2 px-4 border-b">Template</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td className="py-2 px-4 border-b">{template.name}</td>
              <td className="py-2 px-4 border-b">{template.template}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(template)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
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

export default TrackingTemplates;