/**
 * Consent Logging System
 *
 * Logs every user consent event for legal compliance.
 * In production: persist to database. In demo: localStorage + console.
 */

export interface ConsentRecord {
  consent_id: string
  user_id: string
  user_email: string
  user_role: 'opdrachtgever' | 'scout' | 'kandidaat' | 'admin'
  document_type: DocumentType
  document_version: string
  consent_given: boolean
  consent_timestamp: string
  ip_address: string
  user_agent: string
  method: 'checkbox' | 'click' | 'signature'
}

export type DocumentType =
  | 'algemene_voorwaarden'
  | 'plaatsingsovereenkomst'
  | 'scoutovereenkomst'
  | 'privacybeleid'
  | 'verwerkersovereenkomst_opdrachtgever'
  | 'verwerkersovereenkomst_scout'
  | 'toestemmingsverklaring_kandidaat'
  | 'cookiebeleid'

export const DOCUMENT_VERSIONS: Record<DocumentType, string> = {
  algemene_voorwaarden: '1.0',
  plaatsingsovereenkomst: '1.0',
  scoutovereenkomst: '1.0',
  privacybeleid: '1.0',
  verwerkersovereenkomst_opdrachtgever: '1.0',
  verwerkersovereenkomst_scout: '1.0',
  toestemmingsverklaring_kandidaat: '1.0',
  cookiebeleid: '1.0',
}

export const DOCUMENT_NAMES: Record<DocumentType, string> = {
  algemene_voorwaarden: 'Algemene Voorwaarden',
  plaatsingsovereenkomst: 'Plaatsingsovereenkomst',
  scoutovereenkomst: 'Scoutovereenkomst',
  privacybeleid: 'Privacybeleid',
  verwerkersovereenkomst_opdrachtgever: 'Verwerkersovereenkomst',
  verwerkersovereenkomst_scout: 'Verwerkersovereenkomst',
  toestemmingsverklaring_kandidaat: 'Toestemmingsverklaring',
  cookiebeleid: 'Cookiebeleid',
}

export const DOCUMENT_URLS: Record<DocumentType, string> = {
  algemene_voorwaarden: '/juridisch/algemene-voorwaarden',
  plaatsingsovereenkomst: '/juridisch/plaatsingsovereenkomst',
  scoutovereenkomst: '/juridisch/scoutovereenkomst',
  privacybeleid: '/juridisch/privacybeleid',
  verwerkersovereenkomst_opdrachtgever: '/juridisch/verwerkersovereenkomst',
  verwerkersovereenkomst_scout: '/juridisch/verwerkersovereenkomst-scout',
  toestemmingsverklaring_kandidaat: '/juridisch/toestemmingsverklaring',
  cookiebeleid: '/juridisch/cookiebeleid',
}

/** Generate unique consent ID */
function generateConsentId(): string {
  return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/** Log a consent event (demo: localStorage + console) */
export function logConsent(
  userEmail: string,
  userRole: ConsentRecord['user_role'],
  documentType: DocumentType,
  consentGiven: boolean,
  method: ConsentRecord['method'] = 'checkbox'
): ConsentRecord {
  const record: ConsentRecord = {
    consent_id: generateConsentId(),
    user_id: `user_${userEmail.replace(/[^a-z0-9]/gi, '_')}`,
    user_email: userEmail,
    user_role: userRole,
    document_type: documentType,
    document_version: DOCUMENT_VERSIONS[documentType],
    consent_given: consentGiven,
    consent_timestamp: new Date().toISOString(),
    ip_address: '127.0.0.1', // Demo: would be server-side in production
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    method,
  }

  // Store in localStorage (demo)
  const existing = getConsentLog()
  existing.push(record)
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('refurzy_consent_log', JSON.stringify(existing))
  }

  // Log to console for visibility
  console.log(`[CONSENT] ${consentGiven ? '✅' : '❌'} ${userEmail} → ${DOCUMENT_NAMES[documentType]} v${DOCUMENT_VERSIONS[documentType]}`)

  return record
}

/** Get all consent records */
export function getConsentLog(): ConsentRecord[] {
  if (typeof localStorage === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('refurzy_consent_log') || '[]')
  } catch {
    return []
  }
}

/** Check if user has given consent for a specific document version */
export function hasConsent(userEmail: string, documentType: DocumentType): boolean {
  const records = getConsentLog()
  const currentVersion = DOCUMENT_VERSIONS[documentType]
  return records.some(
    r => r.user_email === userEmail && r.document_type === documentType && r.document_version === currentVersion && r.consent_given
  )
}

/** Get all consent records for a specific user */
export function getUserConsents(userEmail: string): ConsentRecord[] {
  return getConsentLog().filter(r => r.user_email === userEmail)
}
