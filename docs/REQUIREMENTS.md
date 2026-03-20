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

### Exclusiviteit (optioneel, +25%)

Bij het aanmaken van een vacature kan de opdrachtgever exclusiviteit activeren:

- **Werking**: Voorgedragen kandidaten zijn 14 dagen exclusief beschikbaar en worden niet aan andere opdrachtgevers aangeboden
- **Toeslag**: +25% bovenop de standaard plaatsingsfee (berekend over de basisfee excl. BTW)
- **Onherroepelijk**: Eenmaal geactiveerd kan exclusiviteit **niet** meer worden uitgeschakeld voor die vacature
- **Rationale**: Onherroepelijkheid voorkomt gaming (exclusiviteit aanzetten om kandidaten te blokkeren, dan uitzetten voor ontgrendeling om de toeslag te vermijden)
- **Verdeling toeslag**: 50/50 scout/Refurzy (zelfde verdeling als de basisfee)
- **Zichtbaarheid**: Scouts zien dat een vacature exclusief is → extra motivatie om sterke kandidaten voor te dragen

**Voorbeeld**: WO + 5-10 jaar = €10.800 basisfee → met exclusiviteit: €10.800 + €2.700 = €13.500 excl. BTW

### Kandidaat-blokkade bij voordracht

Zodra een kandidaat wordt voorgedragen op een vacature, wordt deze geblokkeerd voor voordracht op andere vacatures. De duur van de blokkade hangt af van het type vacature en de uitkomst van het proces:

#### Standaard vacature (zonder exclusiviteit)
| Situatie | Blokkade |
|----------|----------|
| Kandidaat is voorgedragen en in actieve pipeline | Geblokkeerd zolang het proces loopt |
| Kandidaat wordt afgewezen | Direct vrij voor nieuwe voordrachten |
| Voordracht verloopt (opdrachtgever reageert niet binnen 7 dagen) | Direct vrij voor nieuwe voordrachten |
| Kandidaat wordt aangenomen | Permanent geblokkeerd (uit talent pool) |

#### Exclusieve vacature (+25%)
| Situatie | Blokkade |
|----------|----------|
| Kandidaat is voorgedragen | Geblokkeerd voor minimaal 14 dagen, óók als afgewezen binnen die 14 dagen |
| Na 14 dagen + afwijzing | Direct vrij voor nieuwe voordrachten |
| Na 14 dagen + nog in actieve pipeline | Geblokkeerd tot einde proces |
| Voordracht verloopt (7 dagen geen review) | Exclusiviteitsblokkade blijft gelden tot dag 14 |
| Kandidaat wordt aangenomen | Permanent geblokkeerd (uit talent pool) |

#### Technische afdwinging
- Bij het voordragen van een kandidaat checkt het platform of de kandidaat al in een actief proces zit of onder een exclusiviteitsblokkade valt
- Scouts zien in hun talent pool een duidelijke indicator wanneer een kandidaat geblokkeerd is, inclusief verwachte einddatum
- De scout kan een geblokkeerde kandidaat **niet** selecteren voor voordracht totdat de blokkade is verlopen
- Bij exclusieve vacatures start de 14-dagenklok op het moment van voordracht, ongeacht wat er daarna in de pipeline gebeurt

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
│  7. AUTOMATISCH NUDGE-SYSTEEM (geen vrije berichten)     │
│     ├── Geen directe communicatie scout↔opdrachtgever    │
│     ├── Scout levert toelichting bij voordracht          │
│     ├── Opdrachtgever geeft feedback bij afwijzing       │
│     ├── Alle herinneringen automatisch door Refurzy      │
│     ├── Escalatie naar Refurzy bij overschrijding        │
│     └── Kanaal sluit bij aanname of afwijzing            │
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
| Auto-nudge: review dag 3 | Opdrachtgever | "Er wacht een nieuwe voordracht op uw review voor [vacaturetitel]. M-Score: [X]%." |
| Auto-nudge: review dag 6 | Opdrachtgever | "Uw review verloopt morgen. Na 7 dagen wordt de voordracht automatisch geannuleerd." |
| Auto-nudge: review verlopen | Scout + Opdrachtgever | Scout: "Voordracht verlopen, kandidaat terug in pool." / OG: "Voordracht geannuleerd wegens geen reactie." |
| Auto-nudge: gesprek plannen dag 4 | Opdrachtgever | "U heeft het profiel ontgrendeld maar nog geen gesprek gepland." |
| Auto-nudge: gesprek plannen dag 6 | Opdrachtgever | "Morgen verloopt de termijn om een gesprek te plannen." |
| Escalatie: gesprek niet gepland | Scout + Refurzy | "Opdrachtgever plant geen gesprek na ontgrendeling." |
| Auto-nudge: feedback dag 5 | Opdrachtgever | "Heeft het gesprek plaatsgevonden? Geef de uitkomst door." |
| Auto-nudge: feedback dag 6 | Opdrachtgever | "Morgen verloopt de termijn om feedback te geven." |
| Escalatie: geen feedback | Scout + Refurzy | Refurzy neemt contact op |
| Auto-nudge: arbeidsvoorwaarden dag 10 | Opdrachtgever + Scout | "Het arbeidsvoorwaardengesprek loopt al 10 dagen. Kunnen wij iets betekenen?" |
| Escalatie: arbeidsvoorwaarden dag 14 | Refurzy | Interventie door Refurzy |
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
      bedrijfsprofiel/page.tsx       # Bedrijfsprofiel beheer
      instellingen/page.tsx          # Bedrijfsinstellingen
    scout/
      page.tsx                       # Talent Pool
      vacatures/page.tsx             # Vacature browser
      vacature/[id]/page.tsx         # Vacature detail
      pipeline/page.tsx              # Pipeline overzicht + nudges
      analytics/page.tsx             # Scout analytics dashboard
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

