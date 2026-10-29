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
    PRE_VENDA_FIM: "2026-12-15T23:59:00-03:00",
    PRE_VENDA_ATE: "15 de dezembro",
    INAUGURACAO_PREVISTA: "20 de novembro",
    /* Dia da inauguração: a faixa do topo e o relógio contam até aqui. Depois dela, contam até o fim da pré-venda. */
    INAUGURACAO: "2026-11-20T00:00:00-03:00",
    ESTADIO: "Allianz Parque",      /* troque aqui quando virar Nubank Parque */

    /* Instagram (sem @). espaco: página inicial e esquenta. club: Club Alpha. idealizador: quem criou o projeto.
       canal: canal de transmissão da montagem (o que vem depois de instagram.com/). */
    INSTAGRAM: { espaco: "alphahousesp", club: "alphahousesp", idealizador: "consultorcannabicobrasil",
                 canal: "channel/qMWsnLP563LCSqzs" },

    /* Pixel da Meta (só o número). Vazio = desligado. Com o número, mede visitas,
       cliques em pagar, contatos no WhatsApp e compras aprovadas. */
    META_PIXEL: "",

    /* Meta da pré-venda (barra de progresso). O site mostra só a porcentagem, nunca valores.
       alvo: quanto a pré-venda precisa juntar (R$). desde: a partir de que dia contar as vendas.
       A contagem lê as vendas aprovadas do site no Mercado Pago (api/meta.js).
       Vendeu fora do site (Pix pelo WhatsApp)? Some em extraValor (R$) e em extraVagas
       (ex.: { membro: 2 }) para a barra e as vagas restantes ficarem certas. */
    /* Balão de conversa que aparece depois de alguns segundos na página e leva para o WhatsApp.
       Cada página escolhe o seu pelo atributo data-chat do <body>. espera: segundos até aparecer. */
    CHAT: {
      espera: 20,
      home: {
        ola: "Fala, tudo bem? 👋",
        texto: "Ficou com alguma dúvida sobre o projeto? Qual plano fica melhor para a sua realidade hoje?",
        opcoes: ["Sócio do Club", "Membro fundador", "Cotas para marcas", "Tenho uma dúvida"],
        cta: "Bora fazer isso acontecer juntos?"
      },
      marcas: {
        ola: "Fala, tudo bem? 👋",
        texto: "O que mais te interessou para a sua marca?",
        opcoes: ["Cota Bronze", "Cota Prata", "Cota Ouro", "Cota Diamante", "Tenho uma dúvida"],
        cta: "Bora mostrar a sua marca para o mundo?"
      }
    },

    META: { alvo: 25500, desde: "2026-10-01", extraValor: 0, extraVagas: {}, mostrarFundadoresDe: 3 },

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
      /* Cotas para marcas (página /marcas/). vagas = quantas cotas existem de cada uma.
         Tudo do mesmo jeito dos outros planos: mensal, cobrado por trimestre. */
      {
        id: "bronze", nome: "Cota Bronze", pagina: "/marcas/", cota: true,
        uso: "Sua marca no painel de LED de propaganda, no site e nas redes da Alpha House",
        pix: 1170, cartao: 1233, unidade: "/ trimestre", sinal: 1, vagas: 8,
        mensal: 390, assinatura: { meses: 3 },
        apos: "Obrigado por acreditar com a gente! Você já está ajudando a Alpha House a abrir as portas. Chama a gente no WhatsApp para alinhar a presença da sua marca."
      },
      {
        id: "marca", nome: "Cota Prata", pagina: "/marcas/", cota: true,
        uso: "Sua marca no painel de LED, no cenário, na Galeria Alpha e nas lives",
        pix: 2970, cartao: 3129, unidade: "/ trimestre", sinal: 1, vagas: 4,
        mensal: 990, assinatura: { meses: 3 },
        /* barra fixa do celular na /marcas/ (leva para as cotas) */
        barra: "Cotas para marcas a partir de R$ 390/mês", botao: "Ver as cotas",
        apos: "Obrigado por acreditar com a gente! Você já está ajudando a Alpha House a abrir as portas. Chama a gente no WhatsApp para alinhar a presença da sua marca."
      },
      {
        id: "master", nome: "Cota Ouro", pagina: "/marcas/", cota: true,
        uso: "Painel de LED grande com VT, entrevista na Live Alpha e exclusividade na sua categoria",
        pix: 8700, cartao: 9164, unidade: "/ trimestre", sinal: 1, vagas: 2,
        mensal: 2900, assinatura: { meses: 3 },
        apos: "Obrigado por acreditar com a gente! Você já está ajudando a Alpha House a abrir as portas. Chama a gente no WhatsApp para alinhar a presença da sua marca."
      },
      {
        id: "diamante", nome: "Cota Diamante", pagina: "/marcas/", cota: true,
        uso: "A marca que apresenta a Alpha House: o maior destaque em tudo o que acontece lá dentro",
        pix: 14700, cartao: 15486, unidade: "/ trimestre", sinal: 1, vagas: 1,
        mensal: 4900, assinatura: { meses: 3 },
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
