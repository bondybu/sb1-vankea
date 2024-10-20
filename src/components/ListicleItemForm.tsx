import React from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ListicleItemFormProps {
  pageId: string;
}

const ListicleItemForm: React.FC<ListicleItemFormProps> = ({ pageId }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();

  const createListicleItem = async (data: any) => {
    try {
      const itemData = {
        ...data,
        page_id: pageId,
        created_by: user?.id,
        dial1: data.dial1 ? parseFloat(data.dial1) : null,
        dial2: data.dial2 ? parseFloat(data.dial2) : null,
        dial3: data.dial3 ? parseFloat(data.dial3) : null,
        dial4: data.dial4 ? parseFloat(data.dial4) : null,
        dial5: data.dial5 ? parseFloat(data.dial5) : null,
        discount_amount: data.discount_amount ? parseFloat(data.discount_amount) : null,
        visitors_count: data.visitors_count ? parseInt(data.visitors_count) : 0,
        savings_compared_to: data.savings_compared_to ? parseFloat(data.savings_compared_to) : null,
      };

      const { data: item, error } = await supabase
        .from('listicle_items')
        .insert([itemData])
        .select();

      if (error) throw error;
      console.log('Listicle item created:', item);
      navigate(`/pages/${pageId}`);
    } catch (error) {
      console.error('Error creating listicle item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(createListicleItem)} className="space-y-4">
      {/* Existing fields */}
      {/* ... */}

      <div>
        <label htmlFor="dial4" className="block text-sm font-medium text-gray-700">Dial 4 (%)</label>
        <input
          type="number"
          id="dial4"
          step="0.01"
          {...register("dial4")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="dial5" className="block text-sm font-medium text-gray-700">Dial 5 (%)</label>
        <input
          type="number"
          id="dial5"
          step="0.01"
          {...register("dial5")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="dial4_text" className="block text-sm font-medium text-gray-700">Dial 4 Text</label>
        <input
          type="text"
          id="dial4_text"
          {...register("dial4_text")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="dial5_text" className="block text-sm font-medium text-gray-700">Dial 5 Text</label>
        <input
          type="text"
          id="dial5_text"
          {...register("dial5_text")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="savings_compared_to" className="block text-sm font-medium text-gray-700">Savings Compared To</label>
        <input
          type="number"
          id="savings_compared_to"
          step="0.01"
          {...register("savings_compared_to")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Listicle Item
      </button>
    </form>
  );
};

export default ListicleItemForm;