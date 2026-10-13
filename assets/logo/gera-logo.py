import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
F=sys.argv[1]; OUT=sys.argv[2]

def texto(fonte, s, tam, track_em, x0=0, base=0):
    """Converte texto em path SVG (contornos), com espaçamento entre letras."""
    f=TTFont(fonte); gs=f.getGlyphSet(); cmap=f.getBestCmap(); upm=f['head'].unitsPerEm
    esc=tam/upm; x=x0; pen=SVGPathPen(gs)
    for i,ch in enumerate(s):
        g=cmap[ord(ch)]
        tp=TransformPen(pen,(esc,0,0,-esc,x,base))
        gs[g].draw(tp)
        x+=gs[g].width*esc + (track_em*tam if i<len(s)-1 else 0)
    return pen.getCommands(), x-x0

def simbolo(cor, ponto, sw=6.5):
    # telhado = A, paredes + viga = H: uma casa que também se lê "AH"
    return (f'<path fill="none" stroke="{cor}" stroke-width="{sw}" stroke-linejoin="miter" stroke-miterlimit="12" '
            f'd="M22 92 V42 L50 8 L78 42 V92 M22 62 H78"/>')

NOME,wN=texto(F+'/fraunces.ttf','ALPHA HOUSE',100,0.14)
SUB,wS=texto(F+'/grotesk.ttf','PERDIZES · SÃO PAULO',30,0.34)
open(OUT+'/medidas.txt','w').write(f'{wN} {wS}')

def horizontal(cor, ponto, sub=True):
    # símbolo 100 de altura escalado p/ 150; nome à direita
    S=1.5; gap=48; xn=100*S+gap; W=xn+wN+4; H=150
    yb=96 if sub else 108
    sx=xn+(wN-wS)/2
    s=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H}" role="img" aria-label="Alpha House">'
       f'<g transform="scale({S})">{simbolo(cor,ponto)}</g>'
       f'<path fill="{cor}" transform="translate({xn} {yb})" d="{NOME}"/>')
    if sub: s+=f'<path fill="{cor}" fill-opacity=".72" transform="translate({sx:.1f} 140)" d="{SUB}"/>'
    return s+'</svg>'

def vertical(cor, ponto):
    W=max(wN,wS)+20; S=2.2; sw=100*S; H=sw+40+100+20+40
    xs=(W-sw)/2; yn=sw+40+76
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" role="img" aria-label="Alpha House">'
       f'<g transform="translate({xs:.1f} 0) scale({S})">{simbolo(cor,ponto)}</g>'
       f'<path fill="{cor}" transform="translate({(W-wN)/2:.1f} {yn})" d="{NOME}"/>'
       f'<path fill="{cor}" fill-opacity=".72" transform="translate({(W-wS)/2:.1f} {yn+56})" d="{SUB}"/></svg>')

def icone(cor, ponto, fundo=None, pad=14):
    v=100+2*pad
    bg=f'<rect width="{v}" height="{v}" fill="{fundo}"/>' if fundo else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {v} {v}" role="img" aria-label="Alpha House">'
            f'{bg.replace("<rect", f"<rect x=\"{-pad}\" y=\"{-pad}\"")}{simbolo(cor,ponto)}</svg>')

OURO='#C8A24A'; OURO2='#E7C977'; BRANCO='#EDE9DF'; PRETO='#0A0A0C'
arq={
 'alpha-house-horizontal-dourado.svg': horizontal(OURO,OURO2),
 'alpha-house-horizontal-branco.svg': horizontal(BRANCO,OURO2),
 'alpha-house-horizontal-preto.svg': horizontal(PRETO,OURO),
 'alpha-house-vertical-dourado.svg': vertical(OURO,OURO2),
 'alpha-house-vertical-branco.svg': vertical(BRANCO,OURO2),
 'alpha-house-simbolo-dourado.svg': icone(OURO,OURO2),
 'alpha-house-simbolo-branco.svg': icone(BRANCO,OURO2),
 'favicon.svg': icone(OURO2,OURO2,PRETO,pad=12),
}
for n,c in arq.items(): open(f'{OUT}/{n}','w').write(c)
print('ok', round(wN), round(wS))
