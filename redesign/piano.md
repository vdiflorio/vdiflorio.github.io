# Piano del redesign — vdiflorio.github.io

Ultimo aggiornamento: 2026-11-08 · branch di lavoro: `redesign`

Obiettivo: sostituire il sito al-folio con un sito scritto da zero (HTML e CSS statici, nessun
tema, nessuna build), più chiaro, più veloce e riconoscibilmente mio, mantenendo gli stessi indirizzi.
Le decisioni di stile e il loro perché sono in [design.md](design.md).

## Regole di lavoro

- **Mai un push senza averlo visto in locale.** Ogni fase si chiude con l'anteprima su
  `localhost` e gli screenshot a 1440, 768 e 390 px; il push avviene solo dopo un ok esplicito.
- Si va per gradi: una fase alla volta, ciascuna con la sua verifica.
- Il sito online resta quello attuale finché non si fa il merge in `main` (fase 6).
- Backup: branch `al-folio-backup` e tag `al-folio-final` su GitHub (creati il 2026-11-08).
  Ripristino in qualunque momento: `git checkout al-folio-backup`.

## Anteprima in locale

| Cosa | Comando | Indirizzo |
| --- | --- | --- |
| Alternative di stile (fase 1) | `python3 -m http.server 8000` dalla radice del repo | http://localhost:8000/redesign/alternative/ |
| Nuovo sito (dalla fase 3) | `python3 -m http.server 8000 -d docs` | http://localhost:8000/ |
| Vecchio sito al-folio | `git switch al-folio-backup && docker compose up` | http://localhost:8080/ |

Il nuovo sito è statico: quello che si vede con `http.server` è esattamente quello che GitHub Pages
pubblicherà. Docker serve solo per riaprire la vecchia versione Jekyll.

## Fasi

### Fase 0 — Analisi e backup ✅

