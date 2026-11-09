# Prompt — Controllo finale con impeccable: caratteri e tic da IA

Incolla tutto il blocco sotto la riga come primo messaggio di una nuova sessione di Claude Code, aperta nella cartella
`/Users/vincenzo/Documents/Personale/vdiflorio.github.io`. Da fare dopo l'eventuale fase 4 e prima della fase 6.

---

Stiamo rifacendo il mio sito personale (vdiflorio.github.io, GitHub Pages). Sono Vincenzo Di Florio, post-doc al
laboratorio MOX del Dipartimento di Matematica del Politecnico di Milano. Rispondimi in italiano; il sito è in inglese.

Il sito nuovo è in `docs/`, finito e verificato, ma **non ancora pubblicato**. Prima di pubblicarlo voglio un
**controllo finale con la skill impeccable**, concentrato su due cose:

1. **problemi dei caratteri** (Zodiak per i titoli, dal CDN di Fontshare; Hanken Grotesk per il testo, ospitato nel sito);
2. **tic da IA**, nei testi e nel design: tutto ciò che fa sembrare il sito scritto o impaginato da un modello.

## Prima di fare qualunque cosa

1. Leggi per intero `redesign/piano.md`, `redesign/design.md` e `redesign/RIPARTENZA.md`. Sono la fonte di verità.
2. Controlla lo stato: `git status`, `git log --oneline -5`, branch corrente (deve essere `redesign`).
3. Avvia l'anteprima in background: `python3 -m http.server 8001 --bind 127.0.0.1 -d docs` → http://127.0.0.1:8001/
4. Carica la skill **impeccable** e leggi i riferimenti di `critique`, `audit`, `typeset` e `clarify`.
5. Fai il controllo (sotto) **senza modificare niente**, poi dammi il rapporto e **aspetta il mio ok**.

## Cosa controllare

Pagine: `/`, `/publications/`, `/cv/`, `/404.html`, a 1440, 768 e 390 px, tema chiaro e scuro
(il tema scuro si forza con `prefers-color-scheme: dark` o con il pulsante "Dark").

### Caratteri

- **Grassetti e corsivi finti**: Zodiak è caricato solo nel peso 400 e senza corsivo; Hanken Grotesk ha il tondo
  variabile 400–600 e il corsivo solo 400. Cerca ogni elemento il cui peso o stile calcolato non esiste nei file caricati
  (per esempio un `<em>` dentro un titolo in Zodiak, o un corsivo dentro un testo a 600) e valuta `font-synthesis`.
- **Copertura dei glifi**: il file di Hanken è un sottoinsieme latino. Verifica che tutti i caratteri usati nelle pagine
  ci siano davvero (– — ’ “ ” · à è é ì ò ù ü ñ, apici e pedici di pK<sub>a</sub>, ×, ±), per esempio leggendo la cmap del
  woff2 con fontTools, oppure confrontando nel browser la larghezza di ogni carattere con quella del fallback.
- **Caricamento**: lo scambio da Georgia a Zodiak (`font-display: swap`) sposta il layout? Misura il CLS
  (`PerformanceObserver` sui `layout-shift`) con la rete rallentata. Se serve, proponi metriche di fallback
  (`size-adjust`, `ascent-override`) invece di nascondere il testo.
- **Zodiak resta sul CDN di Fontshare**: è una decisione presa (vedi design.md, licenza ITF FFL 2.0). **Non copiare i
  file di Zodiak nel repository** e non fare subset o conversioni: la licenza lo vieta.
- **Tipografia**: titoli a capo male (parole orfane, righe sbilanciate: valuta `text-wrap: balance` per i titoli e
  `pretty` per i paragrafi), trattini (– negli intervalli di date, non -), apostrofi e virgolette tipografiche, spazi
  insecabili dove servono (`Ph.D.`, `110/110 cum laude`), cifre tabellari nelle date, interlinea, misura delle righe.

### Tic da IA

- **Nei testi** (inglese): parole e formule tipiche ("delve", "leverage", "seamless", "cutting-edge", "passionate",
  "driven by", "real, messy problems", "from the ground up", "not just X but Y"), elenchi a tre per ritmo, trattini lunghi
  a raffica, aggettivi vuoti, frasi che suonano bene ma non dicono niente, maiuscole Title Case incoerenti.
- **Distingui la mia voce da quella scritta durante il rifacimento**: i testi originali del sito vecchio sono nel branch
  `al-folio-backup` (per esempio `git show al-folio-backup:_pages/about.md`). Se un tic sta in un testo che ho scritto io,
  segnalalo comunque, ma dimmelo.
- **Nel design**: ogni blocco che entra con lo stesso fade-up, sezioni tutte con lo stesso ritmo e la stessa griglia,
  simmetrie troppo regolari, pulsanti e link d'azione generici ("Email me"), righe di credito nel footer che non servono
  (per esempio "Figure: own work…" sulle pagine che non hanno figure), qualunque cosa sembri un modello di sito.
- Ripeti il controllo dei testi anche su `cv/cv-academic.tex` e `cv/cv-industry.tex`, solo come proposte.

### Cose volute: non segnalarle come errori

Poche immagini (`--allow few-pictures`), il motivo dello scheletro proteico 1BRS sullo sfondo, la citazione di Winston
Wolf come didascalia della foto, la palette grigio e oxblood, Zodiak solo 400, l'assenza di video, la 404 essenziale
(`still-page`), l'ordine non cronologico delle pubblicazioni selezionate (NextGenPB, trasporto fuori equilibrio,
catene di oscillatori).

## Il rapporto

Una tabella ordinata per gravità: pagina, elemento (file:riga), problema, misura o prova, correzione proposta.
Separa in due gruppi:

- **correzioni tecniche** (caratteri, tipografia, CSS): le applichi tu dopo il mio ok, una per volta, ciascuna
  verificata;
- **modifiche ai testi**: sono la mia voce, quindi solo proposte, con il testo attuale e quello nuovo affiancati. Le
  applichi solo quelle che approvo. Niente informazioni inventate.

## Dopo il mio ok

1. Applica le correzioni approvate per gradi.
2. Verifica: `inspect.mjs` 0 FAIL (`node --experimental-websocket ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs <url> --allow few-pictures --out <scratchpad>/...`,
   per la 404 anche `still-page`); `node ~/.claude/skills/design-taste-frontend/scripts/lint.mjs docs` pulito;
   `~/.claude/skills/impeccable/scripts/impeccable detect --no-config <url>` su ogni pagina;
   `bash redesign/tools/verifica-online.sh http://127.0.0.1:8001` → 0 errori.
3. Se cambi un testo che compare anche nei CV, aggiorna i `.tex` e ricompila: `cd cv && PATH=/Library/TeX/texbin:$PATH make`.
4. Aggiorna `redesign/design.md` (una sezione "Controllo finale" con cosa hai trovato e cosa hai cambiato) e
   `redesign/piano.md`; commit locale.

## Regole

- **Mai un push.** Solo commit locali sul branch `redesign`.
- **Niente Claude come coautore**: nessuna riga `Co-Authored-By` nei commit.
- Un passo alla volta; prima di cancellare o sovrascrivere qualcosa, guardalo e dimmelo.
- Un falso positivo di impeccable va verificato sulla pagina renderizzata prima di registrare un'eccezione
  (`impeccable ignores`), e me lo dici.
- Screenshot e report nella scratchpad della sessione, non nel progetto. La shell è zsh: virgolette sui pattern con `*`.
