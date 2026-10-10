# Website SEO metadata refresh

**Goal:** Improve discovery of the site's actual inZOI content, including design inspiration, furniture, decor, screenshots, guides, MOOSTYLES mods and the live ARDENNE collection.

**Scope:** Update the existing metadata and prerendering flow. Keep the page layouts, CMS publishing rules and download behavior. Preserve hidden aviation. Do not deploy or promise search rankings.

**Approach:** Keep static page copy in one content module. Generate canonical URLs, sharing metadata and truthful linked JSON-LD through a tested helper. Use React 19's native head elements so metadata updates on navigation and in development as well as server rendering. Generate a canonical sitemap from the same public route definitions.

- [x] Add page-specific metadata and a shared builder. Test canonical aliases, query normalization, breadcrumbs, actual mod/image metadata, noindex behavior, safe JSON-LD serialization and omission of unsupported prices, ratings and publication dates.
- [x] Update the shared component and all page consumers; integrate native head output with prerendering. Verify metadata in initial HTML and after navigation, including hydration and hidden aviation.
- [x] Refresh the canonical/image sitemap, crawler rules and web app manifest. Exclude duplicate and utility URLs; do not manufacture last-modified dates.
- [x] Run the full test suite, targeted lint and production build. Audit every prerendered page's metadata and representative browser routes. Review the final diff.

**Verification:** 75 tests passed across eight files; targeted ESLint and production build passed. The generated HTML audit checked all 117 pages and 81 canonical sitemap URLs. Browser checks covered direct loads, filtered listings, legacy canonical URLs, hydration, brand transitions, development Strict Mode and noindex error pages. CMS fixture checks confirmed aviation remains stored and unpublished. Independent review found one publication-date issue, which was corrected and verified before completion.