## 11. Factuurmodule

### Automatische facturatie
- Na elke succesvolle plaatsing (contract getekend) genereert Refurzy automatisch een factuur
- Factuurnummering: `RF-F-[jaar]-[volgnummer]`
- Creditnota bij Fit Garantie restitutie: `RF-CN-[jaar]-[volgnummer]`
- Alle bedragen exclusief 21% BTW

### Admin factuuroverzicht (`/demo/admin/facturen`)
- Tabel met: factuurnummer, datum, opdrachtgever, vacature, kandidaat, scout, bedrag, BTW, totaal, status
- Statussen: betaald, openstaand, creditnota
- Filters: status, opdrachtgever, periode (jaar)
- Summary stats: totaal omzet, betaald, openstaand, creditnota's
- "Download PDF" button per factuur (mock)

### Opdrachtgever factuuroverzicht (`/demo/opdrachtgever/facturen`)
- Gefilterd op eigen bedrijf
- Tabel met: factuurnummer, datum, vacature, kandidaat, bedrag excl. BTW, BTW, totaal, status
- Filters: betaald/openstaand
- Summary stats: totaal facturen, betaald, openstaand
- "Download PDF" button per factuur

### Scout verdiensten (`/demo/scout/verdiensten`)
- Summary cards: totaal verdiend, uitbetaald, openstaand, aantal plaatsingen
- Tabel: datum, vacature, kandidaat, opdrachtgever, plaatsingsfee, jouw deel (50%), status
- Introductiekorting op eerste plaatsing zichtbaar (25% i.p.v. 50%)
- Statussen: uitbetaald, openstaand, wacht op betaling
- Link naar volledige factuurpagina

---

## 12. Kandidaat Dashboard

### Dashboard (`/demo/kandidaat`)
- Welkomstbericht: "Welkom, [naam]"
- Status cards:
  - Matching Scan: "Ingevuld" of "Nog niet ingevuld" met link naar scan
  - Aantal vacatures waarvoor voorgedragen
  - Aantal actieve processen in pipeline
- Sectie "Mijn vacatures": cards per vacature met:
  - Vacaturetitel + bedrijf (anoniem tot contractfase)
  - M-Score percentage met kleurindicator
  - Pipeline statusbalk (voorgedragen, gesprek, arbeidsvoorwaarden, contract)
  - Huidige stap gehighlight
  - Scout naam en datum
- Sectie "Mijn documenten":
  - Toestemmingsverklaring (getekend op datum)
  - Privacyverklaring
  - Eventuele arbeidscontracten

### Vacature detailpagina (`/demo/kandidaat/vacature/[id]`)
- Functietitel, locatie, sector (bedrijfsnaam NIET zichtbaar tot contractfase)
- M-Score visualisatie (bar chart per dimensie: werkzaamheden, waarden, organisatie)
- Pipeline timeline met huidige status
- Scout info: "Voorgedragen door [scout naam]"
- Privacy-informatie over anonimiteit

---

## 13. Matching Scan Interactief

### Route: `/demo/kandidaat/matching-scan`

Interactieve 35-vragen vragenlijst gebaseerd op VU Amsterdam onderzoek.

### 8 Stappen
1. **Introductie** — Uitleg van de scan, drie dimensies, tijdsindicatie (10-15 min)
2. **Werkzaamheden - Ranking** — 19 items, ranking 1-19 via dropdown + pijltjes
3. **Werkzaamheden - Rating** — 19 items, Likert schaal 1-7
4. **Waarden - Ranking** — 9 items, ranking 1-9
5. **Waarden - Rating** — 9 items, Likert schaal 1-9
6. **Organisatiekenmerken - Ranking** — 7 items, ranking 1-7
7. **Organisatiekenmerken - Rating** — 7 items, Likert schaal 1-7
8. **Resultaat** — POMP-profiel visualisatie (bar chart per dimensie) + bevestiging opslaan

### Items

**19 Werkzaamheden:**
a. Mensen sociaal faciliteren, b. Zaken regelen, c. Financieel administreren, d. Gegevens verwerken, e. Met mechanica/machines werken, f. In de natuur/voor het milieu werken, g. Artistiek werk verrichten, h. Mensen helpen, i. Gespecialiseerde zorg verlenen, j. Invloedrijk werk doen, k. Met zakelijke systemen werken, l. Kwaliteitscontroles uitvoeren, m. Uitvoerend werk doen, n. Persoonlijke diensten verlenen, o. Financien analyseren, p. Gespecialiseerd onderzoek doen, q. Bouwen/repareren, r. Basisdiensten verlenen, s. Sport- en spelactiviteiten

**9 Waarden:**
a. Macht, b. Prestatie, c. Plezier, d. Stimulatie, e. Autonomie, f. Universalisme, g. Toegeeflijkheid, h. Traditie, i. Veiligheid

**7 Organisatiekenmerken:**
a. Detailgerichtheid, b. Klantgerichtheid, c. Resultaatgerichtheid, d. Stabiliteitgerichtheid, e. Samenwerkingsgerichtheid, f. Integriteitgerichtheid, g. Innovatiegerichtheid

