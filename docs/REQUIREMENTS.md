# Refurzy — Product Requirements Document

**Versie:** 1.0
**Datum:** 19 maart 2026
**Platform:** refurzy.com (Next.js + Vercel)

---

## 1. Overzicht

Refurzy is een wervingsplatform dat wetenschappelijk onderbouwde matching (Matching Scan, ontwikkeld met VU Amsterdam) combineert met een netwerk van onafhankelijke Talent Scouts. Het platform werkt op basis van no cure, no pay.

### Gebruikersrollen

| Rol | Beschrijving |
|-----|-------------|
| **Opdrachtgever** | Bedrijf dat personeel zoekt |
| **Talent Scout** | Onafhankelijke recruiter die kandidaten voordraagt |
| **Kandidaat** | Persoon die via een Talent Scout wordt voorgesteld |
| **Refurzy Admin** | Platformbeheerder |

---

## 2. Matching Scan & M-Score

- **Matching Scan**: 35-vragen vragenlijst gebaseerd op VU Amsterdam onderzoek
- **M-Score**: Resultaat van de scan (0-100%), meet match op cultuur, waarden en interesses
- **Dimensies**: Gebaseerd op Kristof-Brown et al. Person-Environment Fit theorie
- **M-Score ≥80%**: Activeert Fit Garantie (12 maanden)

---

## 3. Pricing Model

### Formule
```
Fee = Ervaringspunten × Opleidingspunten × Waarde per punt (€1.200 NL)
```

### Puntenmatrix

| Werkervaring | Punten | MBO | HBO | WO |
|-------------|--------|-----|-----|-----|
| 0-2 jaar | 1 | €1.800 | €2.400 | €3.600 |
| 2-5 jaar | 2 | €3.600 | €4.800 | €7.200 |
| 5-10 jaar | 3 | €5.400 | €7.200 | €10.800 |
| >10 jaar | 4 | €7.200 | €12.000* | €12.000* |

*>10 jaar regel: HBO en WO krijgen dezelfde multiplier (2.5) om prijsdalingen te voorkomen.*

### Verdeling
- 50% Scout fee (excl. BTW)
- 50% Refurzy fee (excl. BTW)

### BTW & Uitbetaling
- **Alle prijzen op het platform zijn exclusief BTW**
- **Particuliere scout (geen KVK)**: ontvangt 50% van de fee excl. BTW (bruto). Geen loonheffing — Refurzy rapporteert jaarlijks aan de Belastingdienst via IB-47. Scout is zelf verantwoordelijk voor inkomstenbelasting
- **Pro Scout (met KVK)**: ontvangt 50% van de fee excl. BTW + 21% BTW daarboven. Factureert als ondernemer
- **Automatische facturatie**: Na elke succesvolle plaatsing genereert Refurzy automatisch een factuur
- **Uitbetaling trigger**: Scout wordt uitbetaald zodra de opdrachtgever heeft betaald
- **Opdrachtgever betaalt**: Plaatsingsfee + 21% BTW via creditcard

### No Cure, No Pay
Opdrachtgever betaalt alleen bij ondertekening arbeidsovereenkomst.

### 15 Landen
Platform ondersteunt pricing in 15 landen met lokale valuta en aanpassingsfactoren.

---

## 4. Fit Garantie

- **Voorwaarde**: M-Score ≥80%
- **Duur**: 12 maanden na startdatum
- **Dekking**: Mismatch op cultuur, waarden of interesses
- **Uitsluitingen**: Reorganisatie, ziekte, verhuizing, gewijzigde functie-inhoud
- **Restitutie**: 100% van de plaatsingsfee

---

## 5. Gebruikersflows

### 5.1 Opdrachtgever Flow