- [x] Audit della versione attuale (inspector della skill design-taste-frontend: home 9 FAIL / 9 WARN,
      publications 7 FAIL). Risultati riassunti in [design.md](design.md#audit-della-versione-al-folio).
- [x] Backup: branch `al-folio-backup` + tag `al-folio-final` pubblicati su GitHub.
- [x] Branch di lavoro `redesign`.

### Fase 1 — Tre alternative da confrontare ⏳ (in corso)

- [x] Selezione delle figure da `Ricerca/MPBE/presentazione-*` → `redesign/alternative/img/` (WebP).
- [x] Tre prototipi con contenuti veri: prima schermata + ricerca + pubblicazioni + contatti.
  - A. Minimalista — `redesign/alternative/a-minimale.html`
  - B. High-end — `redesign/alternative/b-high-end.html`
  - C. Brutalista — `redesign/alternative/c-brutalista.html`
- [x] Primo giro di feedback (2026-11-08): C scartata; A e B troppo lontane dal sito di prima e con troppe immagini.
- [x] Prototipo D, ibrido A + B vicino al sito di prima — `redesign/alternative/d-ibrida.html`.
- [x] Secondo giro su D (2026-11-08): MOX come laboratorio del Dipartimento, protein–protein binding, CV completo, palette più decisa (tre varianti), navigazione completa, PGNN ridimensionate.
- [x] Terzo giro (2026-11-09): **D confermata**, palette grigio e oxblood più chiara, pubblicazioni selezionate, motivo di sfondo con lo scheletro di barnase–barstar (PDB 1BRS).

**Fase 1 chiusa.**

### Fase 2 — Direzione definitiva e testi

- [ ] Scheda completa della direzione scelta (tipi, palette, composizione di ogni sezione).
- [ ] Testi: home, ricerca, pubblicazioni, didattica, contatti (in inglese; italiano da valutare).
- [ ] Mappa delle pagine e degli indirizzi (vedi sotto).
- [ ] Decidere cosa fare della citazione di Winston Wolf.

### Fase 3 — Costruzione del nuovo sito in `docs/`

- [ ] Struttura: `docs/index.html`, `docs/publications/`, `docs/cv/`, `docs/teaching/`,
      `docs/repositories/` (o fusa nella home), `docs/404.html`, `docs/.nojekyll`.
- [ ] CSS unico con i token della direzione; font self-hosted (niente Google Fonts a runtime).
- [ ] Pubblicazioni: a mano per ora (6 lavori); script `papers.bib → HTML` se diventano tante.
- [x] CV completo (novembre 2026) in `/assets/pdf/CV.pdf`, stesso indirizzo di prima.
- [x] Sorgenti dei CV in `cv/` (`cv-academic.tex`, `cv-industry.tex`, stile comune `cv-style.sty`), con l'aspetto del sito; `make` produce `CV.pdf` e `CV_industry.pdf` (vedi `cv/README.md`).
- [ ] Pagina CV in HTML generata dai contenuti del PDF (fase 3).
- [ ] Anteprima locale + screenshot → ok di Vincenzo.

### Fase 4 — Immagini e animazioni

- [ ] Figure definitive, ottimizzate (WebP, `srcset`, dimensioni esplicite).
- [ ] Nuove figure se servono (es. PINN, meccanica statistica fuori equilibrio, che oggi non ne hanno).
- [ ] Una figura animata con la skill **anatomy** (disegno isometrico esplicativo), candidata:
      la pipeline di NextGenPB — molecola → superficie → octree raffinato localmente → potenziale.
- [ ] L'elemento interattivo della direzione scelta (vedi design.md).
- [ ] Anteprima locale → ok.

### Fase 5 — Verifica

- [ ] `inspect.mjs` 0 FAIL a 1440 / 768 / 390 su ogni pagina; `lint.mjs` pulito.
- [ ] Accessibilità: contrasto, focus visibile, alt delle figure, navigazione da tastiera, `prefers-reduced-motion`.
- [ ] Performance: niente jQuery/MathJax/Bootstrap; obiettivo < 300 KB per la home.
- [ ] SEO: `<title>` e meta description per pagina, `og:image` con URL assoluto, `canonical`,
      schema.org `Person` con ORCID/Scholar/GitHub/LinkedIn puliti, `sitemap.xml`, `robots.txt`,
      file di verifica Google `google6eec2dc6df5f6150.html` + meta tag Search Console.
- [ ] Tutti i link controllati (DOI, ORCID, NextGenPB tutorial, PDF del CV).

### Fase 6 — Pubblicazione

- [ ] Rimuovere dal branch i file di al-folio e i workflow GitHub Actions di al-folio.
- [ ] Merge di `redesign` in `main` (solo dopo l'ok finale in locale).
- [ ] Su GitHub: Settings → Pages → *Deploy from a branch* → `main` / `/docs` (passaggio manuale).
- [ ] Verifica online, Search Console, anteprime social (LinkedIn).
- [ ] Rollback se serve: Pages di nuovo su `gh-pages` oppure ripristino da `al-folio-backup`.

## Indirizzi da mantenere

| Indirizzo attuale | Nel nuovo sito |
| --- | --- |
| `/` | home |
| `/publications/` | pubblicazioni |
| `/cv/` | CV (pagina + PDF) |
| `/teaching/` | didattica |
| `/repositories/` | software (o redirect alla sezione della home) |
| `/assets/pdf/CV.pdf`, `/assets/pdf/CV_industry.pdf` | invariati |
| `/google6eec2dc6df5f6150.html` | invariato |
| `/books/`, `/blog/`, `/news/`, `/projects/` | eliminati (pagine del template, non linkate) |

Il tutorial di NextGenPB (`/nextgenpb_tutorial/`) è un repository separato e non viene toccato.

## Da confermare

- Indirizzo per i contatti: MOX, Dipartimento di Matematica, Politecnico di Milano,
  Piazza Leonardo da Vinci 32, 20133 Milano.
- Didascalie delle figure (quale molecola è in ciascuna; vedi design.md → Immagini).
- Lingua del sito: solo inglese, o inglese + italiano.
