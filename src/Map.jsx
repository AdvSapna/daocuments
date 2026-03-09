import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

const GEO_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';

export const SAMPLE = {
  US:{name:'United States',status:'partial',summary:'Dramatic policy shift 2024-2025. GENIUS Act (stablecoins) signed into law. SEC dismissed major crypto cases under new leadership. Strategic Bitcoin Reserve established by executive order. CLARITY Act (market structure) passed House, awaiting Senate.',
    legislation:[
      {title:'GENIUS Act — Federal Stablecoin Framework',year:2025,note:'First comprehensive federal crypto law; requires 1:1 reserves for payment stablecoins',url:'https://www.lw.com/en/insights/the-genius-act-of-2025-stablecoin-legislation-adopted-in-the-us'},
      {title:'CLARITY Act — SEC/CFTC Jurisdiction',year:2025,note:'CFTC gets digital commodity spot markets; SEC retains investment contract assets. Passed House, awaiting Senate',url:'https://www.congress.gov/bill/119th-congress/house-bill/3633/text'},
      {title:'FIT21 — Financial Innovation and Technology Act',year:2024,note:'First crypto market structure bill to pass a chamber of Congress; template for CLARITY Act',url:'https://www.paulhastings.com/insights/crypto-policy-tracker/the-financial-innovation-and-technology-for-the-21st-century-act-a-template-for-future-crypto-market-legislation'},
      {title:'Executive Order — Strategic Bitcoin Reserve',year:2025,note:'Establishes reserve of ~207,000 BTC from forfeitures; prohibits sale of reserve bitcoin',url:'https://www.whitehouse.gov/fact-sheets/2025/03/fact-sheet-president-donald-j-trump-establishes-the-strategic-bitcoin-reserve-and-u-s-digital-asset-stockpile/'},
      {title:'Executive Order — Digital Financial Technology Leadership',year:2025,note:'Revoked Biden EO 14067; pro-innovation posture; prohibited U.S. CBDC development',url:'https://www.whitehouse.gov/presidential-actions/2025/01/strengthening-american-leadership-in-digital-financial-technology/'},
      {title:'Infrastructure Investment and Jobs Act — Broker Reporting',year:2021,note:'Expanded "broker" definition for digital assets; requires Form 1099-B reporting',url:'https://www.gibsondunn.com/infrastructure-bills-new-reporting-requirements-may-have-sweeping-implications-for-cryptocurrency-ecosystem/'},
      {title:'State Frameworks: Wyoming DAO Laws & NY BitLicense',year:2015,note:'Wyoming pioneered blockchain legislation and DAO LLCs; NY BitLicense remains key state regime',url:'https://montague.law/blog/wyoming-crypto-laws/'},
    ],
    news:[
      {title:'Senate punts crypto market structure bill (CLARITY Act) to 2026',date:'Dec 2025',url:'https://www.coindesk.com/policy/2025/12/15/senate-punts-crypto-market-structure-bill-to-next-year'},
      {title:'SEC paves way for Solana, XRP spot ETFs with new listing rules',date:'Sep 2025',url:'https://www.cnbc.com/2025/09/18/sec-paves-way-for-crypto-spot-etfs-with-new-listing-rules.html'},
      {title:'President Trump signs GENIUS Act — federal stablecoin framework',date:'Jul 2025',url:'https://www.weforum.org/stories/2025/07/stablecoin-regulation-genius-act/'},
      {title:'SEC drops Binance lawsuit; dismissed with prejudice',date:'May 2025',url:'https://www.cnbc.com/2025/05/29/sec-drops-binance-lawsuit-ending-one-of-last-remaining-crypto-actions.html'},
      {title:'Paul Atkins sworn in as SEC Chairman, replacing Gary Gensler',date:'Apr 2025',url:'https://www.coindesk.com/policy/2025/04/22/crypto-ally-paul-atkins-sworn-in-to-replace-gary-gensler-atop-u-s-sec'},
      {title:'Treasury (OFAC) officially delists Tornado Cash sanctions',date:'Mar 2025',url:'https://www.venable.com/insights/publications/2025/04/a-legal-whirlwind-settles-treasury-lifts-sanctions'},
      {title:'Trump signs Executive Order establishing Strategic Bitcoin Reserve',date:'Mar 2025',url:'https://www.cnbc.com/2025/03/06/trump-signs-executive-order-for-us-strategic-bitcoin-reserve.html'},
    ],
    cases:[
      {title:'SEC v. Coinbase — dismissed with prejudice',status:'Dismissed — no penalties, no admission',year:2025,url:'https://www.sec.gov/newsroom/press-releases/2025-47'},
      {title:'SEC v. Ripple Labs (XRP)',status:'Settled — $125M penalty reduced to $50M',year:2025,url:'https://www.cnbc.com/2025/03/22/cryptos-long-battle-with-sec-comes-to-a-close-with-ripple-victory.html'},
      {title:'SEC v. Binance / Changpeng Zhao',status:'Dismissed with prejudice (separate from $4.3B DOJ criminal case)',year:2025,url:'https://www.sec.gov/enforcement-litigation/litigation-releases/lr-26316'},
      {title:'SEC v. Kraken / Payward Inc.',status:'Dismissed with prejudice — no penalties',year:2025,url:'https://blog.kraken.com/news/sec-lawsuit-dismissal'},
      {title:'SEC v. ConsenSys / Cumberland DRW',status:'Dismissed with prejudice under new SEC leadership',year:2025,url:'https://decrypt.co/312072/sec-drops-cases-kraken-consensys-cumberland-drw'},
      {title:'Tornado Cash — OFAC sanctions struck down (Van Loon v. Treasury)',status:'Fifth Circuit ruled smart contracts not sanctionable; OFAC delisted Mar 2025',year:2025,url:'https://www.mayerbrown.com/en/insights/publications/2024/12/federal-appeals-court-tosses-ofac-sanctions-on-tornado-cash-and-limits-federal-governments-ability-to-police-crypto-transactions'},
      {title:'U.S. v. Roman Storm (Tornado Cash criminal)',status:'Partial conviction — guilty on 1 count, jury deadlocked on 2',year:2025,url:'https://www.irs.gov/compliance/criminal-investigation/founder-of-tornado-cash-crypto-mixing-service-convicted-of-knowingly-transmitting-criminal-proceeds'},
    ]},
  CH:{name:'Switzerland',status:'legal',summary:'One of the world\'s most developed crypto frameworks. DLT Act (2021) amended ten federal laws. FINMA actively licensing. New crypto-institution and payment-institution licence categories proposed (Oct 2025). Crypto Valley hosts 1,749 blockchain companies.',
    legislation:[
      {title:'DLT Act — Federal Law on DLT Adaptation',year:2021,note:'Omnibus act amending ten federal laws to recognize ledger-based securities and create DLT trading facility licence',url:'https://www.loc.gov/item/global-legal-monitor/2021-03-03/switzerland-new-amending-law-adapts-several-acts-to-developments-in-distributed-ledger-technology/'},
      {title:'FINMA ICO/Token Guidelines & Stablecoin Guidance',year:2018,note:'Payment-token / utility-token / asset-token taxonomy; 2024 stablecoin risk guidance added',url:'https://www.finma.ch/en/news/2025/09/20250905-meldung-am-kryptovermoegenswerte/'},
      {title:'Revised AMLA & Transparency of Legal Entities Act',year:2025,note:'Centralized beneficial owner register; extended AML requirements including Travel Rule for stablecoins',url:'https://www.sanctions.io/blog/switzerlands-anti-money-laundering-regulations-a-2025-guide'},
      {title:'Federal Council Consultation — Crypto-Institution Licence',year:2025,note:'Proposes new FINMA-supervised crypto-institution and payment-institution licence categories',url:'https://www.news.admin.ch/en/newnsb/x4TMWQ1SWofNoFx7XyHhY'},
      {title:'FINMA Guidance 01/2026 — Crypto Custody Risks',year:2026,note:'Supervisory expectations for banks holding crypto: segregation, operational risk, cybersecurity',url:'https://www.finma.ch/en/news/2026/01/20260112-mm-am-01-26/'},
      {title:'OECD CARF Implementation into Swiss Law',year:2026,note:'Crypto service providers must report user identities, holdings, and income; cross-border exchange from 2027',url:'https://www.iflr.com/article/2fms0fi9lt634zz47qtq8/sponsored/analysis-switzerland-prepares-to-implement-oecds-crypto-asset-reporting-framework'},
    ],
    news:[
      {title:'FINMA publishes crypto custody risk guidance (Guidance 01/2026)',date:'Jan 2026',url:'https://www.finma.ch/en/news/2026/01/20260112-mm-am-01-26/'},
      {title:'Europol and Swiss authorities take down Cryptomixer in Zurich — EUR 25M in Bitcoin seized',date:'Dec 2025',url:'https://www.coindesk.com/policy/2025/12/01/european-authorities-seize-usd1-51b-bitcoin-laundering-service-cryptomixer'},
      {title:'Federal Council launches consultation on new crypto-institution licence categories',date:'Oct 2025',url:'https://www.news.admin.ch/en/newnsb/x4TMWQ1SWofNoFx7XyHhY'},
      {title:'FINMA publishes crypto-asset disclosure guidance for bank financial statements',date:'Sep 2025',url:'https://www.finma.ch/en/news/2025/09/20250905-meldung-am-kryptovermoegenswerte/'},
      {title:'BX Digital receives first-ever DLT Trading Facility licence from FINMA',date:'Mar 2025',url:'https://www.finma.ch/en/news/2025/03/20250318-mm-dlt-handelssystem/'},
      {title:'Crypto Valley grows 132% since 2020 — now 1,749 blockchain companies',date:'2025',url:'https://www.s-ge.com/en/article/news/crypto-valley-growth?ct'},
      {title:'Swiss National Bank extends wholesale CBDC pilot (Helvetia III) until June 2027',date:'2025',url:'https://crypto.news/swiss-central-bank-extends-cbdc-pilot-until-2026/'},
    ],
    cases:[
      {title:'FlowBank SA — FINMA-ordered bankruptcy for AML failures',status:'Licence withdrawn Mar 2024; liquidation ongoing',year:2024,url:'https://www.finma.ch/en/news/2024/06/20240613-mm-flowbank/'},
      {title:'Cryptomixer takedown (Operation Olympia) — EUR 1.3B laundered',status:'Servers seized, EUR 25M Bitcoin confiscated; investigation ongoing',year:2025,url:'https://www.europol.europa.eu/media-press/newsroom/news/europol-and-partners-shut-down-cryptomixer'},
      {title:'FINMA enforcement on unauthorized crypto deposit-taking',status:'Cease-and-desist orders issued against entity and 3 individuals',year:2024,url:'https://practiceguides.chambers.com/practice-guides/blockchain-2025/switzerland/trends-and-developments'},
      {title:'Envion AG — Illegal ICO (CHF 90M from 37,000+ investors)',status:'FINMA enforcement completed; bankruptcy liquidation finished',year:2019,url:'https://www.finma.ch/en/news/2019/03/20190327---mm---envion/'},
    ]},
  SG:{name:'Singapore',status:'legal',summary:'Layered regulatory framework: Payment Services Act (domestic DPT), FSMA Part 9 (overseas DTSPs, effective Jun 2025), SFA (securities tokens). 36 MPI-licensed crypto providers as of Jan 2026. Stablecoin legislation expected mid-2026.',
    legislation:[
      {title:'Payment Services Act 2019',year:2019,note:'Foundational crypto regulation; requires Major Payment Institution licensing for DPT services',url:'https://www.mas.gov.sg/regulation/acts/payment-services-act'},
      {title:'Payment Services Act Amendments 2024',year:2024,note:'Expanded to cover DPT custody, transmission; user protection requirements from Oct 2024',url:'https://www.mas.gov.sg/news/media-releases/2024/mas-expands-scope-of-regulated-payment-services'},
      {title:'Financial Services and Markets Act 2022',year:2022,note:'Omnibus act; Part 9 introduces DTSP licensing for overseas-facing operators',url:'https://www.mas.gov.sg/regulation/acts/financial-services-and-markets-act-2022'},
      {title:'FSMA Part 9 — DTSP Framework',year:2025,note:'Effective Jun 30, 2025; overseas-facing DTSPs must obtain licence or cease operations',url:'https://www.mas.gov.sg/news/media-releases/2025/mas-clarifies-regulatory-regime-for-digital-token-service-providers'},
      {title:'MAS Stablecoin Regulatory Framework',year:2023,note:'Requires 100% reserve backing for single-currency stablecoins; legislation expected mid-2026',url:'https://www.fintechlawblog.com/2025/09/03/the-global-stablecoin-stablecoin-regulatory-framework-in-singapore/'},
      {title:'Guidelines on Licensing for DTSPs',year:2025,note:'Licensing expectations, compliance officer requirements, 1-hour incident reporting',url:'https://www.mas.gov.sg/regulation/guidelines/guidelines-on-licensing-for-dtsps'},
    ],
    news:[
      {title:'36 Major Payment Institution licences granted for DPT services as of Jan 2026',date:'Jan 2026',url:'https://fintechnews.sg/latest-list-licensed-cryptocurrency-providers-in-singapore/'},
      {title:'Singapore tests tokenized MAS Bills (government bonds); prepares stablecoin legislation',date:'Late 2025',url:'https://cryptovalleyjournal.com/hot-topics/news/singapore-tests-tokenized-government-bonds-and-prepares-stablecoin-legislation-for-2026/'},
      {title:'Singapore ends $2.2B Fujian gang money laundering case; 9 banks fined S$27.5M',date:'Jul 2025',url:'https://www.coindesk.com/policy/2025/07/05/crypto-cash-and-condos-singapore-ends-22b-laundering-case-with-fines'},
      {title:'OKX obtains full Major Payment Institution licence from MAS',date:'2024',url:'https://www.theblock.co/post/314088/okx-full-payments-license-in-singapore'},
      {title:'Coinbase obtains Major Payment Institution licence from MAS',date:'2024',url:'https://www.coinbase.com/blog/coinbase-obtains-major-payment-institution-licence-from-the-monetary'},
      {title:'New crypto rules carry penalties of up to S$200,000 fines or jail',date:'2025',url:'https://cointelegraph.com/explained/break-singapores-new-crypto-rules-and-you-could-face-200k-fine-or-jail'},
    ],
    cases:[
      {title:'Three Arrows Capital — Su Zhu arrested, 9-year MAS market ban',status:'Zhu sentenced 4 months; Kyle Davies at large; liquidators pursuing $3.3B',year:2022,url:'https://techcrunch.com/2023/09/29/three-arrows-capital-co-founder-zhu-arrested-in-singapore-airport-sentenced-four-months-in-prison/'},
      {title:'Cheong Jun Yoong v 3AC — crypto as property landmark',status:'Decided — Singapore High Court ruled crypto-assets constitute property',year:2024,url:'https://practiceguides.chambers.com/practice-guides/blockchain-2025/singapore'},
      {title:'2023 Singapore money laundering case (Fujian gang, S$2.79B seized)',status:'Concluded — 10 convicted (13-17 months); 9 banks fined S$27.5M',year:2025,url:'https://en.wikipedia.org/wiki/2023_Singapore_money_laundering_case'},
      {title:'Terraform Labs / Do Kwon (Singapore angle)',status:'Do Kwon extradited to U.S.; $1.3B settlement approved',year:2022,url:'https://www.thestreet.com/crypto/bankruptcy/terraform-luna-1-3b-settlement'},
      {title:'MAS enforcement — 9 financial institutions for AML breaches',status:'Concluded — regulatory actions and penalties imposed',year:2025,url:'https://www.mas.gov.sg/regulation/enforcement/enforcement-actions/2025/mas-takes-regulatory-actions-against-9-financial-institutions-for-aml-related-breaches'},
    ]},
  CN:{name:'China',status:'restricted',summary:'All crypto transactions declared illegal since 2021. Mining prohibited. Digital yuan (e-CNY) reached 16.7 trillion yuan in cumulative transactions. Hong Kong operates contrasting VASP licensing regime with 7 licensed exchanges.',
    legislation:[
      {title:'PBOC Notice on Preventing Bitcoin Risks',year:2013,note:'Classified Bitcoin as "virtual commodity"; barred financial institutions from crypto services',url:'https://maint.loc.gov/law/help/cryptocurrency/china.php'},
      {title:'ICO Ban — 7-Agency Announcement',year:2017,note:'Declared all ICOs unauthorized illegal public financing; forced domestic exchanges to shut down',url:'https://freemanlaw.com/cryptocurrency/china/'},
      {title:'PBOC Circular — Comprehensive Crypto Ban',year:2021,note:'All crypto transactions illegal, including overseas exchanges serving Chinese residents',url:'https://www.loc.gov/item/global-legal-monitor/2021-10-13/china-central-bank-issues-new-regulatory-document-on-cryptocurrency-trading/'},
      {title:'NDRC Notice — Crypto Mining Ban',year:2021,note:'Mining added to "eliminated" industrial category; electricity supply to miners prohibited',url:'https://www.loc.gov/item/global-legal-monitor/2022-02-08/china-national-development-and-reform-commission-issues-notice-restricting-cryptocurrency-mining/'},
      {title:'Hong Kong AMLO Amendment — VASP Licensing',year:2023,note:'Mandatory SFC licensing for crypto exchanges in HK; penalties up to 7 years imprisonment',url:'https://www.nixonpeabody.com/insights/alerts/2023/01/18/hong-kong-amends-anti-money-laundering-law-to-cover-virtual-asset-service-providers'},
      {title:'SAFE Forex Rules — Crypto Monitoring',year:2024,note:'Banks must identify, monitor, and report crypto-related cross-border transactions',url:'https://www.scmp.com/tech/blockchain/article/3292795/chinas-new-forex-rules-require-banks-tighten-scrutiny-cryptocurrency-trades'},
      {title:'PBOC Multi-Agency Stablecoin Crackdown',year:2025,note:'13 agencies coordinated; stablecoins explicitly banned for first time',url:'https://paymentexpert.com/2025/12/01/chinas-central-bank-tightens-stance-as-stablecoins-pulled-into-crypto-clampdown/'},
      {title:'Digital Yuan (e-CNY) Revised Management Framework',year:2026,note:'Redefined e-CNY as interest-bearing digital deposit money; protected by deposit insurance',url:'https://dig.watch/updates/new-rules-set-for-digital-yuan-in-2026'},
    ],
    news:[
      {title:'China expands crypto ban to cover RWA tokenization and offshore stablecoins',date:'Feb 2026',url:'https://coindcx.com/blog/crypto-news-global/china-bans-crypto/'},
      {title:'Digital yuan becomes interest-bearing — a world first for CBDCs',date:'Jan 2026',url:'https://finance.yahoo.com/news/china-cbdc-digital-yuan-enter-093806410.html'},
      {title:'PBOC convenes 13 agencies; stablecoins explicitly outlawed',date:'Nov 2025',url:'https://www.bitget.com/academy/china-crypto-ban-2025-stablecoins-hong-kong-jd-ant-crypto-mining'},
      {title:'Hong Kong Stablecoins Ordinance takes effect',date:'Aug 2025',url:'https://www.mayerbrown.com/en/insights/publications/2025/07/hong-kongs-stablecoin-bill-key-amendments-and-next-steps-following-legislative-passage'},
      {title:'Hong Kong SFC licenses 4 new crypto exchanges, bringing total to 7',date:'Dec 2024',url:'https://www.scmp.com/tech/blockchain/article/3291418/hong-kong-licences-four-more-crypto-exchanges-amid-bitcoin-price-surge'},
      {title:'Shanghai court rules crypto ownership legal as personal property',date:'Nov 2024',url:'https://cryptoslate.com/crypto-clarified-as-personal-property-in-china-remains-barred-for-businesses/'},
      {title:'Project mBridge (cross-border CBDC) reaches minimum viable product stage',date:'Oct 2024',url:'https://www.bis.org/about/bisih/topics/cbdc/mcbdc_bridge.htm'},
      {title:'Hong Kong approves first spot Bitcoin and Ether ETFs',date:'Apr 2024',url:'https://www.cnbc.com/2024/04/15/hong-kong-regulators-approve-spot-bitcoin-and-ether-etfs-.html'},
      {title:'SAFE introduces new forex rules targeting crypto cross-border transactions',date:'Dec 2024',url:'https://finance.yahoo.com/news/china-introduces-forex-rules-tighten-071133871.html'},
    ],
    cases:[
      {title:'PlusToken Ponzi Scheme — $4.2B seized',status:'Concluded — 14 sentenced to 2-11 years',year:2020,url:'https://www.scmp.com/economy/china-economy/article/3112115/chinese-cryptocurrency-scam-ringleaders-jailed-us225-billion'},
      {title:'Star Xu / OKEx founder detention',status:'Resolved — cleared after 5-week detention',year:2020,url:'https://www.coindesk.com/business/2020/11/20/star-xu-surfaces-from-detention-as-okexs-mystery-key-holder-also-returns'},
      {title:'JPEX fraud — HK$1.6B losses (Hong Kong)',status:'Active — 16 charged, trial Mar 2026',year:2023,url:'https://www.coindesk.com/policy/2025/11/05/hong-kong-charges-16-in-alleged-usd205m-jpex-crypto-fraud-as-interpol-hunts-3-more-suspects'},
      {title:'Shikongyun Filecoin mining pyramid scheme — $83.3M',status:'Under prosecution — 57,000 victims',year:2023,url:'https://www.theblock.co/post/244929/chinese-filecoin-mining-firm-charged-for-allegedly-orchestrating-83-3-million-pyramid-scheme'},
      {title:'Haidian USDT cross-border money laundering — ¥1.18B',status:'Concluded — 5 sentenced to 2-4.5 years',year:2025,url:'https://cryptonews.com/news/china-jails-five-for-166m-crypto-money-laundering-scheme/'},
      {title:'Hounax unlicensed exchange fraud (Hong Kong)',status:'Under investigation — HK$148M losses',year:2023,url:'https://fortune.com/crypto/2023/11/28/hong-kong-crypto-regulators-hounax-jpex-scams/'},
      {title:'U.S. v. Daren Li — $73M cross-border crypto laundering',status:'Sentenced 20 years; fugitive',year:2024,url:'https://www.justice.gov/opa/pr/man-sentenced-20-years-prison-role-73-million-global-cryptocurrency-investment-scam'},
    ]},
  DE:{name:'Germany',status:'legal',summary:'EU MiCA fully applied Dec 2024. BaFin designated as national competent authority. FinmadiG/KMAG implemented MiCA domestically. Major banks (DZ Bank, Deutsche Bank) entering crypto under MiCA licences. Active enforcement against unlicensed ATMs and stablecoin issuers.',
    legislation:[
      {title:'EU MiCA Regulation — Full Application',year:2024,note:'EU-wide crypto-asset regulation; BaFin designated as Germany\'s national competent authority',url:'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica'},
      {title:'FinmadiG — Financial Market Digitisation Act',year:2024,note:'Omnibus German law implementing MiCA and Transfer of Funds Regulation domestically',url:'https://www.mayerbrown.com/en/insights/publications/2024/12/german-parliament-passes-act-on-the-digitalisation-of-financial-markets'},
      {title:'KMAG — Crypto Markets Supervision Act',year:2024,note:'Core MiCA implementing law; grants BaFin supervisory powers over CASPs; grandfathering until Dec 2025',url:'https://www.gesetze-im-internet.de/kmag/BJNR1B60B0024.html'},
      {title:'KWG Section 1(1a) No. 6 — Crypto Custody Business',year:2020,note:'Defines crypto custody as regulated financial service requiring BaFin authorisation',url:'https://www.bafin.de/SharedDocs/Veroeffentlichungen/EN/Merkblatt/mb_200302_kryptoverwahrgeschaeft_en.html'},
      {title:'eWpG — Electronic Securities Act',year:2021,note:'Enables purely electronic securities on DLT; expanded to electronic shares via ZuFinG',url:'https://www.loc.gov/item/global-legal-monitor/2021-06-29/germany-electronic-securities-act-enters-into-force/'},
      {title:'BaFin Guidance on Crypto-Asset Services under MiCAR',year:2025,note:'Detailed compliance requirements: capital, AML/KYC, notification process',url:'https://www.twobirds.com/en/insights/2025/germany/bafin-publishes-guidance-note-on-crypto-asset-services-according-to-micar'},
    ],
    news:[
      {title:'DZ Bank wins MiCA approval to roll out retail crypto trading',date:'Jan 2026',url:'https://www.coindesk.com/business/2026/01/14/germany-s-second-largest-lender-dz-bank-secures-retail-crypto-trading-mica-license'},
      {title:'Arkham reveals Germany failed to seize additional $5B in Bitcoin from Movie2K wallets',date:'Sep 2025',url:'https://cointelegraph.com/news/germany-failed-seize-5b-bitcoin-piracy-site-movie2k-arkham'},
      {title:'Deutsche Bank plans crypto custody service with Bitpanda for 2026 launch',date:'Jul 2025',url:'https://www.coindesk.com/business/2025/07/02/deutsche-bank-plans-to-introduce-crypto-custody-with-bitpanda-next-year-bloomberg'},
      {title:'BaFin orders Ethena GmbH to wind down USDe token business',date:'Apr 2025',url:'https://www.bafin.de/SharedDocs/Veroeffentlichungen/EN/Verbrauchermitteilung/weitere/2025/meldung_2025_04_15_Ethena_GmbH_en.html'},
      {title:'BaFin seizes 13 crypto ATMs and EUR 25M in cash in nationwide crackdown',date:'Aug 2024',url:'https://www.coindesk.com/policy/2024/08/21/german-regulator-seizes-13-crypto-atms/'},
      {title:'Germany sells 49,858 seized Bitcoin for $2.88B — later seen as $3B+ missed opportunity',date:'Jul 2024',url:'https://thedefiant.io/news/regulation/germany-sold-50000-bitcoin-seized-movie2k-2-88-billion-57600-bitcoin-price-since-e0ec9eb6'},
      {title:'Bundestag passes Financial Market Digitisation Act (FinmadiG) implementing MiCA',date:'Dec 2024',url:'https://paytechlaw.com/en/finmadig-finally-adopted-by-the-bundestag/'},
    ],
    cases:[
      {title:'Movie2K Bitcoin seizure — 49,858 BTC + potentially $5B more',status:'Ongoing — two suspects charged; additional wallets under investigation',year:2024,url:'https://torrentfreak.com/operator-of-bitcoin-invested-pirate-site-movie2k-charged-after-more-than-a-decade-240419/'},
      {title:'BaFin v. Ethena GmbH (USDe stablecoin)',status:'Resolved — EUR 600K fine; ordered winding-up under MiCAR',year:2025,url:'https://www.bafin.de/SharedDocs/Veroeffentlichungen/EN/Verbrauchermitteilung/weitere/2025/meldung_2025_06_25_Ethena_GmbH_en.html'},
      {title:'BaFin crypto ATM seizures — nationwide operation',status:'Concluded — 13 ATMs seized; operators face up to 5 years',year:2024,url:'https://www.coindesk.com/policy/2024/08/21/german-regulator-seizes-13-crypto-atms/'},
      {title:'German court upholds BaFin MiCAR cease-and-desist',status:'Decided — validated BaFin authority under MiCAR',year:2025,url:'https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-laws-and-regulations/germany/'},
    ]},
  GB:{name:'United Kingdom',status:'partial',summary:'Major transition underway from MLR registration to full FSMA-based crypto regime (commencing Oct 2027). Property (Digital Assets etc) Act 2025 established crypto as personal property. FCA pursuing first-ever High Court action against a crypto exchange.',
    legislation:[
      {title:'FSMA 2023 — Crypto Financial Promotions Regime',year:2023,note:'All crypto marketing to UK consumers must comply with FCA rules on risk warnings and cooling-off periods',url:'https://www.fca.org.uk/publications/policy-statements/ps23-6-financial-promotion-rules-cryptoassets'},
      {title:'FCA Cryptoasset Registration Regime (MLR 2017)',year:2017,note:'AML registration required for crypto businesses; only 48 firms registered as of mid-2025',url:'https://www.fca.org.uk/firms/financial-crime/cryptoassets-aml-ctf-regime'},
      {title:'Property (Digital Assets etc) Act 2025',year:2025,note:'Established third category of personal property for digital assets under English law',url:'https://lawcom.gov.uk/news/the-property-digital-assets-etc-act-2025-has-received-royal-assent/'},
      {title:'Cryptoassets Regulations 2026 (FSMA-based)',year:2026,note:'Full FCA regulatory perimeter for crypto: trading, dealing, custody, staking, stablecoins. Commences Oct 2027',url:'https://www.gov.uk/government/news/new-crypto-rules-to-unlock-growth-and-protect-customers'},
      {title:'FCA Consultation Papers CP25/40-42',year:2025,note:'Three papers covering crypto activities, market abuse regime, and prudential requirements',url:'https://www.fca.org.uk/publications/consultation-papers/cp25-40-regulating-cryptoasset-activities'},
      {title:'FCA Stablecoin Issuance Framework (CP25/14)',year:2025,note:'Regulatory framework for qualifying stablecoins; sandbox applications invited',url:'https://www.fca.org.uk/news/press-releases/stablecoin-payments-priority-2026-fca-outlines-growth-achievements'},
    ],
    news:[
      {title:'Bank of England says digital pound still in design phase; blueprint expected 2026',date:'Mar 2026',url:'https://www.theregister.com/2026/03/05/uk_digital_currency/'},
      {title:'Cryptoassets Regulations 2026 made by Parliament — crypto enters FCA\'s full regulatory remit',date:'Feb 2026',url:'https://www.regulatoryandcompliance.com/2026/01/cryptoassets-regulation-in-the-uk-draft-legislation-published/'},
      {title:'FCA publishes three consultation papers on new cryptoasset regime (CP25/40-42)',date:'Dec 2025',url:'https://www.skadden.com/insights/publications/2025/12/uk-legal-framework-for-crypto'},
      {title:'Property (Digital Assets etc) Act 2025 receives Royal Assent',date:'Dec 2025',url:'https://lawcom.gov.uk/news/the-property-digital-assets-etc-act-2025-has-received-royal-assent/'},
      {title:'Bank of England publishes digital pound design phase update; launches Digital Pound Lab',date:'Oct 2025',url:'https://www.bankofengland.co.uk/report/2025/digital-pound-update-october'},
      {title:'FCA announces stablecoin payments as priority for 2026',date:'2025',url:'https://www.fca.org.uk/news/press-releases/stablecoin-payments-priority-2026-fca-outlines-growth-achievements'},
    ],
    cases:[
      {title:'FCA v. HTX (Huobi) — illegal crypto financial promotions',status:'Ongoing — first-ever FCA High Court action against crypto firm',year:2025,url:'https://www.fca.org.uk/news/press-releases/fca-action-against-htx-illegal-financial-promotions'},
      {title:'R v Osunkoya — illegal crypto ATM network (28 locations)',status:'Convicted — 4 years imprisonment; first UK sentence for unregistered crypto activity',year:2025,url:'https://www.fca.org.uk/news/press-releases/olumide-osunkoya-sentenced-4-years-illegally-operating-crypto-atm-network'},
      {title:'R v Zhimin Qian — GBP 4.8B Bitcoin laundering (61,000 BTC)',status:'Convicted — 11 years 8 months; largest UK crypto seizure',year:2025,url:'https://news.met.police.uk/news/woman-convicted-following-worlds-largest-seizure-501569'},
      {title:'FCA crypto ATM seizure — Southwest London',status:'Under investigation — 7 ATMs seized, 2 arrested',year:2025,url:'https://www.fca.org.uk/news/press-releases/seven-crypto-atms-seized-two-arrested-suspicion-illegal-cryptoasset-exchange'},
    ]},
  JP:{name:'Japan',status:'legal',summary:'Evolving from Payment Services Act framework to full securities-law treatment under FIEA. Tax reform cutting crypto rate from 55% to 20% (effective 2027). First regulated yen-backed stablecoins launched. Mt. Gox repayments ongoing.',
    legislation:[
      {title:'Payment Services Act — Crypto Asset Provisions',year:2017,note:'Established JFSA registration requirement for Crypto Asset Exchange Service Providers',url:'https://maint.loc.gov/law/help/cryptocurrency/japan.php'},
      {title:'Financial Instruments and Exchange Act — Security Tokens',year:2019,note:'Tokenized securities and ICO tokens with investment characteristics under securities regulation',url:'https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-laws-and-regulations/japan/'},
      {title:'PSA Amendment — Stablecoin Framework (EPIs)',year:2023,note:'Created "Electronic Payment Instruments" category; only licensed banks/trust companies may issue',url:'https://cryptoforinnovation.org/policy-brief-summary-of-japanese-fsa-crypto-asset-and-stablecoins-framework/'},
      {title:'2023 Corporate Crypto Tax Reform',year:2023,note:'Eliminated tax on unrealized gains for corporate crypto holders',url:'https://www.tokyofoundation.org/research/detail.php?id=993'},
      {title:'PSA Amendment 2025 — Crypto Intermediary Service',year:2025,note:'New registration regime for intermediary-only operators (brokering without custody)',url:'https://practiceguides.chambers.com/practice-guides/fintech-2025/japan/trends-and-developments'},
      {title:'FIEA Reclassification of Crypto as Financial Products',year:2026,note:'FSA proposes reclassifying ~105 crypto assets under FIEA with disclosure and insider-trading rules',url:'https://www.theblock.co/post/378993/japan-reclassify-crypto-tax-relief'},
      {title:'2026 Tax Reform — 20% Separate Taxation',year:2027,note:'Individual crypto gains taxed at flat 20.315% (down from up to 55%); 3-year loss carryforward',url:'https://www.coindesk.com/markets/2025/12/01/japan-to-cut-crypto-tax-burden-to-20-uniform-rate-in-boost-for-local-bitcoin-traders/'},
    ],
    news:[
      {title:'SBI Holdings targets Q2 2026 launch for bank-backed yen stablecoin (JPYSC)',date:'Dec 2025',url:'https://www.japantimes.co.jp/business/2025/12/16/tech/sbi-stablecoin/'},
      {title:'FSA finalizes plan to reclassify crypto as financial products; 20% tax rate approved',date:'Dec 2025',url:'https://www.coindesk.com/markets/2025/12/01/japan-to-cut-crypto-tax-burden-to-20-uniform-rate-in-boost-for-local-bitcoin-traders/'},
      {title:'JPYC launches Japan\'s first legally recognized yen-pegged stablecoin',date:'Oct 2025',url:'https://www.coindesk.com/markets/2025/10/27/japan-s-new-yen-pegged-stablecoin-is-asia-s-only-truly-global-token'},
      {title:'Mt. Gox extends creditor repayment deadline to Oct 2026; ~34,689 BTC still to distribute',date:'Mid 2025',url:'https://finance.yahoo.com/news/mt-gox-pushes-back-bitcoin-115946910.html'},
      {title:'Coincheck lists on Nasdaq through SPAC merger',date:'Dec 2024',url:'https://www.theblock.co/post/330284/major-japanese-trading-platform-coincheck-becomes-second-crypto-exchange-to-go-public-on-nasdaq'},
      {title:'DMM Bitcoin shuts down after $305M hack (North Korea attribution); assets to SBI VC Trade',date:'Dec 2024',url:'https://www.coindesk.com/business/2024/12/02/japanese-crypto-exchange-dmm-bitcoin-to-shut-down-after-305-m-hack'},
      {title:'Mt. Gox begins creditor repayments in BTC and BCH via Kraken, Bitstamp, BitGo',date:'Jul 2024',url:'https://finance.yahoo.com/news/mt-gox-bitcoin-billions-being-205609624.html'},
    ],
    cases:[
      {title:'Mt. Gox Civil Rehabilitation — ongoing repayments',status:'~19,500 creditors reimbursed; ~34,689 BTC remaining; deadline Oct 2026',year:2014,url:'https://coinmarketcap.com/academy/article/mt-gox-extends-creditor-repayment-deadline-to-2026'},
      {title:'Coincheck NEM Hack — JFSA enforcement',status:'Resolved — all 260,000 users repaid; Coincheck now Nasdaq-listed',year:2018,url:'https://cointelegraph.com/learn/articles/crypto-regulations-in-japan'},
      {title:'DMM Bitcoin Hack — JFSA business improvement order',status:'Resolved — exchange shut down; assets transferred to SBI VC Trade',year:2024,url:'https://www.coindesk.com/business/2024/12/02/japanese-crypto-exchange-dmm-bitcoin-to-shut-down-after-305-m-hack'},
      {title:'Mark Karpeles criminal trial (Mt. Gox)',status:'Acquitted of embezzlement; convicted of data falsification; suspended sentence',year:2019,url:'https://www.japantimes.co.jp/news/2019/03/15/national/crime-legal/mtgox/'},
    ]},
  IN:{name:'India',status:'partial',summary:'No comprehensive crypto law exists. Regulation via patchwork of 30% income tax + 1% TDS on VDAs (Finance Act 2022), PMLA amendments, and 18% GST on platform fees (July 2025). SEBI monitoring tokens resembling securities from April 2025.',
    legislation:[
      {title:'Finance Act 2022 — Section 115BBH (30% VDA Tax)',year:2022,note:'Flat 30% tax on all crypto gains; no loss set-off or carry-forward allowed',url:'https://www.indiacode.nic.in/bitstream/123456789/17641/1/a2022-6.pdf'},
      {title:'Finance Act 2022 — Section 194S (1% TDS)',year:2022,note:'1% TDS on VDA transfers above ₹10K threshold; created transaction paper trail',url:'https://taxguru.in/income-tax/taxation-cryptocurrency-virtual-digital-assets-india-understanding-sections-115bbh-194s-method-taxation.html'},
      {title:'Finance Act 2022 — RBI Act Amendment (CBDC basis)',year:2022,note:'Amended RBI Act to define "bank note" to include digital form, enabling Digital Rupee',url:'https://synergialegal.com/visualizing-the-digital-rupee-legal-foundation-for-indias-cbdc/'},
      {title:'PMLA 2002 — VDA Notification (7 Mar 2023)',year:2023,note:'Brought all VDA activities under anti-money laundering rules; exchanges become reporting entities to FIU-IND',url:'https://blogs.law.ox.ac.uk/oblb/blog-post/2023/07/digital-assets-indian-anti-money-laundering-regime'},
      {title:'IMF-FSB Synthesis Paper (G20 Presidency)',year:2023,note:'India-led global crypto policy framework; shaped domestic regulation-over-prohibition approach',url:'https://www.fsb.org/2023/09/imf-fsb-synthesis-paper-policies-for-crypto-assets/'},
      {title:'GST Council Clarification — 18% on Crypto Fees',year:2025,note:'18% GST on all exchange service fees (trading, staking, withdrawals); not on crypto itself',url:'https://www.gripinvest.in/blog/cryptocurrency-tax-india'},
      {title:'Cryptocurrency & Regulation of Official Digital Currency Bill',year:2021,note:'Listed in Lok Sabha but never introduced; remains shelved pending global consensus',url:'https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-laws-and-regulations/india/'},
    ],
    news:[
      {title:'RBI proposes linking BRICS nations\' CBDCs at 2026 summit',date:'Early 2026',url:'https://www.pymnts.com/cbdc/2026/india-wants-brics-nations-to-link-digital-currencies/'},
      {title:'Finance Bill 2025 expands VDA definition; 18% GST on crypto trading from July 2025',date:'Jul 2025',url:'https://coindcx.com/blog/cryptocurrency/crypto-legal-status-in-india/'},
      {title:'WazirX resumes operations after $230M hack restructuring; 85% funds returned',date:'Oct 2025',url:'https://finance.yahoo.com/news/240m-hacked-crypto-exchange-wazirx-134155027.html'},
      {title:'RBI launches next CBDC pilot phase — deposit tokenisation trials begin',date:'Oct 2025',url:'https://coindcx.com/blog/crypto-news-global/rbi-india-cbdc-digital-rupee/'},
      {title:'49 crypto exchanges register with FIU-IND in FY 2024-25; ₹28 Cr penalties imposed',date:'Apr 2025',url:'https://beincrypto.com/india-crypto-exchanges-aml-registration-fiu/'},
      {title:'Delhi High Court seeks RBI, SEBI, Finance Ministry views on VDA regulation',date:'Jan 2025',url:'https://www.policycircle.org/policy/crypto-regulation-india-sebi/'},
      {title:'Tax authorities uncover $124M in hidden crypto income in FY 2024-25 crackdown',date:'2025',url:'https://www.ainvest.com/news/india-sends-44-057-crypto-tax-notices-scrutiny-intensifies-2508/'},
      {title:'Binance registers with FIU-IND after paying ₹188 Cr fine — largest crypto penalty',date:'Aug 2024',url:'https://www.businesstoday.in/technology/news/story/crypto-exchange-binance-achieves-legal-status-in-india-registers-with-financial-intelligence-unit-441692-2024-08-16'},
      {title:'WazirX suffers $230M hack linked to North Korea\'s Lazarus Group',date:'Jul 2024',url:'https://en.wikipedia.org/wiki/2024_WazirX_hack'},
    ],
    cases:[
      {title:'IAMAI v. Reserve Bank of India (Supreme Court)',status:'Decided — RBI crypto ban struck down as disproportionate',year:2020,url:'https://www.legalbites.in/landmark-judgements/case-summary-internet-and-mobile-association-of-india-v-reserve-bank-of-india-2020-cryptocurrency-case-1069763'},
      {title:'ED vs. WazirX / Zanmai Labs (PMLA & FEMA)',status:'Ongoing — ₹64.67 Cr assets frozen',year:2022,url:'https://business.outlookindia.com/news/enforcement-directorate-ed-raids-premises-of-wazirx-crypto-exchange-freezes-bank-balances-news-214459'},
      {title:'FIU-IND vs. Binance & 8 offshore exchanges',status:'Resolved — ₹188 Cr fine paid, Binance registered',year:2024,url:'https://www.coindesk.com/policy/2024/06/20/binance-fined-22-million-by-indias-financial-intelligence-unit'},
      {title:'ED vs. Vauld / Flipvolt Technologies (PMLA)',status:'Ongoing — ₹370 Cr assets frozen',year:2022,url:'https://www.coindesk.com/policy/2022/08/12/indian-authorities-freeze-nearly-46m-assets-of-troubled-crypto-lender-vauld-report'},
      {title:'GainBitcoin Ponzi Scheme — CBI/ED (₹6,600 Cr)',status:'Ongoing — CBI raids 60+ locations Feb 2025',year:2018,url:'https://inc42.com/buzz/cbi-raids-60-locations-across-india-in-inr-6600-cr-gainbitcoin-crypto-scam/'},
      {title:'DGGI: GST evasion by 17 crypto platforms (₹824 Cr)',status:'Ongoing — partial recovery',year:2024,url:'https://www.business-standard.com/finance/news/authorities-book-17-crypto-platforms-for-gst-evasion-of-rs-824-14-cr-124120200813_1.html'},
      {title:'Income Tax Dept: 44,000+ notices to crypto traders',status:'Ongoing — mass enforcement',year:2025,url:'https://www.ainvest.com/news/india-sends-44-057-crypto-tax-notices-scrutiny-intensifies-2508/'},
    ]},
  AE:{name:'UAE',status:'legal',summary:'Multi-layered regulation: VARA (Dubai), ADGM/FSRA (Abu Dhabi), SCA (federal), CBUAE (central bank). Federal Decree Law No. 6 (Sep 2025) brings DeFi and all blockchain infrastructure under CBUAE criminal enforcement. First dirham-backed stablecoin approved Feb 2026.',
    legislation:[
      {title:'Dubai Law No. 4 of 2022 — VARA Establishment',year:2022,note:'Created world\'s first independent virtual-assets regulator covering all of Dubai',url:'https://rulebooks.vara.ae/rulebook/law-no-4-2022-regulating-virtual-assets-emirate-dubai'},
      {title:'VARA Rulebooks — 13 Compulsory & Activity-Specific',year:2023,note:'5 compulsory + 8 activity-specific rulebooks covering AML, marketing, technology governance',url:'https://rulebooks.vara.ae/'},
      {title:'ADGM DLT Foundations Regulations',year:2023,note:'World\'s first purpose-built legislative framework for DLT foundations (DAOs)',url:'https://www.adgm.com/media/announcements/adgm-introduces-the-worlds-first-dlt-foundations-regime'},
      {title:'CBUAE Payment Token Services Regulation',year:2024,note:'Stablecoin issuers must obtain CBUAE approval; 100% backing in segregated accounts',url:'https://rulebook.centralbank.ae/en/rulebook/payment-token-services-regulation'},
      {title:'ADGM FSRA Digital Asset Framework Amendments',year:2025,note:'Notification-based token listings; express ban on privacy tokens and algorithmic stablecoins',url:'https://www.kslaw.com/news-and-insights/adgm-fsra-implements-amendments-to-its-digital-asset-regulatory-framework'},
      {title:'Federal Decree Law No. 6 of 2025 — Banking & Financial Institutions',year:2025,note:'Brings DeFi, DEXs, wallets, bridges, tokenized RWA under CBUAE; fines up to AED 1B (~$272M)',url:'https://www.coindesk.com/policy/2025/11/26/new-uae-sweeping-banking-decree-looks-to-cement-country-s-global-crypto-position'},
    ],
    news:[
      {title:'VARA orders KuCoin to halt all unlicensed crypto services in Dubai',date:'Mar 2026',url:'https://www.theblock.co/post/392633/dubai-regulator-orders-kucoin-to-halt-unlicensed-crypto-services'},
      {title:'CBUAE approves first dirham-backed stablecoin "DDSC" on ADI Chain',date:'Feb 2026',url:'https://www.emirates247.com/business/economy-finance/uae-central-bank-authorizes-first-dirham-backed-stablecoin-2026-02-12-1.744037'},
      {title:'RAKBank receives CBUAE in-principle approval for AED-backed stablecoin',date:'Late 2025',url:'https://finance.yahoo.com/news/rakbank-wins-approval-aed-stablecoin-100933569.html'},
      {title:'VARA sanctions 19 crypto firms for unlicensed operations — fines up to $163K each',date:'Oct 2025',url:'https://cointelegraph.com/news/vara-fines-19-unlicensed-crypto-firms-dubai'},
      {title:'Federal Decree Law No. 6 pulls DeFi, DEXs, and all blockchain infra under CBUAE',date:'Sep 2025',url:'https://www.databirdjournal.com/posts/uaes-federal-decree-law-no-6-of-2025-the-end-of-the-just-code-defense-for-defi-and-the-dawn-of-comprehensive-crypto-regulation'},
      {title:'Binance awarded full VARA licence; OKX, Bybit, Crypto.com also licensed',date:'2024',url:'https://sumsub.com/blog/crypto-in-the-uae-regulation-licensing/'},
      {title:'ADGM FSRA bans privacy tokens and algorithmic stablecoins',date:'Jun 2025',url:'https://www.kslaw.com/news-and-insights/adgm-fsra-implements-amendments-to-its-digital-asset-regulatory-framework'},
    ],
    cases:[
      {title:'VARA v. KuCoin — cease and desist order',status:'Active — all unlicensed services ordered halted',year:2026,url:'https://www.cryptotimes.io/2026/03/06/dubais-vara-orders-kucoin-to-halt-all-crypto-operations/'},
      {title:'VARA enforcement wave — 19 firms sanctioned',status:'Concluded — fines AED 100K-600K each; all ordered to halt',year:2025,url:'https://finance.yahoo.com/news/dubai-regulator-vara-sanctions-19-144833305.html'},
      {title:'VARA v. OPNX (Three Arrows Capital founders)',status:'Concluded — cease-and-desist for operating without authorization',year:2023,url:'https://cryptopotato.com/dubai-regulator-vara-issues-cease-and-desist-orders-to-2-crypto-exchanges/'},
      {title:'VARA v. BitOasis — licence suspension',status:'Concluded — MVP licence suspended for non-compliance',year:2023,url:'https://www.financemagnates.com/cryptocurrency/bitoasis-license-suspended-in-dubai-over-non-compliance-allegations/'},
    ]},
  BR:{name:'Brazil',status:'partial',summary:'Law 14,478/2022 established regulatory framework. BCB designated as primary regulator (Nov 2025 resolutions set operational rules). Drex CBDC pilot pivoted to centralized architecture for 2026 Phase 1. Existing operators must obtain BCB authorization by Oct 2026.',
    legislation:[
      {title:'Law No. 14,478/2022 — Legal Framework for Virtual Assets',year:2022,note:'Defines virtual assets, establishes VASP licensing, criminalizes crypto fraud',url:'https://www.loc.gov/item/global-legal-monitor/2023-01-31/brazil-new-law-regulates-cryptocurrency/'},
      {title:'Decree No. 11,563/2023 — Regulation of Law 14,478',year:2023,note:'Delegated regulatory authority to Banco Central; preserved CVM jurisdiction over securities tokens',url:'https://www.demarest.com.br/en/federal-government-publishes-decree-11563-2023-which-regulates-the-legal-framework-for-virtual-assets-in-brazil/'},
      {title:'BCB Resolution No. 519/2025 — VASP Authorization',year:2025,note:'Authorization process for VASPs including capital requirements and governance standards',url:'https://www.felsberg.com.br/en/brazil-virtual-asset-framework-519-520-521/'},
      {title:'BCB Resolution No. 520/2025 — Operations & Prudential Standards',year:2025,note:'Core operational framework: custody, cybersecurity, reporting. Compliance deadline Oct 2026',url:'https://www.chainalysis.com/blog/brazil-crypto-asset-regulatory-framework-2025/'},
      {title:'BCB Resolution No. 521/2025 — Foreign Exchange & Self-Hosted Wallets',year:2025,note:'Integrates virtual asset transfers into forex framework; requires wallet owner identification',url:'https://notabene.id/post/brazils-central-bank-regulates-virtual-asset-service-providers-what-bcb-resolutions-mean-for-crypto-compliance'},
      {title:'Drex (CBDC) Framework — Wholesale Digital Real',year:2026,note:'Phase 1 targets 2026 with centralized architecture after blockchain privacy issues identified',url:'https://www.ainvest.com/news/brazil-central-bank-advances-drex-cbdc-2026-centralized-model-2508/'},
    ],
    news:[
      {title:'BCB unveils institutional crypto rules through 2027',date:'Feb 2026',url:'https://www.nyohoka.com/2026/02/brazil-tightens-crypto-grip-central.html'},
      {title:'Mercado Bitcoin outlines 6 crypto trends shaping markets in 2026',date:'Jan 2026',url:'https://www.coindesk.com/business/2026/01/10/brazilian-exchange-mercado-bitcoin-outlines-6-crypto-trends-shaping-markets-in-2026'},
      {title:'Mercado Bitcoin commits EUR 50M to Portugal for European expansion',date:'Nov 2025',url:'https://www.coindesk.com/business/2025/11/12/mercado-bitcoin-commits-eur-50m-to-portugal-as-it-pushes-for-european-expansion'},
      {title:'Operation Deep Hunt: Binance aids Brazil in $30M+ crypto cybercrime bust',date:'Jul 2025',url:'https://www.trmlabs.com/resources/blog/operation-deep-hunt-unravels-164-million-crypto-cybercrime-syndicate-in-brazil'},
      {title:'STJ rules crypto is seizable property in enforcement proceedings',date:'May 2025',url:'https://www.jonesday.com/en/insights/2025/05/brazil-greenlights-the-seizure-of-crypto-in-enforcement-proceedings'},
      {title:'Crypto activity in Brazil rises 43% with average investment surpassing $1,000',date:'2025',url:'https://www.tradingview.com/news/cointelegraph:b953de4e8094b:0-crypto-activity-in-brazil-rises-43-with-average-investment-surpassing-1-000-report/'},
    ],
    cases:[
      {title:'Braiscompany Ponzi Scheme — R$1.1B fraud, 20,000 victims',status:'Convicted — 3 leaders sentenced to combined 171 years',year:2025,url:'https://www.coindesk.com/policy/2025/04/18/leaders-of-usd190m-brazilian-crypto-ponzi-scheme-sentenced-to-over-170-years-in-prison'},
      {title:'STJ landmark ruling — crypto as seizable property',status:'Decided — unanimously held crypto is "an asset with economic value"',year:2025,url:'https://www.jonesday.com/en/insights/2025/05/brazil-greenlights-the-seizure-of-crypto-in-enforcement-proceedings'},
      {title:'Operation Deep Hunt — R$164M crypto laundering syndicate',status:'32 arrested; R$112M in assets seized',year:2025,url:'https://www.trmlabs.com/resources/blog/operation-deep-hunt-unravels-164-million-crypto-cybercrime-syndicate-in-brazil'},
      {title:'US-Brazil transnational cryptocurrency fraud ring',status:'Disrupted — joint ICE/HSI investigation',year:2024,url:'https://www.ice.gov/news/releases/us-brazil-investigation-leads-disruption-transnational-cryptocurrency-fraud-ring'},
    ]},
};