### UX
- Progress bar met stap X van 8 + dot indicators
- "Opslaan en later verder" button
- Validatie: alle items moeten gerankt/beoordeeld zijn per stap
- Foutmelding bij onvolledige stap
- Ranking: dropdown per item + omhoog/omlaag pijltjes, unieke posities
- Rating: knoppen 1-N, geselecteerde waarde gehighlight in paars

---

## 14. Zoek & Filter Verbeteren

### Scout Vacatures (`/demo/scout/vacatures`)

Uitgebreide zoek- en filterfunctionaliteit voor de vacaturebrowser.

#### Filters (inklapbaar filterpaneel)
- Sector dropdown: IT, Marketing, Finance, HR, Sales, Operations, Overig
- Salaris range: min-max invoervelden
- Contract type: Vast, Tijdelijk, Freelance
- Werkmodel: Op kantoor, Hybride, Volledig remote
- Opleiding: MBO, HBO, WO
- Ervaring: 0-2, 2-5, 5-10, 10+

#### Sortering
- Nieuwste eerst (standaard)
- Salaris hoog-laag
- Deadline

#### UX
- Actieve filter chips met X om te verwijderen
- Resultaat telling: "X vacatures gevonden"
- Bestaande zoekbalk en locatiefilter behouden
- Tags per vacaturekaart (sector, contract, werkmodel, opleiding, ervaring)

### Opdrachtgever Kandidaten (`/demo/opdrachtgever/kandidaten`)

Overzicht van alle voorgedragen kandidaten voor de opdrachtgever.

#### Filters
- Vacature dropdown (filter per specifieke vacature)
- M-Score range slider (0-100%)
- Status: alle, voorgedragen, in gesprek, arbeidsvoorwaarden, afgewezen

#### Weergave (cards)
- Kandidaat naam (of "Anoniem" als niet ontgrendeld)
- Vacature naam
- M-Score met kleur (groen >80%, geel 60-80%, rood <60%)
- Status badge
- Scout naam
- "Bekijk profiel" button

#### Sortering
- M-Score (hoog-laag)
- Datum (nieuwste eerst)
- Status

---

## 15. Fit Garantie Module

### Opdrachtgever View (`/demo/opdrachtgever/fit-garantie`)

Overzicht van alle Fit Garanties voor de opdrachtgever.

#### Actieve garantie cards
- Kandidaat naam, vacature, plaatsingsdatum
- Garantie timeline: visuele balk 0-12 maanden met huidige positie
- Check-in status per mijlpaal:
  - 3 maanden: afgerond / aankomend / toekomstig
  - 6 maanden: afgerond / aankomend / toekomstig
  - 12 maanden: afgerond / aankomend / toekomstig
- M-Score bij plaatsing
- Status: Actief, Verlopen, Claim ingediend

#### Claim indienen modal
- Reden dropdown: Culturele mismatch, Waarden mismatch, Anders
- Toelichting textarea
- Uitsluitingsnoot: "Niet van toepassing bij: reorganisatie, ziekte, verhuizing, gewijzigde functie-inhoud"
- Submit button met bevestiging

#### Sectie Verlopen garanties
- Verlopen en afgeronde garanties met verminderde opacity

### Admin View (`/demo/admin/fit-garantie`)

Beheerpagina voor alle Fit Garantie claims.

#### Statistieken (4 cards)
- Actieve garanties
- Claims in behandeling
- Goedgekeurd
- Afgewezen

#### Claims tabel
- Kolommen: kandidaat, opdrachtgever, vacature, plaatsingsdatum, claimdatum, reden, status
- Status: in behandeling, goedgekeurd, afgewezen
- Uitklapbaar per claim: volledige details + opmerkingen timeline
- Actieknoppen (bij in behandeling): Goedkeuren, Afwijzen, Opmerking toevoegen

---

## 16. Berichtenmodule

### Route: `/demo/berichten`

In-platform berichtensysteem, toegankelijk vanuit alle rollen.

#### Layout
- Links paneel: gesprekkenlijst
  - Per gesprek: avatar, naam, laatste bericht preview, tijd, ongelezen badge
  - Optioneel filter op vacature
- Rechts paneel: actief gesprek
  - Berichtenthread met bubbles (links/rechts)
  - Tijdstempel per bericht
  - Invoerveld "Type een bericht..." met verstuurknop

#### Mock gesprekken per rol

**Scout:**
- Gesprek met "HR Afdeling TechCorp" over "Marketing Manager vacature"
- Gesprek met "Kandidaat Lisa J." over "Status update"

**Opdrachtgever:**
- Gesprek met "Scout Jan de Vries" over "Voorgestelde kandidaten"

**Kandidaat:**
- Gesprek met "Mijn Scout - Jan de Vries" over "Vacature update"

#### Mobiel responsive
- Op kleine schermen: toon lijst OF gesprek (niet beide)
- Terugknop om van gesprek naar lijst te gaan

#### Overig
- Noot onderaan: "Berichten zijn altijd gekoppeld aan een vacature of kandidaat"
- Sidebar: "Berichten" link met ongelezen teller badge voor alle rollen
- Sidebar: "Fit Garantie" link onder Opdrachtgever en Admin navigatie

---

## 17. Nog te Bouwen

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

