export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método no permitido. Usa POST."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      ok: false,
      error: "OPENAI_API_KEY no está configurada en Vercel."
    });
  }

  try {
    let body = req.body || {};

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({
          ok: false,
          error: "El cuerpo de la petición no es JSON válido."
        });
      }
    }

    const ramo = Array.isArray(body.ramo) ? body.ramo : [];
    const estiloRaw = String(body.estilo || "coreano").toLowerCase();
    const estilo = estiloRaw.includes("franc") ? "frances" : "coreano";

    if (!ramo.length) {
      return res.status(400).json({
        ok: false,
        error: "No recibí flores para generar el ramo."
      });
    }

    const flores = ramo.map((f, i) => {
      const nombre = String(f.nombre || f.name || f.id || "Flor").slice(0, 80);
      const color = String(f.color || "Natural").slice(0, 50);
      const qty = Math.max(1, Math.min(100, Number(f.qty || f.cantidad || 1)));
      return `${i + 1}. ${qty} tallos de ${nombre}, color ${color}`;
    }).join("\n");

    const total = ramo.reduce((sum, f) => {
      const qty = Math.max(1, Math.min(100, Number(f.qty || f.cantidad || 1)));
      return sum + qty;
    }, 0);

    const estiloPrompt = estilo === "frances"
      ? `ESTILO FRANCÉS:\n- ramo circular/redondeado\n- composición romántica, elegante y natural\n- flores distribuidas de forma equilibrada\n- envoltura discreta y refinada\n- acabado premium artesanal\n- no usar pliegues coreanos grandes`
      : `ESTILO COREANO:\n- ramo de una vista\n- envoltura coreana moderna\n- varias capas de papel visibles\n- pliegues amplios y geométricos\n- volumen visual grande\n- acabado boutique premium`;

    const prompt = `
Genera una fotografía ultrarrealista de un ramo floral profesional de la marca Floralte.

RESPETA LO MEJOR POSIBLE LAS ESPECIES, COLORES Y PROPORCIONES INDICADAS.
No conviertas todo en rosas y no sustituyas las flores principales por flores genéricas.

SELECCIÓN DEL CLIENTE:
${flores}

TOTAL APROXIMADO: ${total} tallos.

${estiloPrompt}

Las flores principales deben dominar visualmente.
Las flores pequeñas y follajes solo deben aportar textura y estructura.
Puedes añadir de forma moderada eucalipto dólar, gypsophila o follaje verde fino.

FOTOGRAFÍA:
- ramo completo visible
- centrado
- iluminación suave de estudio
- fondo limpio ligeramente desenfocado
- flores frescas y realistas
- calidad comercial premium
- sin personas
- sin manos
- sin texto
- sin marcas de agua
- sin logotipos inventados
`;

    const openaiResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt,
        size: "1024x1024",
        quality: "medium"
      })
    });

    const raw = await openaiResponse.text();
    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(502).json({
        ok: false,
        error: `OpenAI devolvió una respuesta no válida (${openaiResponse.status}).`
      });
    }

    if (!openaiResponse.ok) {
      const message =
        data?.error?.message ||
        data?.message ||
        `OpenAI devolvió error ${openaiResponse.status}.`;

      return res.status(openaiResponse.status).json({
        ok: false,
        error: message
      });
    }

    const b64 = data?.data?.[0]?.b64_json;

    if (!b64) {
      return res.status(502).json({
        ok: false,
        error: "OpenAI respondió correctamente, pero no devolvió la imagen."
      });
    }

    return res.status(200).json({
      ok: true,
      imageUrl: `data:image/png;base64,${b64}`,
      estilo
    });

  } catch (error) {
    console.error("Error generar-preview-ramos:", error);

    return res.status(500).json({
      ok: false,
      error: error?.message || "Error interno generando la visualización."
    });
  }
}
