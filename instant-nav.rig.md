# instant-nav rig: notes-provider

- BUILD: `EXPOSE_TESTING_API=1 pnpm build && pnpm start --port 3000`
- EXPOSE: `EXPOSE_TESTING_API=1` (set during build + start)
- RUN: `BASE_URL=http://localhost:3000 pnpm exec playwright test tests/e2e/instant-nav.spec.ts`
- TEST USER: public; no authentication required
- DRIFT: none known — all routes are public, no feature flags, no locale gating
- CONTRACTS:
  - Route `/notes` (initial load): shell marker = `<h1>All Notes</h1>`
  - Route `/groups` (initial load): shell marker = `<h1>Bundles</h1>`
  - Soft nav to `/notes` from home: trigger = link "Browse all notes"
- LOOP: local build → start → test; agent can rebuild and restart server
- LIVENESS: n/a; local build and start
- WALLS:
  - `minimumReleaseAge` pnpm blocks 16.3.5: use `--config.minimumReleaseAge=0`
  - No storageState available — routes are public, no login needed
