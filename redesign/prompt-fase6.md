# Prompt — Fase 6: pubblicazione

Incolla tutto il blocco sotto la riga come primo messaggio di una nuova sessione di Claude Code, aperta nella cartella
`/Users/vincenzo/Documents/Personale/vdiflorio.github.io`. Da fare **solo alla fine**, quando il sito in locale è
quello definitivo. È la fase delicata: ogni passo che cambia qualcosa su GitHub si fa solo dopo il mio ok esplicito.

---

Stiamo rifacendo il mio sito personale (vdiflorio.github.io, GitHub Pages). Sono Vincenzo Di Florio, post-doc al
laboratorio MOX del Dipartimento di Matematica del Politecnico di Milano. Rispondimi in italiano.

Il sito nuovo è pronto in `docs/` sul branch `redesign`. Adesso lo **pubblichiamo** (fase 6). Procedi **esattamente**
nell'ordine sotto. Dove c'è scritto **FERMATI**, mostrami il risultato e aspetta che io scriva "ok" prima di
continuare. Se qualcosa non torna con quello che è scritto qui, fermati e chiedimi: non improvvisare.

## Situazione di partenza (attesa)

- `main`, `origin/main`, il branch `al-folio-backup` e il tag `al-folio-final` puntano tutti allo stesso commit,
  `e5a646a` (sito vecchio, tema al-folio). `al-folio-backup` e il tag sono già su GitHub.
- `redesign` parte da `e5a646a` e contiene solo commit nuovi; **non è mai stato pushato**.
- Il sito online oggi è servito dal branch `gh-pages` (generato dal vecchio workflow `deploy.yml`, che su `redesign`
  è già stato tolto).
- Su `redesign` restano solo `docs/`, `cv/`, `redesign/`, `README.md`, `LICENSE`, `.gitignore`, `.impeccable/`.

## Passo 0 — Leggere e controllare (nessuna modifica)

1. Leggi per intero `redesign/piano.md` (fase 6), `redesign/design.md` e `redesign/RIPARTENZA.md`.
2. Esegui e mostrami l'esito:
   ```sh
   git status
   git branch --show-current                      # deve essere redesign
   git fetch origin
   git rev-parse main origin/main al-folio-backup 'al-folio-final^{commit}' | cut -c1-7   # tutti e5a646a
   git merge-base --is-ancestor main redesign && echo "fast-forward possibile"
   git rev-list --count redesign..main            # deve essere 0
   git log main..redesign --format=%B | grep -ci 'co-authored-by'   # deve essere 0
   git ls-files | grep -ci zodiak                 # deve essere 0: Zodiak resta sul CDN
   git ls-files | wc -l                           # una sessantina di file
   ```
3. Avvia l'anteprima (`python3 -m http.server 8001 --bind 127.0.0.1 -d docs`) ed esegui:
   - `bash redesign/tools/verifica-online.sh http://127.0.0.1:8001` → 0 errori;
   - `node --experimental-websocket ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs <url> --allow few-pictures --out <scratchpad>/...`
     su `/` (con `--allow few-pictures`), `/publications/`, `/cv/` e `/404.html` (con `--allow few-pictures,still-page`:
     pagine da leggere senza entrate, vedi design.md → "Controllo finale") → 0 FAIL.
4. **FERMATI.** Dammi l'indirizzo dell'anteprima per l'ultimo sguardo e il riepilogo dei controlli. Se un controllo
   non torna (per esempio `main` non è più `e5a646a`), non proseguire.

## Passo 1 — Pulizia locale (solo con il mio ok)

- C'è un branch locale `redesign-prima-di-riscrivere`: è la copia di sicurezza fatta prima di togliere "Co-Authored-By"
  dai commit. Non va mai pushato. Chiedimi se cancellarlo (`git branch -D redesign-prima-di-riscrivere`).

## Passo 2 — `main` diventa il sito nuovo, in locale (solo con il mio ok)

```sh
git switch main
git merge --ff-only redesign       # fast-forward: nessun commit di merge, nessun conflitto
git log --oneline -3
git status
```

Se `--ff-only` fallisce, **fermati**: vuol dire che `main` è cambiato, e si decide insieme.
**FERMATI** e mostrami il risultato. Fino a qui niente è cambiato su GitHub.

## Passo 3 — Push (solo con il mio ok esplicito)

```sh
git push origin main               # fast-forward normale: MAI --force
```

Cosa succede: su GitHub `main` contiene il sito nuovo, ma **il sito online non cambia ancora**, perché GitHub Pages
serve ancora il branch `gh-pages`. Il vecchio `deploy.yml` non esiste più nel commit pushato, quindi non parte nessuna
build di al-folio. Controlla e dimmi che nella scheda *Actions* non è partito niente di inatteso.

Chiedimi se pushare anche `redesign` (`git push origin redesign`) per tenerne traccia su GitHub: non è necessario.

## Passo 4 — Cambiare la sorgente di GitHub Pages (lo faccio io, tu mi guidi)

