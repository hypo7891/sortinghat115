// Kept in sync with the hardcoded isAdmin() check in firestore.rules.
// Client-side use is UI-only (which view to render) — the actual access
// control is enforced server-side by the matching Firestore rule.
export const ADMIN_EMAILS = ['chiashen@tmail.hc.edu.tw', 'j27271@tmail.ilc.edu.tw'];
