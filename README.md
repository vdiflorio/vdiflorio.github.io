# vdiflorio.github.io

Sito personale di Vincenzo Di Florio: <https://vdiflorio.github.io>

HTML e CSS statici, senza tema e senza build. GitHub Pages pubblica la cartella `docs/` del branch `main`
così com'è.

## Struttura

| Percorso | Cosa |
| --- | --- |
| `docs/index.html` | Home: chi sono, ricerca, progetti, pubblicazioni selezionate, didattica, contatti |
| `docs/publications/index.html` | Tutti gli articoli, i talk e i poster |
| `docs/cv/index.html` | CV completo in HTML e link ai due PDF |
| `docs/404.html` | Pagina "non trovata" |
| `docs/teaching/`, `docs/teachings/*/`, `docs/repositories/`, `docs/projects/` | Reindirizzano alle sezioni della home (vecchi indirizzi) |
| `docs/assets/css/site.css`, `docs/assets/js/site.js` | L'unico foglio di stile e l'unico script (tema chiaro/scuro, entrate) |
| `docs/assets/pdf/` | `CV.pdf` e `CV_industry.pdf`, generati da `cv/` |
| `docs/sitemap.xml`, `docs/robots.txt`, `docs/google…html` | SEO e verifica di Google Search Console |
| `cv/` | Sorgenti LaTeX dei due CV (vedi `cv/README.md`) |
| `redesign/` | Piano e decisioni di design del rifacimento del 2026, prototipi di stile |

## Vedere il sito in locale

```sh
python3 -m http.server 8001 --bind 127.0.0.1 -d docs
```

Poi <http://127.0.0.1:8001/>. Quello che si vede è esattamente quello che pubblica GitHub Pages
(il server locale però non mostra la 404 personalizzata).

## Aggiornare il sito

- **Un articolo nuovo**: aggiungilo in `docs/publications/index.html`, nella sezione *Journal articles* di
  `docs/cv/index.html`, in `docs/index.html` se va tra le pubblicazioni selezionate, e nei due `.tex` del CV
  (poi `make`, sotto).
- **Talk, poster, corsi, scuole**: stessi posti, nelle sezioni corrispondenti.
- **Testi, colori, caratteri**: le decisioni e il loro perché sono in `redesign/design.md`; i colori sono le
  variabili in cima a `docs/assets/css/site.css`.
- Se cambi una pagina, aggiorna la data in `docs/sitemap.xml`.

## Aggiornare il CV

```sh
cd cv
PATH=/Library/TeX/texbin:$PATH make
```

Compila `cv-academic.tex` e `cv-industry.tex` con LuaLaTeX e copia i PDF in `docs/assets/pdf/`.
Dettagli in `cv/README.md`.

## Pubblicare

Un push su `main` basta: GitHub Pages (Settings → Pages → *Deploy from a branch* → `main` / `/docs`) pubblica
in un paio di minuti. Il sito precedente (tema al-folio) è conservato nel branch `al-folio-backup` e nel tag
`al-folio-final`.

## Licenza

Codice sotto licenza MIT (vedi `LICENSE`); i caratteri e i dati di terze parti mantengono le loro licenze.
