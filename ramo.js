"use strict";

const flowers = [
  {
    id: "rosa",
    name: "Rosa",
    price: 50,
    colors: ["Roja", "Rosa", "Blanca", "Amarilla", "Naranja", "Lila"],
    img: "images/rosroj.jpg",
    images: {
      Roja: "images/rosroj.jpg",
      Rosa: "images/rosros.jpg",
      Blanca: "images/rosblan.jpg",
      Amarilla: "images/rosam.jpg",
      Naranja: "images/rosnar.gif",
      Lila: "images/roslil.png"
    }
  },
  {
    id: "rosaPremium",
    name: "Rosa Premium",
    price: 70,
    colors: ["Acapella"],
    img: "images/rosac.jpg",
    images: {
      Acapella: "images/rosac.jpg"
    }
  },
  {
    id: "girasol",
    name: "Girasol",
    price: 40,
    colors: [],
    img: "images/gir.jpg"
  },
  {
    id: "lili",
    name: "Lili",
    price: 70,
    colors: [],
    img: "images/lil.jpg"
  },
  {
    id: "gerbera",
    name: "Gerbera",
    price: 50,
    colors: ["Rosa", "Roja", "Naranja", "Amarilla", "Blanca"],
    img: "images/gerros.jpg",
    images: {
      Roja: "images/gerroj.jpg",
      Rosa: "images/gerros.jpg",
      Blanca: "images/gerblan.jpg",
      Amarilla: "images/gerama.jpg",
      Naranja: "images/gernar.jpg"
    }
  },
  {
    id: "dendrobium",
    name: "Orquídea Dendrobium",
    price: 80,
    colors: ["Blanco", "Morado"],
    img: "images/deblan.jpg",
    images: {
      Blanco: "images/deblan.jpg",
      Morado: "images/demor.jpg"
    }
  },
  {
    id: "cymbidium",
    name: "Orquídea Cymbidium",
    price: 700,
    colors: ["Amarillo", "Blanco"],
    img: "images/cymama.jpg",
    images: {
      Amarillo: "images/cymama.jpg",
      Blanco: "images/cymblan.jpg"
    }
  },
  {
    id: "margarita",
    name: "Margaritas",
    price: 15,
    colors: ["Blanco", "Amarillo", "Lila", "Naranja"],
    img: "images/marblan.jpg",
    images: {
      Blanco: "images/marblan.jpg",
      Amarillo: "images/marama.jpg",
      Lila: "images/marlila.jpg",
      Naranja: "images/marnar.jpg"
    }
  },
  {
    id: "astromelia",
    name: "Astromelia",
    price: 15,
    colors: ["Morado", "Blanco", "Rosa"],
    img: "images/asmor.jpg",
    images: {
      Morado: "images/asmor.jpg",
      Blanco: "images/asblan.jpg",
      Rosa: "images/asros.jpg"
    }
  },
  {
    id: "clavel",
    name: "Clavel",
    price: 20,
    colors: ["Rojo", "Rosa", "Blanco"],
    img: "images/claroj.jpg",
    images: {
      Rojo: "images/claroj.jpg",
      Rosa: "images/claros.jpg",
      Blanco: "images/clablan.jpg"
    }
  },
  {
    id: "babyrose",
    name: "Baby Rose",
    price: 50,
    colors: ["Rosa", "Blanco", "Rojo", "Amarillo", "Lila"],
    img: "images/babros.jpg",
    images: {
      Rosa: "images/babros.jpg",
      Blanco: "images/bablan.jpg",
      Rojo: "images/babroj.jpg",
      Amarillo: "images/babama.jpg",
      Lila: "images/bablila.jpg"
    }
  },
  {
    id: "craspedia",
    name: "Craspedia",
    price: 80,
    colors: [],
    img: "images/crasp.jpg"
  },
  {
    id: "eryngium",
    name: "Eryngium",
    price: 40,
    colors: [],
    img: "images/eryn.gif"
  },
  {
    id: "hypericum",
    name: "Hypericum",
    price: 40,
    colors: [],
    img: "images/hype.gif"
  },
  {
    id: "ornithogalum",
    name: "Ornithogalum",
    price: 100,
    colors: [],
    img: "images/orni.png"
  },
  {
    id: "snapdragon",
    name: "Snapdragon",
    price: 30,
    colors: ["Rosa", "Blanco", "Lila"],
    img: "images/snaros.gif",
    images: {
      Rosa: "images/snaros.gif",
      Blanco: "images/snablan.gif",
      Lila: "images/snalila.gif"
    }
  },
  {
    id: "hortensia",
    name: "Hortensia",
    price: 250,
    colors: ["Azul", "Tinto", "Lila", "Rosa"],
    img: "images/horazul.jpg",
    images: {
      Azul: "images/horazul.jpg",
      Tinto: "images/hortin.jpg",
      Lila: "images/horlila.jpg",
      Rosa: "images/horros.jpg"
    }
  },
  {
    id: "lisianthus",
    name: "Lisianthus",
    price: 90,
    colors: ["Bicolor", "Rosa", "Morado", "Blanco"],
    img: "images/libi.png",
    images: {
      Bicolor: "images/libi.png",
      Rosa: "images/liros.png",
      Morado: "images/limor.png",
      Blanco: "images/liblan.png"
    }
  },
  {
    id: "protea",
    name: "Protea",
    price: 900,
    colors: ["Rosa", "Blanca"],
    img: "images/proros.gif",
    images: {
      Rosa: "images/proros.gif",
      Blanca: "images/problan.jpg"
    }
  }
];

