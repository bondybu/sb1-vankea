-- Conversions table
CREATE TABLE conversions (
    id uuid PRIMARY KEY,
    timestamp timestamp with time zone,
    conversion_value numeric(10,2),
    short_link_id uuid REFERENCES short_links(id) ON DELETE CASCADE,
    postback_data jsonb,
    subid text
);

-- Custom parameters table
CREATE TABLE custom_parameters (
    id uuid PRIMARY KEY,
    tracking_settings_id uuid REFERENCES tracking_settings(id) ON DELETE CASCADE,
    parameter_name text NOT NULL,
    parameter_slug text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Link clicks table
CREATE TABLE link_clicks (
    id uuid PRIMARY KEY,
    short_link_id uuid REFERENCES short_links(id) ON DELETE CASCADE,
    subid text,
    ip_address inet,
    user_agent text,
    referrer text,
    timestamp timestamp with time zone DEFAULT now(),
    custom_parameters jsonb
);

-- Listicle items table
CREATE TABLE listicle_items (
    id uuid PRIMARY KEY,
    page_id uuid REFERENCES listicle_pages(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    logo_url text,
    button_text text,
    button_url text,
    order_index integer,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    dial1 numeric,
    dial2 numeric,
    dial3 numeric,
    dial4 numeric,
    dial5 numeric,
    dial1_text text,
    dial2_text text,
    dial3_text text,
    dial4_text text,
    dial5_text text,
    discount_code text,
    discount_amount numeric,
    visitors_count integer DEFAULT 0,
    savings_compared_to numeric
);

-- Listicle pages table
CREATE TABLE listicle_pages (
    id uuid PRIMARY KEY,
    site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    faq1 text,
    faq1_answer text,
    faq2 text,
    faq2_answer text,
    faq3 text,
    faq3_answer text,
    faq4 text,
    faq4_answer text,
    faq5 text,
    faq5_answer text,
    language text,
    users_text text,
    overlay_heading text,
    overlay_deal_title text,
    overlay_subheading text,
    overlay_description text,
    overlay_button_text text,
    notification_deal_title text,
    notification_body_text text,
    UNIQUE (site_id, slug)
);

-- Postback settings table
CREATE TABLE postback_settings (
    id uuid PRIMARY KEY,
    site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
    postback_url text NOT NULL,
    tracking_template_id uuid REFERENCES tracking_templates(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Short links table
CREATE TABLE short_links (
    id uuid PRIMARY KEY,
    original_url text NOT NULL,
    short_code text NOT NULL,
    listicle_item_id uuid REFERENCES listicle_items(id) ON DELETE SET NULL,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tracking_template_id uuid REFERENCES tracking_templates(id) ON DELETE SET NULL,
    site_id uuid REFERENCES sites(id) ON DELETE SET NULL,
    UNIQUE (short_code),
    UNIQUE (short_code, site_id)
);

-- Sites table
CREATE TABLE sites (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    primary_domain text UNIQUE,
    additional_domains text[],
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    theme text,
    language text,
    menu_item1 text,
    menu_item1_url uuid REFERENCES listicle_pages(id) ON DELETE SET NULL,
    menu_item2 text,
    menu_item2_url uuid REFERENCES listicle_pages(id) ON DELETE SET NULL,
    menu_item3 text,
    menu_item3_url uuid REFERENCES listicle_pages(id) ON DELETE SET NULL,
    menu_item4 text,
    menu_item4_url uuid REFERENCES listicle_pages(id) ON DELETE SET NULL,
    menu_item5 text,
    menu_item5_url uuid REFERENCES listicle_pages(id) ON DELETE SET NULL,
    site_logo text,
    footer_item1 text,
    footer_item1_content text,
    footer_item1_url text,
    footer_item2 text,
    footer_item2_content text,
    footer_item2_url text,
    footer_item3 text,
    footer_item3_content text,
    footer_item3_url text,
    test_mode boolean NOT NULL DEFAULT false
);

-- Tracking settings table
CREATE TABLE tracking_settings (
    id uuid PRIMARY KEY,
    site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
    listicle_page_id uuid REFERENCES listicle_pages(id) ON DELETE CASCADE,
    listicle_item_id uuid REFERENCES listicle_items(id) ON DELETE CASCADE,
    use_msclkid boolean DEFAULT false,
    use_gclid boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Tracking templates table
CREATE TABLE tracking_templates (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    template text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);