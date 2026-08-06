"use strict";

const flowers = [
  {id:"rosa",name:"Rosa",price:50,colors:["Roja","Rosa","Blanca","Amarilla","Naranja","Lila"],img:"images/rosroj.jpg",images:{Roja:"images/rosroj.jpg",Rosa:"images/rosros.jpg",Blanca:"images/rosblan.jpg",Amarilla:"images/rosam.jpg",Naranja:"images/rosnar.gif",Lila:"images/roslil.png"}},
  {id:"rosaPremium",name:"Rosa Premium",price:70,colors:["Acapella"],img:"images/rosac.jpg"},
  {id:"girasol",name:"Girasol",price:40,colors:[],img:"images/gir.jpg"},
  {id:"lili",name:"Lili",price:70,colors:[],img:"images/lil.jpg"},
  {id:"gerbera",name:"Gerbera",price:50,colors:["Rosa","Roja","Naranja","Amarilla","Blanca"],img:"images/gerros.jpg",images:{Roja:"images/gerroj.jpg",Rosa:"images/gerros.jpg",Blanca:"images/gerblan.jpg",Amarilla:"images/gerama.jpg",Naranja:"images/gernar.jpg"}},
  {id:"dendrobium",name:"Orquídea Dendrobium",price:80,colors:["Blanco","Morado"],img:"images/deblan.jpg",images:{Blanco:"images/deblan.jpg",Morado:"images/demor.jpg"}},
  {id:"cymbidium",name:"Orquídea Cymbidium",price:700,colors:["Amarillo","Blanco"],img:"images/cymama.jpg",images:{Blanco:"images/cymblan.jpg",Amarillo:"images/cymama.jpg"}},
  {id:"margarita",name:"Margaritas",price:15,colors:["Blanco","Amarillo","Lila","Naranja"],img:"images/marblan.jpg",images:{Blanco:"images/marblan.jpg",Amarillo:"images/marama.jpg",Lila:"images/marlila.jpg",Naranja:"images/marnar.jpg"}},
  {id:"astromelia",name:"Astromelia",price:15,colors:["Morado","Blanco","Rosa"],img:"images/asmor.jpg",images:{Morado:"images/asmor.jpg",Blanco:"images/asblan.jpg",Rosa:"images/asros.jpg"}},
  {id:"clavel",name:"Clavel",price:20,colors:["Rojo","Rosa","Blanco"],img:"images/claroj.jpg",images:{Rojo:"images/claroj.jpg",Rosa:"images/claros.jpg",Blanco:"images/clablan.jpg"}},
  {id:"babyrose",name:"Baby Rose",price:50,colors:["Rosa","Blanco","Rojo","Amarillo","Lila"],img:"images/babros.jpg",images:{Rosa:"images/babros.jpg",Blanco:"images/bablan.jpg",Rojo:"images/babroj.jpg",Amarillo:"images/babama.jpg",Lila:"images/bablila.jpg"}},
  {id:"craspedia",name:"Craspedia",price:80,colors:[],img:"images/crasp.jpg"},
  {id:"eryngium",name:"Eryngium",price:40,colors:[],img:"images/eryn.gif"},
  {id:"hypericum",name:"Hypericum",price:40,colors:[],img:"images/hype.gif"},
  {id:"ornithogalum",name:"Ornithogalum",price:100,colors:[],img:"images/orni.png"},
  {id:"snapdragon",name:"Snapdragon",price:30,colors:["Rosa","Blanco","Lila"],img:"images/snaros.gif",images:{Rosa:"images/snaros.gif",Blanco:"images/snablan.gif",Lila:"images/snalila.gif"}},
  {id:"hortensia",name:"Hortensia",price:250,colors:["Azul","Tinto","Lila","Rosa"],img:"images/horazul.jpg",images:{Azul:"images/horazul.jpg",Tinto:"images/hortin.jpg",Lila:"images/horlila.jpg",Rosa:"images/horros.jpg"}},
  {id:"lisianthus",name:"Lisianthus",price:90,colors:["Bicolor","Rosa","Morado","Blanco"],img:"images/libi.png",images:{Bicolor:"images/libi.png",Rosa:"images/liros.png",Morado:"images/limor.png",Blanco:"images/liblan.png"}},
  {id:"protea",name:"Protea",price:900,colors:["Rosa","Blanca"],img:"images/proros.gif",images:{Rosa:"images/proros.gif",Blanca:"images/problan.jpg"}}
];

