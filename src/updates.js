/**
 * Weekly updates data for the notification bell.
 * Add new weeks at the TOP of the array (most recent first).
 * Each week has a label and an array of update items.
 *
 * Types: "regulatory" | "news" | "case"
 */

const WEEKLY_UPDATES = [
  {
    label: 'April 2026, Week 2',
    items: [
      // Regulatory
      { country: 'JP', countryName: 'Japan', type: 'regulatory', title: 'Cabinet approves landmark FIEA amendment — crypto reclassified as financial instruments alongside stocks and bonds; insider trading banned; flat 20% tax proposed', url: 'https://www.cryptotimes.io/2026/04/10/japan-reclassifies-crypto-assets-under-financial-instruments-act/' },
      { country: 'HK', countryName: 'Hong Kong', type: 'regulatory', title: 'HKMA grants first stablecoin licences under Stablecoins Ordinance to HSBC and Anchorpoint Financial (Standard Chartered/Animoca JV)', url: 'https://www.spotedcrypto.com/global-crypto-regulation-wave-2026/' },
      { country: 'KR', countryName: 'South Korea', type: 'regulatory', title: 'National Assembly advances Digital Asset Basic Act — 100%+ stablecoin reserves, VASP licensing, and exchange kill switches proposed', url: 'https://www.coindesk.com/policy/2026/04/08/south-korea-proposes-cryptocurrency-law-with-bank-style-rules-for-stablecoins' },
      { country: 'US', countryName: 'United States', type: 'regulatory', title: 'SEC sends "Regulation Crypto" proposal to White House OIRA — formal publication imminent', url: 'https://www.pymnts.com/cryptocurrency/2026/sec-sends-regulation-crypto-proposal-to-white-house/' },
      { country: 'US', countryName: 'United States', type: 'regulatory', title: 'CLARITY Act stablecoin yield compromise nearing resolution — Tillis and Alsobrooks finalize draft banning passive yield but permitting activity-based rewards', url: 'https://en.cryptonomist.ch/2026/04/14/stablecoin-regulation-senate-dma-act/' },
      { country: 'US', countryName: 'United States', type: 'regulatory', title: 'FinCEN and OFAC propose GENIUS Act AML/sanctions rules for stablecoin issuers — 1:1 reserves, monthly disclosures, transaction blocking required', url: 'https://www.coindesk.com/policy/2026/04/08/u-s-treasury-to-propose-demands-that-stablecoin-firms-be-set-to-police-bad-transactions' },
      { country: 'US', countryName: 'United States', type: 'regulatory', title: 'PARITY Act (crypto tax reform) reintroduced by Reps. Horsford and Miller — seeks to modernize digital asset taxation', url: 'https://www.coindesk.com/policy/2026/04/13/u-s-lawmakers-take-another-swing-at-crypto-tax-policy-with-revised-bill' },
      { country: 'US', countryName: 'United States', type: 'regulatory', title: 'SEC staff statement clarifies broker-dealer registration requirements for DeFi front-end UI operators facilitating crypto securities transactions', url: 'https://www.sec.gov/newsroom/speeches-statements/staff-statement-regarding-broker-dealer-registration-certain-user-interfaces-utilized-prepare-staff-statement-regarding-broker-dealer-registration-certain-user-interfaces-utilized' },
      { country: 'AE', countryName: 'UAE (Dubai)', type: 'regulatory', title: 'CMA Decision No. 4/R.M/2026 establishes most comprehensive federal VASP framework — 8 licensed activities, tiered capital, privacy token ban; transition deadline Feb 2027', url: 'https://mielogroup.com/uae-crypto-law-2026-a-guide-to-cma-decision-no-4-r-m-2026-for-vasps/' },
      { country: 'AE', countryName: 'UAE (Dubai)', type: 'news', title: 'Dubai partners with Crypto.com to enable crypto payments for government services — crypto converted to AED before deposit', url: 'https://www.kucoin.com/news/flash/dubai-partners-with-crypto-com-to-enable-crypto-payments-for-government-services' },
      { country: 'ES', countryName: 'Spain', type: 'regulatory', title: 'ESMA warns unauthorized CASPs must complete orderly wind-down before Jul 1, 2026 MiCA deadline — DAC8 tax reporting already live since Jan 2026', url: 'https://www.financemagnates.com/cryptocurrency/regulation/spain-to-enforce-mica-and-dac8-in-2026-ending-cryptos-regulatory-grey-area/' },
      // News
      { country: 'KR', countryName: 'South Korea', type: 'news', title: 'Bank of Korea governor nominee backs central bank-led digital currency over private stablecoins', url: 'https://www.coindesk.com/policy/2026/04/14/bank-of-korea-nominee-backs-central-bank-led-digital-currency-sees-limited-role-for-stablecoins' },
      { country: 'IR', countryName: 'Iran', type: 'news', title: 'Central Bank of Iran completes Digital Rial (crypto rial) CBDC pre-pilot on Hyperledger Fabric-based Borna platform', url: 'https://usa.news-pravda.com/world/2026/04/12/739410.html' },
      // Case / News
      { country: 'US', countryName: 'United States', type: 'case', title: 'SEC publishes FY2025 enforcement results — only 456 actions (lowest in 21 years); 7 major crypto cases dismissed (Coinbase, Binance, Kraken, Consensys, Cumberland, Dragonchain, Balina)', url: 'https://www.sec.gov/newsroom/press-releases/2026-34' },
      { country: 'US', countryName: 'United States', type: 'news', title: 'Circle CEO Allaire defends not freezing ~$230M USDC after Drift exploit — says freezes require law enforcement requests or court orders, urges Congress to advance GENIUS and CLARITY Acts', url: 'https://www.theblock.co/post/397180/circle-ceo-allaire-defends-decision-not-to-freeze-usdc-in-drift-exploit-citing-moral-quandary' },
    ],
  },
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
