# Prompt per ripartire in una nuova sessione di Claude Code

Incolla tutto il blocco qui sotto come primo messaggio della nuova sessione, aperta nella cartella
`/Users/vincenzo/Documents/Personale/vdiflorio.github.io`.

---

Stiamo rifacendo il mio sito personale (vdiflorio.github.io, GitHub Pages). Sono Vincenzo Di Florio, post-doc al
laboratorio MOX del Dipartimento di Matematica del Politecnico di Milano. Rispondimi in italiano; il sito è in inglese.

## Prima di fare qualunque cosa

1. Leggi per intero `redesign/piano.md` (fasi e checklist) e `redesign/design.md` (tutte le decisioni di stile e il perché),
   poi `cv/README.md`. Sono la fonte di verità: non ridecidere cose già decise lì.
2. Controlla lo stato: `git status`, `git log --oneline -10`, branch corrente (deve essere `redesign`).
3. Dimmi in poche righe a che punto siamo e cosa proponi di fare adesso, poi aspetta il mio ok.

## Stato al 2026-11-09

- Backup del sito vecchio (tema al-folio): branch `al-folio-backup` e tag `al-folio-final`, già su GitHub.
- Lavoro sul branch `redesign`, **solo commit locali, niente push**. Il sito online è ancora quello vecchio.
- Fasi 0–3 chiuse. Il sito nuovo è HTML/CSS statico, senza build, in `docs/`:
  `index.html` (home), `publications/`, `cv/`, `404.html`, reindirizzamenti `teaching/`, `repositories/`, `projects/`
  verso le sezioni della home, `assets/css/site.css`, `assets/js/site.js`, font, immagini, `assets/pdf/CV*.pdf`,
  `sitemap.xml`, `robots.txt`, `.nojekyll`, file di verifica Google.
- Direzione di stile "D" (ibrida, vicina al sito di prima): fondo grigio `#ececea`, superficie `#dfdfdc`, testo `#0e0e0f`,
  secondario `#47484c`, accento oxblood `#7d0c14`; tema scuro con accento `#ff6a4d`. Titoli in Zodiak (CDN Fontshare),
  testo in Hanken Grotesk (ospitato in `docs/assets/fonts`, OFL). Due sole immagini (ritratto + Barnase–Barstar) e lo
  scheletro Cα di barnase–barstar (PDB 1BRS) come motivo di sfondo leggero. Citazione di Winston Wolf come didascalia della foto.
- CV in LaTeX in `cv/` (`cv-academic.tex`, `cv-industry.tex`, stile comune `cv-style.sty`, stesso rosso e caratteri del sito).
  `make` li compila e li copia in `docs/assets/pdf/` e nella vecchia `assets/pdf/`. Solo l'email del Politecnico.
- I prototipi di stile scartati/storici sono in `redesign/alternative/` (A, B, C scartata, D scelta).

## Cosa resta da fare, in ordine

1. **Il mio ok sul sito in locale** (fine fase 3). Avvia l'anteprima, dammi l'indirizzo e applica le correzioni che chiedo.
2. **Fase 4, facoltativa, chiedimi prima**: una figura animata con la skill *anatomy* (candidata: la pipeline di NextGenPB,
   molecola → superficie → octree raffinato localmente → potenziale); eventuali nuove figure. Le PGNN devono restare in secondo piano.
3. **Fase 5, verifiche finali**: tema scuro e chiaro su ogni pagina, navigazione da tastiera e focus visibile,
   `prefers-reduced-motion`, peso delle pagine, link interni ed esterni, licenza di Zodiak (se permette l'hosting,
   ospitarlo in `docs/assets/fonts` come Hanken Grotesk; altrimenti resta il CDN).
