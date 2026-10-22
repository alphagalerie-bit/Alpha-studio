/* Progresso da meta da pré-venda: devolve só a porcentagem e quantas vagas já foram
   preenchidas por oferta, nunca valores em reais.
   Soma os pagamentos aprovados no Mercado Pago que vieram deste site (external_reference
   "studio|<oferta deste config>|...") desde CONFIG.META.desde, mais o que foi vendido fora
   do site (extraValor / extraVagas). A resposta fica em cache por alguns minutos. */
const CONFIG = require("../config.js");

const MP = "https://api.mercadopago.com";

module.exports = async function handler(req, res) {
  const META = CONFIG.META || {};
  const ids = CONFIG.OFERTAS.map(o => o.id);
  let valor = Number(META.extraValor) || 0;
  const vendidas = Object.assign({}, META.extraVagas || {});

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
          vendidas[ref[1]] = (vendidas[ref[1]] || 0) + 1;
        });
        if (lista.length < 100) break;
      }
    } catch (e) {
      console.error(e.message);  /* sem Mercado Pago, mostra só o que está no config */
    }
  }

  const pct = META.alvo ? Math.min(100, Math.floor(valor / META.alvo * 100)) : 0;
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=900");
  return res.status(200).json({ pct, vendidas });
};
