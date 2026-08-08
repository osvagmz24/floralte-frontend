export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Método no permitido"
    });
  }

  try {

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        ok: false,
        error: "Falta MERCADOPAGO_ACCESS_TOKEN en Vercel"
      });
    }


    const { items, customer, delivery } = req.body || {};


    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({
        ok: false,
        error: "El carrito está vacío"
      });
    }


    // Sanitizamos los productos recibidos
    const mpItems = items.map((item, index) => ({

      id: String(item.id || `producto-${index + 1}`),

      title: String(
        item.title ||
        item.name ||
        "Producto Floralte"
      ).slice(0, 120),

      quantity: Math.max(
        1,
        Number(item.quantity) || 1
      ),

      unit_price: Math.max(
        1,
        Number(item.unit_price) || 1
      ),

      currency_id: "MXN"

    }));


    const preference = {

      items: mpItems,

      payer: {
        name: String(
          customer?.name || ""
        ).slice(0, 100)
      },

      external_reference:
        `FLORALTE-${Date.now()}`,

      back_urls: {

        success:
          "https://floralte.com/?pago=exitoso",

        pending:
          "https://floralte.com/?pago=pendiente",

        failure:
          "https://floralte.com/?pago=fallido"

      },

      auto_return: "approved",

      metadata: {

        floristeria: "Floralte",

        delivery_type:
          String(delivery?.type || ""),

        city:
          String(delivery?.city || ""),

        address:
          String(delivery?.address || ""),

        customer_phone:
          String(customer?.phone || "")

      },

      statement_descriptor: "FLORALTE"

    };


    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify(preference)
      }
    );


    const data = await response.json();


    if (!response.ok) {

      console.error(
        "Mercado Pago error:",
        data
      );

      return res.status(response.status).json({

        ok: false,

        error:
          data?.message ||
          data?.error ||
          "Mercado Pago rechazó la preferencia",

        details: data

      });

    }


    return res.status(200).json({

      ok: true,

      preferenceId: data.id,

      init_point: data.init_point,

      sandbox_init_point:
        data.sandbox_init_point

    });


  } catch (error) {

    console.error(
      "Error crear-preferencia:",
      error
    );

    return res.status(500).json({

      ok: false,

      error:
        error?.message ||
        "Error interno creando el pago"

    });

  }

}