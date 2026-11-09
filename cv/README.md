# CV

Sorgenti LaTeX dei due curriculum, con lo stesso aspetto del sito (Zodiak + Hanken Grotesk, grigio e oxblood).

| File | Cosa | PDF prodotto |
| --- | --- | --- |
| `cv-academic.tex` | CV completo, per l'accademia (era `main.tex`) | `assets/pdf/CV.pdf` |
| `cv-industry.tex` | CV per le aziende, due pagine | `assets/pdf/CV_industry.pdf` |
| `cv-style.sty` | Stile comune: caratteri, colori, voci con data | — |
| `get-fonts.sh` | Scarica i caratteri in `cv/fonts/` (non versionata) | — |

## Compilare

```sh
cd cv
make            # scarica i caratteri se mancano, compila e copia i PDF in assets/pdf/
make clean      # cancella cv/build/
```

Serve LuaLaTeX. Su questo Mac il `lualatex` di MacPorts ha il formato rotto: usare quello di MacTeX con
`PATH=/Library/TeX/texbin:$PATH make`.

## Aggiornare

- Cambia la data in fondo alle pagine: `\renewcommand{\lastupdated}{...}` o direttamente in `cv-style.sty`.
- Una voce con data: `\entry{Titolo}{Data}{Luogo}`; un dettaglio sotto: `\detail{Etichetta}{Testo}`.
- Un DOI cliccabile: `\doi{10.xxxx/...}`.
- Quando aggiungi un articolo, aggiungilo in entrambi i file (nel CV per le aziende solo se è tra i più rilevanti)
  e nella home del sito se è tra le pubblicazioni selezionate.