```
┌─────────────────────────────────────────────────────────┐
│                    OPDRACHTGEVER FLOW                     │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. REGISTRATIE & BEDRIJFSPROFIEL                        │
│     ├── Account aanmaken                                  │
│     ├── Bedrijfsgegevens invoeren (KVK, naam, etc.)      │
│     └── Bedrijfsprofiel + cultuuromschrijving            │
│                                                           │
│  2. VACATURE AANMAKEN (6-stappen wizard)                 │
│     ├── Stap 1: Titel & functie                          │
│     ├── Stap 2: AI-gegenereerde omschrijving             │
│     ├── Stap 3: Details + cultuurprofiel                 │
│     ├── Stap 4: Harde criteria (opleiding, ervaring,     │
│     │           locatie, kantoor, reistijd)               │
│     ├── Stap 5: Prijs & overeenkomst                     │
│     └── Stap 6: M-Score profiel (15 vragen, 4 cat.)     │
│                                                           │
│  3. KANDIDATEN ONTVANGEN                                 │
│     ├── Anoniem profiel met M-Score zichtbaar            │
│     ├── Harde criteria match percentage                  │
│     └── Scout rating zichtbaar                           │
│                                                           │
│  4. HIRING PIPELINE                                      │
│     ├── Voorgesteld (anoniem)                            │
│     ├── Contract akkoord (profiel ontgrendeld)           │
│     │   └── Betaalgegevens + voorwaarden accepteren      │
│     ├── Gesprek plannen (contactgegevens zichtbaar)      │
│     │   └── Datum invoeren verplicht                     │
│     ├── Gesprek gepland                                  │
│     │   └── Markeer als afgerond                         │
│     ├── Feedback geven (verplicht voor volgende stap)    │
│     │   ├── Sterren-rating                               │
│     │   └── Tekst feedback                               │
│     ├── Vervolg bepalen                                  │
│     │   ├── Vervolggesprek plannen                       │
│     │   ├── Arbeidsvoorwaarden bespreken                 │
│     │   └── Afwijzen (reden + scout-rating)              │
│     ├── Arbeidsvoorwaarden                               │
│     │   ├── Contract getekend → VIERING!                 │
│     │   └── Nog een gesprek plannen                      │
│     └── Contract getekend                                │
│         ├── Felicitatie-emails (3x)                      │
│         ├── Creditcard incasso                           │
│         └── Fit Garantie start (12 maanden)              │
│                                                           │
│  AFWIJZING (op elk moment):                              │
│     ├── Reden selecteren (dropdown)                      │
│     │   ├── Niet de juiste ervaring                      │
│     │   ├── Culturele mismatch                           │
│     │   ├── Salariseis te hoog                           │
│     │   ├── Andere kandidaat gekozen                     │
│     │   └── Anders                                       │
│     ├── Scout-rating (1-5 sterren)                       │
│     └── Optionele toelichting                            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Talent Scout Flow

```
┌─────────────────────────────────────────────────────────┐
│                    TALENT SCOUT FLOW                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. REGISTRATIE                                          │
│     ├── Account aanmaken (als natuurlijk persoon)        │
│     └── Profiel invullen                                 │
│                                                           │
│  2. TALENT POOL OPBOUWEN                                 │
│     ├── Kandidaten uitnodigen (email)                    │
│     ├── Kandidaten vullen Matching Scan in               │
│     └── CV uploaden                                      │
│                                                           │
│  3. VACATURES BEKIJKEN                                   │
│     ├── Zoeken op titel/locatie                          │
│     ├── Favorieten markeren (ster)                       │
│     ├── Harde criteria bekijken                          │
│     └── Vacature detail met kandidatenlijst              │
│                                                           │
│  4. MATCHINGSUGGESTIES ONTVANGEN                         │
│     ├── Automatische notificatie bij nieuwe vacature      │
│     │   die matcht met kandidaten in talent pool         │
│     ├── Match op basis van:                              │
│     │   ├── Harde criteria (opleiding, ervaring, locatie)│
│     │   └── M-Score (als scan is ingevuld)               │
│     ├── Suggestie accepteren = kandidaat voordragen      │
│     └── Suggestie afwijzen = niet voordragen             │
│                                                           │
│  5. KANDIDAAT VOORDRAGEN                                 │
│     ├── Handmatig matchen aan vacature                   │
│     ├── Of via matchingsuggestie (stap 4)                │
│     └── Alleen eigen kandidaten (scout-exclusiviteit)    │
│                                                           │
│  6. PIPELINE VOLGEN                                      │
│     ├── Overzicht alle voorgedragen kandidaten           │
│     ├── Status per kandidaat (visuele pipeline)          │
│     ├── Filter op status                                 │
│     └── Actie-indicatoren (oranje bij vertraging)        │
│                                                           │
│  7. NUDGE SYSTEEM                                        │
│     ├── Nudge 1: Friendly reminder (💬)                  │
│     │   "Plan je het gesprek deze week in?"              │
│     ├── Nudge 2: Urgente herinnering (⚠️)               │
│     │   "Kandidaat wacht al lang op reactie"             │
│     └── Nudge 3: Rapport bij Refurzy (🚨)               │
│         ├── Refurzy belt opdrachtgever binnen 24u        │
│         ├── Kandidaat wordt geïnformeerd                 │
│         └── Registratie op opdrachtgever-account         │
│                                                           │
│  8. PRO SCOUT UPGRADE (na 2 plaatsingen)                │
│     ├── Blokkade: geen nieuwe voordrachten mogelijk      │
│     ├── Celebratie-modal: "Gefeliciteerd!"               │
│     ├── Inspiratie: "Werk waar je wilt, wanneer je wilt" │
│     ├── KVK/bedrijfsgegevens invoeren                    │
│     │   ├── Bedrijfsnaam *                               │
│     │   ├── KVK-nummer * (of buitenlands equivalent)     │
│     │   ├── BTW-nummer                                   │
│     │   └── Zakelijk IBAN                                │
│     └── Voordelen Pro Scout:                             │
│         ├── Hogere uitbetaling (geen loonheffing)        │
│         ├── Onbeperkt scouten                            │
│         ├── Pro Scout badge                              │
│         └── Wereldwijd werken                            │
│                                                           │
│  9. FEE ONTVANGEN                                        │
│     └── 50% van plaatsingsfee na contract getekend       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Kandidaat Flow