### Should-have (Doorontwikkeling)
- [ ] **AI Vacaturetekst Generatie met online bronnen** — AI zoekt online naar vergelijkbare vacatures (via Perplexity API, Tavily, of Claude met web search) om de sectie "Wat ga je doen?" te vullen met realistische, functie-specifieke taken. Vereisten:
  - Minimale input voordat AI kan genereren: functietitel, locatie, opleidingsniveau, werkervaring
  - Context-aware generatie: AI gebruikt alle ingevulde velden (titel, afdeling, locatie, salaris, contracttype, werkregeling, afdelingscultuur, ervaring, opleiding)
  - Web search haalt 3-5 vergelijkbare vacatures op als referentie voor taken en verantwoordelijkheden
  - Fallback naar interne templates als web search niet beschikbaar is
  - Gegenereerde tekst is altijd bewerkbaar door de opdrachtgever
  - Taalmodel: Nederlands, professioneel maar toegankelijk

### Nice-to-have
- [ ] NL/EN vertaling voor alle demo-pagina's
- [x] Dashboard analytics voor admin
- [ ] Scout leaderboard / ranking
- [ ] Opdrachtgever review systeem (publiek)
- [ ] Mobiele responsive optimalisatie
- [ ] Push notificaties
- [ ] Vacature-specifieke AI matching suggestions

---

## 18. Business Rules

1. **No cure, no pay**: Geen betaling zonder ondertekend arbeidscontract
2. **Anonimiteit**: Kandidaat blijft anoniem totdat opdrachtgever contract accepteert
3. **Pro Scout drempel**: Na 2 plaatsingen als natuurlijk persoon moet KVK worden ingevuld
4. **Geen vrije berichten**: Scouts en opdrachtgevers kunnen niet rechtstreeks communiceren. Alle communicatie verloopt via gestructureerde acties (toelichting bij voordracht, feedback bij afwijzing) en automatische systeemberichten. Dit voorkomt dat contactgegevens buiten het platform worden gedeeld
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
17b. **Kandidaat-blokkade bij voordracht**: Een kandidaat die is voorgedragen op een vacature kan niet tegelijkertijd op een andere vacature worden voorgedragen. De blokkade duurt zolang het proces actief is. Bij afwijzing of verlopen voordracht komt de kandidaat direct vrij — behalve bij exclusieve vacatures, waar een minimale blokkade van 14 dagen geldt ongeacht de uitkomst. Zie sectie 3 "Kandidaat-blokkade bij voordracht".
18. **Automatische matchingsuggesties**: Scouts ontvangen automatische matchingsuggesties wanneer een vacature wordt gepubliceerd die matcht met kandidaten in hun talent pool — op basis van harde criteria (opleiding, ervaring, locatie) en M-Score. De scout kan de suggestie accepteren (= voordragen) of afwijzen.
19. **Handmatig matchen**: Scouts kunnen kandidaten ook handmatig aan vacatures koppelen, onafhankelijk van automatische suggesties.
20. **Introductiekorting nieuwe scout**: Een scout zonder track record (0 afgeronde plaatsingen) is een hoger risico voor opdrachtgevers. Om de drempel te verlagen: de eerste succesvolle plaatsing is met 50% korting. Zowel de scout als Refurzy dragen de korting (beiden ontvangen 25% i.p.v. 50% van de normale fee). Na de eerste succesvolle plaatsing vervalt de korting automatisch. Dit wordt zichtbaar voor de opdrachtgever als "50% introductiekorting" badge bij kandidaten van nieuwe scouts, en voor de scout als incentive om de eerste match te realiseren.
21. **Terugkeer naar talent pool na afwijzing**: Wanneer een kandidaat in de pipeline wordt afgewezen door de opdrachtgever, keert de kandidaat automatisch terug naar de status "beschikbaar" in de talent pool van de scout. De scout ontvangt een notificatie. Het M-Score profiel blijft geldig en de kandidaat kan direct voor een andere vacature worden voorgedragen. Afwijzingsreden en rating worden opgeslagen (niet zichtbaar voor kandidaat, wel voor scout). Wanneer een kandidaat zelf afziet (bijv. ander aanbod), kan de scout kiezen: "Beschikbaar voor andere vacatures" (terug in pool) of "Niet meer beschikbaar" (inactief in pool).
22. **Automatische herinneringen (auto-nudges)**: Refurzy stuurt automatisch herinneringen naar opdrachtgevers wanneer pipeline-fases te lang duren. Scouts hoeven zelf geen actie te ondernemen — het systeem bewaakt de doorlooptijden. Bij overschrijding wordt geëscaleerd naar Refurzy. Zie sectie 27 voor het volledige communicatiemodel.
23. **Exclusiviteit (+25%)**: Opdrachtgevers kunnen bij het aanmaken van een vacature exclusiviteit activeren. Kandidaten worden dan minimaal 14 dagen niet aan andere vacatures aangeboden — ook niet als ze binnen die 14 dagen worden afgewezen of als de voordracht verloopt. De toeslag is 25% bovenop de plaatsingsfee. Exclusiviteit is onherroepelijk per vacature om gaming te voorkomen. Zie sectie 3 "Kandidaat-blokkade bij voordracht" voor alle regels.

---

## 19. Algemene Voorwaarden — Kernbepalingen

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

---

## 20. Juridische Documenten & Consent Logging

### Documenten overzicht