let bouquet = [];

function getFlowerImage(flower, color) {
  if (
    flower.images &&
    color &&
    flower.images[color]
  ) {
    return flower.images[color];
  }

  return flower.img || "";
}

function renderFlowers() {
  const grid = $("#flowersGrid");

  if (!grid) {
    return;
  }

  grid.innerHTML = flowers.map(flower => {
    const firstColor = flower.colors.length
      ? flower.colors[0]
      : "Natural";

    const initialImage = getFlowerImage(
      flower,
      firstColor
    );

    const colorOptions = flower.colors.length
      ? flower.colors
          .map(color => `
            <option value="${esc(color)}">
              ${esc(color)}
            </option>
          `)
          .join("")
      : `
        <option value="Natural">
          Natural
        </option>
      `;

    return `
      <article class="flower-card">
        <div class="flower-head">
          <div class="flower-image">
            <img
              id="flower-image-${esc(flower.id)}"
              src="${esc(initialImage)}"
              alt="${esc(flower.name)} ${esc(firstColor)}"
              loading="lazy"
            >
          </div>

          <div>
            <div class="flower-name">
              ${esc(flower.name)}
            </div>

            <div class="flower-price">
              ${money(flower.price)} por tallo
            </div>
          </div>
        </div>

        <div class="flower-controls">
          <select
            class="field flower-color-select"
            data-color="${esc(flower.id)}"
            aria-label="Color de ${esc(flower.name)}"
          >
            ${colorOptions}
          </select>

          <input
            class="field"
            data-qty="${esc(flower.id)}"
            type="number"
            min="1"
            max="999"
            value="1"
            aria-label="Cantidad de ${esc(flower.name)}"
          >

          <button
            class="flower-add"
            data-flower="${esc(flower.id)}"
            type="button"
          >
            Agregar
          </button>
        </div>
      </article>
    `;
  }).join("");

  initializeColorImageChanges();
  initializeAddButtons();
  initializeImageFallbacks();
}

function initializeColorImageChanges() {
  $$("[data-color]").forEach(select => {
    on(select, "change", () => {
      const flower = flowers.find(
        item => item.id === select.dataset.color
      );

      if (!flower) {
        return;
      }

      const selectedColor = select.value;
      const newImage = getFlowerImage(
        flower,
        selectedColor
      );

      const image = $(
        `#flower-image-${flower.id}`
      );

      if (!image || !newImage) {
        return;
      }

      image.classList.add("changing");

      const preload = new Image();

      preload.onload = () => {
        image.src = newImage;
        image.alt = `${flower.name} ${selectedColor}`;
        image.style.display = "";

        requestAnimationFrame(() => {
          image.classList.remove("changing");
        });
      };

      preload.onerror = () => {
        console.warn(
          `No se encontró la imagen: ${newImage}`
        );

        image.classList.remove("changing");
      };

      preload.src = newImage;
    });
  });
}

function initializeAddButtons() {
  $$("[data-flower]").forEach(button => {
    on(button, "click", () => {
      const flower = flowers.find(
        item => item.id === button.dataset.flower
      );

      if (!flower) {
        return;
      }

      const colorSelect = $(
        `[data-color="${flower.id}"]`
      );

      const quantityInput = $(
        `[data-qty="${flower.id}"]`
      );

      const color =
        colorSelect?.value ||
        flower.colors[0] ||
        "Natural";

      const qty = Math.max(
        1,
        Math.min(
          999,
          Number(quantityInput?.value || 1)
        )
      );

      const existing = bouquet.find(
        item =>
          item.id === flower.id &&
          item.color === color
      );

      if (existing) {
        existing.qty += qty;
      } else {
        bouquet.push({
          ...flower,
          color,
          qty,
          selectedImage: getFlowerImage(
            flower,
            color
          )
        });
      }

      renderSummary();
    });
  });
}

function initializeImageFallbacks() {
  $$(".flower-image img").forEach(image => {
    on(image, "error", () => {
      image.style.display = "none";

      const container = image.closest(
        ".flower-image"
      );

      if (container) {
        container.classList.add(
          "image-error"
        );
      }
    });
  });
}

