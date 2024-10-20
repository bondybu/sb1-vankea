import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DefaultTheme from '../themes/DefaultTheme';
import { Site, ListiclePage, ListicleItem } from '../types';

interface PublicSiteProps {
  site: Site;
}

const PublicSite: React.FC<PublicSiteProps> = ({ site }) => {
  const location = useLocation();
  const [page, setPage] = useState<ListiclePage | null>(null);
  const [items, setItems] = useState<ListicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageAndItems = async () => {
      try {
        console.log('Current location:', location.pathname);
        console.log('Current site:', site);

        let slug = location.pathname.split('/').filter(Boolean)[1];
        console.log('Extracted slug:', slug);

        if (!slug) {
          console.log('No page specified, showing site homepage');
          // TODO: Implement site homepage logic
          setLoading(false);
          return;
        }

        console.log('Fetching page data for slug:', slug);
        const { data: pageData, error: pageError } = await supabase
          .from('listicle_pages')
          .select('*')
          .eq('site_id', site.id)
          .eq('slug', slug)
          .single();

        if (pageError) throw pageError;
        console.log('Page data fetched:', pageData);
        setPage(pageData);

        console.log('Fetching items for page:', pageData.id);
        const { data: itemsData, error: itemsError } = await supabase
          .from('listicle_items')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index', { ascending: true });

        if (itemsError) throw itemsError;
        console.log('Items fetched:', itemsData);
        setItems(itemsData);
      } catch (error) {
        console.error('Error fetching page and items:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPageAndItems();
  }, [site.id, location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!page) {
    return <div>Page not found</div>;
  }

  console.log('Rendering PublicSite component');
  console.log('Current page:', page);
  console.log('Current items:', items);

  // Use the appropriate theme component based on the site's theme setting
  const ThemeComponent = site.theme === 'default' ? DefaultTheme : DefaultTheme;

  return <ThemeComponent site={site} page={page} items={items} />;
};

export default PublicSite;