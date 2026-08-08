/*
 * Floralte · Vercel Function
 * POST /api/crear-preferencia
 *
 * Variables de entorno necesarias:
 *   MERCADOPAGO_ACCESS_TOKEN
 *
 * Recomendadas:
 *   SITE_URL=https://floralte.com
 *
 * Esta función:
 *  - crea una preferencia de Checkout Pro;
 *  - agrega notification_url para que Mercado Pago llame al webhook;
 *  - conserva un snapshot compacto del pedido en metadata para que el
 *    webhook pueda reconstruir productos, ramo personalizado y entrega.
 */

const MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";

function text(value, max = 180) {
  return String(value ?? "").trim().slice(0, max);
}

function positiveNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function positiveInt(value, fallback = 1) {
  return Math.max(1, Math.round(positiveNumber(value, fallback)));
}

function publicHttpsUrl(value) {
  const s = String(value || "").trim();
  return /^https:\/\//i.test(s) ? s.slice(0, 1900) : "";
}

function getSiteUrl(req) {
  const envUrl = String(process.env.SITE_URL || "").trim().replace(/\/$/, "");
  if (envUrl) return envUrl;

  const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  if (host) return `${proto}://${host}`;

  return "https://floralte.com";
}

function compactBouquet(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 35).map(f => ({
    n: text(f.name || f.nombre || f.id || "Flor", 60),
    c: text(f.color || "Natural", 35),
    q: positiveInt(f.qty ?? f.quantity ?? f.cantidad, 1),
    p: positiveNumber(f.price ?? f.unit_price, 0)
  }));
}

function findOrderItem(order, item, index) {
  const orderItems = Array.isArray(order?.items) ? order.items : [];
  const byId = orderItems.find(x => String(x?.id) === String(item?.id));
  return byId || orderItems[index] || null;
}

function makeSnapshot(body, cleanItems, externalReference) {
  const order = body?.order && typeof body.order === "object" ? body.order : {};
  const customer = body?.customer && typeof body.customer === "object" ? body.customer : {};
  const delivery = body?.delivery && typeof body.delivery === "object" ? body.delivery : {};

  const items = cleanItems.slice(0, 30).map((item, index) => {
    const original = findOrderItem(order, body.items[index] || item, index) || {};
    const previewUrl = publicHttpsUrl(
      original.previewUrl || original.previewURL || original.imageUrl || original.aiImageUrl ||
      body.items?.[index]?.previewUrl || body.items?.[index]?.imageUrl
    );

    return {
      id: text(item.id, 90),
      n: text(original.name || item.title, 100),
      q: item.quantity,
      p: item.unit_price,
      custom: Boolean(original.isCustom),
      style: text(original.style || "", 50),
      bouquet: compactBouquet(original.bouquet),
      preview: previewUrl
    };
  });

  return {
    ref: externalReference,
    createdAt: new Date().toISOString(),
    total: cleanItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
    customer: {
      name: text(order?.customer?.name || customer.name, 100),
      phone: text(order?.customer?.phone || customer.phone, 40)
    },
    delivery: {
      type: text(order?.delivery?.type || delivery.type, 80),
      city: text(order?.delivery?.city || delivery.city, 80),
      address: text(order?.delivery?.address || delivery.address, 180)
    },
    items
  };
}

function bouquetDescription(orderItem) {
  if (!orderItem?.isCustom || !Array.isArray(orderItem.bouquet)) return "";
  const style = text(orderItem.style || "Ramo personalizado", 50);
  const flowers = orderItem.bouquet
    .slice(0, 20)
    .map(f => `${positiveInt(f.qty ?? f.quantity, 1)}x ${text(f.name || f.nombre || "Flor", 35)} ${text(f.color || "", 24)}`.trim())
    .join(", ");
  return text(`${style}: ${flowers}`, 240);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método no permitido. Usa POST." });
  }

  const accessToken = String(process.env.MERCADOPAGO_ACCESS_TOKEN || "").trim();
  if (!accessToken) {
    return res.status(500).json({ ok: false, error: "Falta MERCADOPAGO_ACCESS_TOKEN en Vercel." });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const incomingItems = Array.isArray(body.items) ? body.items : [];

    if (!incomingItems.length) {
      return res.status(400).json({ ok: false, error: "El carrito está vacío." });
    }

    const order = body.order && typeof body.order === "object" ? body.order : {};

    const items = incomingItems.slice(0, 30).map((item, index) => {
      const original = findOrderItem(order, item, index) || {};
      const unitPrice = positiveNumber(item.unit_price ?? item.price, 0);
      if (!unitPrice) throw new Error(`El producto ${index + 1} no tiene un precio válido.`);

      const customDescription = bouquetDescription(original);
      const previewUrl = publicHttpsUrl(
        original.previewUrl || original.previewURL || original.imageUrl || original.aiImageUrl ||
        item.previewUrl || item.imageUrl
      );

      const mpItem = {
        id: text(item.id || `floralte-${index + 1}`, 100),
        title: text(item.title || item.name || original.name || "Producto Floralte", 120),
        description: text(customDescription || item.description || original.customSummary || "Diseño Floralte", 240),
        quantity: positiveInt(item.quantity, 1),
        unit_price: unitPrice,
        currency_id: "MXN"
      };

      if (previewUrl) mpItem.picture_url = previewUrl;
      return mpItem;
    });

    const externalReference = `FLORALTE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const snapshot = makeSnapshot(body, items, externalReference);
    const siteUrl = getSiteUrl(req);

    // Mantener metadata compacta ayuda a que el webhook reconstruya el pedido.
    // No guardamos imágenes base64 aquí: solo URLs HTTPS públicas.
    const orderJson = JSON.stringify(snapshot);

    const preference = {
      items,
      external_reference: externalReference,
      notification_url: `${siteUrl}/api/webhook-mercadopago`,
      back_urls: {
        success: `${siteUrl}/?pago=exitoso`,
        pending: `${siteUrl}/?pago=pendiente`,
        failure: `${siteUrl}/?pago=fallido`
      },
      auto_return: "approved",
      statement_descriptor: "FLORALTE",
      metadata: {
        floristeria: "Floralte",
        order_ref: externalReference,
        customer_name: snapshot.customer.name,
        customer_phone: snapshot.customer.phone,
        delivery_type: snapshot.delivery.type,
        delivery_city: snapshot.delivery.city,
        delivery_address: snapshot.delivery.address,
        order_json: orderJson
      }
    };

    const customerName = text(body?.customer?.name || snapshot.customer.name, 100);
    if (customerName) preference.payer = { name: customerName };

    const mpResponse = await fetch(MP_PREFERENCES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": externalReference
      },
      body: JSON.stringify(preference)
    });

    const raw = await mpResponse.text();
    let data;
    try { data = raw ? JSON.parse(raw) : {}; }
    catch { data = { message: raw || "Respuesta inválida de Mercado Pago" }; }

    if (!mpResponse.ok) {
      console.error("Mercado Pago preference error:", data);
      const message = typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : "Mercado Pago rechazó la preferencia.";

      return res.status(mpResponse.status).json({ ok: false, error: message, details: data });
    }

    return res.status(200).json({
      ok: true,
      preferenceId: data.id,
      externalReference,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    });
  } catch (error) {
    console.error("crear-preferencia error:", error);
    return res.status(500).json({
      ok: false,
      error: error?.message || "Error interno creando el pago."
    });
  }
};
