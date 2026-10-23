/* Progresso da meta da pré-venda: devolve só a porcentagem e quantas vagas já foram
   preenchidas por oferta, nunca valores em reais.
   Soma os pagamentos aprovados no Mercado Pago que vieram deste site (external_reference
   "studio|<oferta deste config>|...") desde CONFIG.META.desde, mais o que foi vendido fora
   do site (extraValor / extraVagas). A resposta fica em cache por alguns minutos.
   Ofertas com assinatura (Club) renovam a cada trimestre: para as vagas, cada sócio conta
   uma vez só (pelo e-mail ou id de quem paga), somando também as assinaturas ativas. */
const CONFIG = require("../config.js");

const MP = "https://api.mercadopago.com";

module.exports = async function handler(req, res) {
  const META = CONFIG.META || {};
  const ids = CONFIG.OFERTAS.map(o => o.id);
  let valor = Number(META.extraValor) || 0;
  const vendidas = Object.assign({}, META.extraVagas || {});

  const assinaturas = CONFIG.OFERTAS.filter(o => o.assinatura).map(o => o.id);
  const socios = {};  /* oferta de assinatura -> quem paga (sem repetir renovações) */
  const conta = (oferta, chave) => {
    if (assinaturas.indexOf(oferta) < 0) { vendidas[oferta] = (vendidas[oferta] || 0) + 1; return; }
    (socios[oferta] = socios[oferta] || new Set()).add(String(chave));
  };

  const token = process.env.MP_ACCESS_TOKEN;
  if (token && META.desde) {
    try {
      for (let offset = 0; offset < 2000; offset += 100) {
        const q = new URLSearchParams({
          status: "approved", sort: "date_created", criteria: "desc",
          range: "date_created", begin_date: META.desde + "T00:00:00.000-03:00", end_date: "NOW",
          limit: "100", offset: String(offset)
        });
        const r = await fetch(MP + "/v1/payments/search?" + q, { headers: { Authorization: "Bearer " + token } });
        if (!r.ok) throw new Error("mercadopago " + r.status);
        const d = await r.json();
        const lista = d.results || [];
        lista.forEach(p => {
          const ref = String(p.external_reference || "").split("|");
          if (ref[0] !== "studio" || ids.indexOf(ref[1]) < 0) return;  /* só vendas deste site */
          valor += Number(p.transaction_amount) || 0;
          const quem = p.payer && (p.payer.email || p.payer.id);
          conta(ref[1], quem || (p.metadata && (p.metadata.whatsapp || p.metadata.nome)) || p.id);
        });
        if (lista.length < 100) break;
      }
      if (assinaturas.length) {
        const r = await fetch(MP + "/preapproval/search?status=authorized&limit=100", { headers: { Authorization: "Bearer " + token } });
        const d = r.ok ? await r.json() : {};
        (d.results || []).forEach(a => {
          const ref = String(a.external_reference || "").split("|");
          if (ref[0] === "studio" && assinaturas.indexOf(ref[1]) >= 0) conta(ref[1], a.payer_email || a.payer_id || a.id);
        });
      }
    } catch (e) {
      console.error(e.message);  /* sem Mercado Pago, mostra só o que está no config */
    }
  }

  Object.keys(socios).forEach(k => { vendidas[k] = (vendidas[k] || 0) + socios[k].size; });
  const pct = META.alvo ? Math.min(200, Math.floor(valor / META.alvo * 100)) : 0;  /* até 200%: a segunda metade é a meta dobrada */
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
  return res.status(200).json({ pct, vendidas });
};
