# Builds both CVs with LuaLaTeX and copies them where the website links them.
#   make            -> ../assets/pdf/CV.pdf and ../assets/pdf/CV_industry.pdf
#   make clean      -> removes build files
OUT := ../assets/pdf
LATEX := latexmk -lualatex -interaction=nonstopmode -halt-on-error -outdir=build

all: fonts $(OUT)/CV.pdf $(OUT)/CV_industry.pdf

fonts:
	@sh get-fonts.sh >/dev/null

$(OUT)/CV.pdf: cv-academic.tex cv-style.sty
	$(LATEX) cv-academic.tex
	cp build/cv-academic.pdf $@

$(OUT)/CV_industry.pdf: cv-industry.tex cv-style.sty
	$(LATEX) cv-industry.tex
	cp build/cv-industry.pdf $@

clean:
	rm -rf build

.PHONY: all fonts clean
