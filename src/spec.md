# Specification

## Summary
**Goal:** Build an authenticated gym management app for admins to manage members, plans/memberships, payments, attendance check-ins, and class scheduling with a consistent fitness-themed UI.

**Planned changes:**
- Implement Internet Identity sign-in/sign-out, keep an authenticated UI session, and gate all app features behind authentication.
- Add a simple roles model: store admin principals in the canister, enforce admin-only authorization in backend methods, and hide/disable admin actions in the UI; include a bootstrap mechanism for initial admin setup.
- Create backend (single Motoko actor) stable data models and CRUD/query APIs for:
  - Members (profile, active/inactive status, created/updated timestamps; deterministic listing/sorting)
  - Membership plans (create/edit/archive) and member memberships (assign/change plan, start/end dates, status)
  - Payments (record + per-member history query)
  - Attendance check-ins (record + per-member history + basic totals such as last 30 days)
  - Classes (create/update/cancel; scheduling fields) and enrollments (register/unregister; capacity tracking)
- Build primary UI pages and navigation: Dashboard, Members (list + search), Member Detail (tabs: profile/membership/payments/attendance), Plans, Classes (calendar-like day/week browsing), and Settings (admin management).
- Apply a coherent Tailwind-based visual theme across layouts, forms, tables/lists, and buttons; handle loading/empty/error states consistently and keep all user-facing text in English.
- Add generated static branding assets under `frontend/public/assets/generated`, reference them from the sign-in/landing experience, and ensure graceful fallback if images fail to load.

**User-visible outcome:** Users can sign in with Internet Identity; admins can manage gym members, assign membership plans, record payments, track attendance, schedule classes and registrations, and navigate a themed dashboard and management pages with stable, persisted data.
