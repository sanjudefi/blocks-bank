// Demo data for demo organization accounts (non-ObjectId IDs)
// Returned by API routes when organizationId matches a demo org

export const DEMO_ORG_IDS = ['demo-org-bank-001', 'demo-org-fund-002', 'demo-org-re-003']

export function isDemoOrg(organizationId: string): boolean {
  return DEMO_ORG_IDS.includes(organizationId)
}

export type DemoInstrument = {
  id: string
  name: string
  type: string
  supply: number
  symbol: string
  minimumInvestment: number | null
  interestRate: number | null
  maturityDate: string | null
  status: string
  createdAt: string
}

export type DemoContract = {
  id: string
  tokenContract: string
  registryContract: string
  treasuryContract: string
  complianceContract: string
  transactionHash: string
  blockNumber: number
  instrument: { name: string; symbol: string; type: string } | null
  deployedAt: string
  network: string
}

export type DemoInvestor = {
  id: string
  name: string
  email: string
  walletAddress: string | null
  kycStatus: string
  investedAmount: number
  organizationId: string
  createdAt: string
}

export const DEMO_INSTRUMENTS: Record<string, DemoInstrument[]> = {
  'demo-org-bank-001': [
    {
      id: 'demo-inst-001',
      name: 'US Treasury Bond T-2027',
      type: 'BOND',
      supply: 5000000,
      symbol: 'USTB27',
      minimumInvestment: 100000,
      interestRate: 4.75,
      maturityDate: '2027-03-15T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-09-15T10:00:00Z',
    },
    {
      id: 'demo-inst-002',
      name: 'First National Fixed Deposit',
      type: 'FIXED_DEPOSIT',
      supply: 1000000,
      symbol: 'FNFD',
      minimumInvestment: 50000,
      interestRate: 5.25,
      maturityDate: '2025-09-15T00:00:00Z',
      status: 'DEPLOYED',
      createdAt: '2024-11-01T10:00:00Z',
    },
    {
      id: 'demo-inst-006',
      name: 'Corporate Bond Alpha 2028',
      type: 'BOND',
      supply: 2000000,
      symbol: 'CBA28',
      minimumInvestment: 75000,
      interestRate: 5.1,
      maturityDate: '2028-06-30T00:00:00Z',
      status: 'DEPLOYED',
      createdAt: '2025-01-10T10:00:00Z',
    },
  ],
  'demo-org-fund-002': [
    {
      id: 'demo-inst-003',
      name: 'Apex Global Growth Fund',
      type: 'FUND_SHARES',
      supply: 2000000,
      symbol: 'AXGF',
      minimumInvestment: 500000,
      interestRate: null,
      maturityDate: null,
      status: 'ACTIVE',
      createdAt: '2024-08-20T10:00:00Z',
    },
    {
      id: 'demo-inst-004',
      name: 'Private Credit Series B',
      type: 'PRIVATE_CREDIT',
      supply: 750000,
      symbol: 'AXPC',
      minimumInvestment: 250000,
      interestRate: 8.5,
      maturityDate: '2026-06-30T00:00:00Z',
      status: 'ACTIVE',
      createdAt: '2024-10-05T10:00:00Z',
    },
  ],
  'demo-org-re-003': [
    {
      id: 'demo-inst-005',
      name: 'Singapore Commercial REIT',
      type: 'REAL_ESTATE_ASSET',
      supply: 3000000,
      symbol: 'SGCR',
      minimumInvestment: 200000,
      interestRate: 6.2,
      maturityDate: null,
      status: 'ACTIVE',
      createdAt: '2024-07-10T10:00:00Z',
    },
    {
      id: 'demo-inst-007',
      name: 'Marina Bay Office Tower',
      type: 'REAL_ESTATE_ASSET',
      supply: 1500000,
      symbol: 'MBOT',
      minimumInvestment: 300000,
      interestRate: 5.8,
      maturityDate: null,
      status: 'DEPLOYED',
      createdAt: '2025-02-01T10:00:00Z',
    },
  ],
}

