#!/bin/sh
# Downloads the website's typefaces into cv/fonts/ so LuaLaTeX can embed them in the PDFs.
#   Hanken Grotesk: SIL Open Font License (Google Fonts)
#   Zodiak: ITF Free Font License (Fontshare)
# The folder is git-ignored: the font files are not redistributed through the repository.
set -eu
cd "$(dirname "$0")"
mkdir -p fonts
get() { [ -s "fonts/$1" ] || curl -fsSL "$2" -o "fonts/$1"; }
G=https://fonts.gstatic.com/s/hankengrotesk/v12
get HankenGrotesk-Regular.ttf    "$G/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_Ncs2Zq5vBJ.ttf"
get HankenGrotesk-Medium.ttf     "$G/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcgWZq5vBJ.ttf"
get HankenGrotesk-SemiBold.ttf   "$G/ieVq2YZDLWuGJpnzaiwFXS9tYvBRzyFLlZg_f_NcbWFq5vBJ.ttf"
get HankenGrotesk-Italic.ttf     "$G/ieVo2YZDLWuGJpnzaiwFXS9tYtpY_d6T_POl0fRJeyWyosBO5Xk.ttf"
get HankenGrotesk-SemiBoldItalic.ttf "$G/ieVo2YZDLWuGJpnzaiwFXS9tYtpY_d6T_POl0fRJeyVspcBO5Xk.ttf"
F=https://cdn.fontshare.com/wf
get Zodiak-Regular.ttf "$F/ECUEQQ5BLZLFJS3PPLWOEEVS7SQONQMH/WNTXEMDDVWUVWDURRKDXCJC6G7TMP277/TBWKTFSYABV4KN4GNIJMAOQUOTYBUWB3.ttf"
get Zodiak-Bold.ttf    "$F/63K42MQSJZ57SBX4XJ4J7L4M5IM6V2HQ/DTT4Y5AJV6DYRVZQST5O4K2E6SESQNV3/VGG36BIEB6ODAX4ZN7UV43FK742PFGDV.ttf"
echo "fonts ready in cv/fonts/"
