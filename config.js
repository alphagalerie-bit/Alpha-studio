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

    /* Instagram (sem @). espaco: página inicial e esquenta. club: Clube Alpha. idealizador: quem criou o projeto. */
    INSTAGRAM: { espaco: "alphahousesp", club: "alphahousesp", idealizador: "consultorcannabicobrasil" },

    /* Pixel da Meta (só o número). Vazio = desligado. Com o número, mede visitas,
       cliques em pagar, contatos no WhatsApp e compras aprovadas. */
    META_PIXEL: "",

    /* Meta da pré-venda (barra de progresso). O site mostra só a porcentagem, nunca valores.
       alvo: quanto a pré-venda precisa juntar (R$). desde: a partir de que dia contar as vendas.
       A contagem lê as vendas aprovadas do site no Mercado Pago (api/meta.js).
       Vendeu fora do site (Pix pelo WhatsApp)? Some em extraValor (R$) e em extraVagas
       (ex.: { membro: 2 }) para a barra e as vagas restantes ficarem certas. */
    META: { alvo: 20000, desde: "2026-10-01", extraValor: 0, extraVagas: {} },

    /* Datas de show (página /esquenta).
       data: dia do show (ano-mês-dia). A data sai do site sozinha na véspera do show.
       horario: opcional; vazio = horário combinado com o cliente.
       Marque disponivel:false quando a data for vendida. */
    SHOWS: [
      { id: "mariah", data: "2026-11-17", dia: "Terça · 17/11", artista: "Mariah Carey", disponivel: true,
        horario: "" },
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
        id: "club", nome: "Clube Alpha", pagina: "/club/",
        uso: "Membro do Clube Alpha · plano trimestral",
        pix: 300, cartao: 316, unidade: "/ trimestre", sinal: 1,
        assinatura: { meses: 3 },  /* no cartão vira assinatura com renovação automática */
        barra: "R$ 100/mês · plano trimestral", botao: "Ser membro"
      },
      /* Comunidade Alpha House (página /comunidade): quem entra conta a sua história na Live Alpha,
         expõe o trabalho e faz parte dos encontros. vagas: aparece no card. */
      {
        id: "membro", nome: "Membro fundador da comunidade", pagina: "/comunidade/",
        uso: "Adesão única de membro fundador da comunidade Alpha House",
        pix: 250, cartao: 263, unidade: "/ adesão", sinal: 1, vagas: 30,
        nota: "Adesão única · se a Alpha House não inaugurar, devolvemos 100%",
        apos: "Bem-vindo à comunidade! Chama a gente no WhatsApp para a gente te receber.",
        barra: "Membro fundador · {preco}", botao: "Quero fazer parte"
      },
      {
        id: "marca", nome: "Marca apoiadora", pagina: "/comunidade/",
        uso: "Sua marca perto de quem cria, presente nos encontros e na Live Alpha",
        pix: 990, cartao: 1042, unidade: "/ adesão", sinal: 1, vagas: 5,
        nota: "Adesão única · se a Alpha House não inaugurar, devolvemos 100%",
        apos: "Bem-vindo à comunidade! Chama a gente no WhatsApp para alinhar a presença da sua marca."
      },
      {
        id: "master", nome: "Apoiador master", pagina: "/comunidade/",
        uso: "A marca que apresenta a Live Alpha, com exclusividade na sua categoria",
        pix: 2900, cartao: 3052, unidade: "/ adesão", sinal: 1, vagas: 2,
        nota: "Exclusividade na sua categoria · 100% de volta se a Alpha House não inaugurar",
        apos: "Bem-vindo à comunidade! Chama a gente no WhatsApp para alinhar a presença da sua marca."
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