4. **Fase 6, pubblicazione**, solo dopo il mio ok esplicito, un passo alla volta:
   - togli dal branch `redesign` i file di al-folio: `_config.yml`, `_bibliography/`, `_data/`, `_includes/`, `_layouts/`,
     `_pages/`, `_plugins/`, `_sass/`, `_scripts/`, `_teachings/`, `assets/` della radice (i PDF ora vivono in `docs/assets/pdf`),
     `Gemfile*`, `Dockerfile`, `docker-compose*.yml`, `package*.json`, `purgecss.config.js`, `bin/`, `lighthouse_results/`,
     `readme_preview/`, `.devcontainer/`, `.pre-commit-config.yaml`, `.prettier*`, `.lycheeignore`, `.all-contributorsrc`,
     `.git-blame-ignore-revs`, `.dockerignore`, `CONTRIBUTING.md`, `CUSTOMIZE.md`, `FAQ.md`, `INSTALL.md`,
     `google6eec2dc6df5f6150.html` della radice (la copia giusta è in `docs/`), e **tutti i workflow** in `.github/`
     (soprattutto `deploy.yml`, che pubblica sul branch `gh-pages`). Mostrami l'elenco prima di cancellare; chiedimi del `LICENSE`.
   - aggiorna `cv/Makefile` perché copi i PDF solo in `docs/assets/pdf/`; riscrivi `README.md` (come si aggiorna il sito e il CV);
     ripulisci `.gitignore`.
   - anteprima locale un'ultima volta, poi merge di `redesign` in `main` e push, **solo con il mio ok**.
   - io su GitHub imposto Settings → Pages → *Deploy from a branch* → `main` / `/docs` (tu dimmi esattamente cosa cliccare;
     `gh` non è installato).
   - verifica online: tutte le pagine, i vecchi indirizzi, la 404, l'anteprima social (LinkedIn Post Inspector),
     invio della sitemap in Google Search Console.
   - rollback se serve: Pages di nuovo sul branch `gh-pages`, oppure ripristino da `al-folio-backup`.
5. Aggiorna `redesign/piano.md` e `redesign/design.md` a ogni passo chiuso.

## Regole (le stesse della sessione precedente)

- **Mai un push senza avermelo fatto vedere in locale e senza un mio ok esplicito.** Commit locali sì, sul branch `redesign`.
- **Per gradi**: un passo alla volta, ognuno con la sua verifica; a fine passo mi dici cosa hai fatto e cosa serve da me.
- Prima di cancellare o sovrascrivere qualcosa, guardalo e dimmelo.
- Stile: segui la skill **design-taste-frontend** e le sue regole fisse (titoli al massimo su due righe, niente etichette sopra i
  titoli, niente monospace, niente 01/02/03, niente righe sottili decorative, gradienti, ombre a riposo o card identiche,
  testo corrente nel colore pieno e almeno 16px, margini uguali, un titolo per ogni sezione). Eccezioni già decise e dichiarate:
  poche immagini (`--allow few-pictures`), il motivo proteico di sfondo, `still-page` sulla sola 404.
- Contenuti veri: niente informazioni inventate. Se manca qualcosa, chiedimelo. Le pubblicazioni vanno aggiornate in tre posti:
  `docs/publications/index.html`, la home se è tra le selezionate, i due `.tex` del CV (poi `make`).
- Hook di design *impeccable*: correggi i problemi veri; un falso positivo va verificato sulla pagina renderizzata
  (`impeccable detect --no-config <url>`) prima di registrare un'eccezione con `impeccable hooks ignore-value`, e me lo dici.

## Note pratiche su questo Mac

- Anteprima del sito nuovo: `python3 -m http.server 8001 --bind 127.0.0.1 -d docs` → http://127.0.0.1:8001/
  (in background; il server locale non mostra la 404 personalizzata, GitHub Pages sì).
- Inspector della skill: c'è Node 20, quindi
  `node --experimental-websocket ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs <url> --allow few-pictures --out <scratchpad>/...`
  Scrivi i risultati nella scratchpad, non in `.taste-skill/` nel progetto. Lint: `node .../scripts/lint.mjs docs`.
- CV: il `lualatex` di MacPorts ha il formato rotto, usa MacTeX: `cd cv && PATH=/Library/TeX/texbin:$PATH make`.
  I caratteri per i PDF li scarica `cv/get-fonts.sh` in `cv/fonts/` (ignorata da git).
- La shell è zsh: metti tra virgolette i pattern con `*` (per esempio `--include="*.html"`).
- Lo script che ha generato lo scheletro proteico è `redesign/tools/backbone.py`.
