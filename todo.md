# TODO

## Today
- [ ] Type safety: remove `any` usages
  - [ ] Define proper types for `onEmojiSelect`/`onGridChange` in `src/components/EmojiGridMapper/EmojiGridMapper.tsx`
  - [ ] Replace `ComponentType<any>` in `src/components/VueCalWrapper.tsx` with a typed interface and extend `src/types/vue-cal.d.ts` with props/events we use
  - [ ] Remove `as any` casts in `src/components/VerticalSplit/VerticalSplit.tsx` touch handlers by typing the listeners
- [ ] Implement real Edit Mode in `EmotionalCalendar`
  - [ ] Replace the `console.log` in `handleEditMode` with stateful toggling that enables/disables drag/resize and shows a visual indicator
  - [ ] Surface Edit Mode state in UI (badge or toolbar highlight)
- [ ] Settings wiring
  - [ ] Persist settings (weekends, 24h time, theme, defaultView, eventDuration) to `localStorage` and load them on app init
  - [ ] Apply `defaultView` to `App`/`EmotionalCalendar`
  - [ ] Use `eventDuration` when creating a new event in `handleAddEvent`
- [ ] Clean up console usage
  - [ ] Remove production `console.log` calls or guard behind `process.env.NODE_ENV !== 'production'`

## This Week
- [ ] Testing
  - [ ] Add unit tests for `EmotionalCalendar` (create/update/delete, persistence)
  - [ ] Add tests for `DataExport` (JSON/CSV/Summary formatting and download trigger)
  - [ ] Add tests for `SettingsPage` (toggles + persistence)
  - [ ] Add tests for `EmojiGridMapper` (position→emoji/emotion mapping)
  - [ ] Add basic interaction tests for `VerticalSplit` drag behavior
- [ ] Linting & formatting
  - [ ] Add ESLint + Prettier configs; enforce no `any`, no unused vars, and no console in production
  - [ ] Add `npm run lint` and CI step to run it
- [ ] Emoji tagging integration
  - [ ] Wire `EmojiGridMapper` to update the selected calendar event’s `emoji`/`emotion`
  - [ ] Provide a UX to select an event to tag (or tag last-created/selected event)
- [ ] Accessibility (a11y)
  - [ ] Add aria-labels/roles and keyboard focus styles for accessory buttons in `VerticalSplit`, `CalendarControls`, and modals
  - [ ] Ensure modal traps focus and is keyboard navigable
- [ ] Dead code hygiene
  - [ ] Run `vite-plugin-deadfile` and remove/relocate any reported dead files
- [ ] Docs
  - [ ] Update `README.md` tech stack (Material-UI is mentioned but not used); align features list with current app

## Backlog
- [ ] PWA
  - [ ] Add `manifest.json`, icons, and a service worker (e.g., Vite PWA plugin) for install/offline support
- [ ] Data sync
  - [ ] Optional cloud sync (Firebase or custom backend) with auth; respect privacy
- [ ] Analytics & insights
  - [ ] Advanced emotion analytics and visualizations over time ranges
- [ ] Customization
  - [ ] User-defined emotions/tags with color/emoji selection
  - [ ] Journaling notes attached to events
- [ ] Mobile polish
  - [ ] Deeper mobile gestures and layout tuning for small screens
- [ ] CI/CD
  - [ ] Add coverage reporting and thresholds in CI; upload artifacts for `dead-files.txt`
- [ ] Dependency maintenance
  - [ ] Audit Tailwind usage (currently minimal). Either integrate utilities in UI or remove Tailwind/PostCSS to simplify
  - [ ] Periodic upgrades (Vite 5+, plugins) and lockfile tidy