`gh` non è installato: dimmi esattamente cosa cliccare.

1. Apri https://github.com/vdiflorio/vdiflorio.github.io/settings/pages
   (oppure: repository → *Settings* → nella colonna di sinistra, sotto *Code and automation*, *Pages*).
2. Prima di cambiare, **leggimi cosa c'è adesso** in *Build and deployment*: dovrebbe essere *Source: Deploy from a
   branch*, *Branch: gh-pages*, cartella */ (root)*. Annotalo in `piano.md`: serve per il rollback.
3. *Source*: lascia **Deploy from a branch**.
4. *Branch*: scegli **main**; nel menu della cartella accanto scegli **/docs**; premi **Save**.
5. *Custom domain*: vuoto. *Enforce HTTPS*: resta attivo.
6. In un paio di minuti nella scheda *Actions* compare un'esecuzione "pages build and deployment" sul branch `main`:
   aspetta che diventi verde. Il file `docs/.nojekyll` fa sì che GitHub pubblichi i file così come sono, senza Jekyll.

## Passo 5 — Verifica online

GitHub Pages tiene in cache le pagine per circa 10 minuti: se vedi ancora il sito vecchio, aspetta e riprova.

1. `bash redesign/tools/verifica-online.sh` (senza argomenti controlla https://vdiflorio.github.io) → **0 errori**.
   Controlla tra l'altro: tutte le pagine, i vecchi indirizzi (`/teaching/`, `/repositories/`, `/projects/` reindirizzano;
   `/blog/`, `/news/`, `/books/` danno la 404 personalizzata), i PDF del CV agli stessi indirizzi di prima, sitemap,
   robots, file di verifica Google, canonical e `og:image` assoluti, il tutorial di NextGenPB (repository separato).
2. `inspect.mjs` sulle pagine online → 0 FAIL.
3. Dimmi di aprire il sito su telefono e computer, in tema chiaro e scuro.
4. **Anteprima social**: io apro https://www.linkedin.com/post-inspector/ e incollo https://vdiflorio.github.io/ ;
   deve comparire l'immagine `og.jpg` con titolo e descrizione nuovi. LinkedIn ricorda l'anteprima vecchia: il Post
   Inspector la aggiorna.

## Passo 6 — Google Search Console (lo faccio io, tu mi guidi)

1. https://search.google.com/search-console → proprietà `https://vdiflorio.github.io/` (tipo "prefisso URL"; la
   verifica regge perché nel sito nuovo ci sono sia il file `google6eec2dc6df5f6150.html` sia il meta tag).
2. *Sitemap* → scrivo `sitemap.xml` → *Invia*. Lo stato deve diventare "Riuscito" con 3 URL rilevati.
3. *Controllo URL* → incollo `https://vdiflorio.github.io/` → *Richiedi indicizzazione*; poi lo stesso per
   `/publications/` e `/cv/`.
4. Nei giorni successivi: *Pagine* mostrerà come "Non trovata (404)" le vecchie pagine del template (`/blog/`, `/news/`,
   `/books/`): è normale, escono da sole dall'indice. Non serve lo strumento *Rimozioni*.

## Passo 7 — Chiusura

1. Aggiorna `redesign/piano.md` (fase 6 chiusa, con data, sorgente di Pages prima e dopo) e `redesign/design.md`;
   commit su `main` e push, **solo con il mio ok** (le regole valgono anche dopo la pubblicazione).
2. **Non cancellare** `gh-pages`, `al-folio-backup` né il tag `al-folio-final`: servono per il rollback. Ne riparliamo
   tra qualche settimana.
3. Ricordami di aggiornare il link al sito dove compare: profilo Google Scholar (homepage), ORCID (websites), profilo
   GitHub (website), LinkedIn (contatti), pagina personale MOX/Polimi, README di NextGenPB e del tutorial.

## Rollback, se qualcosa va storto

- **Immediato e sicuro**: Settings → Pages → *Branch* di nuovo **gh-pages** / **/ (root)** → *Save*. In pochi minuti
  torna online il sito vecchio, perché `gh-pages` non è stato toccato. `main` può restare com'è mentre si corregge.
- **Riportare anche `main` al sito vecchio** riscrive la storia pubblicata (`git push --force-with-lease origin
  al-folio-backup:main`): **solo con il mio ok esplicito** e solo se il rollback di Pages non basta.

## Regole

- **Mai un push senza avermi mostrato il sito in locale e senza un mio ok esplicito.** Mai `--force`, salvo il caso del
  rollback sopra, con il mio ok.
- **Niente Claude come coautore**: nessuna riga `Co-Authored-By` nei commit.
- Un passo alla volta; a fine passo dimmi cosa hai fatto e cosa serve da me.
- Prima di cancellare o sovrascrivere qualcosa, guardalo e dimmelo.
- La shell è zsh: metti tra virgolette i pattern con `*` e i riferimenti come `'al-folio-final^{commit}'`.
