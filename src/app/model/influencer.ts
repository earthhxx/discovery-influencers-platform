export interface Influencer {
  record_id: string;
  record_type: string | null;
  full_name: string | null;
  preferred_name: string | null;
  gender: string | null;
  birth_date: string | null; // date จาก PostgreSQL -> string
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  occupation: string | null;
  influencer_category: string | null;
  primary_platform: string | null;
  followers_count: number | null;
  total_followers_count: number | null;
  engagement_rate: number | null;
  engagement_rate_tier: string | null;
  interests: string | null;
  notes: string | null;
  secondary_platform: string | null;
  secondary_followers_count: number | null;
  average_monthly_reach: number | null;
  collaboration_status: string | null;
  languages: string | null;
  portfolio_url: string | null;
  last_contact_date: string | null;
}
