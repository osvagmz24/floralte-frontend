"use strict";const catalog=[
      {
        id:"ramos",
        name:"Ramos",
        img:"images/categoria-ramos.jpg",
        description:"Diseños ligeros, elegantes y listos para regalar.",
        glow:"linear-gradient(135deg,#ffd5e4,#ee4f89)",
        subcategories:[
          {
            id:"ramos-clasicos",
            name:"Clásicos",
            img:"images/subcategoria-ramos-clasicos.jpg",
            description:"Composiciones delicadas con una estética atemporal.",
            products:[
              {id:"requiem",name:"Requiem",price:2500,img:"images/ram1.jpg",desc:"Tonos lila y rosa con empaque premium y listón."},
              {id:"sweet-pink",name:"Sweet Pink",price:1500,img:"images/ram2.jpg",desc:"Gerberas rosas con toques blancos, dulce y elegante."},
              {id:"pilar-autumn",name:"Pillar of Autumn",price:1000,img:"images/ram3.jpg",desc:"Rosas intensas y acentos púrpura de gran presencia."},
              {id:"blossom-mist",name:"Blossom Mist",price:850,img:"images/ram4.jpg",desc:"Diseño de una vista en tonos rosa, sutil y moderno."},
              {id:"rosa-serena",name:"Rosa Serena",price:1250,img:"images/arr5.jpg",desc:"Flores de temporada en una combinación suave y romántica."}
            ]
          },
          {
            id:"ramos-premium",
            name:"Premium",
            img:"images/subcategoria-ramos-premium.jpg",
            description:"Volumen, flores selectas y acabados de mayor impacto.",
            products:[
              {id:"purple-mayhem-ramo",name:"Purple Mayhem",price:4200,img:"images/arr3.jpg",desc:"Una declaración en tonos púrpura con acabado editorial."},
              {id:"imperial-bouquet",name:"Imperial Bouquet",price:4500,img:"images/arr4.jpg",desc:"Rosas seleccionadas con una composición abundante."},
              {id:"wild-lux-bouquet",name:"Wild Luxury",price:2850,img:"images/arr6.jpg",desc:"Mezcla artística de color, movimiento y textura."},
              {id:"velvet-rose",name:"Velvet Rose",price:3200,img:"images/ram1.jpg",desc:"Rosas profundas con detalles en tonos suaves y listón satinado."},
              {id:"lila-couture",name:"Lila Couture",price:3600,img:"images/ram2.jpg",desc:"Diseño premium en rosa y lila con envoltura de autor."}
            ]
          }
        ]
      },
      {
        id:"arreglos",
        name:"Arreglos",
        img:"images/categoria-arreglos.jpg",
        description:"Composiciones con base, volumen y presencia escultural.",
        glow:"linear-gradient(135deg,#ffe3bd,#ff7aa9)",
        subcategories:[
          {
            id:"cajas-florales",
            name:"Cajas florales",
            img:"images/subcategoria-cajas-florales.jpg",
            description:"Flores presentadas en cajas, bases y recipientes elegantes.",
            products:[
              {id:"lovely-heart-200",name:"Lovely Heart 200",price:9500,img:"images/arr1.jpg",desc:"Corazón con 200 rosas sobre base de madera."},
              {id:"sunshine",name:"Sunshine",price:2600,img:"images/arr2.jpg",desc:"Girasoles y rosas en una composición luminosa."},
              {id:"purple-mayhem",name:"Purple Mayhem",price:4200,img:"images/arr3.jpg",desc:"Arreglo definitivo en tonos púrpura."},
              {id:"imperial-100",name:"Imperial 100",price:4500,img:"images/arr4.jpg",desc:"Cien rosas sobre una elegante base de cerámica."},
              {id:"wild-mix",name:"Wild Mix",price:1900,img:"images/arr5.jpg",desc:"Mezcla vibrante sobre base de madera para cualquier ocasión."}
            ]
          },
          {
            id:"disenos-especiales",
            name:"Diseños especiales",
            img:"images/subcategoria-disenos-especiales.jpg",
            description:"Piezas de autor creadas para sorprender y destacar.",
            products:[
              {id:"wild-mix-luxury",name:"Wild Mix Luxury",price:2850,img:"images/arr6.jpg",desc:"Color, textura y volumen en una composición de lujo."},
              {id:"orchid-cloud",name:"Orchid Cloud",price:3900,img:"images/arr3.jpg",desc:"Orquídeas y flores suaves en una nube floral etérea."},
              {id:"rose-sculpture",name:"Rose Sculpture",price:5200,img:"images/arr4.jpg",desc:"Diseño geométrico de rosas con impacto visual."},
              {id:"golden-garden",name:"Golden Garden",price:3100,img:"images/arr2.jpg",desc:"Girasoles y tonos cálidos con acabado contemporáneo."},
              {id:"heart-signature",name:"Heart Signature",price:6800,img:"images/arr1.jpg",desc:"Corazón floral personalizado para una fecha inolvidable."}
            ]
          }
        ]
      },
      {
        id:"momentos",
        name:"Momentos",
        img:"images/categoria-momentos.jpg",
        description:"Selecciones pensadas para cada historia y celebración.",
        glow:"linear-gradient(135deg,#e8d9ff,#ff7caf)",
        subcategories:[
          {
            id:"amor-aniversario",
            name:"Amor y aniversario",
            img:"images/subcategoria-amor-aniversario.jpg",
            description:"Diseños románticos para decir mucho sin tantas palabras.",
            products:[
              {id:"amor-infinito",name:"Amor Infinito",price:4800,img:"images/arr1.jpg",desc:"Corazón de rosas para aniversarios y declaraciones."},
              {id:"primer-beso",name:"Primer Beso",price:1650,img:"images/ram2.jpg",desc:"Ramo suave y femenino con detalles blancos."},
              {id:"cien-razones",name:"Cien Razones",price:4500,img:"images/arr4.jpg",desc:"Cien rosas para celebrar una historia extraordinaria."},
              {id:"promesa",name:"Promesa",price:2950,img:"images/arr6.jpg",desc:"Flores de tonos intensos con una estética sofisticada."},
              {id:"siempre-tu",name:"Siempre Tú",price:2350,img:"images/ram1.jpg",desc:"Ramo lila y rosa con una presentación premium."}
            ]
          },
          {
            id:"celebraciones",
            name:"Celebraciones",
            img:"images/subcategoria-celebraciones.jpg",
            description:"Cumpleaños, graduaciones y momentos que merecen flores.",
            products:[
              {id:"dia-radiante",name:"Día Radiante",price:2600,img:"images/arr2.jpg",desc:"Girasoles y rosas para llenar de energía cualquier celebración."},
              {id:"felicidades",name:"Felicidades",price:1900,img:"images/arr5.jpg",desc:"Mezcla alegre de flores en base de madera."},
              {id:"nuevo-comienzo",name:"Nuevo Comienzo",price:1450,img:"images/ram3.jpg",desc:"Tonos vivos para graduaciones, logros y nuevos proyectos."},
              {id:"brindis-rosa",name:"Brindis Rosa",price:1350,img:"images/ram4.jpg",desc:"Ramo rosa de una vista, ideal para cumpleaños."},
              {id:"gran-noche",name:"Gran Noche",price:4200,img:"images/arr3.jpg",desc:"Púrpura profundo y gran volumen para una ocasión especial."}
            ]
          }
        ]
      }
];
const products=catalog.flatMap(c=>c.subcategories.flatMap(s=>s.products.map(p=>({...p,category:c.name,categoryId:c.id,subcategory:s.name,subcategoryId:s.id}))));
let state={level:'categories',categoryId:null,subcategoryId:null};let activeProduct=null;
function imageHTML(src,alt){return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.parentElement.classList.add('missing-photo');this.remove()">`}
function renderChips(){const h=$('#catalogChips');h.innerHTML=`<button class="catalog-chip ${state.level==='categories'?'active':''}" data-cat="all">Todas</button>`+catalog.map(c=>`<button class="catalog-chip ${state.categoryId===c.id?'active':''}" data-cat="${c.id}">${esc(c.name)}</button>`).join('');$$('[data-cat]',h).forEach(b=>on(b,'click',()=>{if(b.dataset.cat==='all')state={level:'categories',categoryId:null,subcategoryId:null};else state={level:'subcategories',categoryId:b.dataset.cat,subcategoryId:null};render()}))}
function render(){renderChips();const v=$('#catalogView'),back=$('#catalogBack'),path=$('#catalogPath');if(state.level==='categories'){path.innerHTML='<strong>Catálogo</strong><span>›</span><span>Elige una categoría</span>';back.classList.remove('visible');v.innerHTML=`<div class="category-grid">${catalog.map((c,i)=>`<button class="photo-card" data-category="${c.id}">${imageHTML(c.img,c.name)}<span class="photo-shade"></span><span class="photo-copy"><span class="index">Categoría ${String(i+1).padStart(2,'0')}</span><span><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p><span class="photo-enter"><span>Explorar categoría</span><span>→</span></span></span></span></button>`).join('')}</div>`;$$('[data-category]',v).forEach(b=>on(b,'click',()=>{state={level:'subcategories',categoryId:b.dataset.category,subcategoryId:null};render()}))}else if(state.level==='subcategories'){const c=catalog.find(x=>x.id===state.categoryId);path.innerHTML=`<strong>Catálogo</strong><span>›</span><span>${esc(c.name)}</span>`;back.classList.add('visible');v.innerHTML=`<div class="subcategory-grid">${c.subcategories.map((s,i)=>`<button class="photo-card" data-sub="${s.id}">${imageHTML(s.img,s.name)}<span class="photo-shade"></span><span class="photo-copy"><span class="index">Colección ${String(i+1).padStart(2,'0')}</span><span><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><span class="photo-enter"><span>Ver productos</span><span>→</span></span></span></span></button>`).join('')}</div>`;$$('[data-sub]',v).forEach(b=>on(b,'click',()=>{state.level='products';state.subcategoryId=b.dataset.sub;render()}))}else{const c=catalog.find(x=>x.id===state.categoryId),s=c.subcategories.find(x=>x.id===state.subcategoryId);path.innerHTML=`<strong>Catálogo</strong><span>›</span><span>${esc(c.name)}</span><span>›</span><span>${esc(s.name)}</span>`;back.classList.add('visible');v.innerHTML=`<div class="products-grid">${s.products.map(p=>`<article class="product-card" data-product="${p.id}"><div class="product-media">${imageHTML(p.img,p.name)}</div><div class="product-body"><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">+</button></div></div></article>`).join('')}</div>`;$$('[data-product]',v).forEach(card=>on(card,'click',e=>{if(e.target.closest('[data-add]'))return;openProduct(card.dataset.product)}));$$('[data-add]',v).forEach(b=>on(b,'click',e=>{e.stopPropagation();addCart(b.dataset.add,1)}))}}
function goBack(){if(state.level==='products')state={...state,level:'subcategories',subcategoryId:null};else state={level:'categories',categoryId:null,subcategoryId:null};render()}
function openProduct(id){activeProduct=products.find(p=>p.id===id);$('#modalImg').src=activeProduct.img;$('#modalCategory').textContent=`${activeProduct.category} · ${activeProduct.subcategory}`;$('#modalName').textContent=activeProduct.name;$('#modalDesc').textContent=activeProduct.desc;$('#modalPrice').textContent=money(activeProduct.price);$('#modalQty').value=1;$('#productBackdrop').classList.add('show');document.body.classList.add('locked')}function closeProduct(){$('#productBackdrop').classList.remove('show');document.body.classList.remove('locked')}
function addCart(id,q){const p=products.find(x=>x.id===id),d=cartData();d[id]={...p,quantity:Number(d[id]?.quantity||0)+Number(q||1)};saveCart(d);renderCart();openCart()}function renderCart(){const d=cartData(),items=Object.values(d),h=$('#cartItems');if(!items.length)h.innerHTML='<div class="empty">Tu carrito está vacío.</div>';else h.innerHTML=items.map(x=>`<div class="cart-item"><div><strong>${esc(x.name)}</strong><small>${x.quantity} × ${money(x.price)}</small></div><button class="remove" data-remove="${x.id}">Quitar</button></div>`).join('');$('#cartTotal').textContent=money(items.reduce((s,x)=>s+x.price*x.quantity,0));$$('[data-remove]',h).forEach(b=>on(b,'click',()=>{const d=cartData();delete d[b.dataset.remove];saveCart(d);renderCart()}))}function openCart(){renderCart();$('#cartBackdrop').classList.add('show');$('#cartDrawer').classList.add('show');document.body.classList.add('locked')}function closeCart(){$('#cartBackdrop').classList.remove('show');$('#cartDrawer').classList.remove('show');document.body.classList.remove('locked')}function sendCart(){
  const items=Object.values(cartData());
  if(!items.length) return alert('Tu carrito está vacío.');
  let m=`Hola Floralte, quiero pedir:

${items.map(x=>`- ${x.quantity} × ${x.name} — ${money(x.price*x.quantity)}`).join('\n')}`;
  m+=`

Total aproximado: ${money(items.reduce((s,x)=>s+x.price*x.quantity,0))}`;
  whatsapp(m);
}
document.addEventListener('DOMContentLoaded',()=>{render();on('#catalogBack','click',goBack);on('#closeProduct','click',closeProduct);on('#productBackdrop','click',e=>{if(e.target===e.currentTarget)closeProduct()});on('#modalAdd','click',()=>{addCart(activeProduct.id,Number($('#modalQty').value||1));closeProduct()});on('#closeCart','click',closeCart);on('#cartBackdrop','click',closeCart);on('#sendCart','click',sendCart)});