```
┌─────────────────────────────────────────────────────────┐
│                      KANDIDAAT FLOW                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. UITGENODIGD WORDEN                                   │
│     └── Email van Talent Scout met uitnodigingslink      │
│                                                           │
│  2. PROFIEL AANMAKEN                                     │
│     ├── Persoonsgegevens                                 │
│     └── CV uploaden                                      │
│                                                           │
│  3. MATCHING SCAN INVULLEN                               │
│     ├── 35 vragen over cultuur, waarden, interesses      │
│     └── M-Score wordt berekend                           │
│                                                           │
│  4. PIPELINE VOLGEN (read-only)                          │
│     ├── Voorgesteld                                      │
│     ├── Contract akkoord (opdrachtgever)                 │
│     ├── Gesprek gepland                                  │
│     ├── Arbeidsvoorwaarden                               │
│     └── Contract getekend → VIERING!                     │
│                                                           │
│  5. FELICITATIE BIJ PLAATSING                            │
│     └── Email: "Gefeliciteerd met je nieuwe baan!"       │
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
│     ├── Platform statistieken                            │
│     └── Overzicht actieve vacatures/plaatsingen          │
│                                                           │
│  2. PRICING BEHEER                                       │
│     ├── Prijsmatrix per land                             │
│     └── Ervarings-/opleidingsmultipliers                 │
│                                                           │
│  3. LANDEN BEHEER                                        │
│     └── 15 landen met lokale valuta en factoren          │
│                                                           │
│  4. GEBRUIKERS BEHEER                                    │
│     └── Overzicht alle gebruikers per rol                │
│                                                           │
│  5. UITBETALINGEN                                        │
│     ├── Filter op land en jaar                           │
│     ├── Samenvatting per scout (geaggregeerd)            │
│     ├── Detail per transactie                            │
│     ├── CSV export voor belastingaangifte                │
│     │   ├── NL: IB-47 formaat                            │
│     │   ├── DE: §93c AO formaat                          │
│     │   ├── BE: Fiche 281.50 formaat                     │
│     │   ├── FR: DAS-2 formaat                            │
│     │   └── GB: CIS formaat                              │
│     └── Verplichte velden in export:                     │
│         ├── Persoonsgegevens (naam, BSN/TIN, geb.datum,  │
│         │   adres, postcode, woonplaats, land)           │
│         ├── Financieel (IBAN, bruto bedrag, scout fee,   │
│         │   valuta)                                      │
│         ├── Bedrijfsgegevens (KVK, BTW, type relatie)    │
│         └── Transactiedetails (factuurnr, data, status)  │
│                                                           │
│  6. SCAN GEBRUIK (VU AMSTERDAM)                          │
│     ├── Log van alle Matching Scan afnames               │
│     │   ├── Datum + tijd                                 │
│     │   ├── Type (kandidaat / organisatie)                │
│     │   ├── Gebruiker (naam + email)                     │
│     │   ├── Vacature + bedrijf                           │
│     │   └── Status (facturabel / test)                   │
│     ├── Test-email configuratie                          │
│     │   ├── Lijst van test-emailadressen                 │
│     │   ├── Automatische detectie testgebruik            │
│     │   └── Handmatig uitsluiten per afname              │
│     ├── Filtering: jaar, maand, facturabel/test          │
│     └── CSV export facturabel gebruik voor VU            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Email Triggers

| Trigger | Ontvanger(s) | Inhoud |
|---------|-------------|--------|
| Kandidaat uitgenodigd | Kandidaat | Uitnodigingslink + vacature-info |
| Contract akkoord | Scout | "Opdrachtgever heeft profiel ontgrendeld" |
| Gesprek gepland | Kandidaat, Scout | Datum + bedrijfsinfo |
| Nudge 1 (friendly) | Opdrachtgever | "Plan het gesprek deze week in" |
| Nudge 2 (urgent) | Opdrachtgever | "Kandidaat wacht al lang" |
| Nudge 3 (rapport) | Refurzy Admin | "Scout rapporteert: geen reactie na 2 nudges" |
| Afwijzing | Scout, Kandidaat | Reden + rating |
| **Contract getekend** | **Alle drie** | **Felicitatie + volgende stappen** |
| Fee uitbetaald | Scout | Bedrag + factuurbevestiging |
| Fit Garantie check-in | Opdrachtgever | Na 3, 6 en 12 maanden |

---

## 7. Pipeline Statussen

```
voorgesteld → contract_akkoord → gesprek_plannen → gesprek_gepland
                                                        ↓
                                                  feedback_geven
                                                        ↓
                                                  vervolggesprek ──→ (herhaal gesprek cyclus)
                                                        ↓
                                                  arbeidsvoorwaarden
                                                        ↓
                                                  contract_getekend  🎉

        ↕ (op elk moment)
     afgewezen (met reden + rating)
