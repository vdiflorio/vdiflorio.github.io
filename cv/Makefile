# Builds both CVs with LuaLaTeX and copies them where the website links them.
#   make            -> ../docs/assets/pdf/ (new site) and ../assets/pdf/ (old site, until the switch)
#   make clean      -> removes build files
OUT := ../assets/pdf
SITE := ../docs/assets/pdf
LATEX := latexmk -lualatex -interaction=nonstopmode -halt-on-error -outdir=build

all: fonts $(OUT)/CV.pdf $(OUT)/CV_industry.pdf

fonts:
	@sh get-fonts.sh >/dev/null

$(OUT)/CV.pdf: cv-academic.tex cv-style.sty
	$(LATEX) cv-academic.tex
	mkdir -p $(SITE)
	cp build/cv-academic.pdf $@
	cp build/cv-academic.pdf $(SITE)/CV.pdf

$(OUT)/CV_industry.pdf: cv-industry.tex cv-style.sty
	$(LATEX) cv-industry.tex
	mkdir -p $(SITE)
	cp build/cv-industry.pdf $@
	cp build/cv-industry.pdf $(SITE)/CV_industry.pdf

clean:
	rm -rf build

.PHONY: all fonts clean
