/*
 * Floralte · Vercel Function
 * POST /api/webhook-mercadopago
 *
 * Recibe el evento "payment" de Mercado Pago, consulta el pago real y,
 * solamente cuando status === "approved", envía el pedido a WhatsApp.
 *
 * Variables de entorno:
 *   MERCADOPAGO_ACCESS_TOKEN
 *   MERCADOPAGO_WEBHOOK_SECRET       <- firma secreta del panel de Webhooks
 *
 *   WHATSAPP_ACCESS_TOKEN            <- token de WhatsApp Cloud API
 *   WHATSAPP_PHONE_NUMBER_ID         <- Phone Number ID de Meta
 *   WHATSAPP_NOTIFY_TO               <- número destino en formato internacional, solo dígitos
 *
 * Recomendadas para avisos SIEMPRE (fuera de la ventana de 24 h):
 *   WHATSAPP_ORDER_TEMPLATE_NAME=floralte_nueva_compra
 *   WHATSAPP_TEMPLATE_LANG=es_MX
 *
 * Opcional para mandar una imagen pública del ramo IA mediante plantilla:
 *   WHATSAPP_IMAGE_TEMPLATE_NAME=floralte_ramo_ia
 *
 * La plantilla "floralte_nueva_compra" debe tener 4 variables BODY:
 *   {{1}} referencia/pago
 *   {{2}} total
 *   {{3}} cliente
 *   {{4}} detalle del pedido
 *
 * La plantilla "floralte_ramo_ia" (opcional) debe tener:
 *   HEADER de tipo IMAGE dinámico
 *   BODY {{1}} nombre/estilo del ramo
 *   BODY {{2}} precio
 *
 * Nota: la imagen IA debe ser una URL HTTPS pública. Un data:image;base64...
 * no puede ser recuperado por Meta después del checkout.
 */

const crypto = require("crypto");

const MP_PAYMENT_URL = "https://api.mercadopago.com/v1/payments";
const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION || "v26.0";

function header(req, name) {
  const v = req.headers?.[name.toLowerCase()];
  return Array.isArray(v) ? v[0] : String(v || "");
}

function text(value, max = 1000) {
  return String(value ?? "").trim().slice(0, max);
}

function money(value) {
  const n = Number(value || 0);
  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2
    }).format(n);
  } catch {
    return `$${n.toFixed(2)} MXN`;
  }
}

function publicHttpsUrl(value) {
  const s = String(value || "").trim();
  return /^https:\/\//i.test(s) ? s : "";
}

function parseJson(value, fallback = null) {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try { return JSON.parse(String(value)); }
  catch { return fallback; }
}

function getQueryValue(req, key) {
  const direct = req.query?.[key];
  if (Array.isArray(direct)) return direct[0];
  if (direct != null) return String(direct);
  return "";
}

function parseSignature(xSignature) {
  const parts = String(xSignature || "").split(",");
  const out = {};
  for (const part of parts) {
    const [k, ...rest] = part.split("=");
    if (k && rest.length) out[k.trim()] = rest.join("=").trim();
  }
  return out;
}