| Nr | Document | Partijen | Wanneer akkoord? |
|----|----------|----------|-----------------|
| 01 | Algemene Voorwaarden | Alle gebruikers | Bij registratie |
| 02 | Plaatsingsovereenkomst | Refurzy ↔ Opdrachtgever | Bij profiel ontgrendelen (per kandidaat) |
| 03 | Scoutovereenkomst | Refurzy ↔ Talent Scout | Bij registratie als scout |
| 04 | Privacybeleid | Alle bezoekers | Bij eerste bezoek (cookie-banner) |
| 05 | Verwerkersovereenkomst (OG) | Refurzy ↔ Opdrachtgever | Bij registratie |
| 06 | Verwerkersovereenkomst (Scout) | Refurzy ↔ Scout | Bij registratie |
| 07 | Toestemmingsverklaring | Kandidaat | Bij start Matching Scan |
| 08 | Cookiebeleid | Alle bezoekers | Bij eerste bezoek |
| 09 | Verwerkersovereenkomst VU | Refurzy ↔ VU Amsterdam | Bij aangaan licentie (eenmalig) |

### Consent per rol bij registratie

| Rol | Documenten |
|-----|-----------|
| Opdrachtgever | Algemene Voorwaarden + Privacybeleid + Verwerkersovereenkomst |
| Talent Scout | Scoutovereenkomst + Algemene Voorwaarden + Privacybeleid + Verwerkersovereenkomst |
| Kandidaat | Toestemmingsverklaring + Privacybeleid |

### Consent Logging — Verplichte velden

Elk akkoord moet worden gelogd met:

| Veld | Type | Beschrijving |
|------|------|-------------|
| consent_id | string | Uniek ID |
| user_id | string | ID van de gebruiker |
| user_email | string | E-mailadres |
| user_role | enum | opdrachtgever / scout / kandidaat / admin |
| document_type | enum | Type document (bijv. 'algemene_voorwaarden') |
| document_version | string | Versienummer (bijv. '1.0') |
| consent_given | boolean | true/false |
| consent_timestamp | ISO 8601 | Exacte datum en tijd van akkoord |
| ip_address | string | IP-adres op moment van akkoord |
| user_agent | string | Browser user agent |
| method | enum | checkbox / click / signature |

### Versioning

- Bij een nieuwe versie van een document moet de gebruiker opnieuw akkoord gaan
- Het oude akkoord blijft bewaard in de log (nooit overschrijven)
- De huidige documentversie wordt centraal beheerd in `lib/consent-log.ts`

---

## 21. Opdrachtgever Bedrijfsprofiel

**Route:** `/demo/opdrachtgever/bedrijfsprofiel`

Beheer pagina voor het bedrijfsprofiel van de opdrachtgever.

### Secties

1. **Bedrijfsgegevens** — KVK-nummer, bedrijfsnaam, adres, postcode, plaats, land, sector, website. Edit-mode toggle per sectie.
2. **Factuurgegevens** — Factuurnaam, factuuradres, BTW-nummer, IBAN. Edit-mode toggle.
3. **Contactpersonen** — Tabel met naam, email, rol, actief sinds. "Collega uitnodigen" button.
4. **Organisatie M-Score Profiel** — Status (ingevuld/niet ingevuld). Bij ingevuld: samenvatting waarden (dim 2) en organisatiekenmerken (dim 3). "Profiel bewerken" button. Noot over hergebruik bij alle vacatures.
5. **Getekende contracten** — Tabel met contractnaam, vacature, kandidaat, datum getekend, status. "Download PDF" button per contract.

### Technisch
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- Alle velden pre-filled met mock data
- Edit mode toggle per sectie (bedrijfsgegevens, factuurgegevens)

---

## 22. Scout Analytics Dashboard

**Route:** `/demo/scout/analytics`

Performance dashboard voor Talent Scouts.

### Secties

1. **Stat cards (4x):**
   - Totaal plaatsingen: 7 (met trend ↑)
   - Gemiddelde rating: 4.2/5 (uit opdrachtgever reviews)
   - Conversieratio: 34% (voorgedragen → geplaatst)
   - Totaal verdiend: €18.400

2. **Prestaties per maand** — CSS-only bar chart, laatste 6 maanden plaatsingen.

3. **Recente reviews** — Review cards met: opdrachtgever (anoniem), vacature, sterren (1-5), datum. Gemiddelde prominent weergegeven.

4. **Top vakgebieden** — Horizontale bar chart met success rate per sector (Marketing 45%, IT 30%, Finance 25%).

5. **Pro Scout status** — Progress bar met voortgang richting Pro Scout (2 plaatsingen vereist). Voordelen lijst.

### Technisch
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- CSS-only charts (geen externe chart library)

---

## 23. Admin Dashboard (verbeterd)

**Route:** `/demo/admin`

Executive dashboard met KPI's en beheertools.

### Secties

1. **KPI stat cards (6x):**
   - Actieve vacatures: 23
   - Plaatsingen deze maand: 4
   - Omzet deze maand: €28.800
   - Actieve scouts: 47
   - Actieve opdrachtgevers: 12
   - Openstaande escalaties: 2

2. **Omzet overzicht** — CSS bar chart, maandelijkse omzet laatste 6 maanden.

3. **Recente activiteit** — Activity feed met 6-8 recente platform activiteiten (voorstellen, contracten, escalaties, registraties).

4. **Escalaties** — Tabel met opdrachtgever, vacature, scout, nudges verstuurd, laatste nudge, actie. "Bel opdrachtgever" button.

5. **Fit Garantie claims** — Tabel met kandidaat, opdrachtgever, plaatsingsdatum, claim datum, reden, status (in behandeling/goedgekeurd/afgewezen).

6. **Snelkoppelingen** — Buttons naar: Uitbetalingen, Facturen, VU Test Log, Email Templates, Gebruikersbeheer.

