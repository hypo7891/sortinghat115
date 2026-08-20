// Kept in sync with the hardcoded isAdmin() / isAllowedTeacher() checks in
// firestore.rules. Client-side use is UI-only (which view to render, which
// error to show) — the actual access control is enforced server-side by
// the matching Firestore rules.
export const ADMIN_EMAILS = ['chiashen@tmail.hc.edu.tw', 'j27271@tmail.ilc.edu.tw'];

export const REGULAR_TEACHER_EMAILS = [
  'riannon@tmail.hc.edu.tw',
  'ugsummer@gmail.com',
  'ysjt11435@tmail.hc.edu.tw',
];

// Only accounts on this combined list can sign in as a teacher at all.
export const ALLOWED_TEACHER_EMAILS = [...ADMIN_EMAILS, ...REGULAR_TEACHER_EMAILS];
