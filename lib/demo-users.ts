export const DEMO_USERS = [
  {
    id: 'demo-bank-001',
    email: 'demo@firstnational.com',
    password: 'Demo1234!',
    name: 'First National Bank',
    organizationId: 'demo-org-bank-001',
    organization: {
      id: 'demo-org-bank-001',
      name: 'First National Bank',
      country: 'United States',
      type: 'BANK',
      legalEntityName: 'First National Bank Corp.',
      website: 'https://firstnational.demo',
      blockchain: 'ETHEREUM',
    },
  },
  {
    id: 'demo-fund-002',
    email: 'demo@apexcapital.com',
    password: 'Demo1234!',
    name: 'Apex Capital Fund',
    organizationId: 'demo-org-fund-002',
    organization: {
      id: 'demo-org-fund-002',
      name: 'Apex Capital Fund',
      country: 'United Kingdom',
      type: 'HEDGE_FUND',
      legalEntityName: 'Apex Capital Management Ltd.',
      website: 'https://apexcapital.demo',
      blockchain: 'POLYGON',
    },
  },
  {
    id: 'demo-re-003',
    email: 'demo@proptech.com',
    password: 'Demo1234!',
    name: 'PropTech Ventures',
    organizationId: 'demo-org-re-003',
    organization: {
      id: 'demo-org-re-003',
      name: 'PropTech Ventures',
      country: 'Singapore',
      type: 'REAL_ESTATE_COMPANY',
      legalEntityName: 'PropTech Ventures Pte. Ltd.',
      website: 'https://proptech.demo',
      blockchain: 'BASE',
    },
  },
] as const

export type DemoUser = (typeof DEMO_USERS)[number]
