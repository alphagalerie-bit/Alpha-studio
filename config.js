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
    /* Fim da pré-venda de fundadores (ano-mês-dia, hora e fuso). Liga a contagem regressiva
       da faixa do topo e dos relógios grandes; depois dessa hora, os dois somem sozinhos.
       Vazio = sem contagem. PRE_VENDA_ATE e INAUGURACAO_PREVISTA são os textos do site. */
    PRE_VENDA_FIM: "2026-11-20T23:59:00-03:00",
    PRE_VENDA_ATE: "20 de novembro",
    INAUGURACAO_PREVISTA: "novembro",
    ESTADIO: "Allianz Parque",      /* troque aqui quando virar Nubank Parque */

    /* Instagram (sem @). espaco: página inicial e esquenta. club: Club Alpha. idealizador: quem criou o projeto. */
    INSTAGRAM: { espaco: "alphahousesp", club: "alphahousesp", idealizador: "consultorcannabicobrasil" },

    /* Pixel da Meta (só o número). Vazio = desligado. Com o número, mede visitas,
       cliques em pagar, contatos no WhatsApp e compras aprovadas. */
    META_PIXEL: "",

    /* Meta da pré-venda (barra de progresso). O site mostra só a porcentagem, nunca valores.
       alvo: quanto a pré-venda precisa juntar (R$). desde: a partir de que dia contar as vendas.
       A contagem lê as vendas aprovadas do site no Mercado Pago (api/meta.js).
       Vendeu fora do site (Pix pelo WhatsApp)? Some em extraValor (R$) e em extraVagas
       (ex.: { membro: 2 }) para a barra e as vagas restantes ficarem certas. */
    META: { alvo: 22800, desde: "2026-10-01", extraValor: 0, extraVagas: {}, mostrarFundadoresDe: 3 },

    /* Datas de show (página /esquenta).
       data: dia do show (ano-mês-dia). A data sai do site sozinha na véspera do show.
       horario: opcional; vazio = horário combinado com o cliente.
       Marque disponivel:false quando a data for vendida. */
    SHOWS: [
      { id: "seal", data: "2026-11-28", dia: "Sábado · 28/11", artista: "Seal", disponivel: true,
        horario: "" }
    ],

    /* Preços com a taxa do Mercado Pago embutida: pix (0,99%) e cartão à vista (4,98%).
       sinal: fração cobrada agora (0.5 = 50%). pagina: para onde o cliente volta. */
    OFERTAS: [
      {
        id: "show", nome: "Esquenta do show", pagina: "/esquenta/",
        uso: "Até 12 pessoas · lugar privativo antes do show",
        pix: 2200, cartao: 2315, unidade: "/ reserva", sinal: 1,   /* pago integral e antecipado, como ingresso */
        pessoas: 12,               /* usado no "por pessoa" da página */
        nota: "Pagamento antecipado e integral, como um ingresso",
        barra: "{preco} · até 12 pessoas", botao: "Reservar"   /* barra fixa no celular */
      },
      {
        id: "club", nome: "Club Alpha", pagina: "/club/",
        uso: "Membro do Club Alpha · plano trimestral",
        pix: 300, cartao: 316, unidade: "/ trimestre", sinal: 1, vagas: 40,  /* sócios fundadores */
        mensal: 100,               /* o site mostra o valor por mês; cobra pix/cartao a cada trimestre */
        assinatura: { meses: 3 },  /* no cartão vira assinatura com renovação automática */
        barra: "R$ 100/mês · plano trimestral", botao: "Ser membro"
      },
      /* Comunidade Alpha House (página /comunidade): quem entra conta a sua história na Live Alpha,
         expõe o trabalho e faz parte dos encontros. vagas: aparece no card.
         Todos os planos são mensais, cobrados por trimestre (pix/cartao = 3 meses), com
         renovação automática no cartão, como o Club. */
      {
        id: "membro", nome: "Membro fundador da comunidade", pagina: "/comunidade/",
        uso: "Membro fundador da comunidade Alpha House · plano trimestral",
        pix: 750, cartao: 790, unidade: "/ trimestre", sinal: 1, vagas: 50,
        mensal: 250, assinatura: { meses: 3 },
        apos: "Obrigado por acreditar com a gente! Você já está ajudando a Alpha House a abrir as portas. Chama no WhatsApp para a gente te receber.",
        barra: "Membro fundador · R$ 250/mês", botao: "Quero fazer parte"
      },
      {
        id: "marca", nome: "Marca apoiadora", pagina: "/comunidade/",
        uso: "Sua marca perto de quem cria, presente nos encontros e na Live Alpha",
        pix: 2970, cartao: 3129, unidade: "/ trimestre", sinal: 1, vagas: 10,
        mensal: 990, assinatura: { meses: 3 },
        apos: "Obrigado por acreditar com a gente! Você já está ajudando a Alpha House a abrir as portas. Chama a gente no WhatsApp para alinhar a presença da sua marca."
      },
      {
        id: "master", nome: "Apoiador master", pagina: "/comunidade/",
        uso: "A marca que apresenta a Live Alpha, com exclusividade na sua categoria",
        pix: 8700, cartao: 9164, unidade: "/ trimestre", sinal: 1, vagas: 2,
        mensal: 2900, assinatura: { meses: 3 },
        apos: "Obrigado por acreditar com a gente! Você já está ajudando a Alpha House a abrir as portas. Chama a gente no WhatsApp para alinhar a presença da sua marca."
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