### Sidebar navigatie (admin)
- Dashboard, Pricing, Landen, Gebruikers, Facturen, Uitbetalingen, VU Test Log, Email Templates

### Technisch
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- CSS-only charts

---

## 24. Onboarding & Registratie Flows

### 24.1 Opdrachtgever Onboarding

**Route:** `/demo/onboarding/opdrachtgever`

Multi-step registratie wizard voor nieuwe opdrachtgevers.

**Stappen:**

| Stap | Naam | Velden |
|------|------|--------|
| 1 | Bedrijfsgegevens | KVK-nummer, bedrijfsnaam, adres, postcode, plaats, sector |
| 2 | Contactpersoon | Naam, email, telefoon, functie |
| 3 | KVK Verificatie | Automatische check of KVK al geregistreerd is |
| 4 | Voorwaarden | Algemene Voorwaarden, Privacyverklaring, Verwerkersovereenkomst (checkboxes) |
| 5 | Account aangemaakt | Bevestigingspagina, doorverwijzing naar dashboard |

**KVK Duplicaatcontrole (Stap 3):**
- Systeem controleert of KVK-nummer al bestaat in de database
- **KVK bestaat niet:** Doorgaan naar stap 4
- **KVK bestaat al:** Toon melding met bestaand bedrijfsnaam, mogelijkheid om:
  - KVK-nummer wijzigen (terug naar stap 1)
  - Toegangsverzoek sturen naar bestaande account-beheerder
- Bestaande beheerder ontvangt email met verzoek + gegevens aanvrager

### 24.2 Scout Onboarding

**Route:** `/demo/onboarding/scout`

Multi-step registratie wizard voor nieuwe Talent Scouts.

**Stappen:**

| Stap | Naam | Velden |
|------|------|--------|
| 1 | Persoonlijke gegevens | Naam, email, telefoon, woonplaats, land |
| 2 | Professioneel profiel | Sector expertise (multi-select), jaren ervaring, LinkedIn URL |
| 3 | Voorwaarden | Scoutovereenkomst, Privacyverklaring, Verwerkersovereenkomst (checkboxes) |
| 4 | Account aangemaakt | Bevestigingspagina, doorverwijzing naar scout dashboard |

### 24.3 Kandidaat Onboarding

**Route:** `/demo/onboarding/kandidaat`

Toegankelijk via uitnodigingslink van scout. Bevat context over de scout en vacature.

**Stappen:**

| Stap | Naam | Velden |
|------|------|--------|
| 1 | Welkom | Bericht: "Je bent uitgenodigd door [scout_naam]", uitleg over het proces |
| 2 | Persoonlijke gegevens | Naam, email, telefoon |
| 3 | Toestemming | Toestemmingsverklaring, Privacyverklaring (checkboxes) |
| 4 | Account aangemaakt | Bevestigingspagina, doorverwijzing naar Matching Scan |

### Technisch (alle onboarding flows)
- Light theme (`bg-surface`, `text-ink`)
- Progress stepper component bovenaan elke pagina
- Geen authenticatie vereist (registratie flow)
- Na account aanmaken: automatische login + redirect naar dashboard/scan

---

## 25. Email Templates

**Route:** `/demo/admin/email-templates` (Admin only)

Overzicht van alle 12 email templates in het systeem.

### Templates

| Nr | Template | Ontvanger | Trigger | Onderwerp |
|----|----------|-----------|---------|-----------|
| 01 | Uitnodiging kandidaat | Kandidaat | Scout nodigt kandidaat uit | Je bent uitgenodigd voor een unieke kans bij {{bedrijf}}! |
| 02 | Matching Scan herinnering | Kandidaat | Scan niet ingevuld na 48u | Vergeet je Matching Scan niet! |
| 03 | Nieuwe matchingsuggestie | Scout | Nieuwe vacature matcht met talent pool | Nieuwe match gevonden: {{vacature_titel}} bij {{bedrijf}} |
| 04 | Kandidaat voorgedragen | Opdrachtgever | Scout draagt kandidaat voor | Nieuwe kandidaat voorgedragen voor {{vacature_titel}} |
| 05 | Contract akkoord bevestiging | Scout | OG accepteert profiel | Profiel ontgrendeld: {{kandidaat_naam}} voor {{vacature_titel}} |
| 06 | Gespreksdatum herinnering | Kandidaat, Scout | 24 uur voor gepland gesprek | Morgen: gesprek bij {{bedrijf}} voor {{vacature_titel}} |
| 07 | Nudge 1 — Vriendelijke herinnering | Opdrachtgever | Scout stuurt nudge (niveau 1) | Herinnering: plan het gesprek in voor {{vacature_titel}} |
| 08 | Nudge 2 — Urgente herinnering | Opdrachtgever | Scout stuurt nudge (niveau 2) | Urgent: kandidaat wacht op reactie voor {{vacature_titel}} |
| 09 | Escalatie naar Refurzy | Admin | Na 2 onbeantwoorde nudges | Escalatie: geen reactie van {{bedrijf}} op {{vacature_titel}} |
| 10 | Feedback na gesprek herinnering | Opdrachtgever | Gesprek afgerond, geen feedback na 48u | Geef feedback over het gesprek met kandidaat {{initialen}} |
| 11 | Felicitatie contract getekend | OG, Kandidaat, Scout | Arbeidsovereenkomst getekend | Gefeliciteerd! Contract getekend voor {{vacature_titel}} |
| 12 | Fit Garantie check-in | Opdrachtgever | 3, 6 en 12 maanden na startdatum | Fit Garantie check-in: hoe gaat het met {{kandidaat_naam}}? |

