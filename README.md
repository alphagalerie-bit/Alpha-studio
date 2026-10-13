# Alpha House · Perdizes, SP

Site da Alpha House: https://alphahousesp.alphagalerie.com

| Página | O que vende |
| --- | --- |
| `/` | Entrada: esquenta, Clube Alpha, DJs e orçamento de eventos |
| `/esquenta/` | Lugar privativo no dia de show (até 12 pessoas, 14h às 18h) |
| `/club/` | Clube Alpha, plano trimestral |
| `/dj/` | Pacote de 10 horas de estúdio com telão de LED |

## Onde mexer

- **`config.js`**: preços, datas de show, horários, WhatsApp, Instagram, Pixel da Meta e marcas do patrocínio. Mudou aqui, muda no site e no Mercado Pago.
- **`img/`**: fotos. Trocar um arquivo pelo mesmo nome troca a foto no site.
- **`img/marcas/`**: logos do patrocínio (PNG branco, fundo transparente).
- **`assets/logo/`**: logo da Alpha House em SVG e PNG.

## Pagamento (Mercado Pago)

`api/checkout.js` é uma função da Vercel que cria o checkout. O preço é calculado aqui, a partir do `config.js`.

Variáveis de ambiente na Vercel:

- `MP_ACCESS_TOKEN`: Access Token de produção do Mercado Pago (obrigatória para cobrar).
- `SITE_URL` (opcional): endereço do site para a volta do pagamento, por exemplo `https://alphahousesp.alphagalerie.com`.

Sem `MP_ACCESS_TOKEN`, o botão de pagar leva o cliente para o WhatsApp.