let bouquet = [];

function renderFlowers(){
  $("#flowersGrid").innerHTML = flowers.map(flower => {
    const colorOptions = flower.colors.length
      ? flower.colors.map(color => `<option>${esc(color)}</option>`).join("")
      : `<option>Natural</option>`;

    return `
      <article class="flower-card">
        <div class="flower-head">
          <img src="${esc(flower.img)}" alt="${esc(flower.name)}">
          <div>
            <div class="flower-name">${esc(flower.name)}</div>
            <div class="flower-price">${money(flower.price)} por tallo</div>
          </div>
        </div>

        <div class="flower-controls">
          <select class="field" data-color="${flower.id}">
            ${colorOptions}
          </select>

          <input class="field" data-qty="${flower.id}" type="number" min="1" value="1">

          <button class="flower-add" data-flower="${flower.id}" type="button">
            Agregar
          </button>
        </div>
      </article>
    `;
  }).join("");

  $$("[data-flower]").forEach(button => {
    on(button, "click", () => {
      const flower = flowers.find(item => item.id === button.dataset.flower);
      const color = $(`[data-color="${flower.id}"]`).value;
      const qty = Math.max(1, Number($(`[data-qty="${flower.id}"]`).value || 1));

      const existing = bouquet.find(item => item.id === flower.id && item.color === color);

      if(existing){
        existing.qty += qty;
      } else {
        bouquet.push({ ...flower, color, qty });
      }

      renderSummary();
    });
  });
}

function renderSummary(){
  const host = $("#summaryList");

  if(!bouquet.length){
    host.innerHTML = `<div class="empty">Todavía no agregas flores.</div>`;
  } else {
    host.innerHTML = bouquet.map((item, index) => `
      <div class="summary-row">
        <div>
          <strong>${esc(item.name)}</strong>
          <small>${esc(item.color)} · ${item.qty} tallos</small>
        </div>
        <button class="remove" data-remove="${index}" type="button">Quitar</button>
      </div>
    `).join("");
  }

  $("#summaryTotal").textContent = money(
    bouquet.reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  $$("[data-remove]", host).forEach(button => {
    on(button, "click", () => {
      bouquet.splice(Number(button.dataset.remove), 1);
      renderSummary();
    });
  });
}

function sendBouquet(){
  if(!bouquet.length){
    alert("Agrega flores primero.");
    return;
  }

  let message = `Hola Floralte, quiero cotizar este ramo personalizado:\n\n`;
  message += bouquet.map(item => `- ${item.qty} × ${item.name} (${item.color})`).join("\n");
  message += `\n\nTotal aproximado: ${money(bouquet.reduce((sum, item) => sum + item.price * item.qty, 0))}`;

  whatsapp(message);
}

async function generatePreview(){
  if(!bouquet.length){
    alert("Agrega flores primero.");
    return;
  }

  const button = $("#previewBouquet");
  const status = $("#previewStatus");
  const box = $("#previewBox");
  const image = $("#previewImg");

  button.classList.add("is-loading");
  button.disabled = true;
  button.textContent = "Generando visualización...";
  status.textContent = "Estamos creando tu preview con IA...";
  box.classList.remove("show");
  image.removeAttribute("src");

  try{
    const response = await fetch("/api/ramo-preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bouquet: bouquet.map(item => ({
          id: item.id,
          name: item.name,
          color: item.color,
          qty: item.qty
        }))
      })
    });

    const data = await response.json();

    if(!response.ok){
      throw new Error(data.error || "No se pudo generar la visualización.");
    }

    if(!data.imageUrl){
      throw new Error("La API no devolvió imagen.");
    }

    image.src = data.imageUrl;
    box.classList.add("show");
    status.textContent = "Listo. Esta es una visualización aproximada de tu ramo.";
  } catch(error){
    console.error(error);
    status.textContent = "No se pudo generar la visualización IA.";
    alert(error.message || "No se pudo generar la visualización.");
  } finally {
    button.classList.remove("is-loading");
    button.disabled = false;
    button.textContent = "Generar visualización IA";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderFlowers();
  renderSummary();

  on("#clearBouquet", "click", () => {
    bouquet = [];
    renderSummary();
    $("#previewStatus").textContent = "Aún no generas una vista previa.";
    $("#previewBox").classList.remove("show");
    $("#previewImg").removeAttribute("src");
  });

  on("#sendBouquet", "click", sendBouquet);
  on("#previewBouquet", "click", generatePreview);
});