function renderSummary() {
  const host = $("#summaryList");

  if (!host) {
    return;
  }

  if (!bouquet.length) {
    host.innerHTML = `
      <div class="empty">
        Todavía no agregas flores.
      </div>
    `;
  } else {
    host.innerHTML = bouquet.map(
      (item, index) => `
        <div class="summary-row">
          <div class="summary-flower-info">
            <img
              class="summary-flower-image"
              src="${esc(
                item.selectedImage ||
                getFlowerImage(item, item.color)
              )}"
              alt="${esc(item.name)} ${esc(item.color)}"
            >

            <div>
              <strong>${esc(item.name)}</strong>
              <small>
                ${esc(item.color)} ·
                ${item.qty} tallos
              </small>
            </div>
          </div>

          <button
            class="remove"
            data-remove="${index}"
            type="button"
          >
            Quitar
          </button>
        </div>
      `
    ).join("");
  }

  $("#summaryTotal").textContent = money(
    bouquet.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    )
  );

  $$("[data-remove]", host).forEach(
    button => {
      on(button, "click", () => {
        bouquet.splice(
          Number(button.dataset.remove),
          1
        );

        renderSummary();
      });
    }
  );
}

function sendBouquet() {
  if (!bouquet.length) {
    alert("Agrega flores primero.");
    return;
  }

  let message =
    "Hola Floralte, quiero cotizar este ramo personalizado:\n\n";

  message += bouquet
    .map(
      item =>
        `- ${item.qty} × ${item.name} (${item.color})`
    )
    .join("\n");

  message +=
    `\n\nTotal aproximado: ${
      money(
        bouquet.reduce(
          (sum, item) =>
            sum + item.price * item.qty,
          0
        )
      )
    }`;

  whatsapp(message);
}

async function generatePreview() {
  if (!bouquet.length) {
    alert("Agrega flores primero.");
    return;
  }

  const button = $("#previewBouquet");
  const status = $("#previewStatus");
  const box = $("#previewBox");
  const image = $("#previewImg");

  button.disabled = true;
  button.classList.add("is-loading");
  button.textContent = "Generando visualización...";

  status.textContent =
    "Estamos creando una visualización aproximada de tu ramo.";

  box.classList.remove("show");
  image.removeAttribute("src");

  try {
    /*
      IMPORTANTE:

      Si el backend está dentro del mismo dominio:
      const endpoint = "/api/generar-preview-ramos";

      Si el backend está en Render, Railway u otro dominio:
      const endpoint =
        "https://TU-BACKEND.com/api/generar-preview-ramos";
    */

    const endpoint = "/api/generar-preview-ramos";

    const payload = {
      ramo: bouquet.map(item => ({
        id: item.id,
        nombre: item.name,
        name: item.name,
        color: item.color,
        qty: Number(item.qty) || 1,
        imagen:
          item.selectedImage ||
          getFlowerImage(item, item.color)
      })),

      envoltura: {
        paperType: "coreano",
        paperColor: "rosa pastel",
        wrapStyle: "circular"
      },

      envolturaLabel:
        "papel coreano rosa pastel, varias capas, acabado premium y listón de satén bronce pastel"
    };

    console.log("Enviando al servidor:", payload);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const rawText = await response.text();

    console.log("Estado del servidor:", response.status);
    console.log("Respuesta cruda:", rawText);

    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      /*
        Esto normalmente significa que Vercel devolvió una página HTML
        de error, 404 o una redirección.
      */
      throw new Error(
        `El endpoint no devolvió JSON. Estado ${response.status}. ` +
        `Revisa que exista ${endpoint}.`
      );
    }

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        `Error del servidor: ${response.status}`
      );
    }

    if (!data.ok) {
      throw new Error(
        data.message ||
        "El servidor no pudo generar la imagen."
      );
    }

    const generatedImage =
      data.imageUrl ||
      data.url;

    if (!generatedImage) {
      console.error(
        "Respuesta JSON sin imageUrl:",
        data
      );

      throw new Error(
        "El servidor respondió correctamente, pero no envió imageUrl."
      );
    }

    image.onload = () => {
      box.classList.add("show");

      status.textContent =
        "Listo. Esta es una visualización aproximada de tu ramo.";
    };

    image.onerror = () => {
      throw new Error(
        "La imagen fue generada, pero el navegador no pudo mostrarla."
      );
    };

    image.src = generatedImage;

  } catch (error) {
    console.error(
      "Error generando preview:",
      error
    );

    status.textContent =
      "No se pudo generar la visualización.";

    alert(
      error.message ||
      "Ocurrió un error al generar el ramo."
    );

  } finally {
    button.disabled = false;
    button.classList.remove("is-loading");
    button.textContent =
      "Generar visualización IA";
  }
}
    button.disabled = false;

    button.textContent =
      "Generar visualización IA";
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {
    renderFlowers();
    renderSummary();

    on(
      "#clearBouquet",
      "click",
      () => {
        bouquet = [];
        renderSummary();

        const status =
          $("#previewStatus");

        const box =
          $("#previewBox");

        const image =
          $("#previewImg");

        if (status) {
          status.textContent =
            "Aún no generas una vista previa.";
        }

        box?.classList.remove("show");
        image?.removeAttribute("src");
      }
    );

    on(
      "#sendBouquet",
      "click",
      sendBouquet
    );

    on(
      "#previewBouquet",
      "click",
      generatePreview
    );
  }
);