function safeEqualHex(a, b) {
  try {
    const ba = Buffer.from(String(a), "hex");
    const bb = Buffer.from(String(b), "hex");
    if (!ba.length || ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function validateMercadoPagoSignature(req, secret) {
  const xSignature = header(req, "x-signature");
  const xRequestId = header(req, "x-request-id");
  const queryDataId = getQueryValue(req, "data.id") || getQueryValue(req, "data_id");

  if (!xSignature) return false;

  const { ts, v1 } = parseSignature(xSignature);
  if (!ts || !v1) return false;

  // Mercado Pago especifica que data.id alfanumérico en mayúsculas debe ir
  // en minúsculas al construir el manifest.
  const normalizedId = queryDataId ? String(queryDataId).toLowerCase() : "";

  let manifest = "";
  if (normalizedId) manifest += `id:${normalizedId};`;
  if (xRequestId) manifest += `request-id:${xRequestId};`;
  manifest += `ts:${ts};`;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return safeEqualHex(expected, v1);
}

async function getPayment(paymentId, accessToken) {
  const response = await fetch(`${MP_PAYMENT_URL}/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const raw = await response.text();
  let data;
  try { data = raw ? JSON.parse(raw) : {}; }
  catch { data = { message: raw || "Respuesta inválida" }; }

  if (!response.ok) {
    const message = data?.message || data?.error || `Mercado Pago respondió ${response.status}`;
    throw new Error(typeof message === "string" ? message : "No se pudo consultar el pago.");
  }

  return data;
}

function normalizeOrder(payment) {
  const metadata = payment?.metadata || {};
  const snapshot = parseJson(metadata.order_json, null);

  if (snapshot?.items?.length) {
    return snapshot;
  }

  const mpItems = Array.isArray(payment?.additional_info?.items)
    ? payment.additional_info.items
    : [];

  return {
    ref: payment?.external_reference || metadata.order_ref || String(payment?.id || ""),
    total: Number(payment?.transaction_amount || 0),
    customer: {
      name: metadata.customer_name ||
        [payment?.payer?.first_name, payment?.payer?.last_name].filter(Boolean).join(" ") ||
        "Sin nombre",
      phone: metadata.customer_phone || ""
    },
    delivery: {
      type: metadata.delivery_type || "",
      city: metadata.delivery_city || "",
      address: metadata.delivery_address || ""
    },
    items: mpItems.map(i => ({
      id: i.id,
      n: i.title || i.description || "Producto Floralte",
      q: Number(i.quantity || 1),
      p: Number(i.unit_price || 0),
      custom: false,
      style: "",
      bouquet: [],
      preview: publicHttpsUrl(i.picture_url)
    }))
  };
}

function itemName(item) {
  return text(item?.n || item?.name || item?.title || "Producto Floralte", 100);
}

function itemQty(item) {
  return Math.max(1, Number(item?.q ?? item?.quantity ?? 1) || 1);
}

function itemPrice(item) {
  return Number(item?.p ?? item?.price ?? item?.unit_price ?? 0) || 0;
}

function bouquetLine(item) {
  const list = Array.isArray(item?.bouquet) ? item.bouquet : [];
  if (!list.length) return "";

  return list.map(f => {
    const q = Math.max(1, Number(f?.q ?? f?.qty ?? f?.quantity ?? 1) || 1);
    const name = text(f?.n || f?.name || f?.nombre || "Flor", 45);
    const color = text(f?.c || f?.color || "Natural", 30);
    return `${q}× ${name} (${color})`;
  }).join(", ");
}

function buildOrderSummary(order) {
  const items = Array.isArray(order?.items) ? order.items : [];
  if (!items.length) return "Sin detalle de productos.";

  const lines = [];
  for (const item of items) {
    const q = itemQty(item);
    const unit = itemPrice(item);
    const subtotal = q * unit;
    lines.push(`${q}× ${itemName(item)} — ${money(subtotal)}`);

    const flowers = bouquetLine(item);
    if (flowers) lines.push(`  🌸 ${flowers}`);

    const style = text(item?.style || "", 60);
    if (style) lines.push(`  Estilo: ${style}`);
  }

  const delivery = order?.delivery || {};
  if (delivery.type || delivery.city || delivery.address) {
    lines.push("");
    lines.push(`Entrega: ${[delivery.type, delivery.city].filter(Boolean).join(" · ") || "Por definir"}`);
    if (delivery.address) lines.push(`Dirección: ${text(delivery.address, 180)}`);
  }

  return lines.join("\n");
}

function collectPreviewImages(order) {
  const items = Array.isArray(order?.items) ? order.items : [];
  return items
    .filter(i => i?.custom && publicHttpsUrl(i?.preview))
    .map(i => ({
      url: publicHttpsUrl(i.preview),
      title: `${itemName(i)}${i.style ? ` · ${text(i.style, 50)}` : ""}`,
      price: money(itemPrice(i) * itemQty(i))
    }));
}

async function graphPost(phoneNumberId, token, payload) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(phoneNumberId)}/messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const raw = await response.text();
  let data;
  try { data = raw ? JSON.parse(raw) : {}; }
  catch { data = { raw }; }

  if (!response.ok) {
    console.error("WhatsApp API error:", data);
    const message =
  data?.error?.error_data?.details ||
  data?.error?.message ||
  data?.message ||
  `WhatsApp respondió ${response.status}`;
    throw new Error(message);
  }

  console.log("WhatsApp API accepted:", JSON.stringify(data));
  return data;
}

async function sendOrderNotification({ to, phoneNumberId, token, payment, order }) {
  const templateName = String(process.env.WHATSAPP_ORDER_TEMPLATE_NAME || "").trim();
  const language = String(process.env.WHATSAPP_TEMPLATE_LANG || "es_MX").trim();

  const reference = text(order?.ref || payment?.external_reference || payment?.id || "Pago", 90);
  const total = money(payment?.transaction_amount || order?.total || 0);
  const customer = text(order?.customer?.name || "Sin nombre", 100);
  const summary = buildOrderSummary(order);

  if (templateName) {
    // Para notificaciones automáticas confiables fuera de la ventana de 24h.
    return graphPost(phoneNumberId, token, {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: language },
        components: [{
          type: "body",
          parameters: [
            { type: "text", text: reference },
            { type: "text", text: total },
            { type: "text", text: customer },
            { type: "text", text: text(summary, 900) }
          ]
        }]
      }
    });
  }

  // Fallback útil para pruebas; Meta puede rechazarlo si no hay ventana de conversación abierta.
  const message = [
    "🌸 NUEVA COMPRA FLORALTE",
    "",
    `Pago: ${reference}`,
    `Estado: APROBADO`,
    `Total: ${total}`,
    `Cliente: ${customer}`,
    "",
    summary
  ].join("\n");

  return graphPost(phoneNumberId, token, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { preview_url: false, body: text(message, 3900) }
  });
}

async function sendPreviewImages({ to, phoneNumberId, token, order }) {
  const templateName = String(process.env.WHATSAPP_IMAGE_TEMPLATE_NAME || "").trim();
  if (!templateName) return [];

  const language = String(process.env.WHATSAPP_TEMPLATE_LANG || "es_MX").trim();
  const images = collectPreviewImages(order);
  const results = [];

  for (const image of images.slice(0, 5)) {
    const result = await graphPost(phoneNumberId, token, {
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: language },
        components: [
          {
            type: "header",
            parameters: [{ type: "image", image: { link: image.url } }]
          },
          {
            type: "body",
            parameters: [
              { type: "text", text: text(image.title, 120) },
              { type: "text", text: image.price }
            ]
          }
        ]
      }
    });
    results.push(result);
  }

  return results;
}

// Reduce duplicados dentro de una misma instancia caliente de Vercel.
// No sustituye una base de datos, pero evita reenvíos inmediatos en muchos casos.
const sentPayments = globalThis.__FLORALTE_SENT_PAYMENTS__ || new Set();
globalThis.__FLORALTE_SENT_PAYMENTS__ = sentPayments;

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "Floralte Mercado Pago Webhook",
      graphVersion: GRAPH_VERSION,
      mercadoPagoConfigured: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
      webhookSecretConfigured: Boolean(process.env.MERCADOPAGO_WEBHOOK_SECRET),
      whatsappConfigured: Boolean(
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID &&
        process.env.WHATSAPP_NOTIFY_TO
      ),
      orderTemplateConfigured: Boolean(process.env.WHATSAPP_ORDER_TEMPLATE_NAME),
      imageTemplateConfigured: Boolean(process.env.WHATSAPP_IMAGE_TEMPLATE_NAME)
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Método no permitido." });
  }

  const mpToken = String(process.env.MERCADOPAGO_ACCESS_TOKEN || "").trim();
  const webhookSecret = String(process.env.MERCADOPAGO_WEBHOOK_SECRET || "").trim();
  const waToken = String(process.env.WHATSAPP_ACCESS_TOKEN || "").trim();
  const waPhoneNumberId = String(process.env.WHATSAPP_PHONE_NUMBER_ID || "").trim();
  const waTo = String(process.env.WHATSAPP_NOTIFY_TO || "").replace(/\D/g, "");

  if (!mpToken) return res.status(500).json({ ok: false, error: "Falta MERCADOPAGO_ACCESS_TOKEN." });

  // Validación de origen. Se recomienda configurar siempre la firma secreta.
  if (webhookSecret && !validateMercadoPagoSignature(req, webhookSecret)) {
    console.warn("Webhook Mercado Pago con firma inválida.");
    return res.status(401).json({ ok: false, error: "Firma inválida." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const type = String(getQueryValue(req, "type") || body.type || "").toLowerCase();

  // Checkout Pro usa el tópico payment. Ignoramos otros eventos correctamente.
  if (type && type !== "payment") {
    return res.status(200).json({ ok: true, ignored: true, reason: `Evento ${type}` });
  }

  const paymentId = String(
    getQueryValue(req, "data.id") ||
    getQueryValue(req, "data_id") ||
    body?.data?.id ||
    ""
  ).trim();

  if (!paymentId) {
    return res.status(200).json({ ok: true, ignored: true, reason: "Sin payment id" });
  }

  // SIMULADOR DE MERCADO PAGO:
  // El simulador manda live_mode:false y un Data ID ficticio.
  // En vez de consultar ese ID en Mercado Pago, enviamos una plantilla de
  // prueba a nuestro WhatsApp para validar el flujo completo MP -> Vercel -> WA.
  const isMercadoPagoSimulation =
    body?.live_mode === false &&
    String(body?.type || type || "").toLowerCase() === "payment";

  if (isMercadoPagoSimulation) {
    try {
      if (!waToken || !waPhoneNumberId || !waTo) {
        return res.status(500).json({
          ok: false,
          simulated: true,
          error: "El webhook llegó, pero falta configurar WhatsApp en Vercel."
        });
      }

      const testPayment = {
        id: paymentId,
        status: "approved",
        transaction_amount: 0,
        external_reference: `PRUEBA-MP-${paymentId}`
      };

      const testOrder = {
        ref: `PRUEBA-MP-${paymentId}`,
        total: 0,
        customer: { name: "Prueba Mercado Pago", phone: "" },
        delivery: { type: "", city: "", address: "" },
        items: [{
          id: "test-webhook",
          n: "Prueba de notificación Floralte",
          q: 1,
          p: 0,
          custom: false,
          style: "",
          bouquet: [],
          preview: ""
        }]
      };

      const waResult = await sendOrderNotification({
        to: waTo,
        phoneNumberId: waPhoneNumberId,
        token: waToken,
        payment: testPayment,
        order: testOrder
      });

      console.log("WhatsApp prueba aceptada por Meta:", JSON.stringify(waResult));

      return res.status(200).json({
        ok: true,
        simulated: true,
        notified: true,
        whatsappMessageId: waResult?.messages?.[0]?.id || null,
        whatsappStatus: waResult?.messages?.[0]?.message_status || "accepted",
        paymentId,
        action: body?.action || "payment.updated"
      });
    } catch (error) {
      console.error("Prueba Mercado Pago -> WhatsApp falló:", error);
      return res.status(500).json({
        ok: false,
        simulated: true,
        error: error?.message || "Falló la prueba de WhatsApp."
      });
    }
  }

  try {
    const payment = await getPayment(paymentId, mpToken);

    // Solo avisamos cuando Mercado Pago confirma el pago como aprobado.
    if (String(payment?.status || "").toLowerCase() !== "approved") {
      return res.status(200).json({
        ok: true,
        ignored: true,
        paymentId,
        status: payment?.status || "unknown"
      });
    }

    if (sentPayments.has(String(payment.id))) {
      return res.status(200).json({ ok: true, duplicate: true, paymentId: payment.id });
    }

    if (!waToken || !waPhoneNumberId || !waTo) {
      console.error("Pago aprobado, pero faltan variables de WhatsApp.", { paymentId: payment.id });
      // Respondemos 500 para que Mercado Pago reintente la notificación.
      return res.status(500).json({
        ok: false,
        error: "Pago aprobado, pero falta configurar WhatsApp en Vercel."
      });
    }

    const order = normalizeOrder(payment);

    await sendOrderNotification({
      to: waTo,
      phoneNumberId: waPhoneNumberId,
      token: waToken,
      payment,
      order
    });

    // Si existe una URL HTTPS pública de la IA y configuraste la plantilla de imagen,
    // manda también la(s) vista(s) previa(s).
    try {
      await sendPreviewImages({
        to: waTo,
        phoneNumberId: waPhoneNumberId,
        token: waToken,
        order
      });
    } catch (imageError) {
      // No tumbamos el aviso principal si solo falla la imagen.
      console.error("No se pudo enviar la imagen IA por WhatsApp:", imageError);
    }

    sentPayments.add(String(payment.id));

    return res.status(200).json({
      ok: true,
      notified: true,
      paymentId: payment.id,
      status: payment.status,
      externalReference: payment.external_reference || order.ref
    });
  } catch (error) {
    console.error("webhook-mercadopago error:", error);
    // 500 hace que Mercado Pago vuelva a intentar el webhook.
    return res.status(500).json({
      ok: false,
      error: error?.message || "Error procesando el webhook."
    });
  }
};