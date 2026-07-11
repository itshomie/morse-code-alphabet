# Morse Code Alphabet SEO Plan

Updated: 2026-07-10

## Current reality

- Search Console still shows 11 URLs under "Discovered - currently not indexed", but that report was last updated on 2026-06-30.
- Google currently shows 8 public results for the domain, including 7 URLs that still appear in that old GSC report.
- The three real priority pages not visible in the current public `site:` check are:
  - `/morse-code-alphabet/`
  - `/english-to-morse/`
  - `/morse-code-practice/`
- Robots, canonical tags, sitemap access, and static HTML are not blocking these pages.
- Unknown URLs currently return the homepage with status 200 in production. The new build adds a real `404.html`; verify the live 404 status after deployment.

## Keyword ownership

| Priority | Keyword | Owner page | Role |
| --- | --- | --- | --- |
| P0 | `morse code alphabet` | `/morse-code-alphabet/` | Complete printable A-Z chart with pronunciation, sound, copy actions, spacing, and official reference notes |
| P1 | `morse code` | `/` | Broad hub: definition, translator, alphabet entry, sound, learning, and practice |
| P1 | `english to morse code` | `/english-to-morse/` | Locked Text to Morse tool; do not duplicate the homepage's two-way interface |
| P1 | `morse code decoder` | `/morse-code-decoder/` | Locked Morse to English tool |
| P1 | `morse code practice` | `/morse-code-practice/` | Listening quiz, visual quiz, and key trainer |
| P2 | `what is morse code` | `/morse-code-meaning/` | Plain explanation of meaning, signals, spacing, and use |
| P2 | `international morse code` | `/international-morse-code/` | Standard, timing, prosigns, and International vs. older systems |

One keyword intent should have one clear owner. Do not create a separate `/morse-code-chart/` page that competes with the alphabet page.

## Index policy

Keep these nine pages in the XML sitemap:

- `/`
- `/morse-code-alphabet/`
- `/morse-code-decoder/`
- `/english-to-morse/`
- `/learn-morse-code/`
- `/morse-code-practice/`
- `/morse-code-meaning/`
- `/international-morse-code/`
- `/morse-code-sounds/`

Keep About, Contact, Privacy, Terms, Sources, and the HTML sitemap accessible to users but `noindex,follow`. They support trust or navigation; they are not search landing pages.

## Deployment and GSC sequence

1. Deploy the new build.
2. Verify that a random missing URL returns HTTP 404, not the homepage with HTTP 200.
3. Submit the updated `sitemap.xml` in Search Console.
4. Use URL Inspection and request indexing for only these three pages first:
   - `/morse-code-alphabet/`
   - `/english-to-morse/`
   - `/morse-code-practice/`
5. Wait until Google has crawled the version dated 2026-07-10 before judging the result.
6. Review impressions and queries after 14 days; review ranking movement after 28 days.

Also add `www.morsecodealphabet.net` in Cloudflare and permanently redirect it to the non-www domain. This requires a Cloudflare DNS/domain setting and is not solved by page code alone.

## Link plan

The supplied difficulty estimate makes `morse code alphabet` the first target. Treat 15-30 relevant referring domains as a rough market estimate, not a quota to fill with low-quality links.

Prioritize links that can send real users:

- amateur radio clubs and learning-resource pages;
- teacher, scout, STEM, puzzle, and accessibility resource lists;
- curated utility directories with an editorial review;
- relevant GitHub projects or documentation that need a reliable Morse reference;
- pages that can genuinely use the printable chart, audio, or practice trainer.

Avoid bulk directory blasts, paid link networks, PBNs, and hundreds of nearly identical profile links. The broad keyword `morse code` will need substantially more authority than the alphabet term, so it is a second-stage goal.

## Content expansion rule

Do not publish dozens of letter pages now. First let the nine-page core site earn crawls and impressions.

Only add a phrase page when GSC shows real demand. Good candidates to validate later are:

- `sos in morse code`
- `i love you in morse code`
- `help in morse code`
- `hello in morse code`

Each phrase page must provide a playable result, character-by-character breakdown, correct spacing, copy action, common mistakes, and useful internal links. A page that only changes one phrase is too thin.

## KPIs

Track these weekly:

- indexed status of the nine sitemap URLs;
- impressions and average position for the two main keywords;
- impressions for new long-tail queries;
- CTR of the homepage and alphabet page;
- referring domains that are relevant and indexed;
- usage of Play, Copy, Print, Practice, and Translator actions in GA4.
