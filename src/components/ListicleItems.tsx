import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Trash2, Copy } from 'lucide-react';

interface ListicleItem {
  id: string;
  title: string;
  description: string;
  logo_url: string;
  button_text: string;
  button_url: string;
  page_id: string;
  created_by?: string;
  dial1: number | null;
  dial2: number | null;
  dial3: number | null;
  dial4: number | null;
  dial5: number | null;
  dial1_text: string | null;
  dial2_text: string | null;
  dial3_text: string | null;
  dial4_text: string | null;
  dial5_text: string | null;
  discount_code: string | null;
  discount_amount: number | null;
  visitors_count: number | null;
  savings_compared_to: number | null;
}

const ListicleItems: React.FC = () => {
  const [items, setItems] = useState<ListicleItem[]>([]);
  const [pages, setPages] = useState<{ id: string; title: string }[]>([]);
  const [editingItem, setEditingItem] = useState<ListicleItem | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm<ListicleItem>();

  useEffect(() => {
    fetchItems();
    fetchPages();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user?.id || null);
  };

  const fetchItems = async () => {
    const { data, error } = await supabase.from('listicle_items').select('*');
    if (error) console.error('Error fetching items:', error);
    else setItems(data || []);
  };

  const fetchPages = async () => {
    const { data, error } = await supabase.from('listicle_pages').select('id, title');
    if (error) console.error('Error fetching pages:', error);
    else setPages(data || []);
  };

  const onSubmit = async (data: ListicleItem) => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    const itemData = {
      ...data,
      created_by: currentUser,
      dial1: data.dial1 ? parseFloat(data.dial1.toString()) : null,
      dial2: data.dial2 ? parseFloat(data.dial2.toString()) : null,
      dial3: data.dial3 ? parseFloat(data.dial3.toString()) : null,
      dial4: data.dial4 ? parseFloat(data.dial4.toString()) : null,
      dial5: data.dial5 ? parseFloat(data.dial5.toString()) : null,
      discount_amount: data.discount_amount ? parseFloat(data.discount_amount.toString()) : null,
      visitors_count: data.visitors_count ? parseInt(data.visitors_count.toString()) : 0,
      savings_compared_to: data.savings_compared_to ? parseFloat(data.savings_compared_to.toString()) : null,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('listicle_items')
        .update(itemData)
        .eq('id', editingItem.id);
      if (error) console.error('Error updating item:', error);
      else {
        fetchItems();
        setEditingItem(null);
      }
    } else {
      const newItem = {
        ...itemData,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('listicle_items').insert(newItem);
      if (error) console.error('Error creating item:', error);
      else fetchItems();
    }
    reset();
  };

  const handleEdit = (item: ListicleItem) => {
    setEditingItem(item);
    Object.keys(item).forEach((key) => {
      setValue(key as keyof ListicleItem, item[key as keyof ListicleItem]);
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('listicle_items').delete().eq('id', id);
    if (error) console.error('Error deleting item:', error);
    else fetchItems();
  };

  const handleDuplicate = async (item: ListicleItem) => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    const { id, created_at, updated_at, ...itemData } = item;
    const newItem = {
      ...itemData,
      id: uuidv4(),
      title: `${item.title} (Copy)`,
      created_by: currentUser,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('listicle_items').insert(newItem);
    if (error) console.error('Error duplicating item:', error);
    else fetchItems();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Listicle Items</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input {...register('title')} placeholder="Title" className="p-2 border rounded" required />
          <input {...register('description')} placeholder="Description" className="p-2 border rounded" />
          <input {...register('logo_url')} placeholder="Logo URL" className="p-2 border rounded" />
          <input {...register('button_text')} placeholder="Button Text" className="p-2 border rounded" />
          <input {...register('button_url')} placeholder="Button URL" className="p-2 border rounded" />
          <select {...register('page_id')} className="p-2 border rounded" required>
            <option value="">Select a page</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>{page.title}</option>
            ))}
          </select>
          <input {...register('dial1')} type="number" step="0.01" placeholder="Dial 1 (%)" className="p-2 border rounded" />
          <input {...register('dial2')} type="number" step="0.01" placeholder="Dial 2 (%)" className="p-2 border rounded" />
          <input {...register('dial3')} type="number" step="0.01" placeholder="Dial 3 (%)" className="p-2 border rounded" />
          <input {...register('dial4')} type="number" step="0.01" placeholder="Dial 4 (%)" className="p-2 border rounded" />
          <input {...register('dial5')} type="number" step="0.01" placeholder="Dial 5 (%)" className="p-2 border rounded" />
          <input {...register('dial1_text')} placeholder="Dial 1 Text" className="p-2 border rounded" />
          <input {...register('dial2_text')} placeholder="Dial 2 Text" className="p-2 border rounded" />
          <input {...register('dial3_text')} placeholder="Dial 3 Text" className="p-2 border rounded" />
          <input {...register('dial4_text')} placeholder="Dial 4 Text" className="p-2 border rounded" />
          <input {...register('dial5_text')} placeholder="Dial 5 Text" className="p-2 border rounded" />
          <input {...register('discount_code')} placeholder="Discount Code" className="p-2 border rounded" />
          <input {...register('discount_amount')} type="number" step="0.01" placeholder="Discount Amount" className="p-2 border rounded" />
          <input {...register('visitors_count')} type="number" placeholder="Visitors Count" className="p-2 border rounded" />
          <input {...register('savings_compared_to')} type="number" step="0.01" placeholder="Savings Compared To" className="p-2 border rounded" />
        </div>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {editingItem ? 'Update Item' : 'Create Item'}
        </button>
        {editingItem && (
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
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
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Button Text</th>
            <th className="py-2 px-4 border-b">Dials</th>
            <th className="py-2 px-4 border-b">Discount</th>
            <th className="py-2 px-4 border-b">Visitors</th>
            <th className="py-2 px-4 border-b">Savings</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b">{item.title}</td>
              <td className="py-2 px-4 border-b">{item.description}</td>
              <td className="py-2 px-4 border-b">{item.button_text}</td>
              <td className="py-2 px-4 border-b">
                {item.dial1}% / {item.dial2}% / {item.dial3}% / {item.dial4}% / {item.dial5}%
              </td>
              <td className="py-2 px-4 border-b">
                {item.discount_code} ({item.discount_amount})
              </td>
              <td className="py-2 px-4 border-b">{item.visitors_count}</td>
              <td className="py-2 px-4 border-b">{item.savings_compared_to}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(item)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mr-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => handleDuplicate(item)}
                  className="text-green-500 hover:text-green-700"
                >
                  <Copy size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListicleItems;