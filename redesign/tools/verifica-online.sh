#!/usr/bin/env bash
# Verifica in SOLA LETTURA del sito pubblicato (o dell'anteprima locale). Non tocca git né i file.
#
#   bash redesign/tools/verifica-online.sh                         -> https://vdiflorio.github.io
#   bash redesign/tools/verifica-online.sh http://127.0.0.1:8001   -> anteprima locale
#
# In locale la 404 personalizzata e il tutorial di NextGenPB non ci sono: quei controlli si saltano.
# GitHub Pages tiene in cache le pagine per circa 10 minuti: subito dopo il cambio può servire ancora il sito vecchio.
# Esce con 0 se è tutto a posto, altrimenti con il numero di errori.

set -u
BASE="${1:-https://vdiflorio.github.io}"
BASE="${BASE%/}"
PROD="https://vdiflorio.github.io"
UA="vdiflorio-site-check"
ok=0; err=0

pass() { ok=$((ok + 1)); printf '  ok    %s\n' "$1"; }
fail() { err=$((err + 1)); printf '  ERR   %s\n' "$1"; }
status() { curl -s -o /dev/null -A "$UA" --max-time 25 -w '%{http_code}' "$1"; }
ctype() { curl -s -o /dev/null -A "$UA" --max-time 25 -w '%{content_type}' "$1"; }
body() { curl -s -A "$UA" --max-time 25 "$1"; }
expect() { # expect <codice> <percorso>
  local c; c=$(status "$BASE$2")
  if [ "$c" = "$1" ]; then pass "$c $2"; else fail "$c $2 (atteso $1)"; fi
}
local_run=0; [ "$BASE" != "$PROD" ] && local_run=1

echo "Sito: $BASE"
echo
echo "1. Pagine e file che devono rispondere 200"
for p in / /publications/ /cv/ /teaching/ /repositories/ /projects/ /404.html \
         /teachings/calculus-1/ /teachings/methods-environmental-engineering/ /teachings/physics-1/ \
         /sitemap.xml /robots.txt /google6eec2dc6df5f6150.html \
         /assets/css/site.css /assets/js/site.js /assets/img/og.jpg /assets/img/favicon.svg \
         /assets/fonts/hanken-grotesk-latin.woff2 /assets/pdf/CV.pdf /assets/pdf/CV_industry.pdf; do
  expect 200 "$p"
done

echo
echo "2. È il sito nuovo, non al-folio"
home=$(body "$BASE/")
case "$home" in *"/assets/css/site.css"*) pass "la home usa site.css" ;; *) fail "la home non usa site.css (sito vecchio ancora in cache?)" ;; esac
if printf '%s' "$home" | grep -qi 'jekyll\|al-folio\|mdbootstrap\|jquery'; then fail "la home contiene tracce di al-folio"; else pass "nessuna traccia di al-folio nella home"; fi
case "$home" in *'name="google-site-verification"'*) pass "meta di verifica Google presente" ;; *) fail "meta di verifica Google assente" ;; esac
case "$home" in *'application/ld+json'*) pass "schema.org Person presente" ;; *) fail "schema.org Person assente" ;; esac

echo
echo "3. Reindirizzamenti dei vecchi indirizzi"
for pair in "/teaching/ /#teaching" "/repositories/ /#projects" "/projects/ /#projects" \
            "/teachings/calculus-1/ /#teaching" "/teachings/methods-environmental-engineering/ /#teaching" \
            "/teachings/physics-1/ /#teaching"; do
  set -- $pair
  case "$(body "$BASE$1")" in *"url=$2"*) pass "$1 -> $2" ;; *) fail "$1 non reindirizza a $2" ;; esac
done

echo
echo "4. PDF del CV"
for p in /assets/pdf/CV.pdf /assets/pdf/CV_industry.pdf; do
  case "$(ctype "$BASE$p")" in application/pdf*) pass "$p è un PDF" ;; *) fail "$p non è servito come PDF" ;; esac
done

echo
echo "5. Canonical e Open Graph"
for p in / /publications/ /cv/; do
  b=$(body "$BASE$p")
  case "$b" in *"rel=\"canonical\" href=\"$PROD$p\""*) pass "canonical di $p" ;; *) fail "canonical di $p mancante o sbagliato" ;; esac
  case "$b" in *"og:image\" content=\"$PROD/assets/img/og.jpg\""*) pass "og:image assoluto su $p" ;; *) fail "og:image di $p mancante o relativo" ;; esac
done

echo
echo "6. Sitemap: ogni indirizzo risponde 200"
for loc in $(body "$BASE/sitemap.xml" | grep -oE '<loc>[^<]+' | sed 's/<loc>//'); do
  expect 200 "${loc#$PROD}"
done

echo
echo "7. Pagine che non esistono più (devono dare 404)"
for p in /questa-pagina-non-esiste/ /blog/ /news/ /books/ /_pages/dropdown/; do expect 404 "$p"; done
if [ $local_run = 0 ]; then
  case "$(body "$BASE/questa-pagina-non-esiste/")" in *"Page not found"*) pass "la 404 è quella personalizzata" ;; *) fail "la 404 non è quella personalizzata" ;; esac
else
  echo "  --    404 personalizzata: non verificabile in locale"
fi

echo
echo "8. Servizi esterni"
c=$(status "https://api.fontshare.com/v2/css?f[]=zodiak@400&display=swap")
[ "$c" = 200 ] && pass "CSS di Zodiak su Fontshare" || fail "CSS di Zodiak su Fontshare: $c"
if [ $local_run = 0 ]; then
  expect 200 /nextgenpb_tutorial/
else
  echo "  --    tutorial di NextGenPB: è un repository separato, solo online"
fi

echo
echo "Risultato: $ok ok, $err errori"
exit "$err"
