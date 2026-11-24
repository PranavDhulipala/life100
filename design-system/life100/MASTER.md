# Life100 design system — foundation

Source: [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), its SKILL.md priority table and React stack guidelines. Manually adapted to the existing product; the external design generator was not executed.

## Product direction
Mobile-first personal workspace, calm and content-first; prioritize fast daily capture, reading, planning, and review over decorative dashboards. Maintain a restrained dark neutral surface with mint accent, readable text, and a consistent visual hierarchy. Use Lucide icons, not emoji for navigation.

## Baseline tokens
- Background #11131b; surface #1a1e29; border #303646.
- Primary text #f3f2f7; secondary #b3bbce; accent/focus #a8f0c4.
- System sans-serif; 16px body and form inputs, 13px labels; 1.5+ body line-height.
- Spacing on a 4px grid; 44px minimum touch target; 11px control radius, 17px panels.
- Use semantic CSS variables; keep existing visual identity until a complete design-system review.

## UX priorities
1. Keyboard access, visible focus, descriptive labels, current navigation state, meaningful status text and measured WCAG AA contrast.
2. Touch-sized controls and accessible feedback; no hover-only actions.
3. Fast offline capture, stable layout, no unnecessary external resources.
4. Responsive at 375, 768, 1024 and 1440px. Check safe areas, long content, text wrapping and zoom.
5. Keep notes editable, searchable and readable. AI drafts are proposals; user approves replacement and explicit sync.
6. Next iteration: five or fewer primary mobile navigation destinations with a discoverable More menu; deep linking, split view on desktop, a proper reading mode and richer editor.
7. React: small focused components, stable keys, derive state instead of duplicating it, reducer for complex shared state where appropriate, profile before adding memoization.

## Definition of done for a UI PR
- Check keyboard navigation, focus not obscured, accessible names and target sizes.
- Test real content with short/long titles, empty states, errors, loading states and offline operation.
- Verify mobile/desktop browser tests and visual review at the four viewport sizes.
- Keep existing data, API and migration behavior intact.
- Do not add a runtime dependency only to run a design skill. Review any external skill scripts before running them; never send private vault contents or secrets to design tools.

## Visual refresh
Field-notebook concept: slate-blue surfaces, desaturated mint highlights, serif date and page headings, compact divided daily stats instead of a decorative gradient. Mobile has four frequent destinations and a More control; secondary destinations remain available. Typography and restrained interaction guidance adapted from [Anthropic frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design). Review criteria from [Vercel Web Design Guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines); browser verification approach from [Anthropic webapp-testing](https://github.com/anthropics/skills/tree/main/skills/webapp-testing). UI UX Pro Max remains the primary system reference; do not mix conflicting style engines. The article's other skills are optional for specific work, not installed runtime packages. No external skill scripts executed.
