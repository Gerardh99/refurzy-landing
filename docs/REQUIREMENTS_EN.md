# Refurzy — Product Requirements Document

**Version:** 4.0
**Date:** 21 March 2026
**Platform:** refurzy.com (Next.js + Vercel)

---

## 1. Overview

Refurzy is a recruitment platform that combines scientifically validated matching (Matching Scan, developed with VU Amsterdam) with a network of independent Talent Scouts. The platform operates on a no cure, no pay basis.

### User Roles

| Role | Description |
|------|-------------|
| **Employer** | Company looking for personnel |
| **Talent Scout** | Independent recruiter who nominates candidates |
| **Candidate** | Person introduced through a Talent Scout |
| **Refurzy Admin** | Platform administrator |

---

## 2. Matching Scan & M-Score

- **Matching Scan**: 35-question questionnaire based on VU Amsterdam research
- **M-Score**: Result of the scan (0-100%), measures match on culture, values and interests
- **Dimensions**: Based on Kristof-Brown et al. Person-Environment Fit theory
- **M-Score ≥80%**: Activates Fit Guarantee (12 months)

### Matching Scan Logic

1. **Base Matching Scan (one-time)**: The candidate completes the full Matching Scan once (35 questions covering all dimensions: job activities, values and organization). This is the base scan.
2. **Supplementary scan per vacancy**: Per vacancy, only the "job activities" dimension (19 questions) needs to be repeated to arrive at a definitive M-Score. Values and organization characteristics (dim 2+3, 16 questions) are reused.
3. **Indicative M-Score**: If a candidate has completed the base scan, ALL new vacancies immediately receive an **indicative M-Score** based on available data (values + organization + most recently completed job activities). Candidates who have completed the base scan will therefore NEVER see "Complete the Matching Scan".
4. **Vacancy status `scan_aanvullen`**: Vacancies for which the job activities dimension has not yet been completed vacancy-specifically receive the status `scan_aanvullen` (fill in supplementary questions). After completing the 19 job activities questions, the indicative M-Score is converted into a definitive M-Score.
5. **Status `scan_nodig`**: Only candidates who have NEVER completed the base scan receive the status `scan_nodig`. Once the base scan has been completed, this status is never used again.

---

## 3. Pricing Model

### Formula
```
Fee = Experience Points × Education Points × Value per Point (€1,200 NL)
```

### Points Matrix

| Work Experience | Points | MBO | HBO | WO |
|----------------|--------|-----|-----|-----|
| 0-2 years | 1 | €1,800 | €2,400 | €3,600 |
| 2-5 years | 2 | €3,600 | €4,800 | €7,200 |
| 5-10 years | 3 | €5,400 | €7,200 | €10,800 |
| >10 years | 4 | €7,200 | €12,000* | €12,000* |

*>10 year rule: HBO and WO receive the same multiplier (2.5) to prevent price decreases.*

### Distribution
- 50% Scout fee (excl. VAT)
- 50% Refurzy fee (excl. VAT)

### VAT & Payout
- **All prices on the platform are exclusive of VAT**
- **Individual scout (no CoC)**: receives 50% of the fee excl. VAT (gross). No payroll tax — Refurzy reports annually to the Tax Authority via IB-47. Scout is personally responsible for income tax
- **Pro Scout (with CoC)**: receives 50% of the fee excl. VAT + 21% VAT on top. Invoices as entrepreneur
- **Automatic invoicing**: After each successful placement, Refurzy automatically generates an invoice
- **Payout trigger**: Scout is paid out once the employer has paid
- **Employer pays**: Placement fee + 21% VAT via credit card

### No Cure, No Pay
Employer only pays upon signing the employment contract.

### Exclusivity (optional, +25%)

When creating a vacancy, the employer can activate exclusivity:

- **Mechanism**: Nominated candidates are exclusively available for 14 days and are not offered to other employers for vacancies in the same professional field (vakgebied). Applications in other professional fields continue unaffected — a vacancy in a completely different field is not a competitor for your position.
- **Surcharge**: +25% on top of the standard placement fee (calculated on the base fee excl. VAT)
- **Irrevocable**: Once activated, exclusivity **cannot** be deactivated for that vacancy
- **Rationale**: Irrevocability prevents gaming (turning on exclusivity to block candidates, then turning it off to avoid the surcharge)
- **Surcharge distribution**: 50/50 scout/Refurzy (same split as the base fee)
- **Visibility**: Scouts see that a vacancy is exclusive → extra motivation to nominate strong candidates

**Example**: WO + 5-10 years = €10,800 base fee → with exclusivity: €10,800 + €2,700 = €13,500 excl. VAT

### Candidate Block Upon Nomination

Once a candidate is nominated for a vacancy, they are blocked from nomination to other vacancies **in the same professional field (vakgebied)**. Nominations in other professional fields continue unaffected. The duration of the block depends on the vacancy type and the outcome of the process:

#### Standard Vacancy (without exclusivity)
| Situation | Block |
|-----------|-------|
| Candidate is nominated and in active pipeline | Blocked in the same professional field as long as the process runs |
| Candidate is rejected | Immediately available for new nominations |
| Nomination expires (employer doesn't respond within 7 days) | Immediately available for new nominations |
| Candidate is hired | Permanently blocked (removed from talent pool) |

#### Exclusive Vacancy (+25%)
| Situation | Block |
|-----------|-------|
| Candidate is nominated | Blocked in the same professional field for at least 14 days, even if rejected within those 14 days |
| After 14 days + rejection | Immediately available for new nominations |
| After 14 days + still in active pipeline | Blocked until end of process |
| Nomination expires (7 days no review) | Exclusivity block remains in effect until day 14 |
| Candidate is hired | Permanently blocked (removed from talent pool) |

#### Technical Enforcement
- When nominating a candidate, the platform checks whether the candidate is already in an active process or under an exclusivity block **in the same professional field**
- Scouts see a clear indicator in their talent pool when a candidate is blocked, including expected end date
- The scout **cannot** select a blocked candidate for nomination until the block has expired
- For exclusive vacancies, the 14-day clock starts at the moment of nomination, regardless of what happens in the pipeline afterward

### 15 Countries
Platform supports pricing in 15 countries with local currencies and adjustment factors.

---

## 4. Fit Guarantee

- **Condition**: M-Score ≥80%
- **Duration**: 12 months after start date
- **Coverage**: Mismatch in culture, values or interests
- **Exclusions**: Reorganization, illness, relocation, changed job content
- **Refund**: 100% of the placement fee

---

## 5. User Flows

### 5.1 Employer Flow

```
┌─────────────────────────────────────────────────────────┐
│                      EMPLOYER FLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. REGISTRATION & COMPANY PROFILE                       │
│     ├── Create account                                    │
│     ├── Enter company details (CoC, name, etc.)          │
│     └── Company profile + culture description            │
│                                                           │
│  2. CREATE VACANCY (6-step wizard)                       │
│     ├── Step 1: Title & role                              │
│     ├── Step 2: AI-generated description                  │
│     │           + professional field (autocomplete)       │
│     │           + country                                 │
│     ├── Step 3: Details + culture profile                 │
│     ├── Step 4: Hard criteria (education, experience,     │
│     │           location, office, commute)                │
│     ├── Step 5: Price & agreement                         │
│     └── Step 6: M-Score profile (15 questions, 4 cat.)   │
│                                                           │
│  3. RECEIVE CANDIDATES                                   │
│     ├── Anonymous profile with M-Score visible            │
│     ├── Hard criteria match percentage                    │
│     └── Scout rating visible                              │
│                                                           │
│  4. HIRING PIPELINE                                      │
│     ├── Nominated (anonymous)                             │
│     ├── Contract agreed (profile unlocked)                │
│     │   └── Payment details + accept terms                │
│     ├── Schedule interview (contact details visible)      │
│     │   └── Date entry required                           │
│     ├── Interview scheduled                               │
│     │   └── Mark as completed                             │
│     ├── Give feedback (required for next step)            │
│     │   ├── Star rating                                   │
│     │   └── Text feedback                                 │
│     ├── Determine next step                               │
│     │   ├── Schedule follow-up interview                  │
│     │   ├── Discuss employment terms                      │
│     │   └── Reject (reason + scout rating)                │
│     ├── Employment terms                                  │
│     │   ├── Contract signed → CELEBRATION!                │
│     │   └── Schedule another interview                    │
│     └── Contract signed                                   │
│         ├── Congratulations emails (3x)                   │
│         ├── Credit card collection                        │
│         └── Fit Guarantee starts (12 months)              │
│                                                           │
│  REJECTION (at any time):                                │
│     ├── Select reason (dropdown)                          │
│     │   ├── Not the right experience                      │
│     │   ├── Cultural mismatch                             │
│     │   ├── Salary expectation too high                   │
│     │   ├── Another candidate chosen                      │
│     │   └── Other                                         │
│     ├── Scout rating (1-5 stars)                          │
│     └── Optional explanation                              │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Talent Scout Flow

```
┌─────────────────────────────────────────────────────────┐
│                    TALENT SCOUT FLOW                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. REGISTRATION                                         │
│     ├── Create account (as individual)                    │
│     └── Complete profile                                  │
│                                                           │
│  2. BUILD TALENT POOL                                    │
│     ├── Invite candidates (email)                         │
│     ├── Candidates complete Matching Scan                 │
│     └── Upload CV                                         │
│                                                           │
│  3. VIEW VACANCIES                                       │
│     ├── Search by title/location                          │
│     ├── Filter by professional field and country          │
│     ├── Mark favorites (star)                             │
│     ├── View hard criteria                                │
│     └── Vacancy detail with candidate list                │
│                                                           │
│  4. RECEIVE MATCHING SUGGESTIONS                         │
│     ├── Automatic notification for new vacancy            │
│     │   that matches candidates in talent pool            │
│     ├── Match based on:                                   │
│     │   ├── Hard criteria (education, experience, loc.)   │
│     │   └── M-Score (if scan is completed)                │
│     ├── Accept suggestion = nominate candidate             │
│     └── Reject suggestion = do not nominate               │
│                                                           │
│  5. NOMINATE CANDIDATE                                   │
│     ├── Manually match to vacancy                         │
│     ├── Or via matching suggestion (step 4)               │
│     ├── Candidate can be represented by multiple scouts   │
│     │   (multi-scout)                                    │
│     └── One nomination per vacancy (first-come)           │
│                                                           │
│  6. FOLLOW PIPELINE                                      │
│     ├── Overview of all nominated candidates              │
│     ├── Status per candidate (visual pipeline)            │
│     ├── Filter by status                                  │
│     └── Action indicators (orange when delayed)           │
│                                                           │
│  7. AUTOMATIC NUDGE SYSTEM (no free messages)            │
│     ├── No direct communication scout↔employer            │
│     ├── Scout provides explanation at nomination          │
│     ├── Employer provides feedback at rejection           │
│     ├── All reminders automated by Refurzy                │
│     ├── Escalation to Refurzy when overdue                │
│     └── Channel closes upon hiring or rejection           │
│                                                           │
│  8. PRO SCOUT UPGRADE (after 2 placements)              │
│     ├── Block: no new nominations possible                │
│     ├── Celebration modal: "Congratulations!"             │
│     ├── Inspiration: "Work where you want, when you want" │
│     ├── Enter CoC/company details                         │
│     │   ├── Company name *                                │
│     │   ├── CoC number * (or foreign equivalent)          │
│     │   ├── VAT number                                    │
│     │   └── Business IBAN                                 │
│     └── Pro Scout benefits:                               │
│         ├── Higher payout (no payroll tax)                │
│         ├── Unlimited scouting                            │
│         ├── Pro Scout badge                               │
│         └── Work worldwide                                │
│                                                           │
│  9. RECEIVE FEE                                          │
│     └── 50% of placement fee after contract signed        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Candidate Flow

```
┌─────────────────────────────────────────────────────────┐
│                      CANDIDATE FLOW                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. GET INVITED                                          │
│     └── Email from Talent Scout with invitation link      │
│                                                           │
│  2. CREATE PROFILE                                       │
│     ├── Personal details                                  │
│     └── Upload CV                                         │
│                                                           │
│  3. COMPLETE MATCHING SCAN                               │
│     ├── 35 questions about culture, values, interests     │
│     └── M-Score is calculated                             │
│                                                           │
│  4. FOLLOW PIPELINE (read-only)                          │
│     ├── Nominated                                         │
│     ├── Contract agreed (employer)                        │
│     ├── Interview scheduled                               │
│     ├── Employment terms                                  │
│     └── Contract signed → CELEBRATION!                    │
│                                                           │
│  5. CONGRATULATIONS ON PLACEMENT                         │
│     └── Email: "Congratulations on your new job!"         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.4 Refurzy Admin Flow

```
┌─────────────────────────────────────────────────────────┐
│                    REFURZY ADMIN FLOW                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. DASHBOARD                                            │
│     ├── Platform statistics                               │
│     └── Overview of active vacancies/placements           │
│                                                           │
│  2. PRICING MANAGEMENT                                   │
│     ├── Price matrix per country                          │
│     └── Experience/education multipliers                  │
│                                                           │
│  3. COUNTRY MANAGEMENT                                   │
│     └── 15 countries with local currencies and factors    │
│                                                           │
│  4. USER MANAGEMENT                                      │
│     └── Overview of all users per role                    │
│                                                           │
│  5. PAYOUTS                                              │
│     ├── Filter by country, year and relationship type     │
│     │   └── Private (logging required) / Business         │
│     ├── Logging status banner                            │
│     │   ├── Amber: # payments private (IB-47)            │
│     │   └── Green: # payments business (no logging)      │
│     ├── Summary per scout (aggregated)                    │
│     ├── Detail per transaction                            │
│     ├── Logging column in both tables                    │
│     │   ├── Private (no CoC): "IB-47 required"           │
│     │   └── Business (with CoC): "Not required"          │
│     ├── CSV export for tax returns                        │
│     │   ├── NL: IB-47 format                              │
│     │   ├── DE: §93c AO format                            │
│     │   ├── BE: Fiche 281.50 format                       │
│     │   ├── FR: DAS-2 format                              │
│     │   └── GB: CIS format                                │
│     └── Required fields in export:                        │
│         ├── Personal details (name, BSN/TIN, DOB,         │
│         │   address, postcode, city, country)              │
│         ├── Financial (IBAN, gross amount, scout fee,      │
│         │   currency)                                      │
│         ├── Company details (CoC, VAT, relationship type)  │
│         └── Transaction details (invoice no, dates, status)│
│                                                           │
│  6. SCAN USAGE (VU AMSTERDAM)                            │
│     ├── Log of all Matching Scan administrations          │
│     │   ├── Date + time                                   │
│     │   ├── Type (candidate / organization)               │
│     │   ├── User (name + email)                           │
│     │   ├── Vacancy + company                             │
│     │   └── Status (billable / test)                      │
│     ├── Test email configuration                          │
│     │   ├── List of test email addresses                  │
│     │   ├── Automatic test usage detection                │
│     │   └── Manual exclusion per administration           │
│     ├── Filtering: year, month, billable/test             │
│     └── CSV export of billable usage for VU               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Email Triggers

| Trigger | Recipient(s) | Content |
|---------|-------------|---------|
| Candidate invited | Candidate | Invitation link + vacancy info |
| Contract agreed | Scout | "Employer has unlocked the profile" |
| Interview scheduled | Candidate, Scout | Date + company info |
| Auto-nudge: review day 3 | Employer | "A new nomination is awaiting your review for [vacancy title]. M-Score: [X]%." |
| Auto-nudge: review day 6 | Employer | "Your review expires tomorrow. After 7 days, the nomination is automatically cancelled." |
| Auto-nudge: review expired | Scout + Employer | Scout: "Nomination expired, candidate back in pool." / Employer: "Nomination cancelled due to no response." |
| Auto-nudge: schedule interview day 4 | Employer | "You have unlocked the profile but haven't scheduled an interview yet." |
| Auto-nudge: schedule interview day 6 | Employer | "Tomorrow the deadline to schedule an interview expires." |
| Escalation: interview not scheduled | Scout + Refurzy | "Employer is not scheduling an interview after unlocking." |
| Auto-nudge: feedback day 5 | Employer | "Has the interview taken place? Please provide the outcome." |
| Auto-nudge: feedback day 6 | Employer | "Tomorrow the deadline to provide feedback expires." |
| Escalation: no feedback | Scout + Refurzy | Refurzy reaches out |
| Auto-nudge: employment terms day 10 | Employer + Scout | "The employment terms discussion has been running for 10 days. Can we help?" |
| Escalation: employment terms day 14 | Refurzy | Intervention by Refurzy |
| Rejection | Scout, Candidate | Reason + rating |
| **Contract signed** | **All three** | **Congratulations + next steps** |
| Fee paid out | Scout | Amount + invoice confirmation |
| Fit Guarantee check-in | Employer | After 3, 6 and 12 months |

---

## 7. Pipeline Statuses

```
nominated → contract_agreed → schedule_interview → interview_scheduled
                                                        ↓
                                                  provide_feedback
                                                        ↓
                                                  follow_up_interview ──→ (repeat interview cycle)
                                                        ↓
                                                  employment_terms
                                                        ↓
                                                  contract_signed  🎉

        ↕ (at any time)
     rejected (with reason + rating)
```

---

## 8. Visual Design

### Themes
| Context | Theme | Background |
|---------|-------|------------|
| Marketing (homepage, science) | Dark | `bg-navy` (#1A0F5D) |
| Temporary landing page | Dark | `bg-navy` (#1A0F5D) |
| Demo/Dashboard (all roles) | Light | `bg-surface` (#FAFBFE) |
| Sidebar (demo) | Dark | `bg-navy-light` (#231470) |

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Navy | #1A0F5D | Dark backgrounds |
| Cyan/Teal | #14CDD3 | Primary CTA, M-Score high |
| Blue | #06BAFF | Gradient, links |
| Purple | #6D40F9 | Accent, badges, scout color |
| Surface | #FAFBFE | Light theme background |
| Ink | #1E293B | Text on light theme |

### Typography
- Font: Poppins
- Landing page body: weight 300, opacity 0.6
- Dashboard body: weight 400, standard color

---

## 9. Language Support

- Dutch (default)
- English
- Toggle via `LangToggle` component in navigation
- Translations in `lib/i18n.ts` (type-safe)
- Language preference stored in localStorage

---

## 10. Technical Architecture

### Stack
- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom tokens
- **Deployment**: Vercel
- **Repository**: github.com/Gerardh99/refurzy-landing

### File Structure (key files)
```
app/
  page.tsx                           # Temporary landing page
  homepage/page.tsx                  # Full marketing homepage
  wetenschap/page.tsx                # Science page
  login/page.tsx                     # Login with demo accounts
  demo/
    layout.tsx                       # Light theme wrapper + sidebar
    opdrachtgever/
      page.tsx                       # Dashboard
      vacature-aanmaken/page.tsx     # 6-step wizard
      vacature/[id]/page.tsx         # Vacancy detail + candidates
      kandidaat/[vacatureId]/[kandidaatId]/page.tsx  # Hiring pipeline
      bedrijfsprofiel/page.tsx       # Company profile management
      instellingen/page.tsx          # Company settings
    scout/
      page.tsx                       # Talent Pool
      vacatures/page.tsx             # Vacancy browser
      vacature/[id]/page.tsx         # Vacancy detail
      pipeline/page.tsx              # Pipeline overview + nudges
      analytics/page.tsx             # Scout analytics dashboard
      kandidaat-uitnodigen/page.tsx  # Invitation form
      meldingen/page.tsx             # Notifications
      instellingen/page.tsx          # Settings & payout
    kandidaat/
      page.tsx                       # My applications
      pipeline/page.tsx              # Pipeline progress (read-only)
      profiel/page.tsx               # Manage profile
      scan/page.tsx                  # Matching Scan
    admin/
      page.tsx                       # Dashboard
      pricing/page.tsx               # Price matrix management
      landen/page.tsx                # Country configuration
      gebruikers/page.tsx            # User management
      uitbetalingen/page.tsx         # Payment overview + export

components/
  Sidebar.tsx                        # Navigation per role
  PipelineTracker.tsx                # Visual pipeline steps
  ProScoutUpgradeModal.tsx           # CoC upgrade after 2 placements
  MScore.tsx                         # M-Score circle
  StatusBadge.tsx                    # Status labels
  StarRating.tsx                     # Star rating
  LangToggle.tsx                     # NL/EN switch

lib/
  types.ts                           # TypeScript types
  mock-data.ts                       # Demo data
  pricing.ts                         # Price calculation (15 countries)
  auth.ts                            # Demo authentication
  i18n.ts                            # Translations
```

---

## 11. Invoice Module

### Automatic Invoicing
- After each successful placement (contract signed), Refurzy automatically generates an invoice
- Invoice numbering: `RF-F-[year]-[sequence number]`
- Credit note for Fit Guarantee refund: `RF-CN-[year]-[sequence number]`
- All amounts exclusive of 21% VAT

### Admin invoice overview (`/demo/admin/facturen`)
- Table with: invoice number, date, employer, vacancy, candidate, scout, amount, VAT, total, status
- Statuses: paid, outstanding, credit note
- Filters: status, employer, period (year)
- Summary stats: total revenue, paid, outstanding, credit notes
- "Download PDF" button per invoice (mock)

### Employer invoice overview (`/demo/opdrachtgever/facturen`)
- Filtered by own company
- Table with: invoice number, date, vacancy, candidate, amount excl. VAT, VAT, total, status
- Filters: paid/outstanding
- Summary stats: total invoices, paid, outstanding
- "Download PDF" button per invoice

### Scout earnings (`/demo/scout/verdiensten`)
- Summary cards: total earned, paid out, outstanding, number of placements
- Table: date, vacancy, candidate, employer, placement fee, your share (50%), status
- Introductory discount on first placement visible (25% instead of 50%)
- Statuses: paid out, outstanding, awaiting payment
- Link to full invoice page

---

## 12. Candidate Dashboard

### Dashboard (`/demo/kandidaat`)
- Welcome message: "Welcome, [name]"
- Status cards:
  - Matching Scan: "Completed" or "Not yet completed" with link to scan
  - Number of vacancies nominated for
  - Number of active processes in pipeline
- Section "My vacancies": cards per vacancy with:
  - Vacancy title + company (anonymous until contract phase)
  - M-Score percentage with color indicator
  - Pipeline status bar (nominated, interview, employment terms, contract)
  - Current step highlighted
  - Scout name and date
- Section "My documents":
  - Consent statement (signed on date)
  - Privacy statement
  - Any employment contracts

### Vacancy detail page (`/demo/kandidaat/vacature/[id]`)
- Job title, location, sector (company name NOT visible until contract phase)
- M-Score visualization (bar chart per dimension: job activities, values, organization)
- Pipeline timeline with current status
- Scout info: "Nominated by [scout name]"
- Privacy information about anonymity

---

## 13. Interactive Matching Scan

### Route: `/demo/kandidaat/matching-scan`

Interactive 35-question questionnaire based on VU Amsterdam research.

### 8 Steps
1. **Introduction** — Explanation of the scan, three dimensions, time indication (10-15 min)
2. **Job Activities - Ranking** — 19 items, ranking 1-19 via dropdown + arrows
3. **Job Activities - Rating** — 19 items, Likert scale 1-7
4. **Values - Ranking** — 9 items, ranking 1-9
5. **Values - Rating** — 9 items, Likert scale 1-9
6. **Organization Characteristics - Ranking** — 7 items, ranking 1-7
7. **Organization Characteristics - Rating** — 7 items, Likert scale 1-7
8. **Result** — POMP profile visualization (bar chart per dimension) + confirmation to save

### Items

**19 Job Activities:**
a. Facilitating people socially, b. Organizing matters, c. Financial administration, d. Processing data, e. Working with mechanics/machines, f. Working in nature/for the environment, g. Performing artistic work, h. Helping people, i. Providing specialized care, j. Doing influential work, k. Working with business systems, l. Performing quality controls, m. Doing operational work, n. Providing personal services, o. Analyzing finances, p. Conducting specialized research, q. Building/repairing, r. Providing basic services, s. Sports and games activities

**9 Values:**
a. Power, b. Achievement, c. Hedonism, d. Stimulation, e. Autonomy, f. Universalism, g. Benevolence, h. Tradition, i. Security

**7 Organization Characteristics:**
a. Detail orientation, b. Customer orientation, c. Result orientation, d. Stability orientation, e. Collaboration orientation, f. Integrity orientation, g. Innovation orientation

### UX
- Progress bar with step X of 8 + dot indicators
- "Save and continue later" button
- Validation: all items must be ranked/rated per step
- Error message for incomplete step
- Ranking: dropdown per item + up/down arrows, unique positions
- Rating: buttons 1-N, selected value highlighted in purple

---

## 14. Search & Filter Improvements

### Scout Vacancies (`/demo/scout/vacatures`)

Extended search and filter functionality for the vacancy browser.

#### Filters (collapsible filter panel)
- Sector dropdown: IT, Marketing, Finance, HR, Sales, Operations, Other
- Salary range: min-max input fields
- Contract type: Permanent, Temporary, Freelance
- Work model: On-site, Hybrid, Fully remote
- Education: MBO, HBO, WO
- Experience: 0-2, 2-5, 5-10, 10+

#### Sorting
- Newest first (default)
- Salary high-low
- Deadline

#### UX
- Active filter chips with X to remove
- Result count: "X vacancies found"
- Existing search bar and location filter retained
- Tags per vacancy card (sector, contract, work model, education, experience)

### Employer Candidates (`/demo/opdrachtgever/kandidaten`)

Overview of all nominated candidates for the employer.

#### Filters
- Vacancy dropdown (filter by specific vacancy)
- M-Score range slider (0-100%)
- Status: all, nominated, in interview, employment terms, rejected

#### Display (cards)
- Candidate name (or "Anonymous" if not unlocked)
- Vacancy name
- M-Score with color (green >80%, yellow 60-80%, red <60%)
- Status badge
- Scout name
- "View profile" button

#### Sorting
- M-Score (high-low)
- Date (newest first)
- Status

---

## 15. Fit Guarantee Module

### Employer View (`/demo/opdrachtgever/fit-garantie`)

Overview of all Fit Guarantees for the employer.

#### Active guarantee cards
- Candidate name, vacancy, placement date
- Guarantee timeline: visual bar 0-12 months with current position
- Check-in status per milestone:
  - 3 months: completed / upcoming / future
  - 6 months: completed / upcoming / future
  - 12 months: completed / upcoming / future
- M-Score at placement
- Status: Active, Expired, Claim submitted

#### Submit claim modal
- Reason dropdown: Cultural mismatch, Values mismatch, Other
- Explanation textarea
- Exclusion note: "Not applicable for: reorganization, illness, relocation, changed job content"
- Submit button with confirmation

#### Section Expired guarantees
- Expired and completed guarantees with reduced opacity

### Admin View (`/demo/admin/fit-garantie`)

Management page for all Fit Guarantee claims.

#### Statistics (4 cards)
- Active guarantees
- Claims in progress
- Approved
- Rejected

#### Claims table
- Columns: candidate, employer, vacancy, placement date, claim date, reason, status
- Status: in progress, approved, rejected
- Expandable per claim: full details + comments timeline
- Action buttons (when in progress): Approve, Reject, Add comment

---

## 16. Messaging Module

### Route: `/demo/berichten`

In-platform messaging system, accessible from all roles.

#### Layout
- Left panel: conversation list
  - Per conversation: avatar, name, last message preview, time, unread badge
  - Optional filter by vacancy
- Right panel: active conversation
  - Message thread with bubbles (left/right)
  - Timestamp per message
  - Input field "Type a message..." with send button

#### Mock conversations per role

**Scout:**
- Conversation with "HR Department TechCorp" about "Marketing Manager vacancy"
- Conversation with "Candidate Lisa J." about "Status update"

**Employer:**
- Conversation with "Scout Jan de Vries" about "Nominated candidates"

**Candidate:**
- Conversation with "My Scout - Jan de Vries" about "Vacancy update"

#### Mobile responsive
- On small screens: show list OR conversation (not both)
- Back button to go from conversation to list

#### Other
- Note at bottom: "Messages are always linked to a vacancy or candidate"
- Sidebar: "Messages" link with unread counter badge for all roles
- Sidebar: "Fit Guarantee" link under Employer and Admin navigation

---

## 17. Still to Build

### Must-have (MVP)
- [ ] CoC duplicate check at employer registration (check if CoC already exists, send request)
- [ ] Vacancy-specific invitation email for candidates (enthusiastic template with vacancy details)
- [ ] Integration of Pro Scout upgrade modal in actual scout flow (check at nomination)
- [ ] Progress indicator on scout dashboard ("2/2 placements as starter")
- [ ] Contract signed email templates (3x: employer, candidate, scout)
- [ ] Fit Guarantee check-in system (3, 6, 12 month reminders)
- [ ] Payment integration (Stripe/Mollie) for credit card collection
- [ ] Real authentication (not demo accounts)
- [ ] Database (replaces mock data)

### Should-have (Further Development)
- [ ] **AI Vacancy Text Generation with online sources** — AI searches online for similar vacancies (via Perplexity API, Tavily, or Claude with web search) to populate the "What will you do?" section with realistic, role-specific tasks. Requirements:
  - Minimum input before AI can generate: job title, location, education level, work experience
  - Context-aware generation: AI uses all filled fields (title, department, location, salary, contract type, work arrangement, department culture, experience, education)
  - Web search retrieves 3-5 similar vacancies as reference for tasks and responsibilities
  - Fallback to internal templates if web search is not available
  - Generated text is always editable by the employer
  - Language model: Dutch, professional but accessible

### Nice-to-have
- [ ] NL/EN translation for all demo pages
- [x] Dashboard analytics for admin
- [ ] Scout leaderboard / ranking
- [ ] Employer review system (public)
- [ ] Mobile responsive optimization
- [ ] Push notifications
- [ ] Vacancy-specific AI matching suggestions

---

## 18. Business Rules

1. **No cure, no pay**: No payment without signed employment contract
2. **Anonymity**: Candidate remains anonymous until employer accepts the contract
3. **CoC and relationship type**: Chamber of Commerce number is requested during onboarding (optional). With CoC = business relationship (no IB-47 logging required), without CoC = private individual (IB-47 logging required). After 2 placements as private individual, CoC must be registered (Pro Scout upgrade)
4. **No free messages**: Scouts and employers cannot communicate directly. All communication runs through structured actions (explanation at nomination, feedback at rejection) and automatic system messages. This prevents contact details from being shared outside the platform
5. **Feedback required**: Employer must give feedback before next step is possible
6. **Rejection requires reason**: Dropdown + optional explanation + scout rating (1-5)
7. **Fee distribution**: 50/50 scout/Refurzy
8. **>10 year rule**: HBO and WO receive the same multiplier (2.5) for >10 years of experience
9. **Fit Guarantee**: Only at M-Score ≥80%, 12 months, only culture/values/interests mismatch
10. **Exclusivity**: Optional 2-week exclusivity with 25% surcharge
11. **Prices excl. VAT**: All prices on the platform are exclusive of VAT
12. **Automatic invoicing**: Invoice is generated at contract signed, payout upon employer payment
13. **Pro Scout VAT**: Pro Scouts receive 50% fee + 21% VAT. Individual scouts receive 50% fee gross (no withholding, IB-47 reporting)
14. **Scout independence**: The Talent Scout works entirely at their own expense and risk. Determines independently when, how, how much and where assignments are fulfilled. No employment relationship with Refurzy.
15. **VU Amsterdam license**: Refurzy pays VU per administered Matching Scan. Internal test usage is filtered based on test email addresses. All administrations are logged with date, type, user and status.
16. **Profile reuse & scan status**: Candidate completes the base scan once (35 questions) → profile reusable across all vacancies. Values + characteristics (dim 2+3, 16 questions) are reused; only job activities (dim 1, 19 questions) are completed per vacancy anew. After completing the base scan, all new vacancies receive an indicative M-Score (status: `scan_aanvullen`). Only after completing the vacancy-specific job activities does the M-Score become definitive. Only candidates who have never completed the base scan see status `scan_nodig`.
17. **Multi-scout representation**: A candidate can be represented by multiple Talent Scouts simultaneously. Each scout can independently nominate the candidate for vacancies, provided the candidate has not already been nominated for that same vacancy by another scout (first-come-first-served). The fee goes to the scout whose nomination led to a successful placement. The candidate sees all their scouts in the dashboard; scouts only see a notice "already nominated by another scout" if another scout has already nominated the candidate for the same vacancy.
17b. **Candidate block upon nomination (per professional field)**: A candidate who is nominated for a vacancy cannot simultaneously be nominated for another vacancy **in the same professional field (vakgebied)**. Nominations in other professional fields continue unaffected — a vacancy in a completely different field is not a competitor. The block lasts as long as the process is active. Upon rejection or expired nomination, the candidate becomes immediately available — except for exclusive vacancies, where a minimum block of 14 days applies regardless of the outcome. See section 3 "Candidate Block Upon Nomination".
18. **Automatic matching suggestions**: Scouts receive automatic matching suggestions when a vacancy is published that matches candidates in their talent pool — based on hard criteria (education, experience, location) and M-Score. The scout can accept the suggestion (= nominate) or reject.
19. **Manual matching**: Scouts can also manually match candidates to vacancies, independent of automatic suggestions.
20. **Introductory discount for new scout**: A scout without track record (0 completed placements) is a higher risk for employers. To lower the barrier: the first successful placement is at 50% discount. Both the scout and Refurzy bear the discount (both receive 25% instead of 50% of the normal fee). After the first successful placement, the discount expires automatically. This is visible to the employer as a "50% introductory discount" badge for candidates from new scouts, and for the scout as an incentive to realize the first match.
21. **Return to talent pool after rejection**: When a candidate in the pipeline is rejected by the employer, the candidate automatically returns to "available" status in the scout's talent pool. The scout receives a notification. The M-Score profile remains valid and the candidate can immediately be nominated for another vacancy. Rejection reason and rating are stored (not visible to candidate, visible to scout). When a candidate withdraws (e.g., other offer), the scout can choose: "Available for other vacancies" (back to pool) or "No longer available" (inactive in pool).
22. **Automatic reminders (auto-nudges)**: Refurzy automatically sends reminders to employers when pipeline phases take too long. Scouts don't need to take any action — the system monitors lead times. When exceeded, escalation to Refurzy occurs. See section 27 for the full communication model.
22b. **Dual-status confirmation (candidate ↔ employer)**: At each pipeline step, the candidate is asked to confirm. This is a soft confirmation — the candidate is encouraged but not required. When a mismatch occurs (candidate confirms a step that the employer hasn't updated yet), the system automatically sends a nudge to the employer and a notification to the scout. The scout sees a dual indicator in the pipeline: ✓✓ = both confirmed, ✓? = employer only, ?✓ = candidate only (orange warning), ?? = neither. The candidate can also proactively report that an interview has taken place or that direct contact outside the platform has occurred (escalation to Refurzy).
23. **Exclusivity (+25%, per professional field)**: Employers can activate exclusivity when creating a vacancy. Candidates are then not offered to other vacancies **in the same professional field** for at least 14 days — even if they are rejected within those 14 days or the nomination expires. Applications in other professional fields continue unaffected — a vacancy in a completely different field is not a competitor for your position. The surcharge is 25% on top of the placement fee. Exclusivity is irrevocable per vacancy to prevent gaming. See section 3 "Candidate Block Upon Nomination" for all rules.

---

## 19. Terms & Conditions — Key Provisions

The following provisions must be included in the Terms & Conditions:

### Position of Talent Scout
- The Talent Scout is not an employee of Refurzy but an independent contractor
- The Talent Scout works entirely at their own expense and risk
- The Talent Scout independently determines when, how, how much and where they fulfill assignments
- There is no authority relationship between Refurzy and the Talent Scout
- The Talent Scout is free to work for multiple clients and platforms
- Refurzy does not give instructions on how the work is performed

### VAT & Taxes
- All stated prices and fees are exclusive of VAT
- Pro Scouts (with CoC) invoice 21% VAT on top of the scout fee
- Individual scouts receive the gross amount without tax withholding
- Refurzy reports payments to individual scouts annually to the Tax Authority (IB-47)
- The Talent Scout is personally responsible for filing and paying income tax and/or turnover tax
- For cross-border services within the EU, the reverse charge mechanism applies

### Invoicing & Payment
- After each successful placement, Refurzy automatically generates an invoice
- The employer pays the placement fee + VAT via credit card upon signing the employment contract
- The scout fee is paid out once the employer's payment is received
- Payment is made to the IBAN registered with Refurzy by the Talent Scout

### No Cure, No Pay
- Employer only pays upon signing an employment contract
- Intermediation outside the platform results in a penalty of 100% of the fee

### Fit Guarantee
- At M-Score >= 80%, a Fit Guarantee of 12 months applies
- Coverage: departure due to mismatch in culture, values or interests
- Exclusions: reorganization, illness, relocation, changed job content
- Refund: 100% of the placement fee (incl. VAT)

---

## 20. Legal Documents & Consent Logging

### Documents Overview

| No | Document | Parties | When agreed? |
|----|----------|---------|-------------|
| 01 | Terms & Conditions | All users | At registration |
| 02 | Placement Agreement | Refurzy ↔ Employer | When unlocking profile (per candidate) |
| 03 | Scout Agreement | Refurzy ↔ Talent Scout | At registration as scout |
| 04 | Privacy Policy | All visitors | At first visit (cookie banner) |
| 05 | Data Processing Agreement (Employer) | Refurzy ↔ Employer | At registration |
| 06 | Data Processing Agreement (Scout) | Refurzy ↔ Scout | At registration |
| 07 | Consent Statement | Candidate | At start of Matching Scan |
| 08 | Cookie Policy | All visitors | At first visit |
| 09 | Data Processing Agreement VU | Refurzy ↔ VU Amsterdam | Upon entering license (one-time) |

### Consent per Role at Registration

| Role | Documents |
|------|-----------|
| Employer | Terms & Conditions + Privacy Policy + Data Processing Agreement |
| Talent Scout | Scout Agreement + Terms & Conditions + Privacy Policy + Data Processing Agreement |
| Candidate | Consent Statement + Privacy Policy |

### Consent Logging — Required Fields

Each consent must be logged with:

| Field | Type | Description |
|-------|------|-------------|
| consent_id | string | Unique ID |
| user_id | string | User ID |
| user_email | string | Email address |
| user_role | enum | employer / scout / candidate / admin |
| document_type | enum | Document type (e.g., 'terms_and_conditions') |
| document_version | string | Version number (e.g., '1.0') |
| consent_given | boolean | true/false |
| consent_timestamp | ISO 8601 | Exact date and time of consent |
| ip_address | string | IP address at time of consent |
| user_agent | string | Browser user agent |
| method | enum | checkbox / click / signature |

### Versioning

- When a new version of a document is released, the user must agree again
- The old consent remains stored in the log (never overwrite)
- The current document version is centrally managed in `lib/consent-log.ts`

---

## 21. Employer Company Profile

**Route:** `/demo/opdrachtgever/bedrijfsprofiel`

Management page for the employer's company profile.

### Sections

1. **Company Details** — CoC number, company name, address, postcode, city, country, sector, website. Edit mode toggle per section.
2. **Invoice Details** — Invoice name, invoice address, VAT number, IBAN. Edit mode toggle.
3. **Contact Persons** — Table with name, email, role, active since. "Invite colleague" button.
4. **Organization M-Score Profile** — Status (completed/not completed). When completed: summary of values (dim 2) and organization characteristics (dim 3). "Edit profile" button. Note about reuse across all vacancies.
5. **Signed Contracts** — Table with contract name, vacancy, candidate, date signed, status. "Download PDF" button per contract.

### Technical
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- All fields pre-filled with mock data
- Edit mode toggle per section (company details, invoice details)

---

## 22. Scout Analytics Dashboard

**Route:** `/demo/scout/analytics`

Performance dashboard for Talent Scouts.

### Sections

1. **Stat cards (4x):**
   - Total placements: 7 (with trend ↑)
   - Average rating: 4.2/5 (from employer reviews)
   - Conversion ratio: 34% (nominated → placed)
   - Total earned: €18,400

2. **Performance per month** — CSS-only bar chart, last 6 months placements.

3. **Recent reviews** — Review cards with: employer (anonymous), vacancy, stars (1-5), date. Average prominently displayed.

4. **Top specializations** — Horizontal bar chart with success rate per sector (Marketing 45%, IT 30%, Finance 25%).

5. **Pro Scout status** — Progress bar with progress toward Pro Scout (2 placements required). Benefits list.

### Technical
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- CSS-only charts (no external chart library)

---

## 23. Admin Dashboard (improved)

**Route:** `/demo/admin`

Executive dashboard with KPIs and management tools.

### Sections

1. **KPI stat cards (6x):**
   - Active vacancies: 23
   - Placements this month: 4
   - Revenue this month: €28,800
   - Active scouts: 47
   - Active employers: 12
   - Outstanding escalations: 2

2. **Revenue overview** — CSS bar chart, monthly revenue last 6 months.

3. **Recent activity** — Activity feed with 6-8 recent platform activities (nominations, contracts, escalations, registrations).

4. **Escalations** — Table with employer, vacancy, scout, nudges sent, last nudge, action. "Call employer" button.

5. **Fit Guarantee claims** — Table with candidate, employer, placement date, claim date, reason, status (in progress/approved/rejected).

6. **Quick links** — Buttons to: Payouts, Invoices, VU Test Log, Email Templates, User Management.

### Sidebar navigation (admin)
- Dashboard, Pricing, Countries, Users, Invoices, Payouts, VU Test Log, Email Templates

### Technical
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- CSS-only charts

---

## 24. Onboarding & Registration Flows

### 24.1 Employer Onboarding

**Route:** `/demo/onboarding/opdrachtgever`

Multi-step registration wizard for new employers.

**Steps:**

| Step | Name | Fields |
|------|------|--------|
| 1 | Company Details | CoC number, company name, address, postcode, city, sector |
| 2 | Contact Person | Name, email, phone, job title |
| 3 | CoC Verification | Automatic check if CoC is already registered |
| 4 | Terms | Terms & Conditions, Privacy Policy, Data Processing Agreement (checkboxes) |
| 5 | Account Created | Confirmation page, redirect to dashboard |

**CoC Duplicate Check (Step 3):**
- System checks if CoC number already exists in the database
- **CoC doesn't exist:** Continue to step 4
- **CoC already exists:** Show message with existing company name, option to:
  - Change CoC number (back to step 1)
  - Send access request to existing account administrator
- Existing administrator receives email with request + applicant details

### 24.2 Scout Onboarding

**Route:** `/demo/onboarding/scout`

Multi-step registration wizard for new Talent Scouts.

**Steps:**

| Step | Name | Fields |
|------|------|--------|
| 1 | Personal Details | Name, email, phone, city, country, Chamber of Commerce number (optional) |
| 2 | Professional Profile | Sector expertise (multi-select), years of experience, LinkedIn URL |
| 3 | Terms | Scout Agreement, Privacy Policy, Data Processing Agreement (checkboxes) |
| 4 | Account Created | Confirmation page, redirect to scout dashboard |

**Chamber of Commerce number and relationship type (Step 1):**
- Chamber of Commerce (CoC/KVK) number is optional and accepts a maximum of 8 digits
- **With CoC number** → scout is registered as a business relationship. Payments do not need to be reported to the tax authorities.
- **Without CoC number** → scout is registered as a private individual. Payments are logged and reported annually to the tax authorities (IB-47 in the Netherlands).
- Visual indicator switches in real-time when filling in: amber badge ("Private individual") ↔ cyan badge ("Business relationship")
- This field determines the `typeRelatie` field in the database (`natuurlijk_persoon` | `zzp`)

### 24.3 Candidate Onboarding

**Route:** `/demo/onboarding/kandidaat`

Accessible via invitation link from scout. Contains context about the scout and vacancy.

**Steps:**

| Step | Name | Fields |
|------|------|--------|
| 1 | Welcome | Message: "You've been invited by [scout_name]", explanation of the process |
| 2 | Personal Details | Name, email, phone |
| 3 | Consent | Consent Statement, Privacy Policy (checkboxes) |
| 4 | Account Created | Confirmation page, redirect to Matching Scan |

### Technical (all onboarding flows)
- Light theme (`bg-surface`, `text-ink`)
- Progress stepper component at top of each page
- No authentication required (registration flow)
- After account creation: automatic login + redirect to dashboard/scan

---

## 25. Email Templates

**Route:** `/demo/admin/email-templates` (Admin only)

Overview of all 12 email templates in the system.

### Templates

| No | Template | Recipient | Trigger | Subject |
|----|----------|-----------|---------|---------|
| 01 | Candidate invitation | Candidate | Scout invites candidate | You've been invited for a unique opportunity at {{company}}! |
| 02 | Matching Scan reminder | Candidate | Scan not completed after 48h | Don't forget your Matching Scan! |
| 03 | New matching suggestion | Scout | New vacancy matches talent pool | New match found: {{vacancy_title}} at {{company}} |
| 04 | Candidate nominated | Employer | Scout nominates candidate | New candidate nominated for {{vacancy_title}} |
| 05 | Contract agreed confirmation | Scout | Employer accepts profile | Profile unlocked: {{candidate_name}} for {{vacancy_title}} |
| 06 | Interview date reminder | Candidate, Scout | 24 hours before scheduled interview | Tomorrow: interview at {{company}} for {{vacancy_title}} |
| 07 | Nudge 1 — Friendly reminder | Employer | Auto-nudge (level 1) | Reminder: schedule the interview for {{vacancy_title}} |
| 08 | Nudge 2 — Urgent reminder | Employer | Auto-nudge (level 2) | Urgent: candidate waiting for response on {{vacancy_title}} |
| 09 | Escalation to Refurzy | Admin | After 2 unanswered nudges | Escalation: no response from {{company}} on {{vacancy_title}} |
| 10 | Post-interview feedback reminder | Employer | Interview completed, no feedback after 48h | Give feedback about the interview with candidate {{initials}} |
| 11 | Congratulations contract signed | Employer, Candidate, Scout | Employment contract signed | Congratulations! Contract signed for {{vacancy_title}} |
| 12 | Fit Guarantee check-in | Employer | 3, 6 and 12 months after start date | Fit Guarantee check-in: how is {{candidate_name}} doing? |

### Congratulations Email (3 versions)
- **Employer version:** Contains invoice information + Fit Guarantee details
- **Candidate version:** Contains start date + employer contact details
- **Scout version:** Contains fee overview + payout information

### Fit Guarantee Check-in (3 moments)
- **3 months:** Early check-in — "How is the collaboration going?"
- **6 months:** Halfway check-in — Optional feedback form
- **12 months:** Final check-in — Fit Guarantee expires, evaluation

### Admin Interface
- Card grid layout with all 12 templates
- Per card: template name, recipient role, trigger event, subject line
- Click on card: expand with full HTML email preview (Refurzy branding)
- Templates use variables: {{candidate_name}}, {{scout_name}}, {{company}}, etc.

### Technical
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- Mock HTML email previews with Refurzy gradient header

---

## 26. Notification System

### NotificationBell Component

**Location:** TopBar (all roles)

- Bell icon in top-right of the topbar (next to username)
- Badge with unread count (e.g., "3")
- Click: dropdown with last 6 notifications
- Per notification: type icon, title, description, timestamp ("2 hours ago"), read/unread status
- "Mark all as read" button
- Link to full notifications page

### Notifications Page

**Route:** `/demo/notificaties` (all roles)

Full notifications page with:
- List of all notifications
- Per notification:
  - Icon per type (vacancy, match, contract, message, system)
  - Title + description
  - Timestamp (relative)
  - Read/unread toggle
  - Link to relevant page
- Filter by type (All, Vacancy, Match, Contract, Message, System)
- "Mark all as read" button
- 8-10 notifications per role (mock data)

### Notification Types

| Type | Icon | Description |
|------|------|-------------|
| vacancy | Vacancy | New vacancy, expiring soon, published |
| match | Match | New nomination, matching suggestion, M-Score calculated |
| contract | Contract | Profile unlocked, contract signed, employment terms |
| message | Message | Nudge, feedback, interview reminder |
| system | System | Welcome, registration, Pro Scout upgrade, Fit Guarantee check-in |

### Delivery per Role

| Role | Example Notifications |
|------|----------------------|
| Employer | New nomination, nudge from scout, contract ready, vacancy expiring, feedback reminder |
| Scout | Matching suggestion, profile unlocked, scan completed, contract signed, new vacancy |
| Candidate | Nominated for vacancy, interview scheduled, feedback received, scan result |
| Admin | Escalation alert, contract signed, new registration, CoC duplicate, payout |

### Technical
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- Mock data in `lib/mock-notifications.ts`
- NotificationBell component in `app/demo/components/NotificationBell.tsx`
- Notifications page in `app/demo/notificaties/page.tsx`
- TopBar updated with NotificationBell
- Sidebar updated with "Notifications" link for all roles

---

## 27. Communication Model — No Free Messages

### Principle
Scouts and employers can **never** freely communicate with each other via the platform. All communication runs through:
1. **Structured explanation** — scout writes motivation when nominating a candidate
2. **Structured feedback** — employer provides reason at rejection (dropdown + explanation)
3. **Automatic system nudges** — Refurzy sends reminders when lead times are exceeded
4. **Status updates** — scout automatically receives notifications at every status change

### Rationale
- Prevents scouts from sharing contact details and operating outside the platform
- Protects candidate anonymity (no informal messages that circumvent the system)
- Quality filter: only when an employer invests (unlocking) does a process begin
- Scouts don't need to do anything except nominate candidates — the system monitors progress

### Pipeline Phases and Maximum Lead Times

| # | Phase | Status | Max Lead Time |
|---|-------|--------|--------------|
| 1 | Nominated | `nominated` | — |
| 2 | Review | `nominated` → `contract_agreed` | 7 days |
| 3 | Profile unlocked | `contract_agreed` → `schedule_interview` | 7 days |
| 4 | Schedule interview | `schedule_interview` → `interview_scheduled` | 7 days |
| 5 | Interview scheduled | `interview_scheduled` → `provide_feedback` | 10 days |
| 6 | Provide feedback | `provide_feedback` → next step | 7 days |
| 7a | Follow-up interview | `follow_up_interview` | 10 days |
| 7b | Employment terms | `employment_terms` | 14 days |
| 8 | Hired | `contract_signed` | End |
| X | Rejected | `rejected` | End |

### Automatic System Nudges — Exact Message Texts

#### Phase 2: Review (after nomination)

| Day | To | Message |
|-----|-----|---------|
| Day 3 | Employer | "A new nomination is awaiting your review for **[vacancy title]**. The candidate has an M-Score of **[X]%**. View the nomination in your dashboard." |
| Day 6 | Employer | "Your review for a nomination on **[vacancy title]** expires tomorrow. After 7 days, the nomination is automatically cancelled and the candidate returns to the scout's talent pool." |
| Day 7 | Employer | "A nomination for **[vacancy title]** has been automatically cancelled due to no response within 7 days." |
| Day 7 | Scout | "Your nomination for **[vacancy title]** has expired because the employer did not respond. **[Candidate]** is back in your talent pool and can be nominated for another vacancy." |

#### Phase 4: Schedule Interview (after unlocking)

| Day | To | Message |
|-----|-----|---------|
| Day 4 | Employer | "You have unlocked the profile of **[candidate]** for **[vacancy title]**, but no interview has been scheduled yet. Schedule an introductory interview to assess the match." |
| Day 6 | Employer | "Tomorrow the deadline expires to schedule an interview with **[candidate]** for **[vacancy title]**. Without action, this will be escalated." |
| Day 7 | Scout | "The employer has unlocked the profile of **[candidate]** for **[vacancy title]**, but is not scheduling an interview. Refurzy is contacting the employer." |
| Day 7 | Refurzy Admin | "Escalation: **[employer]** has unlocked a profile for **[vacancy title]** but is not scheduling an interview after 7 days. Action required." |

#### Phase 6: Provide Feedback (after interview)

| Day | To | Message |
|-----|-----|---------|
| Day 5 | Employer | "Has the interview with **[candidate]** for **[vacancy title]** taken place? Please provide the outcome so we can continue the process." |
| Day 6 | Employer | "Tomorrow the deadline expires to provide feedback about your interview with **[candidate]** for **[vacancy title]**." |
| Day 7 | Scout | "The employer has not yet provided feedback about the interview with **[candidate]** for **[vacancy title]**. Refurzy is reaching out." |
| Day 7 | Refurzy Admin | "Escalation: **[employer]** is not providing feedback after interview for **[vacancy title]**. Action required." |

#### Phase 7b: Employment Terms

| Day | To | Message |
|-----|-----|---------|
| Day 10 | Employer + Scout | "The employment terms discussion for **[candidate]** at **[vacancy title]** has been running for 10 days. Can we help? Contact Refurzy if support is needed." |
| Day 14 | Refurzy Admin | "Escalation: employment terms phase for **[candidate]** at **[vacancy title]** exceeds 14 days. Intervention required." |

### Status Updates to Scout (automatic)

| Trigger | Message to Scout |
|---------|-----------------|
| Nomination submitted | "Your nomination of **[candidate]** for **[vacancy title]** has been submitted. The employer has 7 days to respond." |
| Profile unlocked | "Good news! **[employer]** has unlocked the profile of **[candidate]** for **[vacancy title]**." |
| Interview scheduled | "**[Candidate]** has been invited for an interview on **[date]** at **[employer]**." |
| Feedback received | "**[Employer]** has provided feedback about the interview with **[candidate]**." |
| Follow-up interview | "**[Candidate]** has been invited for a follow-up interview at **[employer]**." |
| Hired | "Congratulations! **[Candidate]** has been hired for **[vacancy title]**. Your fee: €**[amount]**." |
| Rejected | "**[Candidate]** has been rejected for **[vacancy title]**. Reason: **[category]**. The candidate is back in your talent pool." |

### Candidate Confirmations

After each status change by the employer, the candidate receives a confirmation request:

| Trigger | Message to candidate | Upon confirmation | Upon "not correct" |
|---------|---------------------|-------------------|-------------------|
| Interview scheduled on [date] | "Your interview is scheduled for [date]. Is this correct?" | ✓✓ indicator | Escalation to Refurzy |
| Interview completed | "Did your interview at [company] take place?" | ✓✓ indicator | Escalation to Refurzy |
| Employment terms phase | "Are you discussing employment terms?" | ✓✓ indicator | Escalation to Refurzy |
| Contract signed | "Is it correct that you've signed a contract?" | ✓✓ + start date | Escalation to Refurzy |

#### Proactive Candidate Reports

The candidate can also confirm a step before the employer has done so:
- "My interview has taken place" → nudge to employer + notification to scout
- "I've had direct contact with the employer" → automatic escalation to Refurzy (platform terms violation)

#### Mismatch Detection

When the candidate confirms a status that the employer hasn't updated yet:
1. **Immediate nudge to employer**: "The candidate has reported that [action]. Please update the status."
2. **Notification to scout**: "Note: candidate reports [action], employer has not yet updated."
3. **With repeated failure (3+ times)**: Escalation to Refurzy for manual intervention

### What is Not Available
- ~~Free messaging between scout and employer~~
- ~~Chat or direct communication~~
- ~~Messages after hiring or rejection~~ (channel closes automatically)
- ~~Manual nudges by scouts~~ (replaced by automatic system nudges)

---

## 28. Marketing Homepage Content & Business Case

### 28.1 Turnover Reduction Percentages

Based on scientific research, Refurzy reduces turnover (mis-hires) by **39–59%**:

| Source | Reduction | Usage |
|--------|-----------|-------|
| Aberdeen Group | 39% | Conservative scenario |
| Gallup | 59% | Optimistic scenario |

> **Previous version used 10–30%.** All business case calculations have been updated accordingly.

### 28.2 Mis-hire Cost Breakdown

A mis-hire costs **€44,000–€175,000** (based on a gross monthly salary of €5,000). Always mention the salary basis when quoting this figure.

#### Employer Cost Calculation (€87,480 breakdown)
Shown everywhere to explain cost calculations:
- €60,000 gross annual salary
- €4,800 holiday allowance (8%)
- €22,680 employer charges (social contributions, pension, etc.)
- **= €87,480 total annual employer costs**

#### 6 Cost Components of a Mis-hire
1. **Recruitment costs** — 15–25% of annual salary
2. **Onboarding & training** — 10–20% of annual salary
3. **Productivity loss** — first 6–12 months underperformance
4. **Team impact & morale loss** — disruption to existing team
5. **Management time & guidance** — additional supervision hours
6. **VSO/severance costs** — average 2 monthly salaries

**Source:** SHRM estimates total mis-hire cost at 50–200% of annual salary (clickable link to SHRM).

**VSO/severance warning:** "SHRM estimates are based on the US market. In the Netherlands, mis-hire costs are on average even higher due to stronger employment protection and statutory transition payments."

#### Display Locations
The mis-hire cost breakdown appears as an expandable explanation in 3 places:
1. Homepage stat card
2. Savings calculator
3. Wetenschap (science) page

Plus a dedicated FAQ item (see section 28.8).

### 28.3 Business Case Calculations

All scenarios use **39%** (Aberdeen Group, conservative) and **59%** (Gallup, optimistic).

#### Small Organization
| Metric | Conservative (39%) | Optimistic (59%) |
|--------|-------------------|------------------|
| Turnover reduction | 39% | 59% |
| **Annual savings** | **€51K** | **€131K** |

#### Large Organization
| Metric | Conservative (39%) | Optimistic (59%) |
|--------|-------------------|------------------|
| Turnover reduction | 39% | 59% |
| **Annual savings** | **€196K** | **€1,370K** |

#### ROI
Updated ROI: **396%** (was 336%).

### 28.4 Turnover Data (Netherlands)

| Metric | Value | Source |
|--------|-------|--------|
| Current average turnover | 10% | CBS / Intelligence Group |
| Expected future turnover | 19% | Mercer |

These figures are used as defaults and context in the savings calculator.

### 28.5 Savings Calculator

New interactive calculator on the homepage with `id="calculator"`.

#### Calculation Model (per scientific document v7)

**Inputs (3 fields):**

All inputs use `type="text"` with `inputMode="numeric"` for free keyboard entry. Validation occurs on blur only (no inline blocking).

| Field | Default | Min | Max | Notes |
|-------|---------|-----|-----|-------|
| Number of employees | 50 | 1 | 10,000 | Total headcount |
| Average gross monthly salary | €5,000 | €2,000 | €20,000 | Average across all roles |
| Current turnover (%) | 10% | 1% | 50% | Default source: CBS/Intelligence Group (2025). Expected rise to 19% (Mercer, 2025) |

> **Key change (v7):** The first field is now "Number of employees" (not "Hires per year"). The turnover percentage drives the calculation: employees × turnover% = hires per year.

**Calculation (step by step):**

1. Hires per year = employees × turnover%
2. Annual salary incl. holiday allowance = monthly salary × 12 × 1.08
3. Total employer costs = annual salary incl. holiday allowance × 1.35
4. Cost per mis-hire = 50-200% of total employer costs (SHRM)
5. Mis-hires per year = hires × 46% (Leadership IQ)
6. Prevented mis-hires = mis-hires × 39-59% (Aberdeen Group 39%, Gallup 59%)
7. Mis-hire savings = prevented mis-hires × cost per mis-hire
8. Direct savings = agency fee (25% annual salary) - Refurzy fee (€4,333/hire)
9. Total savings = direct savings + mis-hire savings
10. ROI = total savings (low) / Refurzy costs × 100%
11. 5-year cumulative = total savings × 5

**Output (results panel):**

- Estimated annual savings (low-high range, gradient text)
- Context line: "[X] employees × [Y]% turnover = [Z] hires per year"
- ROI percentage
- Savings on agency fees
- Cumulative over 5 years
- Footnote with all sources
- Expandable mis-hire cost breakdown (6 components + VSO + SHRM link)

**Example (default values):**

50 employees × 10% turnover = 5 hires/year

- Agency: 5 × €64,800 × 25% = €81,000
- Refurzy: 5 × €4,333 = €21,665
- Direct savings: €59,335
- Mis-hires: 5 × 46% = 2.3 → Refurzy prevents 0.9-1.4
- Mis-hire savings: €19,372-€119,691
- Total: €78,707-€179,026/year

#### Behavior
- Shows live calculation with "wow effect" (animated numbers)
- Mention expected rise to 19% (source: Mercer) near the turnover input
- Expandable mis-hire cost breakdown (6 components, see 28.2)
- CTA button after calculation result

### 28.6 Homepage Role Cards

3 role cards (Employer, Scout, Candidate) use `flex-col` with `flex-1` on the content area so the colored footer text aligns vertically across all cards regardless of content height.

### 28.7 Text Changes

| Location | Old | New |
|----------|-----|-----|
| `how.subtitle` | "fairer" | "much cheaper" |
| Demo user name | "Jan van der Berg" | "Daan Verhoeven" |
| Everywhere | "fit-score" | "M-Score" |
| VSO warning | "probably" | "on average" |

### 28.8 FAQ Updates

FAQ item numbering has been updated:

| # | Question | Notes |
|---|----------|-------|
| q1–q6 | (unchanged) | |
| **q7** | **"Why does a mis-hire cost €44,000–€175,000?"** | **NEW.** Contains 6 cost components + VSO + SHRM warning (see 28.2) |
| q8 | "What guarantee do you offer?" | Was q7 |
| q9 | "Which countries do you support?" | Was q8 |

---

## 29. Demo Login Flow (Option A)

### Entry: refurzy.com → /login

- Login page shows **empty fields** (no pre-fill, for security reasons)
- Hint text: *"Vraag uw demo-inloggegevens aan via info@refurzy.com"*
- Demo credentials: `demo@refurzy.com` + `Nummer1platform!` (with exclamation mark)
- Successful login → redirects to `/homepage`

### Profile Picker: /homepage → /login

When navigating from `/homepage` to `/login`, the login page shows a **profile picker** with 4 role cards:

| Role Card | Role |
|-----------|------|
| Opdrachtgever | Employer |
| Scout | Talent Scout |
| Kandidaat | Candidate |
| Admin | Administrator |

- Click on a role card → auto-fills the corresponding credentials
- Login → redirects to the role-specific dashboard

### Password
All demo accounts use: **Nummer1platform!** (with exclamation mark `!`)

---

## 30. Wetenschap (Science) Page Updates

### 30.1 Comparison Table

Updated comparison between traditional recruitment bureaus and Refurzy:

| Metric | Bureau | Refurzy |
|--------|--------|---------|
| Bureau costs | **20–30%** of gross annual salary (was 15–27%) | No cure, no pay formula |
| Payment model | Retainer + success fee, or 100% success fee. *Retainer = fixed amount upfront, regardless of outcome.* | No cure, no pay |
| **Exclusivity** | **Standard exclusive** | **Optional (+25%)** |

> **New row added:** Exclusivity comparison.

### 30.2 Gray Text Readability

Fixed gray text readability: use `text-gray-400` instead of `text-gray-500` for sufficient contrast on dark backgrounds.

### 30.3 Navigation Consistency

Wetenschap page navigation updated to match homepage:
- Centered menu
- "Inloggen" button
- No user info display

---

## 31. Vacancy Archive After Placement

### Flow Upon Candidate Hire

When a candidate is hired, the vacancy automatically goes through these steps:

1. **Status change**: Vacancy transitions from `open` → `filled`
2. **Automatic actions**:
   - All pending nominations are automatically rejected with message "Vacancy filled"
   - Scouts and remaining candidates receive a notification
   - Vacancy disappears from the active overview and scout feed
3. **Archive**: The vacancy moves to the "Completed vacancies" tab in the employer dashboard

### Dashboard UI — Employer

```
My vacancies
┌─────────────────────┬──────────────────────┐
│  Active (3)         │  Completed (12)      │
└─────────────────────┴──────────────────────┘
```

- **Active tab** (default): Shows open and on-hold vacancies with full prominence
- **Completed tab**: Shows filled and closed vacancies in a more compact, less prominent view (grey accents)
  - Per vacancy visible: title, placement date, hired candidate, scout, fee
  - Option to **reopen** vacancy (creates copy as new vacancy)
  - Option to view details (fully readonly)

### Vacancy Statuses

| Status | Description | Visibility | Trigger |
|--------|------------|------------|---------|
| `open` | Active, scouts can nominate | Active tab, scout feed | Vacancy creation |
| `on_hold` | Temporarily paused by employer | Active tab (dimmed), not in scout feed | Manual by employer |
| `filled` | Candidate hired | Completed tab | Employment contract signed |
| `closed` | Manually closed without placement | Completed tab | Manual by employer |

### Scout Perspective

- Filled vacancies disappear from the vacancy feed
- In the scout dashboard under "My nominations" they remain visible with status "Placed ✓" or "Vacancy filled"
- Under "Earnings" placed vacancies are always accessible

### Candidate Perspective

- Candidate receives notification when rejected due to vacancy being filled
- Status in candidate dashboard changes to "Not selected — vacancy filled"
- Candidate is released for new nominations (unless hired themselves)

### Technical

- Vacancy record maintains a `status` field: `open` | `on_hold` | `filled` | `closed`
- `closedAt` timestamp is set upon status change to `filled` or `closed`
- `hiredCandidateId` and `hiredScoutId` are populated for `filled`
- All nominations with status `pending` or `in_review` are automatically set to `rejected` with reason `vacancy_filled`
- Archive queries filter on `status IN ('filled', 'closed')`, sorted by `closedAt DESC`

---

## 37. Professional Field & Country

### Professional Field (Vakgebied)

Every vacancy has a required **professional field** (vakgebied). The field is selected via an autocomplete input when creating a vacancy.

**Available professional fields:**
Accountancy & Finance, Administration, Construction & Civil Engineering, Communication & PR, Customer Service, Data & Analytics, Design & Creative, Facilities & Services, HR & Recruitment, ICT & Development, Procurement & Supply Chain, Legal, Logistics & Transport, Management & Executive, Marketing & E-commerce, Education & Training, Operations, Production & Engineering, Sales & Business Development, Healthcare & Welfare, Other.

**Usage:**
- Scouts can filter by professional field in the vacancy overview
- Candidate blocks and exclusivity are enforced per professional field (see section 3 and business rules 17b, 23)
- Professional field is displayed on vacancy cards and detail pages

### Country

Every vacancy has a **country** field. This defaults to the country the employer specified as their company address, but can be changed per vacancy.

**Available countries:**
Netherlands, Belgium, Germany, United Kingdom, France, Spain, Italy, Switzerland, Austria, Ireland, Luxembourg, Sweden, Norway, Denmark, Finland, Poland, Portugal, Other.

**Usage:**
- Scouts can filter by country in the vacancy overview
- Country is displayed alongside the location on vacancy cards

---

## 38. Multi-scout Representation

### Core Principles

A candidate can be represented by **multiple Talent Scouts** simultaneously. This increases opportunities for the candidate and encourages competition among scouts.

### Rules

| Rule | Description |
|------|-------------|
| **Multiple scouts per candidate** | A candidate can be in the talent pool of multiple scouts |
| **One nomination per vacancy** | A candidate can only be nominated once for the same vacancy — by the scout who nominates first (first-come-first-served) |
| **Fee to nominating scout** | The placement fee goes to the scout whose nomination led to a successful placement |
| **Candidate transparency** | The candidate sees all their scouts in the dashboard |
| **Scout privacy** | A scout only sees the notice "already nominated by another scout" if another scout has already nominated the candidate for the same vacancy — not which scout |

### Conflict Resolution

- For simultaneous nominations on the same vacancy, the submission timestamp determines priority
- A scout can only see that a candidate has already been nominated after selecting the vacancy for nomination
- The system automatically blocks the nomination if another scout was faster

### Impact on Exclusivity

For exclusive vacancies, the same multi-scout rules apply: the scout who first nominates the candidate for the exclusive vacancy initiates the exclusivity process. Other scouts can no longer nominate the same candidate for that vacancy.

---

## 39. Candidate Nomination Flow

### Overview

The nomination process runs through 6 phases, with the candidate playing an active role via a workflow inbox.

### Phase 1: Recruitment (outside platform)

- Scout sends personal invitation link via email, WhatsApp or LinkedIn
- Link opens a landing page: "[Scout name] invites you to Refurzy"
- Candidate sees: who the scout is, what Refurzy is, what it offers, how it works
- Candidate chooses: [Accept invitation] or [No thanks]
- Upon acceptance → proceed to phase 2 (onboarding)

### Phase 2: Onboarding

- Create account (name, email, phone)
- Give consent (privacy, profile usage)
- Complete profile (education, experience, city, preferred role)
- Candidate is now "in talent pool" of the inviting scout
- Can later be approached by multiple scouts (multi-scout, see section 38)

### Phase 3: Vacancy nomination (scout → candidate inbox)

- Scout selects candidate + vacancy for nomination
- Candidate receives notification: "New vacancy proposed"
- Vacancy appears in the **candidate inbox** with status "New"
- Candidate sees: title, professional field, location, salary, hard criteria fit, description
- **Scan status determines display:**
  - **`scan_nodig`** (base scan never completed): No M-Score visible. Text: "Complete the Matching Scan". Candidate must complete the full scan (35 questions) in phase 4.
  - **`scan_aanvullen`** (base scan completed, job activities not yet vacancy-specific): Indicative M-Score is shown with label "(indicative)". Text: "Complete the supplementary questions for a definitive M-Score". Candidate only needs to complete the job activities dimension (19 questions) in phase 4.
  - **Definitive M-Score** (job activities completed for this vacancy): Definitive M-Score is shown.
- Company name is anonymous until the interview phase
- **Candidate chooses:**
  - **[Interested]** → proceed to phase 4 (Matching Scan or supplementary questions)
  - **[Not interested]** → select reason (see rejection reasons), candidate returns to pool, scout receives feedback
  - **[Review later]** → stays in inbox

#### Candidate rejection reasons

- Salary not attractive
- Location not feasible
- Role doesn't match my ambition
- Industry doesn't appeal to me
- I'm already in talks for a similar role
- Other (free text field)

→ Feedback goes to the scout (not to the employer).

#### Response deadline

- Candidate has **5 days** to respond
- After 3 days: automatic reminder
- After 5 days: proposal expires, scout receives notification

### Phase 4: Matching Scan

- After "Interested", the candidate must complete (or supplement) the Matching Scan
- **Status `scan_nodig`** (base scan never completed): Full scan (35 questions covering all dimensions, ~10 minutes). After completion, the candidate has a complete base scan and a definitive M-Score for this vacancy.
- **Status `scan_aanvullen`** (base scan previously completed): Only job activities dimension again (19 questions, vacancy-specific, ~5 minutes). Values and organization characteristics are reused. The indicative M-Score is converted into a definitive M-Score.
- M-Score is calculated and displayed
- Candidate sees summary: "Your M-Score is 87%"
- **Candidate chooses:**
  - **[Confirm nomination]** → proceed to phase 5
  - **[Cancel]** → return to pool

### Phase 5: Official nomination (to employer)

- Anonymous profile goes to employer
- Employer sees: initials, M-Score, hard criteria match, scout rating
- Pipeline starts: nominated → contract_agreed → interview → employment_terms → contract
- Candidate receives dual-status confirmations per step (see business rule 22b)

### Phase 6: Pipeline & outcome

- Existing pipeline flow (interviews, feedback, contract)
- Dual-status confirmation (candidate ↔ employer)
- Outcome: hired (🎉) or rejected (back to pool)

### Candidate Dashboard: Workflow Inbox

The candidate dashboard is built around a workflow inbox with tabs:

| Tab | Content |
|-----|---------|
| **New** | Proposed vacancies awaiting response (Interested/Not interested/Later) |
| **Active** | Vacancies where the candidate has shown interest or is in the pipeline |
| **Completed** | Rejected, expired or placed vacancies |
| **Scouts** | Overview of all Talent Scouts representing the candidate |

### Candidate Pipeline (7 steps, visual)

From the candidate perspective, the pipeline shows 7 steps:

1. **Proposed** — vacancy received from scout
2. **Interested** — candidate confirmed interest
3. **Scan** — Matching Scan completed (M-Score calculated)
4. **Nominated** — officially nominated to employer
5. **Interview** — interview(s) with employer
6. **Terms** — discussing employment terms
7. **Contract** — contract signed (🎉)

Colors: green (✓ completed), purple (▶ current step), gray (not yet reached), orange (waiting for employer action with ?✓ indicator)