### Felicitatie email (3 versies)
- **Opdrachtgever versie:** Bevat factuurinformatie + Fit Garantie details
- **Kandidaat versie:** Bevat startdatum + contactgegevens opdrachtgever
- **Scout versie:** Bevat fee-overzicht + uitbetalingsinformatie

### Fit Garantie check-in (3 momenten)
- **3 maanden:** Vroege check-in — "Hoe verloopt de samenwerking?"
- **6 maanden:** Halverwege check-in — Optioneel feedbackformulier
- **12 maanden:** Finale check-in — Fit Garantie loopt af, evaluatie

### Admin interface
- Card grid layout met alle 12 templates
- Per card: template naam, ontvanger rol, trigger event, onderwerpregel
- Klik op card: uitklappen met volledige HTML email preview (Refurzy branding)
- Templates gebruiken variabelen: {{kandidaat_naam}}, {{scout_naam}}, {{bedrijf}}, etc.

### Technisch
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- Mock HTML email previews met Refurzy gradient header

---

## 26. Notificatiesysteem

### NotificationBell component

**Locatie:** TopBar (alle rollen)

- Bell icon in top-right van de topbar (naast gebruikersnaam)
- Badge met ongelezen telling (bijv. "3")
- Klik: dropdown met laatste 6 notificaties
- Per notificatie: type icon, titel, beschrijving, tijdstip ("2 uur geleden"), gelezen/ongelezen status
- "Alles gelezen" button
- Link naar volledige notificatiepagina

### Notificaties pagina

**Route:** `/demo/notificaties` (alle rollen)

Volledige notificatiepagina met:
- Lijst van alle notificaties
- Per notificatie:
  - Icon per type (vacature, match, contract, bericht, systeem)
  - Titel + beschrijving
  - Tijdstempel (relatief)
  - Gelezen/ongelezen toggle
  - Link naar relevante pagina
- Filter op type (Alles, Vacature, Match, Contract, Bericht, Systeem)
- "Alles als gelezen markeren" button
- 8-10 notificaties per rol (mock data)

### Notificatie types

| Type | Icon | Beschrijving |
|------|------|-------------|
| vacancy | Vacature | Nieuwe vacature, verloopt binnenkort, gepubliceerd |
| match | Match | Nieuwe voordracht, matchingsuggestie, M-Score berekend |
| contract | Contract | Profiel ontgrendeld, contract getekend, arbeidsvoorwaarden |
| message | Bericht | Nudge, feedback, gesprek herinnering |
| system | Systeem | Welkom, registratie, Pro Scout upgrade, Fit Garantie check-in |

### Delivery per rol

| Rol | Voorbeeld notificaties |
|-----|----------------------|
| Opdrachtgever | Nieuwe voordracht, nudge van scout, contract klaar, vacature verloopt, feedback herinnering |
| Scout | Matchingsuggestie, profiel ontgrendeld, scan ingevuld, contract getekend, nieuwe vacature |
| Kandidaat | Voorgedragen voor vacature, gesprek gepland, feedback ontvangen, scan resultaat |
| Admin | Escalatie melding, contract getekend, nieuwe registratie, KVK duplicaat, uitbetaling |

### Technisch
- Light theme (`bg-surface`, `text-ink`)
- `'use client'` directive
- Mock data in `lib/mock-notifications.ts`
- NotificationBell component in `app/demo/components/NotificationBell.tsx`
- Notificaties pagina in `app/demo/notificaties/page.tsx`
- TopBar geupdate met NotificationBell
- Sidebar geupdate met "Notificaties" link voor alle rollen

---

## 27. Communicatiemodel — Geen Vrije Berichten

### Principe
Scouts en opdrachtgevers kunnen **nooit** vrij met elkaar communiceren via het platform. Alle communicatie verloopt via:
1. **Gestructureerde toelichting** — scout schrijft motivatie bij voordracht van kandidaat
2. **Gestructureerde feedback** — opdrachtgever geeft reden bij afwijzing (dropdown + toelichting)
3. **Automatische systeem-nudges** — Refurzy stuurt herinneringen bij overschrijding van doorlooptijden
4. **Statusupdates** — scout ontvangt automatisch notificaties bij elke statuswijziging

### Rationale
- Voorkomt dat scouts contactgegevens delen en buiten het platform om opereren
- Beschermt de anonimiteit van kandidaten (geen informele berichten die het systeem omzeilen)
- Kwaliteitsfilter: alleen wanneer een opdrachtgever investeert (ontgrendeling) ontstaat een proces
- Scouts hoeven niets te doen behalve kandidaten voordragen — het systeem bewaakt de voortgang

### Pipeline-fases en maximale doorlooptijden

| # | Fase | Status | Max doorlooptijd |
|---|------|--------|-----------------|
| 1 | Voorgedragen | `voorgesteld` | — |
| 2 | Review | `voorgesteld` → `contract_akkoord` | 7 dagen |
| 3 | Profiel ontgrendeld | `contract_akkoord` → `gesprek_plannen` | 7 dagen |
| 4 | Gesprek plannen | `gesprek_plannen` → `gesprek_gepland` | 7 dagen |
| 5 | Gesprek gepland | `gesprek_gepland` → `feedback_geven` | 10 dagen |
| 6 | Feedback geven | `feedback_geven` → volgende stap | 7 dagen |
| 7a | Vervolggesprek | `vervolggesprek` | 10 dagen |
| 7b | Arbeidsvoorwaarden | `arbeidsvoorwaarden` | 14 dagen |
| 8 | Aangenomen | `contract_getekend` | Einde |
| X | Afgewezen | `afgewezen` | Einde |

