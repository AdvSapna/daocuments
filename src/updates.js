/**
 * Weekly updates data for the notification bell.
 * Add new weeks at the TOP of the array (most recent first).
 * Each week has a label and an array of update items.
 *
 * Types: "regulatory" | "news" | "case"
 */

const WEEKLY_UPDATES = [
  {
    label: 'April 2026, Week 1',
    items: [
      // Regulatory
      { country: 'AU', countryName: 'Australia', type: 'regulatory', title: 'Parliament passes first crypto licensing law — Digital Assets Framework Bill requires exchanges to obtain AFSL licenses', url: 'https://www.coindesk.com/policy/2026/04/01/australia-passes-crypto-licensing-bill-as-ausd24-billion-opportunity-comes-into-focus' },
      { country: 'US', countryName: 'United States', type: 'regulatory', title: 'CLARITY Act stalls amid four-way deadlock over stablecoin yield; Senate markup pushed to late April', url: 'https://www.coindesk.com/policy/2026/04/02/crypto-market-structure-bill-release-pushed-back-as-industries-view-revised-stablecoin-yield-compromise-this-week/' },
      { country: 'US', countryName: 'United States', type: 'regulatory', title: 'SEC and CFTC issue joint token classification framework — first formal definition of digital commodities, securities, and stablecoins under federal law', url: 'https://www.sec.gov/newsroom/press-releases/2026-30-sec-clarifies-application-federal-securities-laws-crypto-assets' },
      { country: 'AE', countryName: 'UAE (Dubai)', type: 'regulatory', title: 'VARA launches crypto derivatives framework — retail leverage capped at 5:1 for futures, options, and perpetual swaps', url: 'https://www.theblock.co/post/395873/dubais-vara-imposes-margin-governance-and-disclosure-rules-on-crypto-trading-and-derivatives' },
      { country: 'IN', countryName: 'India', type: 'regulatory', title: 'New crypto reporting penalties take effect — INR 200/day for missed filings, INR 50,000 flat penalty for incorrect reporting', url: 'https://www.coindesk.com/markets/2026/02/02/india-s-budget-2026-keeps-crypto-taxes-tds-unchanged-adds-usd545-penalty-for-lapses' },
      { country: 'KR', countryName: 'South Korea', type: 'regulatory', title: 'FSC confirms 20% ownership cap for crypto exchanges; Upbit and Bithumb get 3-year grace period', url: 'https://www.cryptotimes.io/2026/03/04/south-korea-sets-ownership-cap-for-upbit-and-bithumb/' },
      { country: 'JP', countryName: 'Japan', type: 'regulatory', title: 'FSA prepares to reclassify crypto as "financial products" — insider-trading bans and flat 20% tax rate expected', url: 'https://www.financemagnates.com/cryptocurrency/regulation/japan-plans-20-crypto-tax-reclassifies-digital-assets-as-financial-products/' },
      { country: 'GB', countryName: 'United Kingdom', type: 'regulatory', title: 'FSMA Cryptoassets Regulations 2026 made by Parliament — FCA Application Gateway opens Sep 30, 2026', url: 'https://www.fca.org.uk/firms/new-regime-cryptoasset-regulation' },
      { country: 'EU', countryName: 'European Union', type: 'regulatory', title: 'MiCA transitional periods approaching final deadline — ESMA publishes new guidelines on reverse solicitation and market abuse', url: 'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica' },
      { country: 'BR', countryName: 'Brazil', type: 'regulatory', title: 'Central Bank crypto authorization regime active — VASPs have until Oct 30, 2026 to meet licensing requirements', url: 'https://sumsub.com/blog/global-crypto-regulations/' },
      { country: 'KH', countryName: 'Cambodia', type: 'regulatory', title: 'Parliament unanimously passes anti-scam law — up to life imprisonment for crypto scam site operators where deaths occur', url: 'https://www.washingtontimes.com/news/2026/mar/30/cambodia-advances-scam-center-law-penalties-life-prison/' },
      // News
      { country: 'HK', countryName: 'Hong Kong', type: 'news', title: 'Missed self-imposed March deadline for stablecoin licenses — zero of 36 applications approved so far', url: 'https://www.coindesk.com/policy/2026/04/01/hong-kong-hasn-t-issued-a-single-hkd-stablecoin-license-after-march-target' },
      { country: 'ZA', countryName: 'South Africa', type: 'news', title: 'Budget Speech signals crypto assets will enter exchange control regime — cross-border transfers may require approval', url: 'https://www.bakermckenzie.com/en/insight/publications/2026/03/south-africa-crypto-assets-likely-to-enter-exchange-control-regime' },
      // Case / Hack
      { country: '', countryName: 'DeFi', type: 'case', title: 'Drift Protocol (Solana) exploited for ~$285M in suspected DPRK-linked attack — largest crypto hack of 2026', url: 'https://www.bloomberg.com/news/articles/2026-04-01/solana-based-defi-project-drift-hit-by-285-million-exploit' },
    ],
  },
];

export default WEEKLY_UPDATES;
