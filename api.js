export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const bouquet = body?.bouquet || [];

    if (!bouquet.length) {
      return res.status(400).json({ error: "No se enviaron flores." });
    }

    const bouquetText = bouquet
      .map(item => `${item.qty} tallos de ${item.name} color ${item.color}`)
      .join(", ");

    const prompt = `
Crea una visualización realista y elegante de un ramo floral premium.
Debe verse como fotografía de estudio, fondo limpio y suave, composición vertical.
El ramo debe incluir: ${bouquetText}.
Haz que se vea delicado, romántico, premium y muy bonito, con envoltura elegante.
    `.trim();

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        size: "1024x1024",
        prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        error: data?.error?.message || "Error al generar la imagen"
      });
    }

    const base64 = data?.data?.[0]?.b64_json;

    if (!base64) {
      return res.status(500).json({ error: "La API no devolvió una imagen válida." });
    }

    return res.status(200).json({
      imageUrl: `data:image/png;base64,${base64}`
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Ocurrió un error al generar la visualización."
    });
  }
}