export const DEMO_CONTRACTS: Record<string, DemoContract[]> = {
  'demo-org-bank-001': [
    {
      id: 'demo-ct-001',
      tokenContract: '0xA1B2C3D4E5F6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      registryContract: '0xB2C3D4E5F6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
      treasuryContract: '0xC3D4E5F6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
      complianceContract: '0xD4E5F6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
      transactionHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      blockNumber: 21450123,
      instrument: { name: 'US Treasury Bond T-2027', symbol: 'USTB27', type: 'BOND' },
      deployedAt: '2024-09-15T12:00:00Z',
      network: 'Ethereum Sepolia',
    },
    {
      id: 'demo-ct-002',
      tokenContract: '0xE5F6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
      registryContract: '0xF6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
      treasuryContract: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
      complianceContract: '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
      transactionHash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
      blockNumber: 21580456,
      instrument: { name: 'First National Fixed Deposit', symbol: 'FNFD', type: 'FIXED_DEPOSIT' },
      deployedAt: '2024-11-01T12:00:00Z',
      network: 'Ethereum Sepolia',
    },
    {
      id: 'demo-ct-006',
      tokenContract: '0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
      registryContract: '0xd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
      treasuryContract: '0xe1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      complianceContract: '0xf2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      transactionHash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
      blockNumber: 21710789,
      instrument: { name: 'Corporate Bond Alpha 2028', symbol: 'CBA28', type: 'BOND' },
      deployedAt: '2025-01-10T12:00:00Z',
      network: 'Ethereum Sepolia',
    },
  ],
  'demo-org-fund-002': [
    {
      id: 'demo-ct-003',
      tokenContract: '0xa3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      registryContract: '0xb4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
      treasuryContract: '0xc5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
      complianceContract: '0xd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      transactionHash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      blockNumber: 53120456,
      instrument: { name: 'Apex Global Growth Fund', symbol: 'AXGF', type: 'FUND_SHARES' },
      deployedAt: '2024-08-20T12:00:00Z',
      network: 'Polygon Amoy',
    },
    {
      id: 'demo-ct-004',
      tokenContract: '0xe7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
      registryContract: '0xf8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
      treasuryContract: '0xa9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      complianceContract: '0xb0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
      transactionHash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
      blockNumber: 53340789,
      instrument: { name: 'Private Credit Series B', symbol: 'AXPC', type: 'PRIVATE_CREDIT' },
      deployedAt: '2024-10-05T12:00:00Z',
      network: 'Polygon Amoy',
    },
  ],
  'demo-org-re-003': [
    {
      id: 'demo-ct-005',
      tokenContract: '0xc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
      registryContract: '0xd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
      treasuryContract: '0xe3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
      complianceContract: '0xf4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3',
      transactionHash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
      blockNumber: 8920456,
      instrument: { name: 'Singapore Commercial REIT', symbol: 'SGCR', type: 'REAL_ESTATE_ASSET' },
      deployedAt: '2024-07-10T12:00:00Z',
      network: 'Base Sepolia',
    },
    {
      id: 'demo-ct-007',
      tokenContract: '0xa5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4',
      registryContract: '0xb6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
      treasuryContract: '0xc7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
      complianceContract: '0xd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
      transactionHash: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      blockNumber: 9150789,
      instrument: { name: 'Marina Bay Office Tower', symbol: 'MBOT', type: 'REAL_ESTATE_ASSET' },
      deployedAt: '2025-02-01T12:00:00Z',
      network: 'Base Sepolia',
    },
  ],
}