const COLOR = { legal:'#8bc9a4', partial:'#edc978', restricted:'#e8948e', default:'#d4cdc4' };

function getColor(status) {
  if (!status) return COLOR.default;
  const s = status.toLowerCase();
  if (s === 'legal' || s.includes('friend')) return COLOR.legal;
  if (s === 'partial' || s.includes('moderate') || s.includes('neutral')) return COLOR.partial;
  if (s === 'restricted' || s.includes('restrict') || s.includes('ban')) return COLOR.restricted;
  return COLOR.default;
}

function getCode(props) {
  return props['ISO3166-1-Alpha-2'] || props.ISO_A2 || props.iso_a2 || '';
}

function getName(props) {
  return props.name || props.ADMIN || props.NAME || '';
}

export default function Map({ selectedCountry, onCountrySelect, data }) {
  const [tooltip, setTooltip] = useState({ visible:false, x:0, y:0, name:'', status:'' });
  const [position, setPosition] = useState({ coordinates:[0, 20], zoom:1.2 });

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--bg-primary)', position:'relative' }}>
      <ComposableMap
        projection="geoMercator"
        style={{ width:'100%', height:'100%' }}
        projectionConfig={{ scale: 140 }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={setPosition}
          minZoom={0.8}
          maxZoom={8}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => geographies.map(geo => {
              const code = getCode(geo.properties);
              const info = data[code];
              const isSelected = selectedCountry && selectedCountry.code === code;
              const statusColor = getColor(info && info.status);
              const fill = isSelected ? statusColor : statusColor;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => onCountrySelect({
                    code,
                    name: (info && info.name) || getName(geo.properties),
                    status: (info && info.status) || null,
                    summary: (info && info.summary) || null,
                    legislation: (info && info.legislation) || [],
                    news: (info && info.news) || [],
                    cases: (info && info.cases) || [],
                  })}
                  onMouseEnter={(evt) => setTooltip({
                    visible: true,
                    x: evt.clientX + 12,
                    y: evt.clientY - 36,
                    name: (info && info.name) || getName(geo.properties),
                    status: (info && info.status) || 'No data',
                  })}
                  onMouseMove={(evt) => setTooltip(t => ({ ...t, x: evt.clientX + 12, y: evt.clientY - 36 }))}
                  onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
                  style={{
                    default: { fill, stroke: isSelected ? '#3a3530' : '#e5ddd3', strokeWidth: isSelected ? 1.2 : 0.4, outline:'none' },
                    hover:   { fill: statusColor, stroke:'#3a353066', strokeWidth:0.8, outline:'none', cursor:'pointer', filter:'brightness(1.08)' },
                    pressed: { fill: statusColor, outline:'none' },
                  }}
                />
              );
            })}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip.visible && (
        <div style={{
          position:'absolute', left:tooltip.x, top:tooltip.y,
          pointerEvents:'none', background:'#fff',
          border:'1px solid #e5ddd3', borderRadius:6, padding:'8px 12px',
          fontSize:12, fontFamily:'EB Garamond, serif', color:'#3a3530',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
          whiteSpace:'nowrap', zIndex:100,
        }}>
          {tooltip.name}
          <span style={{ marginLeft:8, color:getColor(tooltip.status), fontSize:10 }}>
            {tooltip.status}
          </span>
        </div>
      )}

      <div style={{
        position:'absolute', bottom:16, left:16,
        fontSize:10, fontFamily:'EB Garamond, serif',
        color:'#b0a89e', letterSpacing:'0.08em',
      }}>
        SCROLL TO ZOOM · DRAG TO PAN · CLICK COUNTRY
      </div>
    </div>
  );
}