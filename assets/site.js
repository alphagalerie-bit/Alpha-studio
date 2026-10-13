/* Comportamento comum às páginas: preços, modal de reserva, Mercado Pago,
   WhatsApp, FAQ e animações. A página diz qual oferta vende em <body data-oferta="...">. */
(function () {
  var CFG = window.ALPHA_CONFIG;
  var ROOT = new URL("..", document.currentScript.src).href;  /* raiz do site, de qualquer página */
  var WPP = CFG.WPP, SHOWS = CFG.SHOWS;
  var OFERTA = CFG.OFERTAS.find(function (o) { return o.id === document.body.getAttribute("data-oferta"); });
  var BRL = function (n) { return "R$ " + n.toLocaleString("pt-BR"); };
  var PAY_NOME = { pix: "Pix", cartao: "Cartão à vista" };
  var $ = function (id) { return document.getElementById(id); };

  var state = { show: null, pay: "pix" };

  /* Textos vindos do config: <span data-cfg="PRAZO"></span> */
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    el.textContent = CFG[el.getAttribute("data-cfg")];
  });

  function preco() { return OFERTA ? OFERTA[state.pay] : 0; }
  function sinal() { return Math.round(preco() * (OFERTA.sinal || 1)); }

  /* ====== SHOWS ====== */
  var grid = $("showGrid"), optShows = $("optShows");
  if (grid || optShows) SHOWS.forEach(function (s) {
    if (grid) {
      var c = document.createElement("div");
      c.className = "show reveal" + (s.disponivel ? "" : " out");
      c.innerHTML =
        '<span class="date">' + s.dia + '</span>' +
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
      else sub = "Pagamento antecipado e integral, como um ingresso";
      $("subTotal").textContent = sub;
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

  refresh();

  /* ====== REVEAL ====== */
  var els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.14 });
  els.forEach(function (e) { io.observe(e); });
})();