```

---

## 8. Visueel Ontwerp

### Thema's
| Context | Thema | Achtergrond |
|---------|-------|-------------|
| Marketing (homepage, wetenschap) | Dark | `bg-navy` (#1A0F5D) |
| Tijdelijke landingspagina | Dark | `bg-navy` (#1A0F5D) |
| Demo/Dashboard (alle rollen) | Light | `bg-surface` (#FAFBFE) |
| Sidebar (demo) | Dark | `bg-navy-light` (#231470) |

### Kleuren
| Token | Hex | Gebruik |
|-------|-----|---------|
| Navy | #1A0F5D | Donkere achtergronden |
| Cyan/Teal | #14CDD3 | Primaire CTA, M-Score hoog |
| Blue | #06BAFF | Gradient, links |
| Purple | #6D40F9 | Accent, badges, scout-kleur |
| Surface | #FAFBFE | Light theme achtergrond |
| Ink | #1E293B | Tekst op light theme |

### Typografie
- Font: Poppins
- Landing page body: weight 300, opacity 0.6
- Dashboard body: weight 400, standaard kleur

---

## 9. Taalondersteuning

- Nederlands (standaard)
- Engels
- Toggle via `LangToggle` component in navigatie
- Translations in `lib/i18n.ts` (type-safe)
- Taalvoorkeur opgeslagen in localStorage

---

## 10. Technische Architectuur

### Stack
- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS met custom tokens
- **Deployment**: Vercel
- **Repository**: github.com/Gerardh99/refurzy-landing

### Bestandsstructuur (key files)
```
app/
  page.tsx                           # Tijdelijke landingspagina
  homepage/page.tsx                  # Volledige marketing homepage
  wetenschap/page.tsx                # Wetenschapspagina
  login/page.tsx                     # Login met demo-accounts
  demo/
    layout.tsx                       # Light theme wrapper + sidebar
    opdrachtgever/
      page.tsx                       # Dashboard
      vacature-aanmaken/page.tsx     # 6-stappen wizard
      vacature/[id]/page.tsx         # Vacature detail + kandidaten
      kandidaat/[vacatureId]/[kandidaatId]/page.tsx  # Hiring pipeline
      instellingen/page.tsx          # Bedrijfsinstellingen
    scout/
      page.tsx                       # Talent Pool
      vacatures/page.tsx             # Vacature browser
      vacature/[id]/page.tsx         # Vacature detail
      pipeline/page.tsx              # Pipeline overzicht + nudges
      kandidaat-uitnodigen/page.tsx  # Uitnodigingsformulier
      meldingen/page.tsx             # Notificaties
      instellingen/page.tsx          # Instellingen & uitbetaling
    kandidaat/
      page.tsx                       # Mijn sollicitaties
      pipeline/page.tsx              # Voortgang pipeline (read-only)
      profiel/page.tsx               # Profiel beheren
      scan/page.tsx                  # Matching Scan
    admin/
      page.tsx                       # Dashboard
      pricing/page.tsx               # Prijsmatrix beheer
      landen/page.tsx                # Landen configuratie
      gebruikers/page.tsx            # Gebruikersbeheer
      uitbetalingen/page.tsx         # Betalingsoverzicht + export