### Automatische systeem-nudges — exacte berichtteksten

#### Fase 2: Review (na voordracht)

| Dag | Aan | Bericht |
|-----|-----|---------|
| Dag 3 | Opdrachtgever | "Er wacht een nieuwe voordracht op uw review voor **[vacaturetitel]**. De kandidaat heeft een M-Score van **[X]%**. Bekijk de voordracht in uw dashboard." |
| Dag 6 | Opdrachtgever | "Uw review voor een voordracht op **[vacaturetitel]** verloopt morgen. Na 7 dagen wordt de voordracht automatisch geannuleerd en keert de kandidaat terug naar de talent pool van de scout." |
| Dag 7 | Opdrachtgever | "Een voordracht voor **[vacaturetitel]** is automatisch geannuleerd wegens geen reactie binnen 7 dagen." |
| Dag 7 | Scout | "Uw voordracht voor **[vacaturetitel]** is verlopen omdat de opdrachtgever niet heeft gereageerd. **[Kandidaat]** is terug in uw talent pool en kan voor een andere vacature worden voorgedragen." |

#### Fase 4: Gesprek plannen (na ontgrendeling)

| Dag | Aan | Bericht |
|-----|-----|---------|
| Dag 4 | Opdrachtgever | "U heeft het profiel van **[kandidaat]** ontgrendeld voor **[vacaturetitel]**, maar er is nog geen gesprek gepland. Plan een kennismakingsgesprek om de match te beoordelen." |
| Dag 6 | Opdrachtgever | "Morgen verloopt de termijn om een gesprek te plannen met **[kandidaat]** voor **[vacaturetitel]**. Zonder actie wordt dit geëscaleerd." |
| Dag 7 | Scout | "De opdrachtgever heeft het profiel van **[kandidaat]** ontgrendeld voor **[vacaturetitel]**, maar plant geen gesprek. Refurzy neemt contact op met de opdrachtgever." |
| Dag 7 | Refurzy Admin | "Escalatie: **[opdrachtgever]** heeft profiel ontgrendeld voor **[vacaturetitel]** maar plant geen gesprek na 7 dagen. Actie vereist." |

#### Fase 6: Feedback geven (na gesprek)

| Dag | Aan | Bericht |
|-----|-----|---------|
| Dag 5 | Opdrachtgever | "Heeft het gesprek met **[kandidaat]** voor **[vacaturetitel]** plaatsgevonden? Geef de uitkomst door zodat we het proces kunnen vervolgen." |
| Dag 6 | Opdrachtgever | "Morgen verloopt de termijn om feedback te geven over uw gesprek met **[kandidaat]** voor **[vacaturetitel]**." |
| Dag 7 | Scout | "De opdrachtgever heeft nog geen feedback gegeven over het gesprek met **[kandidaat]** voor **[vacaturetitel]**. Refurzy neemt contact op." |
| Dag 7 | Refurzy Admin | "Escalatie: **[opdrachtgever]** geeft geen feedback na gesprek voor **[vacaturetitel]**. Actie vereist." |

#### Fase 7b: Arbeidsvoorwaarden

| Dag | Aan | Bericht |
|-----|-----|---------|
| Dag 10 | Opdrachtgever + Scout | "Het arbeidsvoorwaardengesprek voor **[kandidaat]** bij **[vacaturetitel]** loopt al 10 dagen. Kunnen wij iets voor u betekenen? Neem contact op met Refurzy als er ondersteuning nodig is." |
| Dag 14 | Refurzy Admin | "Escalatie: arbeidsvoorwaardenfase voor **[kandidaat]** bij **[vacaturetitel]** overschrijdt 14 dagen. Interventie vereist." |

### Statusupdates aan scout (automatisch)

| Trigger | Bericht aan scout |
|---------|-------------------|
| Voordracht ingediend | "Uw voordracht van **[kandidaat]** voor **[vacaturetitel]** is ingediend. De opdrachtgever heeft 7 dagen om te reageren." |
| Profiel ontgrendeld | "Goed nieuws! **[opdrachtgever]** heeft het profiel van **[kandidaat]** ontgrendeld voor **[vacaturetitel]**." |
| Gesprek gepland | "**[Kandidaat]** is uitgenodigd voor een gesprek op **[datum]** bij **[opdrachtgever]**." |
| Feedback ontvangen | "**[Opdrachtgever]** heeft feedback gegeven over het gesprek met **[kandidaat]**." |
| Vervolggesprek | "**[Kandidaat]** is uitgenodigd voor een vervolggesprek bij **[opdrachtgever]**." |
| Aangenomen | "Gefeliciteerd! **[Kandidaat]** is aangenomen voor **[vacaturetitel]**. Uw fee: €**[bedrag]**." |
| Afgewezen | "**[Kandidaat]** is afgewezen voor **[vacaturetitel]**. Reden: **[categorie]**. De kandidaat is terug in uw talent pool." |

### Wat niet beschikbaar is
- ~~Vrije berichtenfunctie tussen scout en opdrachtgever~~
- ~~Chat of directe communicatie~~
- ~~Berichten na aanname of afwijzing~~ (kanaal sluit automatisch)
- ~~Handmatige nudges door scouts~~ (vervangen door automatische systeem-nudges)