export const DEMO_INVESTORS: Record<string, DemoInvestor[]> = {
  'demo-org-bank-001': [
    { id: 'demo-inv-001', name: 'BlackRock Institutional', email: 'invest@blackrock.demo', walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', kycStatus: 'APPROVED', investedAmount: 25000000, organizationId: 'demo-org-bank-001', createdAt: '2024-09-20T10:00:00Z' },
    { id: 'demo-inv-002', name: 'Vanguard Asset Management', email: 'ops@vanguard.demo', walletAddress: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72', kycStatus: 'APPROVED', investedAmount: 15000000, organizationId: 'demo-org-bank-001', createdAt: '2024-10-05T10:00:00Z' },
    { id: 'demo-inv-003', name: 'State Street Global', email: 'global@ssga.demo', walletAddress: '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB', kycStatus: 'APPROVED', investedAmount: 10000000, organizationId: 'demo-org-bank-001', createdAt: '2024-10-18T10:00:00Z' },
    { id: 'demo-inv-004', name: 'Fidelity Investments', email: 'institutional@fidelity.demo', walletAddress: null, kycStatus: 'PENDING', investedAmount: 5000000, organizationId: 'demo-org-bank-001', createdAt: '2024-11-12T10:00:00Z' },
    { id: 'demo-inv-005', name: 'PIMCO Advisors', email: 'ops@pimco.demo', walletAddress: '0x583031D1113aD414F02576BD6afaBfb302140225', kycStatus: 'APPROVED', investedAmount: 8000000, organizationId: 'demo-org-bank-001', createdAt: '2024-12-01T10:00:00Z' },
  ],
  'demo-org-fund-002': [
    { id: 'demo-inv-006', name: 'Singapore GIC', email: 'funds@gic.demo', walletAddress: '0xdD870fA1b7C4700F2BD7f44238821C26f7392148', kycStatus: 'APPROVED', investedAmount: 50000000, organizationId: 'demo-org-fund-002', createdAt: '2024-08-25T10:00:00Z' },
    { id: 'demo-inv-007', name: 'Abu Dhabi Investment', email: 'invest@adia.demo', walletAddress: '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C', kycStatus: 'APPROVED', investedAmount: 75000000, organizationId: 'demo-org-fund-002', createdAt: '2024-09-10T10:00:00Z' },
    { id: 'demo-inv-008', name: 'Norges Bank IM', email: 'external@nbim.demo', walletAddress: null, kycStatus: 'REVIEW', investedAmount: 30000000, organizationId: 'demo-org-fund-002', createdAt: '2024-10-20T10:00:00Z' },
  ],
  'demo-org-re-003': [
    { id: 'demo-inv-009', name: 'Temasek Holdings', email: 'realty@temasek.demo', walletAddress: '0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c', kycStatus: 'APPROVED', investedAmount: 40000000, organizationId: 'demo-org-re-003', createdAt: '2024-07-15T10:00:00Z' },
    { id: 'demo-inv-010', name: 'CapitaLand Investment', email: 'invest@capitaland.demo', walletAddress: '0x4AD7F279Af6b6e3c4d5f8a9b0c1d2e3f4a5b6c7d', kycStatus: 'APPROVED', investedAmount: 25000000, organizationId: 'demo-org-re-003', createdAt: '2024-08-05T10:00:00Z' },
    { id: 'demo-inv-011', name: 'Mapletree Investments', email: 'funds@mapletree.demo', walletAddress: null, kycStatus: 'PENDING', investedAmount: 12000000, organizationId: 'demo-org-re-003', createdAt: '2024-09-30T10:00:00Z' },
    { id: 'demo-inv-012', name: 'ESR Cayman', email: 'ap@esr.demo', walletAddress: '0x5BdB3f7a2c1e0d9b8a7f6e5d4c3b2a1f0e9d8c7b', kycStatus: 'APPROVED', investedAmount: 18000000, organizationId: 'demo-org-re-003', createdAt: '2024-11-20T10:00:00Z' },
  ],
}

export function getDemoDashboard(organizationId: string) {
  const instruments = DEMO_INSTRUMENTS[organizationId] ?? []
  const contracts = DEMO_CONTRACTS[organizationId] ?? []
  const investors = DEMO_INVESTORS[organizationId] ?? []
  const totalSupply = instruments.reduce((acc, i) => acc + i.supply, 0)
  return {
    stats: {
      totalInstruments: instruments.length,
      totalSupply: totalSupply > 1_000_000 ? `${(totalSupply / 1_000_000).toFixed(1)}M` : totalSupply > 1_000 ? `${(totalSupply / 1_000).toFixed(1)}K` : String(totalSupply),
      totalInvestors: investors.length,
      assetsUnderManagement: `$${(instruments.length * 50_000_000 / 1_000_000).toFixed(1)}M`,
    },
    instruments,
    contracts,
    investors,
  }
}
