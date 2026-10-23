/* Comportamento comum às páginas: preços, modal de reserva, Mercado Pago,
   WhatsApp, FAQ e animações. A página diz qual oferta vende em <body data-oferta="...">. */
(function () {
  var CFG = window.ALPHA_CONFIG;
  var ROOT = new URL("..", document.currentScript.src).href;  /* raiz do site, de qualquer página */
  var WPP = CFG.WPP;
  /* Datas no formato ano-mês-dia, pelo relógio de quem visita */
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var agora = new Date();
  var HOJE = agora.getFullYear() + "-" + pad(agora.getMonth() + 1) + "-" + pad(agora.getDate());
  function diasAte(iso) {
    var p = iso.split("-"), alvo = new Date(+p[0], +p[1] - 1, +p[2]);
    var base = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    return Math.round((alvo - base) / 864e5);
  }
  /* Shows saem do site na véspera (não dá para preparar o espaço no mesmo dia) */
  var SHOWS = (CFG.SHOWS || []).filter(function (s) { return !s.data || s.data > HOJE; });
  function acha(id) { return CFG.OFERTAS.find(function (o) { return o.id === id; }); }
  /* Página com várias ofertas: o botão diz qual abre (<button data-reserve data-oferta-id="marca">) */
  var OFERTA = acha(document.body.getAttribute("data-oferta")), OFERTA_PADRAO = OFERTA;
  var BRL = function (n) { return "R$ " + n.toLocaleString("pt-BR"); };
  var PAY_NOME = { pix: "Pix", cartao: "Cartão à vista" };
  var $ = function (id) { return document.getElementById(id); };

  var state = { show: null, pay: "pix" };

  /* Textos vindos do config: <span data-cfg="ESTADIO"></span> */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    el.textContent = CFG[el.getAttribute("data-cfg")];
  });

  /* Vagas da oferta: <span data-vagas-de="membro"></span>. Começa com o total do config
     e, quando a meta responde, mostra quantas restam. */
  function pintaVagas(vendidas) {
    document.querySelectorAll("[data-vagas-de]").forEach(function (el) {
      var o = acha(el.getAttribute("data-vagas-de"));
      if (!o || !o.vagas) { el.remove(); return; }
      var resta = Math.max(0, o.vagas - ((vendidas && vendidas[o.id]) || 0));
      el.textContent = resta === 0 ? "Vagas esgotadas"
        : resta === o.vagas ? o.vagas + " vagas de fundador"
        : (resta === 1 ? "Resta 1 vaga" : "Restam " + resta + " vagas") + " de " + o.vagas;
      var card = el.closest(".pac"), btn = card && card.querySelector("[data-reserve]");
      if (btn && resta === 0) { btn.disabled = true; btn.textContent = "Esgotado"; }
    });
  }
  pintaVagas(null);

  /* Meta da pré-venda: <div data-meta></div> vira a barra de progresso (só porcentagem) */
  var metaEls = document.querySelectorAll("[data-meta]");
  if (metaEls.length || document.querySelector("[data-vagas-de]")) {
    fetch(ROOT + "api/meta").then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      if (!d) return;
      pintaVagas(d.vendidas);
      var pct = Math.max(0, Math.min(200, d.pct | 0));
      /* Quantos fundadores já entraram (todas as ofertas menos o esquenta), a partir de um mínimo */
      var dentro = Object.keys(d.vendidas || {}).reduce(function (t, k) { return k === "show" ? t : t + (d.vendidas[k] | 0); }, 0);
      var minimo = (CFG.META && CFG.META.mostrarFundadoresDe) || 3;
      /* Até 100%: abrir a Alpha House. De 100% a 200%: meta dobrada, aberta até as 6h */
      var dobrada = pct >= 100, barra = dobrada ? pct - 100 : pct;
      /* Prova social no topo: "N fundadores já entraram" */
      document.querySelectorAll("[data-dentro-hero]").forEach(function (el) {
        if (dentro >= minimo) { el.textContent = dentro + " fundadores já entraram"; el.hidden = false; }
      });
      metaEls.forEach(function (el) {
        el.innerHTML =
          '<div class="meta-top"><span>' + (dobrada ? "Meta dobrada: aberta até as 6h" : "Meta para abrir a Alpha House") + '</span><b' +
          (barra ? '>' + barra + "%" : (dobrada ? '>0%' : ' class="txt">Começando agora')) + '</b></div>' +
          (dentro >= minimo ? '<p class="meta-dentro"><b>' + dentro + ' fundadores</b> já fazem parte</p>' : '') +
          '<div class="meta-barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + barra + '"><i style="width:' + Math.max(barra, 2) + '%"></i></div>' +
          '<p class="meta-txt">' + (pct >= 200 ? "Meta dobrada! A Alpha House vai funcionar até as 6h da manhã."
            : dobrada ? "A Alpha House vai abrir. Se a meta dobrar, ela fica aberta até as 6h da manhã."
            : pct ? "Quanto mais gente entra, mais perto a Alpha House fica de abrir. E se a meta dobrar, ela fica aberta até as 6h."
            : "Os primeiros fundadores estão entrando agora. Seja um deles.") + '</p>';
        el.hidden = false;
      });
    }).catch(function () {});
  }

  /* Contagem para o fim da pré-venda: na faixa do topo (<span data-contagem>) e nos relógios
     grandes (<div data-relogio>). Depois da hora marcada, a faixa e os relógios somem. */
  var FIM = CFG.PRE_VENDA_FIM ? new Date(CFG.PRE_VENDA_FIM) : null;
  if (FIM && !isNaN(FIM)) {
    var relogios = document.querySelectorAll("[data-relogio]");
    var conta = function () {
      var ms = FIM - new Date();
      if (ms <= 0) {
        document.querySelectorAll("[data-prazo],[data-relogio]").forEach(function (el) { el.style.display = "none"; });
        return;
      }
      var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
      document.querySelectorAll("[data-contagem]").forEach(function (el) {
        el.innerHTML = ' · termina em <b>' + d + 'd ' + pad(h) + 'h ' + pad(m) + 'min</b>';
      });
      relogios.forEach(function (el) {
        el.innerHTML = '<p class="relogio-tit">A pré-venda de fundadores termina em</p><div class="relogio-num">' +
          [[d, d === 1 ? "dia" : "dias"], [pad(h), "horas"], [pad(m), "min"], [pad(s), "seg"]].map(function (x) {
            return '<span><b>' + x[0] + '</b>' + x[1] + '</span>';
          }).join("") + '</div><p class="relogio-sub">Até ' + (CFG.PRE_VENDA_ATE || "o fim da pré-venda") +
          ' ou enquanto houver vagas. Depois da pré-venda, os preços sobem.</p>';
        el.hidden = false;
      });
    };
    conta(); setInterval(conta, relogios.length ? 1000 : 30000);
  }

  /* Botões que só levam ao Instagram: <a data-ig-link="espaco"> (mantém o texto do botão) */
  document.querySelectorAll("[data-ig-link]").forEach(function (a) {
    var h = CFG.INSTAGRAM && CFG.INSTAGRAM[a.getAttribute("data-ig-link")];
    if (h) { a.href = "https://www.instagram.com/" + h + "/"; a.target = "_blank"; a.rel = "noopener"; }
  });

  /* Links de Instagram: <a data-ig="espaco|club"> */
  document.querySelectorAll("[data-ig]").forEach(function (a) {
    var h = CFG.INSTAGRAM && CFG.INSTAGRAM[a.getAttribute("data-ig")];
    if (!h) return;
    a.href = "https://www.instagram.com/" + h + "/";
    a.textContent = "@" + h;
  });

  /* ====== PIXEL DA META (liga só com CFG.META_PIXEL) ====== */
  function track(evento, dados) { if (window.fbq) window.fbq("track", evento, dados || {}); }
  if (CFG.META_PIXEL) {
    /* código oficial do Pixel, carregado só quando há um número no config */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", CFG.META_PIXEL);
    track("PageView");
    if (OFERTA) track("ViewContent", { content_name: OFERTA.nome, value: OFERTA.pix, currency: "BRL" });
  }

  /* ====== WHATSAPP: botão flutuante e links prontos ====== */
  function linkWpp(msg) { return "https://wa.me/" + WPP + "?text=" + encodeURIComponent(msg); }
  /* <a data-wpp="mensagem"> vira link de WhatsApp com a mensagem pronta */
  document.querySelectorAll("[data-wpp]").forEach(function (a) {
    a.href = linkWpp(a.getAttribute("data-wpp"));
    a.target = "_blank"; a.rel = "noopener";
  });
  (function () {
    var a = document.createElement("a");
    a.className = "wa-float";
    a.href = linkWpp("Olá! Vim pelo site da " + CFG.NOME + (OFERTA ? " e quero saber mais sobre " + OFERTA.nome : " e quero saber mais") + ".");
    a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", "Falar no WhatsApp");
    a.innerHTML = '<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-1.9-.9-3.1-1.7-4.4-3.8-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.3 5.3 4.6 2 .8 2.7.9 3.7.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.7-.5z"/></svg>';
    document.body.appendChild(a);
  })();
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="https://wa.me/"]');
    if (a) track("Contact");
  });

  function preco() { return OFERTA ? OFERTA[state.pay] : 0; }
  function sinal() { return Math.round(preco() * (OFERTA.sinal || 1)); }

  /* ====== SHOWS ====== */
  var grid = $("showGrid"), optShows = $("optShows");
  if (grid && !SHOWS.length) {
    grid.innerHTML = '<div class="show"><span class="date">Novas datas</span><h3>Em breve</h3>' +
      '<p class="meta">Os próximos shows abrem aqui primeiro. Peça para ser avisado logo abaixo.</p></div>';
  }
  if (grid || optShows) SHOWS.forEach(function (s) {
    if (grid) {
      var c = document.createElement("div");
      var faltam = s.data ? diasAte(s.data) : null;
      c.className = "show reveal" + (s.disponivel ? "" : " out");
      c.innerHTML =
        '<span class="date">' + s.dia + '</span>' +
        (faltam && s.disponivel ? '<span class="falta">' + (faltam === 1 ? "É amanhã" : "Faltam " + faltam + " dias") + '</span>' : '') +
        '<h3>' + s.artista + '</h3>' +
        '<p class="meta"><b style="color:var(--ink);font-weight:500">' + (s.horario ? "Esquenta das " + s.horario : "Esquenta antes do show") + '</b></p>' +
        '<span class="status">' + (s.disponivel ? "Disponível · 1 reserva" : "Reservado") + '</span>' +
        '<button class="btn ' + (s.disponivel ? 'btn-gold' : 'btn-ghost') + '" data-reserve data-show="' + s.id + '"' + (s.disponivel ? '' : ' disabled') + '>' +
        (s.disponivel ? 'Reservar esta data' : 'Data reservada') + '</button>';
      grid.appendChild(c);
    }
    if (optShows) {
      var o = document.createElement("label");
      o.className = "opt" + (s.disponivel ? "" : " off");
      o.setAttribute("data-show-opt", s.id);
      o.innerHTML = '<span class="o-name">' + s.artista + '<span>' + s.dia + (s.horario ? ' · ' + s.horario : '') + '</span></span>' +
        '<span class="o-price" style="font-size:14px;font-family:inherit;color:var(--muted)">' + (s.disponivel ? '' : 'Reservado') + '</span>' +
        '<input type="radio" name="show" value="' + s.id + '"' + (s.disponivel ? '' : ' disabled') + '>';
      optShows.appendChild(o);
    }
  });

  /* ====== PAGAMENTO (pix / cartão) ====== */
  var optPay = $("optPay");
  if (optPay) ["pix", "cartao"].forEach(function (k) {
    var o = document.createElement("label");
    o.className = "opt"; o.setAttribute("data-pay-opt", k);
    o.innerHTML = '<span class="o-name">' + PAY_NOME[k] + '</span><input type="radio" name="pay" value="' + k + '">';
    optPay.appendChild(o);
  });

  function markSel(attr, val) {
    document.querySelectorAll("[" + attr + "]").forEach(function (o) {
      var on = o.getAttribute(attr) === val;
      o.classList.toggle("sel", on);
      var r = o.querySelector("input"); if (r) r.checked = on;
    });
  }

  function refresh() {
    document.querySelectorAll("[data-preco-de]").forEach(function (el) {
      var o = acha(el.getAttribute("data-preco-de")); if (o) el.textContent = BRL(o[state.pay]);
    });
    if (!OFERTA) return;
    if ($("modalNome")) $("modalNome").textContent = OFERTA.nome.replace(/^.* · /, "");
    if ($("modalUso")) $("modalUso").textContent = OFERTA.uso;
    document.querySelectorAll("[data-price]").forEach(function (el) { el.textContent = BRL(preco()); });
    document.querySelectorAll("[data-sinal]").forEach(function (el) { el.textContent = BRL(sinal()); });
    if (OFERTA.pessoas) document.querySelectorAll("[data-pessoa]").forEach(function (el) {
      el.textContent = BRL(Math.ceil(preco() / OFERTA.pessoas));
    });
    document.querySelectorAll("[data-pay]").forEach(function (b) {
      var on = b.getAttribute("data-pay") === state.pay;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    markSel("data-show-opt", state.show);
    markSel("data-pay-opt", state.pay);
    if ($("total")) $("total").textContent = BRL(preco());
    if ($("totalLbl")) $("totalLbl").textContent = OFERTA.assinatura ? "Trimestre" : "Adesão";
    if ($("subTotal")) {
      var sub = "";
      if (OFERTA.sinal < 1) sub = "Agora no Mercado Pago: " + BRL(sinal()) + " · saldo até 7 dias antes";
      else if (OFERTA.assinatura) sub = BRL(OFERTA.mensal || Math.round(OFERTA.pix / OFERTA.assinatura.meses)) + " por mês · " +
        (state.pay === "cartao" ? "renova sozinho a cada 3 meses" : "renovação pelo Pix a cada 3 meses");
      else sub = OFERTA.nota || "";
      $("subTotal").textContent = sub;
    }
    var ctaTxt = document.querySelector(".cta-bar .cta-txt");
    if (ctaTxt) {  /* a barra mostra sempre a oferta principal da página; o primeiro R$ fica em destaque */
      ctaTxt.textContent = OFERTA_PADRAO.barra.replace("{preco}", BRL(OFERTA_PADRAO[state.pay]));
      ctaTxt.innerHTML = ctaTxt.innerHTML.replace(/(R\$\s?[\d.]+(,\d+)?)/, "<b>$1</b>");
    }
    /* E-mail só quando o Mercado Pago exige: assinatura no cartão */
    if ($("fEmail")) $("fEmail").closest(".field").hidden = !(OFERTA.assinatura && state.pay === "cartao");
    if ($("fEmailLbl")) $("fEmailLbl").textContent = "Seu e-mail (o Mercado Pago pede para a assinatura)";
  }

  /* ====== MODAL ====== */
  var modal = $("modal"), lastFocus = null;
  function firstShow() { var s = SHOWS.find(function (x) { return x.disponivel; }); return s ? s.id : null; }
  function openModal(showId, ofertaId) {
    if (!modal) return;
    lastFocus = document.activeElement;
    OFERTA = (ofertaId && acha(ofertaId)) || OFERTA_PADRAO;
    if (showId) state.show = showId;
    if (!state.show) state.show = firstShow();
    refresh();
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $("closeModal").focus();
  }
  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener("click", function (e) {
    var t;
    if ((t = e.target.closest("[data-reserve]"))) { if (!t.disabled) openModal(t.getAttribute("data-show"), t.getAttribute("data-oferta-id")); return; }
    if ((t = e.target.closest("[data-pay]"))) { state.pay = t.getAttribute("data-pay"); refresh(); return; }
    if ((t = e.target.closest("[data-show-opt]"))) {
      if (t.classList.contains("off")) { e.preventDefault(); return; }
      state.show = t.getAttribute("data-show-opt"); refresh(); return;
    }
    if ((t = e.target.closest("[data-pay-opt]"))) { state.pay = t.getAttribute("data-pay-opt"); refresh(); return; }
  });
  if (modal) {
    $("closeModal").addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("show")) closeModal(); });
  }

  function campos() {
    return {
      nome: $("fNome").value.trim(),
      wpp: $("fWpp").value.trim(),
      email: $("fEmail") ? $("fEmail").value.trim() : "",
      data: $("fData") ? $("fData").value.trim() : "",
      insta: $("fInsta") ? $("fInsta").value.trim() : ""
    };
  }
  function showAtual() { return SHOWS.find(function (x) { return x.id === state.show; }); }
  function valida(f) {
    if (!f.nome) { alert("Coloca seu nome pra gente saber quem é."); return false; }
    if (OFERTA.id === "show") {
      var s = showAtual();
      if (!s || !s.disponivel) { alert("Escolha uma data de show disponível."); return false; }
    }
    return true;
  }

  /* ====== WHATSAPP ====== */
  function abrirWhatsApp() {
    var f = campos();
    if (!valida(f)) return;
    var L = ["Olá! Quero garantir *" + OFERTA.nome + "* na " + CFG.NOME + ".", ""];
    if (OFERTA.id === "show") {
      var s = showAtual();
      L.push("Show: " + s.artista + " (" + s.dia + (s.horario ? ", " + s.horario : "") + ")");
    }
    if (OFERTA.assinatura) L.push("Plano: trimestral, " + BRL(OFERTA.mensal || Math.round(OFERTA.pix / OFERTA.assinatura.meses)) + " por mês");
    L.push("Nome: " + f.nome);
    if (f.wpp) L.push("Meu WhatsApp: " + f.wpp);
    if (f.data) L.push(($("fData").getAttribute("data-rotulo") || "Quando quero usar") + ": " + f.data);
    if (f.insta) L.push("Instagram: " + f.insta);
    L.push("Pagamento: " + PAY_NOME[state.pay]);
    L.push("Valor: " + BRL(preco()) + (OFERTA.sinal < 1 ? " (sinal de " + BRL(sinal()) + ")" : ""));
    L.push("", state.pay === "pix" ? "Pode confirmar e me mandar o Pix?" : "Pode confirmar e me mandar o link de pagamento?");
    track("Contact");
    var url = "https://wa.me/" + WPP + "?text=" + encodeURIComponent(L.join("\n"));
    /* Depois de esperar o servidor, o celular pode bloquear a aba nova: aí abre na mesma aba */
    var aba = window.open(url, "_blank");
    if (!aba) window.location.href = url;
  }
  if ($("send")) $("send").addEventListener("click", abrirWhatsApp);

  /* ====== MERCADO PAGO ====== */
  if ($("pagar")) $("pagar").addEventListener("click", function () {
    var btn = this, f = campos();
    if (!valida(f)) return;
    if (OFERTA.assinatura && state.pay === "cartao" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) {
      alert("Para a assinatura no cartão, o Mercado Pago pede seu e-mail."); return;
    }
    btn.disabled = true; btn.textContent = "Abrindo o Mercado Pago...";
    track("InitiateCheckout", { content_name: OFERTA.nome, value: preco(), currency: "BRL" });
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oferta: OFERTA.id, show: state.show, pay: state.pay,
        nome: f.nome, email: f.email, wpp: f.wpp, data: f.data, insta: f.insta })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d.url) { window.location.href = x.d.url; return; }
        var e = new Error(x.d && x.d.erro);
        e.semMP = x.status === 503;  /* Mercado Pago ainda não configurado na Vercel */
        throw e;
      })
      .catch(function (e) {
        btn.disabled = false; btn.textContent = "Pagar no Mercado Pago";
        /* Sem Mercado Pago configurado, o pedido segue direto para o WhatsApp, sem mensagem de erro */
        if (!(e && e.semMP)) alert("Não conseguimos abrir o Mercado Pago agora. Vamos fechar pelo WhatsApp.");
        abrirWhatsApp();
      });
  });

  /* Volta do Mercado Pago: ?pagamento=aprovado|pendente|falhou|assinatura */
  (function () {
    var q = new URLSearchParams(location.search), st = q.get("pagamento");
    if (q.get("oferta") && acha(q.get("oferta"))) OFERTA = acha(q.get("oferta"));
    if (!st || !OFERTA) return;
    var s = SHOWS.find(function (x) { return x.id === q.get("show"); });
    var oque = OFERTA.nome + (s ? " · " + s.artista + " (" + s.dia + ")" : "");
    var txt = {
      aprovado:   ["Pagamento aprovado!", OFERTA.apos || "Chama a gente no WhatsApp para receber o endereço e as regras da portaria."],
      assinatura: ["Assinatura criada!", OFERTA.apos || "Bem-vindo ao Club Alpha. Chama a gente no WhatsApp para a gente te receber."],
      pendente:   ["Pagamento em análise.", "Assim que o Mercado Pago aprovar, a gente confirma no WhatsApp."],
      falhou:     ["O pagamento não foi concluído.", "Você pode tentar de novo ou fechar com a gente pelo WhatsApp."]
    }[st];
    if (!txt) return;
    if (st === "aprovado" || st === "assinatura") track("Purchase", { content_name: OFERTA.nome, value: OFERTA.pix, currency: "BRL" });
    var msg = "Olá! " + (st === "falhou" ? "Tive um problema ao pagar " : "Acabei de pagar ") + oque + " no site da " + CFG.NOME + ".";
    var bar = document.createElement("div");
    bar.className = "paid";
    bar.innerHTML = '<div class="wrap"><div><b>' + txt[0] + '</b> ' + txt[1] + '</div>' +
      '<a class="btn btn-gold" target="_blank" rel="noopener" href="https://wa.me/' + WPP + '?text=' + encodeURIComponent(msg) + '">Falar no WhatsApp</a></div>';
    document.body.insertBefore(bar, document.body.firstChild);
    history.replaceState(null, "", location.pathname);
  })();

  /* ====== PATROCÍNIO ====== */
  var marcas = $("marcas");
  var comLogo = (CFG.MARCAS || []).filter(function (m) { return m.logo; });  /* só logo oficial */
  if (marcas && comLogo.length) {
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    marcas.innerHTML =
      '<div class="wrap">' +
      '<h2 id="marcas-titulo">As marcas que estão <em>com a gente</em>.</h2>' +
      '<div class="marcas-row">' + comLogo.map(function (m) {
        return '<div class="marca"><img src="' + esc(ROOT + m.logo) + '" alt="' + esc(m.nome) + '" loading="lazy" decoding="async"></div>';
      }).join("") + '</div></div>';
  }

  /* ====== VÍDEO: toca sem som só enquanto aparece na tela; o botão liga o som ====== */
  document.querySelectorAll("video[data-auto]").forEach(function (v) {
    if (!("IntersectionObserver" in window)) { v.setAttribute("controls", ""); return; }
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () { v.setAttribute("controls", ""); }); }
      else v.pause();
    }, { threshold: 0.4 }).observe(v);
  });
  document.querySelectorAll("[data-som]").forEach(function (b) {
    var v = b.parentNode.querySelector("video");
    b.addEventListener("click", function () {
      v.muted = !v.muted;
      if (!v.muted) { v.currentTime = 0; v.play(); }
      b.textContent = v.muted ? "Ativar som" : "Desativar som";
      b.setAttribute("aria-pressed", v.muted ? "false" : "true");
    });
  });

  /* ====== PLANOS: o card tocado (ou com foco) fica em destaque ====== */
  document.querySelectorAll("[data-planos]").forEach(function (grid) {
    var marca = function (card) {
      grid.querySelectorAll(".pac").forEach(function (c) { c.classList.toggle("feat", c === card); });
    };
    grid.addEventListener("click", function (e) { var c = e.target.closest(".pac"); if (c) marca(c); });
    grid.addEventListener("focusin", function (e) { var c = e.target.closest(".pac"); if (c) marca(c); });
  });

  /* ====== INDICAR: manda o link da comunidade para um amigo pelo WhatsApp ====== */
  document.querySelectorAll("[data-indicar]").forEach(function (a) {
    a.href = "https://wa.me/?text=" + encodeURIComponent("Olha isso: a Alpha House é uma comunidade multicultural para quem cria e empreende. Tem tudo a ver com você! " + ROOT + "comunidade/");
    a.target = "_blank"; a.rel = "noopener";
  });

  /* ====== FAQ ====== */
  document.querySelectorAll(".qa").forEach(function (qa) {
    qa.querySelector("button").addEventListener("click", function () {
      var open = qa.classList.contains("open");
      qa.classList.toggle("open", !open);
      var ans = qa.querySelector(".ans");
      ans.style.maxHeight = open ? null : (ans.scrollHeight + "px");
    });
  });

  /* ====== BARRA FIXA NO CELULAR: preço + botão, depois que o topo da página sai da tela ====== */
  var heroEl = document.querySelector(".hero");
  if (OFERTA && OFERTA.barra && modal && heroEl && "IntersectionObserver" in window) {
    var cta = document.createElement("div");
    cta.className = "cta-bar";
    cta.innerHTML = '<span class="cta-txt"></span><button type="button" class="btn btn-gold" data-reserve>' + (OFERTA.botao || "Reservar") + '</button>';
    document.body.appendChild(cta);
    document.body.classList.add("has-cta");
    new IntersectionObserver(function (es) {
      var mostrar = !es[0].isIntersecting;
      cta.classList.toggle("on", mostrar);
      document.body.classList.toggle("cta-on", mostrar);
    }).observe(heroEl);
  }

  /* Página sem modal (home): a barra fixa leva para os planos */
  var ctaLink = document.body.getAttribute("data-cta-link");
  if (!OFERTA && ctaLink && heroEl && "IntersectionObserver" in window) {
    var barra = document.createElement("div");
    barra.className = "cta-bar";
    barra.innerHTML = '<span class="cta-txt">' + (document.body.getAttribute("data-cta-texto") || "") + '</span>' +
      '<a class="btn btn-gold" href="' + ctaLink + '">' + (document.body.getAttribute("data-cta-botao") || "Ver planos") + '</a>';
    document.body.appendChild(barra);
    document.body.classList.add("has-cta");
    new IntersectionObserver(function (es) {
      var mostrar = !es[0].isIntersecting;
      barra.classList.toggle("on", mostrar);
      document.body.classList.toggle("cta-on", mostrar);
    }).observe(heroEl);
  }

  refresh();

  /* ====== REVEAL ====== */
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.14 });
  els.forEach(function (e) { io.observe(e); });
})();
