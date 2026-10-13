/* ============================================================
   CONFIG DO SITE — preços, shows e contatos.
   Este arquivo é lido pela página (index.html) e pela função
   de pagamento (api/checkout.js). Mude aqui e vale nos dois.
   ============================================================ */
(function (root) {
  var CONFIG = {
    WPP: "5511926441522",   /* WhatsApp da captação */
    PRAZO: "30/10",         /* fim da pré-venda */

    /* Marque disponivel:false quando a data for vendida.
       horario: edite quando confirmar o horário do show. */
    SHOWS: [
      { id: "mariah", dia: "Terça · 17/11", artista: "Mariah Carey", disponivel: true,
        horario: "Esquenta a partir das 14h", obs: "Esquenta antes do show ou after depois." },
      { id: "seal", dia: "Sábado · 28/11", artista: "Seal", disponivel: true,
        horario: "Horário a confirmar", obs: "Esquenta à tarde ou after à noite." }
    ],

    /* Preços com a taxa do Mercado Pago embutida: pix (0,99%) e cartão à vista (4,98%).
       sinal: fração cobrada agora no Mercado Pago (0.5 = 50%). */
    OFERTAS: [
      {
        id: "club", nome: "Social Club", feat: true, flag: "Novo",
        uso: "Happy hour, amigos e dias de jogo e show",
        pix: 300, cartao: 316, unidade: "/ trimestre", sinal: 1,
        assinatura: { meses: 3 },  /* no cartão vira assinatura com renovação automática */
        dur: "R$ 100 por mês · renova a cada 3 meses",
        inclui: [
          "Lounge com painel de LED e varanda",
          "Vista aberta em Perdizes",
          "Uso agendado, para nunca lotar",
          "Para sair, avise antes da renovação"
        ]
      },
      {
        id: "show", nome: "Reserva do show", feat: false, flag: "1 por show",
        uso: "Esquenta ou after · até 10 pessoas · 3 horas",
        pix: 2200, cartao: 2315, unidade: "/ reserva", sinal: 0.5,
        dur: "R$ 220 por pessoa · sinal de 50% garante a data",
        inclui: [
          "Espaço privativo só para o seu grupo",
          "Lounge, varanda e painel de LED",
          "Som ambiente e banheiro",
          "Reembolso integral se o show for cancelado"
        ]
      },
      {
        id: "dj", nome: "Pacote DJ 10 h", feat: false, flag: "",
        uso: "Ensaio, treino e gravação de live",
        pix: 1000, cartao: 1045, unidade: "/ 10 horas", sinal: 1,
        dur: "R$ 100 por hora · só os 10 primeiros · depois R$ 1.300",
        inclui: [
          "Blocos de no mínimo 2 horas",
          "Validade de 90 dias após a abertura",
          "Mesa, tomada e a vista. Equipamento é seu",
          "Arrependimento em 7 dias"
        ]
      }
    ]
  };

  if (typeof module !== "undefined" && module.exports) module.exports = CONFIG;
  else root.ALPHA_CONFIG = CONFIG;
})(this);
