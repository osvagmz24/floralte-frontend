
"use strict";
const WHATSAPP_NUMBER="523336611674";
const $=(q,s=document)=>s.querySelector(q);const $$=(q,s=document)=>Array.from(s.querySelectorAll(q));
const money=n=>new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(Number(n||0));
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[c]);
const on=(el,e,fn,o)=>{el=typeof el==="string"?$(el):el;if(el)el.addEventListener(e,fn,o)};
function whatsapp(text){window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer")}
const navItems=[
  ["catalogo.html","Catálogo","Explora todos los diseños","01"],
  ["arma-tu-ramo.html","Arma tu Ramo","Crea una combinación personalizada","02"],
  ["eventos.html","Cotiza tu evento Floralte","Bodas, celebraciones y montajes","03"],
  ["sobre-nosotros.html","Sobre nosotros","Conoce nuestra historia y esencia","04"],
  ["contacto.html","Contacto","Haz un pedido o solicita información","05"],
  ["visitanos.html","Visítanos","Ubicación, mapa y florería","06"]
];
function splash(){const s=$("#splash");setTimeout(()=>s?.classList.add("hide"),600);setTimeout(()=>s?.remove(),1300)}
function ambience(){const a=$(".ambient");if(!a||matchMedia("(prefers-reduced-motion:reduce)").matches)return;for(let i=0;i<11;i++){const p=document.createElement("i");p.style.left=`${Math.random()*100}vw`;p.style.animationDuration=`${12+Math.random()*10}s`;p.style.animationDelay=`${-Math.random()*13}s`;p.style.opacity=.35+Math.random()*.5;a.appendChild(p)}}
function logoFallbacks(){$$("img[data-logo]").forEach(img=>on(img,"error",()=>{img.style.opacity=".18";img.alt="Agrega images/logo-floralte.png"}))}
function addRipple(card,event){const r=document.createElement("i");r.className="ripple";const b=card.getBoundingClientRect();r.style.left=`${event.clientX-b.left}px`;r.style.top=`${event.clientY-b.top}px`;card.appendChild(r);setTimeout(()=>r.remove(),800)}
function addCardEffects(scope=document){$$('.portal-card,.quick-card',scope).forEach(card=>{on(card,'pointermove',e=>{if(matchMedia('(pointer:coarse)').matches)return;const b=card.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;card.style.transform=`translateY(-9px) rotateX(${-y*5}deg) rotateY(${x*6}deg)`});on(card,'pointerleave',()=>card.style.transform='');on(card,'pointerdown',e=>addRipple(card,e))})}
function renderQuickMenu(){const host=$("#quickGrid");if(!host)return;const current=document.body.dataset.page;host.innerHTML=navItems.map(([href,title,desc,num])=>`<a class="quick-card ${current===href?'active':''}" href="${href}"><span class="num">${num}</span><strong>${title}</strong><small>${desc}</small></a>`).join('');addCardEffects(host)}
function openQuick(){const q=$("#quickNav");q?.classList.add('show');document.body.classList.add('locked')}function closeQuick(){const q=$("#quickNav");q?.classList.remove('show');document.body.classList.remove('locked')}
function initQuick(){renderQuickMenu();on('#quickLauncher','click',openQuick);on('#closeQuick','click',closeQuick);on('#quickNav','click',e=>{if(e.target===e.currentTarget)closeQuick()})}
function reveal(){const els=$$('.reveal');if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('on'));return}const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('on');io.unobserve(x.target)}}),{threshold:.08});els.forEach(e=>io.observe(e))}
function cartData(){try{return JSON.parse(localStorage.getItem('floralteCart')||'{}')}catch{return {}}}function saveCart(data){localStorage.setItem('floralteCart',JSON.stringify(data));syncCartBadge()}function syncCartBadge(){const b=$('#cartCount');if(!b)return;const n=Object.values(cartData()).reduce((s,x)=>s+Number(x.quantity||0),0);b.textContent=n}
function baseLayout(){splash();ambience();logoFallbacks();initQuick();reveal();syncCartBadge();on('#headerWA','click',()=>whatsapp('Hola Floralte, quiero información.'));on('#footerYear','click',()=>{});const y=$('#year');if(y)y.textContent=new Date().getFullYear();document.addEventListener('keydown',e=>{if(e.key==='Escape')closeQuick()})}
document.addEventListener('DOMContentLoaded',baseLayout);
