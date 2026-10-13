/* ============================================================
   CONFIG DO SITE — preços, shows e contatos.
   Lido pelas páginas e pela função de pagamento (api/checkout.js).
   Mude aqui e vale em todo lugar.
   ============================================================ */
(function (root) {
  var CONFIG = {
    NOME: "Alpha House",            /* nome do espaço: aparece no Mercado Pago e no WhatsApp */
    DESCRITOR: "ALPHAHOUSE",        /* nome na fatura do cartão (até 13 letras, sem acento) */
    WPP: "5511942920076",           /* WhatsApp da Alpha Galerie */
    /* Inauguração (ano-mês-dia e hora, ex: "2026-11-07T19:00"). Com a data, a faixa do topo
       mostra a contagem regressiva sem escrever a data; depois dela, a faixa some.
       Vazio = faixa de pré-venda sem contagem. */
    INAUGURACAO: "",
    ESTADIO: "Allianz Parque",      /* troque aqui quando virar Nubank Parque */

    /* Instagram (sem @). espaco: página inicial e esquenta. club: Clube Alpha. */
    INSTAGRAM: { espaco: "alphahousesp", club: "alphahousesp" },

    /* Pixel da Meta (só o número). Vazio = desligado. Com o número, mede visitas,
       cliques em pagar, contatos no WhatsApp e compras aprovadas. */
    META_PIXEL: "",

    /* Datas de show (página /esquenta).
       data: dia do show (ano-mês-dia). A data sai do site sozinha na véspera do show.
       Marque disponivel:false quando a data for vendida. */
    SHOWS: [
      { id: "mariah", data: "2026-11-17", dia: "Terça · 17/11", artista: "Mariah Carey", disponivel: true,
        horario: "14h às 18h" },
      { id: "seal", data: "2026-11-28", dia: "Sábado · 28/11", artista: "Seal", disponivel: true,
        horario: "14h às 18h" }
    ],

    /* Preços com a taxa do Mercado Pago embutida: pix (0,99%) e cartão à vista (4,98%).
       sinal: fração cobrada agora (0.5 = 50%). pagina: para onde o cliente volta. */
    OFERTAS: [
      {
        id: "show", nome: "Esquenta do show", pagina: "/esquenta/",
        uso: "Até 12 pessoas · 4 horas · das 14h às 18h",
        pix: 2200, cartao: 2315, unidade: "/ reserva", sinal: 1,   /* pago integral e antecipado, como ingresso */
        pessoas: 12,               /* usado no "por pessoa" da página */
        nota: "Pagamento antecipado e integral, como um ingresso",
        barra: "{preco} · até 12 pessoas", botao: "Reservar"   /* barra fixa no celular */
      },
      {
        id: "club", nome: "Clube Alpha", pagina: "/club/",
        uso: "Membro do Clube Alpha · plano trimestral",
        pix: 300, cartao: 316, unidade: "/ trimestre", sinal: 1,
        assinatura: { meses: 3 },  /* no cartão vira assinatura com renovação automática */
        barra: "R$ 100/mês · plano trimestral", botao: "Ser membro"
      }
    ],

    /* Patrocínio (faixa no fim das páginas). Logos brancos, fundo transparente,
       tirados do Club Parceria (Aleda, Bombaco, Squadafum) e da Nowdays.
       Para pôr outro logo, solte o PNG
       com fundo transparente em img/marcas/ e preencha "logo".
       Marca sem logo oficial não aparece. */
    MARCAS: [
      { nome: "Aleda", logo: "img/marcas/aleda.png" },
      { nome: "Bombaco", logo: "img/marcas/bombaco.png" },
      { nome: "Squadafum", logo: "img/marcas/squadafum.png" },
      { nome: "Nowdays", logo: "img/marcas/nowdays.png" }
    ]
  };

  if (typeof module !== "undefined" && module.exports) module.exports = CONFIG;
  else root.ALPHA_CONFIG = CONFIG;
})(this);
