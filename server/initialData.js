export const initialData = {
  siteSettings: {
    siteName: 'Niyam Insights',
    tagline: 'A regulatory navigation and interpretation platform',
    definitionNoun: 'noun',
    definitionPronunciation: '/ˈnɪ.yəm/ (nee-yum)',
    definitionHindi: 'नियम',
    definitionParagraph:
      'Niyam refers to rule, order, or governing principle. In modern institutions, it appears as regulations and compliance frameworks that quietly shape how capital markets operate. Niyam Insights applies this idea of order to financial market regulation.',
    whyItExistsShort:
      'Capital market regulation is extensive, but difficult to navigate for founders and investment professionals. Niyam Insights exists to make regulatory frameworks readable and intelligible for people who operate regulated institutions.',
    whyItExistsFull: `Capital market regulation is extensive, but understanding it is rarely simple.

Regulatory obligations evolve through regulations, circulars, amendments, clarifications, and enforcement actions. These are written to be legally precise and regulator-focused. They are not always intuitive for founders, chief investment officers, or fund managers whose primary responsibility is investment decision-making and long-term performance.

This creates a recurring problem.
Obligations are understood late. Regulatory intent is missed. Compliance becomes reactive rather than designed into the structure of the institution.

Niyam Insights exists to reduce this gap by making regulation readable, navigable, and intelligible for the people who operate within regulated financial systems.`,
    whatItDoesShort:
      'Niyam Insights organises publicly available regulatory material by regulator and intermediary, focusing on how rules operate in practice rather than how they are drafted.',
    whatItDoesFull: `Niyam Insights organises publicly available regulatory material by regulator and by intermediary, rather than by document type.

Regulatory frameworks are presented under authorities such as:
• Securities and Exchange Board of India (SEBI)
• International Financial Services Centres Authority (IFSCA)

Within each regulator, content is structured by intermediary, including:
• Investment Adviser (IA)
• Research Analyst (RA)
• Portfolio Manager (PMS)
• Alternative Investment Fund (AIF)

For each intermediary, Niyam Insights:
• links original regulations, circulars, and directions directly from the regulator
• explains regulatory intent in clear, non-legal language
• highlights responsibilities that materially affect operations and governance
• distinguishes formal requirements from practical expectations observed in supervisory practice

Interpretation is always clearly separated from original source material.`,
    whoItIsForShort:
      'Designed for founders, chief investment officers, fund managers, and serious learners who value understanding before execution.',
    whoItIsForFull: `Niyam Insights is intended for:
• founders and promoters of regulated financial intermediaries
• chief investment officers and fund managers seeking regulatory clarity without legal noise
• senior professionals working across multiple licences
• students who want to understand regulation as a living system rather than an examination subject

The platform is not designed for speed or virality.
It is designed for people who value understanding before execution.`,
    disclaimerShort: 'Content is for educational and informational purposes only.',
    disclaimerFull: `Niyam Insights curates and explains publicly available regulatory information issued by regulators such as the Securities and Exchange Board of India (SEBI) and the International Financial Services Centres Authority (IFSCA). The content is provided solely for educational and informational purposes.

Niyam Insights does not provide legal, compliance, investment, or regulatory advice, and does not undertake advisory or execution services. Readers should refer to original regulatory documents and consult qualified professionals where required.

Niyam Insights is an independent knowledge initiative, not an advisory or execution platform.`,
  },

  regulators: [
    {
      id: 'sebi',
      name: 'Securities and Exchange Board of India',
      shortName: 'SEBI',
      slug: 'sebi',
      tagline: 'Statutory market regulator protecting investor interests and promoting capital market development in India',
      established: 'April 12, 1992 (SEBI Act, 1992)',
      headquarters: 'SEBI Bhavan, Bandra Kurla Complex, Mumbai, Maharashtra',
      website: 'https://www.sebi.gov.in',
      themeColor: '#0D274D',
      badgeColor: '#1E3A8A',
      isPublished: true,
      about:
        'The Securities and Exchange Board of India was established on April 12, 1992 in accordance with the provisions of the Securities and Exchange Board of India Act, 1992. SEBI is tasked with protecting the interests of investors in securities, promoting the development of securities markets, and regulating the market through rules, registration standards, supervision, and enforcement.',
      frameworks: [
        {
          id: 'sebi-act-1992',
          title: 'SEBI Act, 1992',
          code: 'Act No. 15 of 1992',
          summary: 'The primary statutory enactment establishing the Board, defining its regulatory purview, adjudicatory mechanisms, investigation and search powers, and appellate hierarchies via SAT and Supreme Court.',
          docUrl: 'https://www.sebi.gov.in/acts/act15_92.html',
        },
        {
          id: 'intermediaries-reg-2008',
          title: 'Intermediaries Regulations, 2008',
          code: 'SEBI (Intermediaries) Reg.',
          summary: 'Consolidated umbrella framework governing common registration procedures, Fit and Proper Person criteria, cancellation/suspension proceedings, and overarching code of conduct standards.',
          docUrl: 'https://www.sebi.gov.in/legal/regulations/may-2008/securities-and-exchange-board-of-india-intermediaries-regulations-2008_136.html',
        },
        {
          id: 'pit-regulations-2015',
          title: 'Prohibition of Insider Trading (PIT), 2015',
          code: 'SEBI (PIT) Reg., 2015',
          summary: 'Statutory mandate preventing asymmetrical market manipulation, handling of Unpublished Price Sensitive Information (UPSI), Structured Digital Database (SDD) compliance, and pre-clearance protocols.',
          docUrl: 'https://www.sebi.gov.in/legal/regulations/jan-2015/sebi-prohibition-of-insider-trading-regulations-2015-issued-on-15-jan-2015_28945.html',
        },
        {
          id: 'kyc-pmla-framework',
          title: 'KYC & PMLA Master Framework',
          code: 'PMLA 2002 & SEBI Master Circular',
          summary: 'Anti-money laundering standards, Central KYC Records Registry (CKYCR) processes, Client Due Diligence (CDD), ultimate beneficial ownership (UBO) identification, and suspicious transaction reporting to FIU-IND.',
          docUrl: 'https://www.sebi.gov.in',
        },
      ],
    },
    {
      id: 'ifsca',
      name: 'International Financial Services Centres Authority',
      shortName: 'IFSCA',
      slug: 'ifsca',
      tagline: 'Unified statutory regulator for international financial services in GIFT IFSC, India',
      established: 'April 27, 2020 (IFSCA Act, 2019)',
      headquarters: 'PRAGYA, GIFT City, Gandhinagar, Gujarat - 382355',
      website: 'https://www.ifsca.gov.in',
      themeColor: '#084B83',
      badgeColor: '#0E7490',
      isPublished: true,
      about:
        'The International Financial Services Centres Authority (IFSCA) is a unified regulator established in 2020 under the IFSCA Act, 2019. It exercises the powers of four major domestic regulators (RBI, SEBI, IRDAI, and PFRDA) in the GIFT International Financial Services Centre, providing a globally benchmarked regulatory ecosystem for cross-border capital, fund management, and fintech.',
      frameworks: [
        {
          id: 'ifsca-act-2019',
          title: 'IFSCA Act, 2019',
          code: 'Act No. 50 of 2019',
          summary: 'Foundational statutory legislation consolidating authority over financial products, financial services, and financial institutions operating within Indian Special Economic Zones designated as IFSCs.',
          docUrl: 'https://www.ifsca.gov.in/Legal/Index/Act',
        },
        {
          id: 'ifsca-fm-reg-2022',
          title: 'IFSCA (Fund Management) Regulations, 2022',
          code: 'Gazette No. IFSCA/2022-23/GN/REG024',
          summary: 'The comprehensive single-window regulatory code governing Authorised FMEs, Registered FMEs (Non-Retail & Retail), Venture Capital schemes, Family Offices, and ESG mandates in GIFT City.',
          docUrl: 'https://www.ifsca.gov.in/Legal/Index/Regulations',
        },
        {
          id: 'ifsca-aml-cft-2022',
          title: 'IFSCA Anti-Money Laundering & CFT Guidelines',
          code: 'IFSCA Master Direction 2022',
          summary: 'Global FATF-compliant risk-based anti-money laundering, counter-terrorist financing, and sanctions screening governance for IFSC registered entities.',
          docUrl: 'https://www.ifsca.gov.in',
        },
      ],
    },
  ],

  intermediaries: [
    {
      id: 'sebi-pms',
      regulatorId: 'sebi',
      name: 'Portfolio Managers (PMS)',
      shortCode: 'PMS',
      slug: 'pms',
      description: 'Discretionary, Non-Discretionary, and Advisory portfolio management services provided to high-net-worth individuals and institutional mandates.',
      isActive: true,
      sortOrder: 1,
      minTicket: '₹50 Lakhs per client',
      minNetWorth: '₹5 Crores',
      regulationsYear: '2020 (Principal)',
    },
    {
      id: 'sebi-ia',
      regulatorId: 'sebi',
      name: 'Investment Advisers (IA)',
      shortCode: 'IA',
      slug: 'ia',
      description: 'Entities providing investment advice concerning securities or investment products for consideration, under strict fiduciary segregation.',
      isActive: false,
      sortOrder: 2,
      minTicket: 'No statutory minimum',
      minNetWorth: '₹50 Lakhs (Corp) / ₹5 Lakhs (Ind)',
      regulationsYear: '2013',
    },
    {
      id: 'sebi-ra',
      regulatorId: 'sebi',
      name: 'Research Analysts (RA)',
      shortCode: 'RA',
      slug: 'ra',
      description: 'Entities preparing or publishing research reports, recommendations, price targets, or opinion on listed securities.',
      isActive: false,
      sortOrder: 3,
      minTicket: 'N/A',
      minNetWorth: '₹25 Lakhs (Corp) / ₹1 Lakh (Ind)',
      regulationsYear: '2014',
    },
    {
      id: 'sebi-aif',
      regulatorId: 'sebi',
      name: 'Alternative Investment Funds (AIF)',
      shortCode: 'AIF',
      slug: 'aif',
      description: 'Privately pooled investment vehicles established in India collecting funds from sophisticated investors across Category I, II, and III.',
      isActive: false,
      sortOrder: 4,
      minTicket: '₹1 Crore (Standard) / ₹25 Lakh (Angel)',
      minNetWorth: 'Varies by Category',
      regulationsYear: '2012',
    },
    {
      id: 'ifsca-fme',
      regulatorId: 'ifsca',
      name: 'Fund Management Entity (FME - Non-retail / Cat III equivalent)',
      shortCode: 'FME',
      slug: 'fme',
      description: 'Entities registered in GIFT IFSC authorized to manage non-retail schemes (Category III AIF equivalent, hedge funds, private equity) and overseas client mandates.',
      isActive: true,
      sortOrder: 1,
      minTicket: '$150,000 USD (Accredited)',
      minNetWorth: '$500,000 USD',
      regulationsYear: '2022',
    },
  ],

  documents: [
    {
      id: 'doc-pms-reg-2020',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      category: 'Regulations',
      title: 'SEBI (Portfolio Managers) Regulations, 2020 (Principal Enactment)',
      date: '2020-01-16',
      version: 'Principal Regulation (as amended up to Dec 2023)',
      summary: 'Replaced the 1993 Regulations to elevate net-worth criteria to ₹5 Cr, raise minimum investment ticket to ₹50 Lakh, standardize fee disclosures, and mandate independent custodian appointments.',
      pdfUrl: 'https://www.sebi.gov.in/legal/regulations/jan-2020/securities-and-exchange-board-of-india-portfolio-managers-regulations-2020_45695.html',
      originalRegulatorUrl: 'https://www.sebi.gov.in/legal/regulations/jan-2020/securities-and-exchange-board-of-india-portfolio-managers-regulations-2020_45695.html',
      isPublished: true,
    },
    {
      id: 'doc-pms-reg-amend-2023',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      category: 'Regulations',
      title: 'SEBI (Portfolio Managers) (Amendment) Regulations, 2023',
      date: '2023-04-20',
      version: 'Gazette Notification No. SEBI/LAD-NRO/GN/2023/125',
      summary: 'Introduced framework for Co-investment Portfolio Managers, dematerialization requirements for all investor holdings, and enhanced client reporting periodicity.',
      pdfUrl: 'https://www.sebi.gov.in/legal/regulations/apr-2023/securities-and-exchange-board-of-india-portfolio-managers-amendment-regulations-2023_70233.html',
      originalRegulatorUrl: 'https://www.sebi.gov.in',
      isPublished: true,
    },
    {
      id: 'doc-pms-master-circ-2023',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      category: 'Master Circulars',
      title: 'Master Circular for Portfolio Managers',
      date: '2023-03-20',
      version: 'SEBI/HO/IMD/IMD-PoD-1/P/CIR/2023/38',
      summary: 'Consolidation of all operational circulars issued up to March 2023 covering client onboarding, KYC procedures, fee computation rules, performance calculation, and supervisory audit mandates.',
      pdfUrl: 'https://www.sebi.gov.in/legal/master-circulars/mar-2023/master-circular-for-portfolio-managers_69248.html',
      originalRegulatorUrl: 'https://www.sebi.gov.in/legal/master-circulars/mar-2023/master-circular-for-portfolio-managers_69248.html',
      isPublished: true,
    },
    {
      id: 'doc-pms-circ-bench-2022',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      category: 'Circulars',
      title: 'Performance Benchmarking and Reporting of Portfolio Management Services',
      date: '2022-12-16',
      version: 'SEBI/HO/IMD/IMD-I/DOF1/P/CIR/2022/173',
      summary: 'Mandated standardization of investment strategies into Equity, Debt, Hybrid, and Multi-Asset with designated benchmark indices and APMI verification.',
      pdfUrl: 'https://www.sebi.gov.in/legal/circulars/dec-2022/performance-benchmarking-and-reporting-of-portfolio-management-services-pms-_66282.html',
      originalRegulatorUrl: 'https://www.sebi.gov.in',
      isPublished: true,
    },
    {
      id: 'doc-pms-circ-direct-2020',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      category: 'Circulars',
      title: 'Direct Onboarding of Clients by Portfolio Managers without Distributor Intermediation',
      date: '2020-02-13',
      version: 'SEBI/HO/IMD/DF1/CIR/P/2020/26',
      summary: 'Mandates that PMS providers must provide an explicit option to clients to onboard directly without paying any distribution fee or commission.',
      pdfUrl: 'https://www.sebi.gov.in/legal/circulars/feb-2020/direct-onboarding-of-clients-by-portfolio-managers_45995.html',
      originalRegulatorUrl: 'https://www.sebi.gov.in',
      isPublished: true,
    },
    {
      id: 'doc-pms-circ-cyber-2023',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      category: 'Circulars',
      title: 'Cybersecurity & Cyber Resilience Framework for Portfolio Managers',
      date: '2023-11-03',
      version: 'SEBI/HO/ITD/ITD-PoD-1/P/CIR/2023/178',
      summary: 'Establishes mandatory protocols for data encryption in transit & rest, multi-factor authentication for client portals, periodic VAPT, and SOC monitoring.',
      pdfUrl: 'https://www.sebi.gov.in',
      originalRegulatorUrl: 'https://www.sebi.gov.in',
      isPublished: true,
    },
    {
      id: 'doc-ifsca-fm-reg-2022',
      regulatorId: 'ifsca',
      intermediaryId: 'ifsca-fme',
      category: 'Regulations',
      title: 'IFSCA (Fund Management) Regulations, 2022',
      date: '2022-04-19',
      version: 'Comprehensive Unified Code',
      summary: 'Unifies fund management activities across Retail, Non-Retail, Venture Capital, and Portfolio Management schemes in GIFT City IFSC.',
      pdfUrl: 'https://www.ifsca.gov.in/Legal/Index/Regulations',
      originalRegulatorUrl: 'https://www.ifsca.gov.in',
      isPublished: true,
    },
    {
      id: 'doc-ifsca-fme-circ-2023',
      regulatorId: 'ifsca',
      intermediaryId: 'ifsca-fme',
      category: 'Master Circulars',
      title: 'Consolidated Master Circular for Registered Fund Management Entities in IFSC',
      date: '2023-06-12',
      version: 'IFSCA/2023-24/MC/001',
      summary: 'Consolidates operational guidelines on permissible investments, USD capital adequacy, fund borrowing limits, co-investment vehicles, and statutory filings.',
      pdfUrl: 'https://www.ifsca.gov.in',
      originalRegulatorUrl: 'https://www.ifsca.gov.in',
      isPublished: true,
    },
  ],

  interpretations: [
    {
      id: 'interp-pms-sebi',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      title: 'Niyam Insights: Operating Architecture & Supervisory Expectations for Portfolio Managers (PMS)',
      summary:
        'A structural analysis of fiduciary duties, client asset segregation, fee calculation mechanisms, and supervisory focus areas for SEBI-registered Portfolio Managers.',
      lastUpdated: '2024-03-20',
      downloadPdfUrl: '',
      isPublished: true,
      intent: `The SEBI Portfolio Managers framework is fundamentally engineered around individual fiduciary custody and segregation of client holdings.

Unlike mutual funds or AIFs where unit net asset values (NAVs) pool gains and losses across an omnibus structure, PMS involves individual client accounts managed on a discretionary or non-discretionary basis.

The regulatory architecture prioritises:
1. Complete transparency of individual holding ownership (direct demat account segregation).
2. Elimination of principal-agent conflicts in execution (fair allocation across accounts).
3. Prevention of opaque fee extractions (strict High-Water Mark enforcement).`,
      practicalExpectations: `While the written regulations lay down formal structural parameters, supervisory inspections and SEBI thematic audits consistently evaluate five practical operational expectations:

1. Fair Allocation Algorithms in Bunch Orders:
When executing institutional bunch orders across discretionary accounts, the PMS must deploy pre-trade automated allocation logic. Executed prices must be averaged mathematically; allocating favorable fills to priority accounts is a serious violation.

2. High-Water Mark (HWM) Integrity:
Performance fees can only be charged if the portfolio exceeds the previous highest watermark, net of all management fees, custodial expenses, and statutory taxes. Supervisory practice requires historical HWM tracking across the entire client relationship lifecycle.

3. Direct Onboarding Protocol:
SEBI expects portfolio managers to prominently display direct onboarding options on websites and agreement forms, ensuring direct investors are never burdened with distributor trailing amortizations.

4. Daily-plus-T Holding Reconciliations:
Custodians and PMS operations teams must reconcile bank balances, corporate action entitlements (dividends, splits), and demat balances on every settlement day.`,
      governanceImpact: `Key structural governance requirements under Regulation 7 and Regulation 22:
• Capital Adequacy: Net worth of minimum ₹5 Crore maintained continuously (not just at year-end).
• Qualified Principal Officer: Minimum 5 years of fund management experience with NISM Series XXI-A certification.
• Mandatory Custodian: Every PMS must appoint an independent SEBI-registered custodian for custody of securities.
• Compliance Officer: Exclusive appointment charged with monitoring PIT Structured Digital Database (SDD) logs and SEBI complaints portal (SCORES).`,
      sections: [
        {
          title: 'Distinguishing Discretionary vs. Non-Discretionary Mandates',
          content:
            'In Discretionary PMS, the manager exercises unfettered investment discretion within the agreed strategy parameters without prior client sign-off. In Non-Discretionary PMS, every buy/sell trade requires recorded, timestamped client consent before order placement. Hybrid arrangements are impermissible.',
          callout: 'Audit Trail Requirement: Non-discretionary PMS without timestamped pre-trade consent is treated as unauthorized trading under SEBI supervisory scrutiny.',
        },
        {
          title: 'Permissible Investments & Strategy Classification',
          content:
            'SEBI restricts investment of client funds to listed securities, units of mutual funds, money market instruments, and unlisted securities up to a strict statutory ceiling (25% for discretionary portfolios). PMS cannot invest client funds in derivative contracts for speculation—derivatives are permissible only for portfolio hedging and rebalancing.',
          callout: 'Investment strategies must be officially tagged under Equity, Debt, Hybrid, or Multi-Asset and linked to APMI benchmark indices.',
        },
      ],
    },
    {
      id: 'interp-fme-ifsca',
      regulatorId: 'ifsca',
      intermediaryId: 'ifsca-fme',
      title: 'Niyam Insights: Operating Framework for GIFT City Fund Management Entities (FME)',
      summary: 'Navigating the unified IFSCA fund management regime for Non-Retail schemes, offshore feeder structures, and cross-border capital deployment.',
      lastUpdated: '2024-03-10',
      downloadPdfUrl: '',
      isPublished: true,
      intent: `IFSCA's Fund Management Regulations, 2022 represent a deliberate shift toward a unified, principles-based international regime.

Unlike the fragmented domestic regime with separate registrations for PMS, AIFs, and offshore managers, IFSCA enables a single registered FME (Non-Retail) to operate multiple schemes, offer portfolio management, and launch hedge fund strategies under a single corporate licence in GIFT City.`,
      practicalExpectations: `Key supervisory expectations in GIFT IFSC:
1. Substance Requirements: Real management control, qualified Key Managerial Personnel (KMP) stationed in GIFT City, and documented decision-making processes.
2. USD Accounting & Denomination: Books of account and scheme units must be denominated in freely convertible foreign currencies (principally USD).
3. Leverage and Borrowing Limits: Non-retail schemes can deploy leverage up to scheme disclosure thresholds, subject to robust risk models.`,
      governanceImpact: `• Minimum Net Worth: USD 500,000 for Non-Retail Registered FME.
• Principal Officer & Compliance Officer stationed in GIFT City.
• Direct access to international brokers, custodians, and clearing houses without onshore capital controls.`,
      sections: [
        {
          title: 'Cat-III Equivalent Hedge Funds in GIFT City',
          content:
            'Non-retail FMEs can structure closed-ended or open-ended alternative funds investing across global equities, commodities, derivatives, and Indian onshore securities via the FPI route with pass-through tax benefits.',
          callout: 'Tax Advantage: 100% tax holiday for 10 out of 15 years under Section 80LA of the Indian Income Tax Act.',
        },
      ],
    },
  ],

  blogs: [
    {
      id: 'note-pms-valuation-2024',
      title: "SEBI's Revised Valuation Framework for Discretionary PMS Portfolios: Operational Implications",
      slug: 'sebi-revised-valuation-framework-pms',
      type: 'regulatory_note',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      regulatorTag: 'SEBI',
      intermediaryTag: 'PMS',
      date: '2024-02-18',
      excerpt:
        'A detailed breakdown of the mandatory independent valuation benchmarks, illiquid security handling, and audit trails required under the latest supervisory circulars.',
      content: `### Context & Regulatory Objective

Valuation integrity is central to investor trust in discretionary portfolio management services. When portfolios hold illiquid bonds, unlisted equity, or thinly-traded securities, subjective valuations directly distort performance reporting and high-water mark calculations.

SEBI has systematically closed valuation discretion by standardizing valuation methodologies across registered intermediaries.

---

### Core Operational Shifts

#### 1. Independent Third-Party Valuation Mandate
Portfolio Managers can no longer rely solely on in-house valuation formulas for illiquid or unlisted debt instruments. Valuations must be referenced from designated credit rating agencies and independent valuation service providers recognized by the Association of Portfolio Managers in India (APMI).

#### 2. Treatment of Stressed Assets & Defaults
In the event of a credit downgrade below investment grade or technical default:
* The impairment must be factored into client portfolio valuations within T+1 days.
* Portfolio managers cannot withhold marking down securities to preserve artificial performance metrics.

#### 3. High-Water Mark Adjustments
Any impairment reversal must follow conservative accrual standards before contributing to performance fee calculations.

---

### Key Action Items for CIOs and Compliance Teams

1. **Review Custodial Valuation Feeds**: Verify that your primary custodian integrates the mandated daily matrix prices directly into portfolio management software.
2. **Audit Policy Documentation**: Update the firm's Valuation Policy to explicitly mirror APMI circular standards.
3. **Disclosure Form Alignment**: Ensure Form C disclosures provided to prospective clients include the exact valuation methodology for non-standard assets.`,
      featuredImage: '',
      pdfUrl: '/uploads/sample-regulatory-note.pdf',
      metaTitle: "SEBI's Revised Valuation Framework for Discretionary PMS Portfolios",
      metaDescription: "Operational implications of SEBI's valuation mandates for Portfolio Managers in India.",
      readTime: '5 min read',
      isPublished: true,
      createdAt: '2024-02-18T10:00:00Z',
    },
    {
      id: 'note-ifsca-fme-cat3-2024',
      title: 'IFSCA Non-Retail FME: Setting up a Cat-III Equivalent Offshore Fund in GIFT City',
      slug: 'ifsca-non-retail-fme-cat3-offshore-fund',
      type: 'regulatory_note',
      regulatorId: 'ifsca',
      intermediaryId: 'ifsca-fme',
      regulatorTag: 'IFSCA',
      intermediaryTag: 'FME',
      date: '2024-01-25',
      excerpt:
        'Key structural advantages, minimum sponsor commitment rules, and tax efficiency comparisons between domestic AIF Cat III and GIFT FME regimes.',
      content: `### The Emergence of GIFT IFSC for Global Asset Allocators

For fund managers seeking to pool global capital for investment into India and overseas markets, the IFSCA Non-Retail FME registration represents the most compelling structural vehicle created in Indian financial history.

---

### Key Structural Highlights

* **Licence Flexibility**: A single Non-Retail FME registration allows launching multiple close-ended and open-ended funds, managing private mandates, and providing portfolio advisory without separate sub-registrations.
* **Currency Mechanics**: All funds, management fees, and distributions operate in foreign currency (predominantly USD), eliminating domestic exchange controls (FEMA restrictions do not apply inside IFSC).
* **Tax Architecture**: Eligible FMEs enjoy a 10-year 100% corporate tax exemption under Section 80LA, and non-resident investors are exempt from GST and securities transaction taxes in GIFT City.

---

### Regulatory Roadmap to Launch

1. Incorporation of a GIFT City Company / LLP.
2. Filing Form A with IFSCA under Fund Management Regulations, 2022.
3. Deputation of Principal Officer & Compliance Officer in GIFT City.
4. Fund Scheme filing under the Green Channel route (fast-track 21-day timeline).`,
      featuredImage: '',
      pdfUrl: '/uploads/sample-regulatory-note.pdf',
      metaTitle: 'IFSCA Non-Retail FME: Setting up a Cat-III Equivalent Offshore Fund',
      metaDescription: 'Complete structural guide to launching a fund management entity in GIFT City IFSC.',
      readTime: '6 min read',
      isPublished: true,
      createdAt: '2024-01-25T14:30:00Z',
    },
    {
      id: 'note-pms-affiliated-brokers-2023',
      title: 'Managing Conflicts in Affiliated Brokerage Routing for Registered Portfolio Managers',
      slug: 'managing-conflicts-affiliated-brokerage-pms',
      type: 'regulatory_note',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      regulatorTag: 'SEBI',
      intermediaryTag: 'PMS',
      date: '2023-11-12',
      excerpt:
        'Examining SEBI’s 20% cap on related-party broker routing, best execution reporting, and quarterly compliance certificates.',
      content: `### Supervisory Context

A core area of supervisory focus in SEBI inspections is the relationship between registered Portfolio Managers and their sister brokerage entities.

When portfolio managers route substantial trade volumes through group stockbrokers, regulators scrutinize whether client interests are subordinate to group commission generation.

---

### The 20% Statutory Cap Rule

Under Regulation 24(4) and subsequent SEBI clarifications:
* Total brokerage paid to an associate or group stockbroker cannot exceed **20% of the total brokerage paid** across all brokers by the PMS in any quarter.
* Discretionary accounts must obtain prior written consent from clients before routing any trade through an associate broker.

---

### Best Execution Protocols

To defend against allegations of favoritism or excess churn:
1. Maintain quantitative Best Execution reports comparing execution prices against volume-weighted average price (VWAP).
2. Document broker selection matrices evaluating research quality, algorithmic capabilities, and execution speed.`,
      featuredImage: '',
      pdfUrl: '/uploads/sample-regulatory-note.pdf',
      metaTitle: 'Managing Conflicts in Affiliated Brokerage Routing for PMS',
      metaDescription: 'Regulatory compliance requirements for related-party stockbroker routing under SEBI.',
      readTime: '4 min read',
      isPublished: true,
      createdAt: '2023-11-12T09:15:00Z',
    },
    {
      id: 'note-pms-digital-execution-2023',
      title: 'Digital Execution and Electronic Signature Framework for Intermediary Client Agreements',
      slug: 'digital-execution-electronic-signatures-pms',
      type: 'regulatory_note',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      regulatorTag: 'SEBI',
      intermediaryTag: 'PMS',
      date: '2023-09-05',
      excerpt:
        'Navigating Aadhaar e-Sign, DigiLocker integration, and timestamped audit logs for seamless client onboarding.',
      content: `### Modernizing the Client Onboarding Pipeline

With the acceleration of digital wealth platforms, physical wet-ink signature execution of lengthy Discretionary Portfolio Management agreements has transitioned to digital onboarding frameworks.

---

### Regulatory Compliance Mandates

* **Information Technology Act, 2000 Compliance**: Electronic signatures must utilize Certifying Authority (CA) backed signatures (such as Aadhaar e-Sign with OTP or digital signature certificates).
* **Audit Trail Retention**: The PMS platform must store an immutable audit log capturing IP address, timestamp, device identifier, and SMS OTP verification logs for at least 8 years.
* **Direct Client Confirmation**: The client must be provided an instant downloadable copy of the executed agreement with all schedules and fee matrices clearly populated.`,
      featuredImage: '',
      pdfUrl: '/uploads/sample-regulatory-note.pdf',
      metaTitle: 'Digital Execution and Electronic Signature Framework for PMS',
      metaDescription: 'How portfolio managers can achieve compliant digital onboarding with e-signatures.',
      readTime: '4 min read',
      isPublished: true,
      createdAt: '2023-09-05T11:00:00Z',
    },

    // Long-Form Blogs
    {
      id: 'blog-architecture-discipline-2024',
      title: 'The Architecture of Capital Market Discipline: Understanding Niyam in Institutional Governance',
      slug: 'architecture-capital-market-discipline-niyam',
      type: 'blog',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      regulatorTag: 'SEBI',
      intermediaryTag: 'Governance',
      date: '2024-03-01',
      excerpt:
        'Why proactive regulatory comprehension creates durable competitive moats for Indian asset managers and financial founders.',
      content: `### The Meaning of Niyam in Capital Markets

In classical Sanskrit philosophy, *Niyam* (नियम) signifies the fundamental principles of discipline, order, and governance that allow complex, unpredictable systems to thrive.

Without rules, market ecosystems devolve into short-term rent-seeking and trust deficits. In institutional capital markets, regulation is not a hurdle or bureaucratic drag; it is the infrastructure of market integrity that allows strangers to pool billions of rupees in long-term enterprise.

---

### The Modern Institutional Dilemma

Most financial institutions treat compliance as a reactive defense mechanism:
* An amendment circular is published.
* The legal team creates an addendum to the agreement.
* Operations scrambles to update client forms.
* The CIO views the entire exercise as friction.

This reactive posture fails because modern regulators—whether SEBI in Mumbai or IFSCA in GIFT City—are increasingly supervisory and algorithmic. They do not merely inspect whether a paper form exists; they evaluate the **underlying operational architecture**.

---

### Regulation as a Competitive Moat

Founders and Chief Investment Officers who master regulatory intent gain two profound advantages:

1. **Institutional Investor Appeal**: Sovereign wealth funds, global family offices, and institutional allocators perform deep due diligence on fiduciary architecture. A firm with pristine segregation, clean valuation models, and automated compliance commands premium institutional trust.
2. **Speed to Market**: When new regulatory opportunities arise—such as Co-investment PMS or GIFT IFSC Non-Retail FME licences—teams that understand regulatory logic can structure and launch products months before competitors navigate the circulars.

Niyam Insights was founded precisely to elevate regulatory knowledge from dry legal jargon into strategic institutional clarity.`,
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      pdfUrl: '',
      metaTitle: 'The Architecture of Capital Market Discipline | Niyam Insights',
      metaDescription: 'Why proactive regulatory comprehension creates durable competitive moats for asset managers.',
      readTime: '7 min read',
      isPublished: true,
      createdAt: '2024-03-01T08:00:00Z',
    },
    {
      id: 'blog-fiduciary-duty-ambiguity-2024',
      title: 'Fiduciary Duty Beyond Compliance: How Fund Managers Should Navigate Supervisory Ambiguity',
      slug: 'fiduciary-duty-beyond-compliance-fund-managers',
      type: 'blog',
      regulatorId: 'sebi',
      intermediaryId: 'sebi-pms',
      regulatorTag: 'SEBI',
      intermediaryTag: 'PMS',
      date: '2024-02-05',
      excerpt:
        'Moving from reactive tick-box compliance to structural governance that aligns CIO incentives with regulator intent.',
      content: `### The Limits of Black-Letter Law

Regulations are written in definitive statutory prose, but the real world of market volatility, counterparty stress, and novel financial instruments exists in gray areas.

When supervisory scrutiny arrives, regulators do not ask, *"Did you technically comply with the phrasing of clause 4(b)?"* 

They ask: **"Did your actions reflect the highest standard of fiduciary care toward the client?"**

---

### Three Fiduciary Touchstones for Asset Managers

#### 1. Information Asymmetry and Disclosures
The fiduciary obligation requires not merely disclosing risks in 8-point font in an annexure, but ensuring that investment mandates, drawdown tolerances, and concentration limits are actively understood and consented to by the investor.

#### 2. Trade Allocation Integrity
During market shocks, when liquidity dries up, the order in which client trades are executed reveals institutional character. Automated algorithms that eliminate subjective trader discretion are essential evidence of fiduciary integrity.

#### 3. Fee Transparency
High-water mark calculations, brokerage sharing, and custodial expense pass-throughs must be mathematically unimpeachable.

Fiduciary duty is not a document; it is an active discipline practiced daily across investment and operational workflows.`,
      featuredImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
      pdfUrl: '',
      metaTitle: 'Fiduciary Duty Beyond Compliance | Niyam Insights',
      metaDescription: 'Navigating supervisory expectations and fiduciary governance in portfolio management.',
      readTime: '6 min read',
      isPublished: true,
      createdAt: '2024-02-05T12:00:00Z',
    },
    {
      id: 'blog-gift-city-evolution-2024',
      title: 'GIFT City as a Global Regulatory Sandbox: The Evolution of IFSCA’s Unified Regime',
      slug: 'gift-city-global-regulatory-sandbox-ifsca',
      type: 'blog',
      regulatorId: 'ifsca',
      intermediaryId: 'ifsca-fme',
      regulatorTag: 'IFSCA',
      intermediaryTag: 'FME',
      date: '2024-01-10',
      excerpt:
        'How IFSCA’s principles-based approach contrasts with prescription-heavy domestic frameworks, and what it means for global allocators.',
      content: `### A Unified Gateway for Cross-Border Capital

For decades, global capital entering India took circuitous routes through Singapore, Mauritius, or the Cayman Islands due to domestic regulatory friction and exchange control complexity.

The establishment of the International Financial Services Centres Authority (IFSCA) in GIFT City represents an institutional attempt to onshore this offshore financial ecosystem.

---

### Why the IFSCA Model is Structurally Different

1. **Unified Jurisdiction**: Instead of coordinating between multiple domestic regulators with overlapping mandates, an entity in GIFT City interacts with one unified authority.
2. **Principles-Based Guidance**: IFSCA regulations emphasize governance outcomes and risk management over hyper-prescriptive procedural micro-management.
3. **Global Currency Freedom**: Operating natively in USD eliminates currency conversion slippage and capital repatriation hurdles.

For asset managers and financial innovators, GIFT City is not just a tax-advantaged zone—it is a progressive regulatory sandbox engineered for global scale.`,
      featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      pdfUrl: '',
      metaTitle: 'GIFT City as a Global Regulatory Sandbox | Niyam Insights',
      metaDescription: 'Examining the evolution of IFSCA unified fund management regime in GIFT City.',
      readTime: '8 min read',
      isPublished: true,
      createdAt: '2024-01-10T09:30:00Z',
    },
  ],
};
