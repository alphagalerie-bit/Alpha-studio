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
  var OFERTA = CFG.OFERTAS.find(function (o) { return o.id === document.body.getAttribute("data-oferta"); });
  var BRL = function (n) { return "R$ " + n.toLocaleString("pt-BR"); };
  var PAY_NOME = { pix: "Pix", cartao: "Cartão à vista" };
  var $ = function (id) { return document.getElementById(id); };

  var state = { show: null, pay: "pix" };

  /* Textos vindos do config: <span data-cfg="PRAZO"></span> */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    el.textContent = CFG[el.getAttribute("data-cfg")];
  });

  /* Faixa de pré-venda (<div data-prazo>) some depois do PRAZO ("dd/mm") */
  if (CFG.PRAZO) {
    var pz = CFG.PRAZO.split("/");
    if (agora.getFullYear() + "-" + pad(+pz[1]) + "-" + pad(+pz[0]) < HOJE)
      document.querySelectorAll("[data-prazo]").forEach(function (el) { el.style.display = "none"; });
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
        '<p class="meta"><b style="color:var(--ink);font-weight:500">Esquenta das ' + s.horario +'</b></p>' +
        '<span class="status">' + (s.disponivel ? "Disponível · 1 reserva" : "Reservado") + '</span>' +
        '<button class="btn ' + (s.disponivel ? 'btn-gold' : 'btn-ghost') + '" data-reserve data-show="' + s.id + '"' + (s.disponivel ? '' : ' disabled') + '>' +
        (s.disponivel ? 'Reservar esta data' : 'Data reservada') + '</button>';
      grid.appendChild(c);
    }
    if (optShows) {
      var o = document.createElement("label");
      o.className = "opt" + (s.disponivel ? "" : " off");
      o.setAttribute("data-show-opt", s.id);
      o.innerHTML = '<span class="o-name">' + s.artista + '<span>' + s.dia + ' · ' + s.horario + '</span></span>' +
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
    if (!OFERTA) return;
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
    if ($("subTotal")) {
      var sub = "";
      if (OFERTA.sinal < 1) sub = "Agora no Mercado Pago: " + BRL(sinal()) + " · saldo até 7 dias antes";
      else if (OFERTA.assinatura) sub = state.pay === "cartao"
        ? "R$ 100 por mês · renova sozinho a cada 3 meses"
        : "R$ 100 por mês · renovação pelo Pix a cada 3 meses";
      else sub = OFERTA.nota || "";
      $("subTotal").textContent = sub;
    }
    var ctaTxt = document.querySelector(".cta-bar .cta-txt");
    if (ctaTxt) {  /* o primeiro valor em R$ fica em destaque */
      ctaTxt.textContent = OFERTA.barra.replace("{preco}", BRL(preco()));
      ctaTxt.innerHTML = ctaTxt.innerHTML.replace(/(R\$\s?[\d.]+(,\d+)?)/, "<b>$1</b>");
    }
    if ($("fEmailLbl")) $("fEmailLbl").textContent =
      (OFERTA.assinatura && state.pay === "cartao") ? "Seu e-mail (para a assinatura)" : "Seu e-mail";
  }

  /* ====== MODAL ====== */
  var modal = $("modal"), lastFocus = null;
  function firstShow() { var s = SHOWS.find(function (x) { return x.disponivel; }); return s ? s.id : null; }
  function openModal(showId) {
    if (!modal) return;
    lastFocus = document.activeElement;
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
    if ((t = e.target.closest("[data-reserve]"))) { if (!t.disabled) openModal(t.getAttribute("data-show")); return; }
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
      data: $("fData") ? $("fData").value.trim() : ""
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
      L.push("Show: " + s.artista + " (" + s.dia + ", " + s.horario + ")");
    }
    if (OFERTA.assinatura) L.push("Plano: trimestral, R$ 100 por mês");
    L.push("Nome: " + f.nome);
    if (f.wpp) L.push("Meu WhatsApp: " + f.wpp);
    if (f.data) L.push("Quando quero usar: " + f.data);
    L.push("Pagamento: " + PAY_NOME[state.pay]);
    L.push("Valor: " + BRL(preco()) + (OFERTA.sinal < 1 ? " (sinal de " + BRL(sinal()) + ")" : ""));
    L.push("", "Pode confirmar e me mandar o Pix?");
    track("Contact");
    window.open("https://wa.me/" + WPP + "?text=" + encodeURIComponent(L.join("\n")), "_blank");
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
        nome: f.nome, email: f.email, wpp: f.wpp, data: f.data })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d.url) { window.location.href = x.d.url; return; }
        throw new Error(x.d && x.d.erro);
      })
      .catch(function () {
        btn.disabled = false; btn.textContent = "Pagar no Mercado Pago";
        alert("Não conseguimos abrir o Mercado Pago agora. Vamos fechar pelo WhatsApp.");
        abrirWhatsApp();
      });
  });

  /* Volta do Mercado Pago: ?pagamento=aprovado|pendente|falhou|assinatura */
  (function () {
    var q = new URLSearchParams(location.search), st = q.get("pagamento");
    if (!st || !OFERTA) return;
    var s = SHOWS.find(function (x) { return x.id === q.get("show"); });
    var oque = OFERTA.nome + (s ? " · " + s.artista + " (" + s.dia + ")" : "");
    var txt = {
      aprovado:   ["Pagamento aprovado!", "Chama a gente no WhatsApp para receber o endereço e as regras da portaria."],
      assinatura: ["Assinatura criada!", "Bem-vindo ao Clube Alpha. Chama a gente no WhatsApp para agendar sua primeira visita."],
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
      '<div class="wrap"><p class="eyebrow">Patrocínio</p>' +
      '<h2 id="marcas-titulo">As marcas que estão <em>com a gente</em>.</h2>' +
      '<div class="marcas-row">' + comLogo.map(function (m) {
        return '<div class="marca"><img src="' + esc(ROOT + m.logo) + '" alt="' + esc(m.nome) + '" loading="lazy" decoding="async"></div>';
      }).join("") + '</div></div>';
  }

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

  refresh();

  /* ====== REVEAL ====== */
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.14 });
  els.forEach(function (e) { io.observe(e); });
})();
