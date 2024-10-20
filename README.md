# VPN Listicle Admin

## Project Overview

VPN Listicle Admin is a comprehensive content management system (CMS) designed for managing VPN comparison listicles. This admin area provides a user-friendly interface for creating, editing, and managing listicle pages, items, short links, sites, and advanced tracking features.

## Features

1. **Authentication**
   - Secure login system for admin access
   - Protected routes to ensure only authenticated users can access the admin area

2. **Listicle Pages Management**
   - Create, read, update, and delete listicle pages
   - Set custom slugs for SEO-friendly URLs
   - Associate pages with specific sites
   - Manage FAQ sections, overlay content, and notification settings
   - Support for multiple languages

3. **Listicle Items Management**
   - Create, read, update, and delete listicle items (VPN entries)
   - Add details such as title, description, logo URL, and call-to-action buttons
   - Manage multiple rating dials (up to 5) and their associated text
   - Track discount codes, amounts, and visitor counts
   - Calculate and display savings compared to competitors

4. **Short Links Management**
   - Create and manage short links for tracking purposes
   - Generate random short codes or set custom ones
   - Associate short links with listicle items and tracking templates
   - Support for site-specific and global short links

5. **Sites Management**
   - Create and manage multiple sites
   - Set primary domain and multiple additional domains for each site
   - Organize listicle pages under different sites
   - Manage site-specific settings like theme, language, and menu items
   - Configure footer content and links

6. **Advanced Tracking Features**
   - Tracking Settings: Configure msclkid and gclid usage for sites, pages, or items
   - Tracking Templates: Create and manage URL templates for advanced tracking
   - Postback Settings: Set up postback URLs for conversion tracking
   - Custom Parameters: Add and manage up to 5 custom tracking parameters

7. **Multi-Domain Support**
   - Assign multiple domains to a single site
   - Automatic routing based on accessed domain
   - Unique domain validation across all sites

8. **Responsive Design**
   - User-friendly interface that works well on desktop and mobile devices

9. **Help Section**
   - Comprehensive guide on how to use tracking features
   - Examples of tracking templates and postback URL setups
   - Instructions for domain setup and management

## Tech Stack

- **Frontend:**
  - React 18.3.1
  - TypeScript
  - Vite 5.4.2 (for fast development and optimized production builds)
  - React Router 6.22.3 (for routing)
  - React Hook Form 7.51.0 (for form handling)
  - Tailwind CSS 3.4.1 (for styling)
  - Lucide React 0.344.0 (for icons)

- **Backend:**
  - Supabase (for database and authentication)

- **State Management:**
  - React Hooks (useState, useEffect)

- **Other Libraries:**
  - UUID 9.0.1 (for generating unique identifiers)

## Project Structure

```
/src
  /components
    AdminDashboard.tsx
    ListicleItems.tsx
    ListiclePages.tsx
    Login.tsx
    PrivateRoute.tsx
    ShortLinks.tsx
    Sites.tsx
    TrackingSettings.tsx
    TrackingTemplates.tsx
    PostbackSettings.tsx
    Help.tsx
    PublicSite.tsx
  /lib
    supabase.ts
  App.tsx
  index.css
  main.tsx
.env
package.json
README.md
netlify.toml
```

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the project root
   - Add Supabase URL and Anon Key:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
4. Run the development server: `npm run dev`

## Deployment

The project is configured for deployment on Netlify. The `netlify.toml` file includes the build command and publish directory settings. To deploy:

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the `netlify.toml` configuration
3. Set up the required environment variables in Netlify's dashboard
4. For custom domains, configure DNS settings and add domains in Netlify's site settings

## Usage

1. Access the login page and authenticate with admin credentials
2. Navigate through the sidebar to manage different aspects of the CMS:
   - Listicle Pages: Create and manage comparison pages
   - Listicle Items: Add and edit VPN entries
   - Short Links: Create and manage tracking links
   - Sites: Set up and configure different sites with multiple domains
   - Tracking Settings: Configure tracking parameters for sites, pages, or items
   - Tracking Templates: Create and manage URL templates for advanced tracking
   - Postback Settings: Set up postback URLs for conversion tracking
   - Help: Access information on how to use the tracking features and set up domains

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your proposed changes.

## License

[MIT License](https://opensource.org/licenses/MIT)