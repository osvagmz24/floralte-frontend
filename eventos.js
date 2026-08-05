"use strict";const eventServices=[
      {name:"Peceritas con vela",note:"Centro de mesa en pecera con vela."},
      {name:"Florero grande con vela",note:"Florero alto con vela decorativa."},
      {name:"Kit ramo de novia",note:"Ramo de novia y posibles extras según paquete."},
      {name:"Centros de mesa redonda",note:"Centros para mesas redondas."},
      {name:"Centros de mesa rectangular",note:"Centros para mesas rectangulares."},
      {name:"Floreros para mesa",note:"Florero sencillo con flor de temporada."},
      {name:"Estructuras para back de novios",note:"Estructura base para decoración del back."},
      {name:"Arreglo para mesa de novios",note:"Arreglo frontal o central para mesa principal."},
      {name:"Decoración de fuente",note:"Decoración para fuente, si existe en el lugar."},
      {name:"Decoración aérea",note:"Instalación aérea según viabilidad del lugar."},
      {name:"Decoración de entrada",note:"Arco, bienvenida o pasillo."},
      {name:"Transporte",note:"Se cobra según ubicación."}
];document.addEventListener('DOMContentLoaded',()=>{$('#services').innerHTML=eventServices.map(s=>`<label class="service"><input type="checkbox" value="${esc(s.name)}"><span><strong>${esc(s.name)}</strong><small>${esc(s.note)}</small></span></label>`).join('');on('#sendEvent','click',()=>{const selected=$$('#services input:checked').map(x=>x.value);let m=`Hola Floralte, quiero cotizar un evento.

Tipo: ${$('#eTipo').value}
Fecha: ${$('#eFecha').value||'Por definir'}
Mesas: ${$('#eMesas').value}
Personas: ${$('#ePersonas').value}
Lugar: ${$('#eLugar').value||'Por definir'}

Servicios:
${selected.length?selected.map(x=>'- '+x).join('\n'):'- Por definir'}`;if($('#eNotas').value)m+=`

Notas: ${$('#eNotas').value}`;whatsapp(m)});on('#sendGarden','click',()=>whatsapp(`Hola Floralte, quiero cotizar jardinería.

Servicio: ${$('#jTipo').value}
Ubicación: ${$('#jLugar').value||'Por definir'}
Detalles: ${$('#jNotas').value||'Por definir'}`))});
