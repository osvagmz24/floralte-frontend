"use strict";const flowers=[
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
];let bouquet=[];
function renderFlowers(){$('#flowersGrid').innerHTML=flowers.map(f=>{const opts=f.colors.length?f.colors.map(c=>`<option>${esc(c)}</option>`).join(''):'<option>Natural</option>';return `<article class="flower-card"><div class="flower-head"><img src="${esc(f.img)}" alt="${esc(f.name)}"><div><div class="flower-name">${esc(f.name)}</div><div class="flower-price">${money(f.price)} por tallo</div></div></div><div class="flower-controls"><select class="field" data-color="${f.id}">${opts}</select><input class="field" data-qty="${f.id}" type="number" min="1" value="1"><button class="flower-add" data-flower="${f.id}">Agregar</button></div></article>`}).join('');$$('[data-flower]').forEach(b=>on(b,'click',()=>{const f=flowers.find(x=>x.id===b.dataset.flower),color=$(`[data-color="${f.id}"]`).value,qty=Math.max(1,Number($(`[data-qty="${f.id}"]`).value||1));const existing=bouquet.find(x=>x.id===f.id&&x.color===color);if(existing)existing.qty+=qty;else bouquet.push({...f,color,qty});renderSummary()}))}
function renderSummary(){const h=$('#summaryList');if(!bouquet.length)h.innerHTML='<div class="empty">Todavía no agregas flores.</div>';else h.innerHTML=bouquet.map((x,i)=>`<div class="summary-row"><div><strong>${esc(x.name)}</strong><small>${esc(x.color)} · ${x.qty} tallos</small></div><button class="remove" data-remove="${i}">Quitar</button></div>`).join('');$('#summaryTotal').textContent=money(bouquet.reduce((s,x)=>s+x.price*x.qty,0));$$('[data-remove]',h).forEach(b=>on(b,'click',()=>{bouquet.splice(Number(b.dataset.remove),1);renderSummary()}))}
function send(){
  if(!bouquet.length) return alert('Agrega flores primero.');
  let m=`Hola Floralte, quiero cotizar este ramo personalizado:

${bouquet.map(x=>`- ${x.qty} × ${x.name} (${x.color})`).join('\n')}`;
  m+=`

Total aproximado: ${money(bouquet.reduce((s,x)=>s+x.price*x.qty,0))}`;
  whatsapp(m);
}
document.addEventListener('DOMContentLoaded',()=>{renderFlowers();renderSummary();on('#clearBouquet','click',()=>{bouquet=[];renderSummary()});on('#sendBouquet','click',send)});
