import React from 'react';
import { Site, ListiclePage, ListicleItem } from '../types';

interface DefaultThemeProps {
  site: Site;
  page: ListiclePage;
  items: ListicleItem[];
}

const DefaultTheme: React.FC<DefaultThemeProps> = ({ site, page, items }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{site.name}</h1>
        {site.site_logo && <img src={site.site_logo} alt={site.name} className="h-16 mt-4" />}
      </header>
      <main>
        <h2 className="text-2xl font-semibold mb-4">{page.title}</h2>
        <p className="mb-8">{page.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-md">
              <img src={item.logo_url} alt={item.title} className="h-16 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="mb-4">{item.description}</p>
              <a
                href={item.button_url}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {item.button_text}
              </a>
            </div>
          ))}
        </div>
      </main>
      <footer className="mt-16 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} {site.name}</p>
      </footer>
    </div>
  );
};

export default DefaultTheme;