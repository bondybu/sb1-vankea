export interface Site {
  id: string;
  name: string;
  slug: string;
  primary_domain: string;
  additional_domains: string[] | null;
  theme: string | null;
  language: string | null;
  test_mode: boolean;
  site_logo: string | null;
}

export interface ListiclePage {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  description: string;
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

export interface ListicleItem {
  id: string;
  page_id: string;
  title: string;
  description: string;
  logo_url: string;
  button_text: string;
  button_url: string;
  order_index: number;
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
  visitors_count: number;
  savings_compared_to: number | null;
}