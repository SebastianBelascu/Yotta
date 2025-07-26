export interface Tool {
  id: string;
  name: string;
  tagline?: string;
  categories: string[];
  description?: string;
  problem_solved?: string;
  best_for: string[];
  features: string[];
  pros: string[];
  cons: string[];
  pricing_model?: string;
  starting_price?: number;
  currency: 'MYR' | 'SGD' | 'USD' | 'GBP';
  platforms_supported: string[];
  regions: string[];
  logo_url?: string;
  banner_url?: string;
  affiliate_link?: string;
  free_trial_available?: boolean;
  integrations?: string[];
  published: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateToolData {
  name: string;
  tagline?: string;
  categories: string[];
  description?: string;
  problem_solved?: string;
  best_for: string[];
  features: string[];
  pros: string[];
  cons: string[];
  pricing_model?: string;
  starting_price?: number;
  currency: 'MYR' | 'SGD' | 'USD' | 'GBP';
  platforms_supported: string[];
  regions: string[];
  logo_url?: string;
  banner_url?: string;
  affiliate_link?: string;
  free_trial_available?: boolean;
  integrations?: string[];
  published: boolean;
}

export interface UpdateToolData extends Partial<CreateToolData> {
  id: string;
}

export const TOOL_CATEGORIES = [
  'Productivity',
  'Design',
  'Development',
  'Marketing',
  'Analytics',
  'Communication',
  'Project Management',
  'E-commerce',
  'Finance',
  'HR',
  'Customer Support',
  'Social Media',
  'SEO',
  'Content Creation',
  'Automation',
  'Security',
  'Education',
  'Health & Fitness',
  'Travel',
  'Entertainment'
];

export const PRICING_MODELS = [
  'Free',
  'Freemium',
  'One-time Purchase',
  'Monthly Subscription',
  'Annual Subscription',
  'Usage-based',
  'Pay As You Go',
  'Tiered Pricing',
  'Enterprise',
  'Trial Available'
];

export const PLATFORMS = [
  'Web',
  'iOS',
  'Android',
  'Windows',
  'macOS',
  'Linux',
  'Chrome Extension',
  'API'
];

export const REGIONS = [
  'Malaysia',
  'Singapore',
  'Global',
  'Australia'
];

export const BEST_FOR_OPTIONS = [
  'Solopreneurs',
  'Startups',
  'SMEs',
  'Agencies',
  'Remote Teams',
  'Enterprise',
  'Freelancers',
  'Developers'
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'MYR', label: 'MYR (RM)' },
  { value: 'SGD', label: 'SGD (S$)' },
  { value: 'GBP', label: 'GBP (£)' }
];