components/
  Sidebar.tsx                        # Navigatie per rol
  PipelineTracker.tsx                # Visuele pipeline stappen
  ProScoutUpgradeModal.tsx           # KVK upgrade na 2 plaatsingen
  FitScore.tsx                       # M-Score cirkel
  StatusBadge.tsx                    # Status labels
  StarRating.tsx                     # Sterren-rating
  LangToggle.tsx                     # NL/EN switch

lib/
  types.ts                           # TypeScript types
  mock-data.ts                       # Demo data
  pricing.ts                         # Prijsberekening (15 landen)
  auth.ts                            # Demo authenticatie
  i18n.ts                            # Vertalingen
```

---

## 11. Nog te Bouwen

### Must-have (MVP)
- [ ] KVK-duplicaatcontrole bij registratie opdrachtgever (check of KVK al bestaat, stuur verzoek)
- [ ] Vacature-specifieke uitnodigingsmail voor kandidaten (enthousiaste template met vacature-details)
- [ ] Integratie Pro Scout upgrade modal in daadwerkelijke scout flow (check bij voordracht)
- [ ] Progressie-indicator op scout dashboard ("2/2 plaatsingen als starter")
- [ ] Contract getekend email templates (3x: opdrachtgever, kandidaat, scout)
- [ ] Fit Garantie check-in systeem (3, 6, 12 maanden reminders)
- [ ] Betaalintegratie (Stripe/Mollie) voor creditcard incasso
- [ ] Echte authenticatie (niet demo-accounts)
- [ ] Database (vervangt mock-data)

### Nice-to-have
- [ ] NL/EN vertaling voor alle demo-pagina's
- [ ] Dashboard analytics voor admin
- [ ] Scout leaderboard / ranking
- [ ] Opdrachtgever review systeem (publiek)
- [ ] Mobiele responsive optimalisatie
- [ ] Push notificaties
- [ ] Vacature-specifieke AI matching suggestions

---

## 12. Business Rules

1. **No cure, no pay**: Geen betaling zonder ondertekend arbeidscontract
2. **Anonimiteit**: Kandidaat blijft anoniem totdat opdrachtgever contract accepteert
3. **Pro Scout drempel**: Na 2 plaatsingen als natuurlijk persoon moet KVK worden ingevuld
4. **Nudge escalatie**: 2 nudges van scout, daarna rapport bij Refurzy
5. **Feedback verplicht**: Opdrachtgever moet feedback geven voordat volgende stap mogelijk is
6. **Afwijzing vereist reden**: Dropdown + optionele toelichting + scout-rating (1-5)
7. **Fee verdeling**: 50/50 scout/Refurzy
8. **>10 jaar regel**: HBO en WO krijgen zelfde multiplier (2.5) bij >10 jaar ervaring
9. **Fit Garantie**: Alleen bij M-Score ≥80%, 12 maanden, alleen cultuur/waarden/interesses mismatch
10. **Exclusiviteit**: Optioneel 2-weken exclusiviteit met 30% premium (gaat naar scout)
11. **Prijzen excl. BTW**: Alle prijzen op het platform zijn exclusief BTW
12. **Automatische facturatie**: Factuur wordt gegenereerd bij contract getekend, uitbetaling bij betaling opdrachtgever
13. **Pro Scout BTW**: Pro Scouts ontvangen 50% fee + 21% BTW. Particuliere scouts ontvangen 50% fee bruto (geen inhouding, IB-47 rapportage)
14. **Zelfstandigheid scout**: De Talent Scout werkt volledig voor eigen rekening en risico. Bepaalt zelf wanneer, hoe, hoeveel en waar opdrachten worden vervuld. Geen arbeidsrelatie met Refurzy.
15. **VU Amsterdam licentie**: Refurzy betaalt de VU per afgenomen Matching Scan. Intern testgebruik wordt uitgefilterd op basis van test-emailadressen. Alle afnames worden gelogd met datum, type, gebruiker en status.
16. **Profiel hergebruik**: Kandidaat vult scan 1x in → profiel herbruikbaar over alle vacatures. Organisatie: waarden + kenmerken (dim 2+3, 16 vragen) herbruikbaar over vacatures, alleen werkzaamheden (dim 1, 19 vragen) per vacature opnieuw.
17. **Scout-exclusiviteit**: Een kandidaat kan alleen worden voorgedragen door de scout die de kandidaat heeft aangebracht. Andere scouts kunnen dezelfde kandidaat niet voordragen.
18. **Automatische matchingsuggesties**: Scouts ontvangen automatische matchingsuggesties wanneer een vacature wordt gepubliceerd die matcht met kandidaten in hun talent pool — op basis van harde criteria (opleiding, ervaring, locatie) en M-Score. De scout kan de suggestie accepteren (= voordragen) of afwijzen.
19. **Handmatig matchen**: Scouts kunnen kandidaten ook handmatig aan vacatures koppelen, onafhankelijk van automatische suggesties.
20. **Introductiekorting nieuwe scout**: Een scout zonder track record (0 afgeronde plaatsingen) is een hoger risico voor opdrachtgevers. Om de drempel te verlagen: de eerste succesvolle plaatsing is met 50% korting. Zowel de scout als Refurzy dragen de korting (beiden ontvangen 25% i.p.v. 50% van de normale fee). Na de eerste succesvolle plaatsing vervalt de korting automatisch. Dit wordt zichtbaar voor de opdrachtgever als "50% introductiekorting" badge bij kandidaten van nieuwe scouts, en voor de scout als incentive om de eerste match te realiseren.

---

## 14. Algemene Voorwaarden — Kernbepalingen

De volgende bepalingen moeten worden opgenomen in de Algemene Voorwaarden:

### Positie Talent Scout
- De Talent Scout is geen werknemer van Refurzy maar een onafhankelijke opdrachtnemer
- De Talent Scout werkt volledig voor eigen rekening en risico
- De Talent Scout bepaalt zelf wanneer, hoe, hoeveel en waar hij/zij opdrachten vervult
- Er is geen gezagsverhouding tussen Refurzy en de Talent Scout
- De Talent Scout is vrij om voor meerdere opdrachtgevers en platforms te werken
- Refurzy geeft geen instructies over de wijze waarop de werkzaamheden worden uitgevoerd

### BTW & Belastingen
- Alle genoemde prijzen en vergoedingen zijn exclusief BTW
- Pro Scouts (met KVK) factureren 21% BTW bovenop de scout fee
- Particuliere scouts ontvangen het bruto bedrag zonder inhouding van belasting
- Refurzy rapporteert betalingen aan particuliere scouts jaarlijks aan de Belastingdienst (IB-47)
- De Talent Scout is zelf verantwoordelijk voor de aangifte en afdracht van inkomstenbelasting en/of omzetbelasting
- Bij grensoverschrijdende dienstverlening binnen de EU geldt de verleggingsregeling (reverse charge)

### Facturatie & Betaling
- Na elke succesvolle plaatsing genereert Refurzy automatisch een factuur
- De opdrachtgever betaalt de plaatsingsfee + BTW via creditcard bij ondertekening arbeidsovereenkomst
- De scout fee wordt uitbetaald zodra de betaling van de opdrachtgever is ontvangen
- Uitbetaling geschiedt op het bij Refurzy bekende IBAN van de Talent Scout

### No Cure, No Pay
- Opdrachtgever betaalt uitsluitend bij ondertekening van een arbeidsovereenkomst
- Bemiddeling buiten het platform om resulteert in een boete van 100% van de vergoeding

### Fit Garantie
- Bij M-Score >= 80% geldt een Fit Garantie van 12 maanden
- Dekking: vertrek wegens mismatch in cultuur, waarden of interesses
- Uitsluitingen: reorganisatie, ziekte, verhuizing, gewijzigde functie-inhoud
- Restitutie: 100% van de plaatsingsfee (incl. BTW)
