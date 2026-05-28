/**
 * Column definitions for the comparison table.
 * Each field drives a table column header, filter UI, and cell rendering.
 *
 * Types:
 *   "enum"  — dropdown filter with predefined values
 *   "text"  — free-text substring filter
 *   "tax"   — special: supports "none", "ordinary rates", or numeric %
 */

export const COMPARISON_FIELDS = [
  { key: 'classification', label: 'Legal Classification', type: 'enum', values: ['property', 'commodity', 'security', 'virtual asset', 'currency', 'unclassified'], group: 'core' },
  { key: 'legalTender', label: 'Legal Tender', type: 'enum', values: ['yes', 'no', 'limited'], group: 'core' },
  { key: 'dedicatedLaw', label: 'Dedicated Crypto Law', type: 'enum', values: ['yes', 'no', 'in progress'], group: 'core' },
  { key: 'primaryRegulator', label: 'Primary Regulator(s)', type: 'text', group: 'core' },
  { key: 'vaspLicensing', label: 'VASP/CASP Licensing', type: 'enum', values: ['yes', 'no'], group: 'licensing' },
  { key: 'capitalGainsTax', label: 'Capital Gains Tax', type: 'tax', group: 'tax' },
  { key: 'taxableEvents', label: 'Taxable Events', type: 'text', group: 'tax' },
  { key: 'airdropTaxed', label: 'Airdrops Taxed', type: 'enum', values: ['yes', 'no', 'unclear'], group: 'tax' },
  { key: 'miningStakingTaxed', label: 'Mining/Staking Taxed', type: 'enum', values: ['yes', 'no', 'unclear'], group: 'tax' },
  { key: 'stablecoinRegulation', label: 'Stablecoin Regulation', type: 'enum', values: ['yes', 'no', 'pending'], group: 'regulation' },
  { key: 'defiAddressed', label: 'DeFi Addressed', type: 'enum', values: ['yes', 'partially', 'no'], group: 'regulation' },
  { key: 'privacyTokensBanned', label: 'Privacy Tokens Banned', type: 'enum', values: ['yes', 'no'], group: 'regulation' },
  { key: 'govAcceptsCrypto', label: 'Gov Accepts Crypto', type: 'enum', values: ['yes', 'no'], group: 'adoption' },
  { key: 'bankIntegration', label: 'Bank-Crypto Integration', type: 'enum', values: ['allowed', 'neutral', 'prohibited'], group: 'adoption' },
  { key: 'cbdcStatus', label: 'CBDC Status', type: 'enum', values: ['live', 'pilot', 'research', 'paused', 'none'], group: 'adoption' },
  { key: 'travelRule', label: 'Travel Rule', type: 'enum', values: ['yes', 'partial', 'no'], group: 'compliance' },
];

export const FIELD_GROUPS = [
  { key: 'core', label: 'Core' },
  { key: 'licensing', label: 'Licensing' },
  { key: 'tax', label: 'Taxation' },
  { key: 'regulation', label: 'Regulation' },
  { key: 'adoption', label: 'Adoption' },
  { key: 'compliance', label: 'Compliance' },
];
