# Builds both CVs with LuaLaTeX and copies them where the website links them.
#   make            -> ../docs/assets/pdf/CV.pdf and ../docs/assets/pdf/CV_industry.pdf
#   make clean      -> removes build files
SITE := ../docs/assets/pdf
LATEX := latexmk -lualatex -interaction=nonstopmode -halt-on-error -outdir=build

all: fonts $(SITE)/CV.pdf $(SITE)/CV_industry.pdf

fonts:
	@sh get-fonts.sh >/dev/null

$(SITE)/CV.pdf: cv-academic.tex cv-style.sty
	$(LATEX) cv-academic.tex
	mkdir -p $(SITE)
	cp build/cv-academic.pdf $@

$(SITE)/CV_industry.pdf: cv-industry.tex cv-style.sty
	$(LATEX) cv-industry.tex
	mkdir -p $(SITE)
	cp build/cv-industry.pdf $@

clean:
	rm -rf build

.PHONY: all fonts clean
