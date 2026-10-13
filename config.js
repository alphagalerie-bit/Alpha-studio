/* ============================================================
   CONFIG DO SITE — preços, shows e contatos.
   Lido pelas páginas e pela função de pagamento (api/checkout.js).
   Mude aqui e vale em todo lugar.
   ============================================================ */
(function (root) {
  var CONFIG = {
    WPP: "5511926441522",           /* WhatsApp da captação */
    PRAZO: "30/10",                 /* fim da pré-venda */
    ESTADIO: "Allianz Parque",      /* troque aqui quando virar Nubank Parque */

    /* Datas de show (página /esquenta).
       Marque disponivel:false quando a data for vendida. */
    SHOWS: [
      { id: "mariah", dia: "Terça · 17/11", artista: "Mariah Carey", disponivel: true,
        horario: "14h às 18h" },
      { id: "seal", dia: "Sábado · 28/11", artista: "Seal", disponivel: true,
        horario: "14h às 18h" }
    ],

    /* Preços com a taxa do Mercado Pago embutida: pix (0,99%) e cartão à vista (4,98%).
       sinal: fração cobrada agora (0.5 = 50%). pagina: para onde o cliente volta. */
    OFERTAS: [
      {
        id: "show", nome: "Esquenta do show", pagina: "/esquenta/",
        uso: "Até 12 pessoas · 4 horas · das 14h às 18h",
        pix: 2200, cartao: 2315, unidade: "/ reserva", sinal: 0.5
      },
      {
        id: "club", nome: "Clube Alpha", pagina: "/club/",
        uso: "Membro do Clube Alpha · plano trimestral",
        pix: 300, cartao: 316, unidade: "/ trimestre", sinal: 1,
        assinatura: { meses: 3 }   /* no cartão vira assinatura com renovação automática */
      }
    ]
  };

  if (typeof module !== "undefined" && module.exports) module.exports = CONFIG;
  else root.ALPHA_CONFIG = CONFIG;
})(this);
