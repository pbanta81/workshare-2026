// Company-specific dynamic content
// Each company gets their own welcome image and branding
// Maps to password via PORTFOLIO_X_SLUG env vars

export interface CompanyConfig {
  welcomeImage: string;
  welcomeCompany: string;
  color: string;
}

export const companies: Record<string, CompanyConfig> = {
  'test-portfolio': {
    welcomeImage: '/welcome-ansi.png',
    welcomeCompany: 'CompanyName',
    color: '#FF2F00',
  },
  // Add more companies here:
  // 'acme-corp': {
  //   welcomeImage: '/welcome-acme.png',
  //   welcomeCompany: 'Acme Corp',
  //   color: '#22d3ee',
  // },
};

export function getCompanyConfig(slug: string): CompanyConfig | null {
  return companies[slug] || null;
}

