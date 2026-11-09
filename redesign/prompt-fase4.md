# Prompt — Fase 4: figura animata di NextGenPB (prova)

Incolla tutto il blocco sotto la riga come primo messaggio di una nuova sessione di Claude Code, aperta nella cartella
`/Users/vincenzo/Documents/Personale/vdiflorio.github.io`. È una **prova**: se il risultato non convince, si butta via
e il sito resta com'è.

---

Stiamo rifacendo il mio sito personale (vdiflorio.github.io, GitHub Pages). Sono Vincenzo Di Florio, post-doc al
laboratorio MOX del Dipartimento di Matematica del Politecnico di Milano. Rispondimi in italiano; il sito è in inglese.

Il sito nuovo è finito e verificato (fasi 0–3 e 5 chiuse) ma **non ancora pubblicato**. Adesso voglio **provare la
fase 4**: una figura animata, fatta con la skill **anatomy**, che spieghi come funziona NextGenPB, il solutore di
Poisson–Boltzmann che ho sviluppato.

## Prima di fare qualunque cosa

1. Leggi per intero `redesign/piano.md`, `redesign/design.md` e `redesign/RIPARTENZA.md`. Sono la fonte di verità:
   non ridecidere niente di quello che è già deciso lì (palette, caratteri, regole, eccezioni).
2. Controlla lo stato: `git status`, `git log --oneline -5`, branch corrente (deve essere `redesign`).
3. Leggi `docs/index.html` (sezioni Research e Projects) e `docs/assets/css/site.css` (token di colore, caratteri,
   tema scuro), per sapere dove andrà la figura e con quali colori.
4. Carica la skill **anatomy** e leggi le sue istruzioni.
5. Dimmi in poche righe cosa hai capito e proponimi **due idee di figura**, a parole, ciascuna con uno schizzo ASCII
   dell'inquadratura e l'elenco delle fasi animate. Poi **aspetta il mio ok**.

## Cosa deve raccontare la figura

La pipeline di NextGenPB, in quattro passi: **molecola → superficie molecolare → griglia octree raffinata solo vicino
alla superficie → potenziale elettrostatico sulla superficie** (rosso negativo, blu positivo, come nelle mie figure).

- Fedele al metodo, senza numeri inventati. Quello che puoi dire con sicurezza: elementi finiti, super-risoluzione
  analitica, mesh raffinata localmente (local (de)refinement) dove c'è la superficie molecolare. Se ti serve un
  dettaglio (numero di livelli di raffinamento, dimensioni, valori del potenziale), **chiedimelo**.
- Se vuoi una molecola vera, la coppia barnase–barstar (PDB 1BRS) è già nel sito: c'è lo scheletro Cα in
  `docs/assets/img/backbone-1brs.svg`, generato da `redesign/tools/backbone.py`.
- Le PGNN / i surrogati neurali **non** entrano nella figura: devono restare in secondo piano.

## Vincoli del sito (non negoziabili)

- **Stile**: segui la skill **design-taste-frontend** e le regole fisse in `design.md`. Niente etichette sopra i titoli,
  niente monospace (nemmeno nel "readout" della figura), niente 01/02/03, niente righe sottili decorative, gradienti,
  ombre a riposo, cornici con bordo. La "card" della skill anatomy va adattata: titolo in Zodiak 400 come gli altri
  `h3` del sito, testi in Hanken Grotesk, nessun riquadro con ombra.
- **Colori**: solo i token di `site.css` (`--bg`, `--surface`, `--ink`, `--muted`, `--accent`, `--line`) più il rosso e il
  blu della mappa del potenziale. La figura deve funzionare **nel tema chiaro e nello scuro** (`data-theme` e
  `prefers-color-scheme`).
- **Movimento**: solo `transform` e `opacity`; animazione ferma quando la figura non è sullo schermo; un controllo per
  mettere in pausa se dura più di 5 secondi; con `prefers-reduced-motion: reduce` una figura **ferma e completa** (tutte
  e quattro le fasi leggibili).
- **Peso**: la home oggi pesa ~146 KB in tutto; la figura (SVG + script) deve stare **sotto i 60 KB**, senza librerie
  esterne, senza WebGL (salvo mio ok esplicito), senza build: JS semplice dentro `docs/assets/js/` o SVG inline.
- **Accessibilità**: `role="img"` con descrizione testuale, oppure `<figure>` con `<figcaption>`; se è interattiva,
  usabile da tastiera con focus visibile.
- **Contenuti veri**: niente frasi inventate su risultati o prestazioni.

## Come procedere, per gradi

1. **Prototipo isolato** in `redesign/fase4/` (non in `docs/`), con i colori e i caratteri del sito. Servilo in locale
   (`python3 -m http.server 8000 --bind 127.0.0.1` dalla radice → http://127.0.0.1:8000/redesign/fase4/) e dammi
   l'indirizzo. Screenshot a 1440, 768 e 390 px, tema chiaro e scuro, e un fotogramma con il movimento ridotto.
2. **Aspetta il mio giudizio.** Se non mi convince, si ferma tutto qui e il sito resta com'è.
3. Solo con il mio ok: **integrazione nel sito**. Proposta di posizione: nella riga di NextGenPB della sezione Projects
   (oggi solo testo), così la figura di Barnase–Barstar resta nella sezione Research. Decidiamo insieme.
4. **Verifiche** sulla home integrata (anteprima: `python3 -m http.server 8001 --bind 127.0.0.1 -d docs`):
   - `node --experimental-websocket ~/.claude/skills/design-taste-frontend/scripts/inspect.mjs http://127.0.0.1:8001/ --allow few-pictures --out <scratchpad>/...`
     → 0 FAIL a 1440 / 768 / 390;
   - `node ~/.claude/skills/design-taste-frontend/scripts/lint.mjs docs` pulito;
   - peso della home ancora sotto i 300 KB;
   - `bash redesign/tools/verifica-online.sh http://127.0.0.1:8001` → 0 errori.
5. Aggiorna `redesign/piano.md` (fase 4) e `redesign/design.md` (decisione, perché, misure), poi commit locale.

## Regole

- **Mai un push.** Solo commit locali sul branch `redesign`, e solo dopo che ti ho detto che il passo va bene.
- **Niente Claude come coautore**: nessuna riga `Co-Authored-By` nei commit.
- Un passo alla volta; a fine passo dimmi cosa hai fatto e cosa serve da me.
- Prima di cancellare o sovrascrivere qualcosa, guardalo e dimmelo.
- Hook di design *impeccable*: correggi i problemi veri; un falso positivo va verificato sulla pagina renderizzata
  (`~/.claude/skills/impeccable/scripts/impeccable detect --no-config <url>`) prima di registrare un'eccezione, e me lo dici.
- Scrivi screenshot e report nella scratchpad della sessione, non nel progetto.
- La shell è zsh: metti tra virgolette i pattern con `*`.
