import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Help: Using Tracking Features and Domain Setup</h2>
      
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Tracking Features</h3>
        <h4 className="text-lg font-medium mt-4 mb-2">1. Tracking Settings</h4>
        <p>Tracking settings allow you to configure which parameters to use for tracking at different levels:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>Site-wide: Apply to all pages and items within a site</li>
          <li>Page-specific: Apply to a specific listicle page</li>
          <li>Item-specific: Apply to a specific listicle item</li>
        </ul>
        <p className="mt-2">You can enable or disable msclkid and gclid tracking, and add up to 5 custom parameters.</p>

        <h4 className="text-lg font-medium mt-4 mb-2">2. Tracking Templates</h4>
        <p>Tracking templates define the structure of your tracking URLs. Example:</p>
        <pre className="bg-gray-100 p-2 rounded mt-2">
          ?msclkid=[msclkid]&gclid=[gclid]&custom1=[custom1]&custom2=[custom2]
        </pre>
        <p className="mt-2">Use placeholders like [parameter_name] in your templates.</p>

        <h4 className="text-lg font-medium mt-4 mb-2">3. Short Links</h4>
        <p>Create short, trackable links for your listicle items:</p>
        <ol className="list-decimal pl-5 mt-2">
          <li>Go to the Short Links section</li>
          <li>Enter the original URL and optionally customize the short code</li>
          <li>Associate with a listicle item and tracking template if desired</li>
          <li>Save the short link</li>
        </ol>

        <h4 className="text-lg font-medium mt-4 mb-2">4. Postback Settings</h4>
        <p>Set up postback URLs to track conversions:</p>
        <ol className="list-decimal pl-5 mt-2">
          <li>Go to the Postback Settings section</li>
          <li>Enter the postback URL provided by your affiliate network</li>
          <li>Associate with a site and tracking template</li>
          <li>Save the postback setting</li>
        </ol>
        <p className="mt-2">The system will automatically send conversion data to the specified URL when a conversion occurs.</p>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Domain Setup</h3>
        <p>The VPN Listicle Admin now supports multiple domains for each site. Here's how to set up and manage domains:</p>
        <ol className="list-decimal pl-5 mt-2">
          <li>Go to the Sites management section.</li>
          <li>When creating or editing a site, you'll see fields for Primary Domain and Additional Domains.</li>
          <li>Set the main domain for your site in the Primary Domain field.</li>
          <li>Add any additional domains in the Additional Domains section. You can add multiple domains here.</li>
          <li>The system will ensure that all domains (primary and additional) are unique across all sites.</li>
          <li>To use a custom domain:
            <ul className="list-disc pl-5 mt-1">
              <li>Set up DNS records for your domain, pointing to your Netlify site.</li>
              <li>In your Netlify settings, add the custom domain to your site configuration.</li>
              <li>Netlify will automatically provision SSL certificates for your domains.</li>
            </ul>
          </li>
        </ol>
        <p className="mt-2">Remember, each domain must be unique across all sites in the system. The application will automatically route requests to the appropriate site based on the accessed domain.</p>
      </section>
    </div>
  );
};

export default Help;