# Alpha House · Perdizes, SP

Site da Alpha House: https://alphastudio.alphagalerie.com

| Página | O que vende |
| --- | --- |
| `/` | Comunidade Alpha: membro fundador, Sócio do Club, marca apoiadora e apoiador master (pré-venda de fundadores) |
| `/comunidade/` | A mesma página da home, para os links já divulgados |
| `/club/` | Club Alpha, plano trimestral |
| `/esquenta/` | Lugar privativo no dia de show (até 12 pessoas) |

## Onde mexer

- **`config.js`**: preços, vagas, datas da pré-venda, meta, shows, WhatsApp, Instagram (perfil, canal da montagem), Pixel da Meta e marcas parceiras. Mudou aqui, muda no site e no Mercado Pago.
- **`img/`**: fotos. Trocar um arquivo pelo mesmo nome troca a foto no site.
- **`img/og-alpha-house.jpg`**: imagem que aparece quando alguém compartilha o link (WhatsApp, Instagram). Ao trocar, use outro nome de arquivo para o WhatsApp não mostrar a antiga do cache.
- **`img/marcas/`**: logos das marcas parceiras (PNG branco, fundo transparente).
- **`video/`**: vídeos do site (MP4 sem som, a não ser o do topo).
- **`assets/logo/`**: logo da Alpha House em SVG e PNG.

## Visual

- **`assets/casa.css`**: home e `/comunidade/`.
- **`assets/site.css` + `assets/ponte.css`**: Club e Esquenta. O `ponte.css` deixa as duas páginas com a mesma identidade da home (fontes, cores e botões).
- Paleta: violeta `#B44BFF`, rubi `#FF2E63`, ciano `#2BE4FF` e ouro `#FFE14D`/`#FFB800`, sobre o fundo `#07080D`.
- Fontes: Bricolage Grotesque (títulos e textos), IBM Plex Mono (rótulos) e Cinzel (nome no menu).

## Pagamento (Mercado Pago)

`api/checkout.js` é uma função da Vercel que cria o checkout. O preço é calculado aqui, a partir do `config.js`. Pix é cobrado por trimestre; no cartão, os planos viram assinatura que renova a cada 3 meses.

`api/meta.js` lê as vendas aprovadas no Mercado Pago e devolve só a porcentagem da meta e as vagas preenchidas (nunca valores em reais).

Variáveis de ambiente na Vercel:

- `MP_ACCESS_TOKEN`: Access Token de produção do Mercado Pago (obrigatória para cobrar e para a barra da meta).
- `SITE_URL` (opcional): endereço do site para a volta do pagamento, por exemplo `https://alphastudio.alphagalerie.com`.

Sem `MP_ACCESS_TOKEN`, o botão de pagar leva o cliente para o WhatsApp.

## Depois de 20 de novembro

A contagem regressiva some sozinha quando a pré-venda termina (`PRE_VENDA_FIM`), mas os preços não mudam sozinhos: atualize `pix`, `cartao` e `mensal` de cada oferta no `config.js`.
