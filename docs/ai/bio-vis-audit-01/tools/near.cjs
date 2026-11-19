const fs=require('node:fs'),path=require('node:path'),{chromium,webkit}=require('playwright'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'..'),d=JSON.parse(fs.readFileSync(path.join(dir,'data/near-states.json')));
(async()=>{for(const engine of[chromium,webkit]){const b=await engine.launch();try{const p=await b.newPage({viewport:{width:1200,height:900}});await p.setContent('<!doctype html><body></body>');const results=await p.evaluate(async d=>{
 const canvas=document.createElement('canvas');canvas.width=480;canvas.height=710;const ctx=canvas.getContext('2d'),map={};
 const hair='[data-layer=rear],[data-layer=back],[data-layer=volume],[data-layer=front],[data-layer=sides],[data-layer=texture],[data-layer=lengths]';
 for(const e of d.entries){
  const svg=new DOMParser().parseFromString(e.svg,'image/svg+xml').documentElement;svg.querySelectorAll('[data-layer^=accessories],[data-layer=color]').forEach(e=>e.remove());
  for(const el of svg.querySelectorAll('path,circle,ellipse,rect,polygon,polyline,line')){
   if(el.closest('defs'))continue;const inHair=el.closest(hair),filled=el.getAttribute('fill')!=='none';
   if(inHair&&(el.closest('[data-layer=texture]')||!filled)){el.remove();continue;}
   if(filled)el.setAttribute('fill',inHair?'#000':'#fff');if(el.hasAttribute('stroke')&&el.getAttribute('stroke')!=='none')el.setAttribute('stroke',inHair?'#000':'#fff');el.removeAttribute('opacity');
  }
  const img=new Image();img.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))));await img.decode();ctx.fillStyle='#fff';ctx.fillRect(0,0,480,710);ctx.drawImage(img,0,0,480,710);const pix=ctx.getImageData(0,0,480,710).data,mask=new Uint8Array(480*710);let area=0;for(let i=0;i<mask.length;i++){mask[i]=pix[i*4]<128?1:0;area+=mask[i];}map[e.key+'-'+e.state]={mask,area};
 }
 return d.pairs.map(([a,b])=>({a,b,states:d.states.map((s,i)=>{const aa=map[a+'-'+i],bb=map[b+'-'+i];let intersection=0;for(let j=0;j<aa.mask.length;j++)intersection+=aa.mask[j]&bb.mask[j];return{name:s.name,iou:intersection/(aa.area+bb.area-intersection)}})}));
 },d);fs.writeFileSync(path.join(dir,'data/near-'+engine.name()+'.json'),JSON.stringify(results,null,2)+'\n');
 console.log(engine.name(),JSON.stringify(results.map(r=>({pair:r.a+'/'+r.b,min:Math.min(...r.states.map(s=>s.iou)),max:Math.max(...r.states.map(s=>s.iou)),priority:r.states[1].iou}))));
 if(engine===chromium){let html='<!doctype html><html lang="fr"><meta charset="utf-8"><style>body{font:14px system-ui;width:1100px;padding:24px;color:#352b21;background:white}h1,h2{font-family:Georgia}section{margin:25px 0;border-top:1px solid #ccc}.row{display:grid;grid-template-columns:1fr 1fr}svg{width:100%;height:370px}article{border:1px solid #ddd;padding:12px}h3,p{margin:8px}h3{font-size:14px}</style><h1>Quatre rapprochements, deux têtes par paire</h1><p>État neutre puis cas iPad combiné. Même personnage et même morphologie dans chaque ligne ; cheveux monochromes sans accessoires. Les nombres IoU servent d’indices géométriques, pas de verdict artistique.</p>';
 for(const [a,b]of d.pairs)for(const state of[0,1])html+=`<section><h2>${a} / ${b} · ${d.states[state].name}</h2><div class="row">${[a,b].map(key=>`<article><h3>${key}</h3>${d.entries.find(e=>e.key===key&&e.state===state).svg}</article>`).join('')}</div></section>`;
 html+='</html>';await p.setContent(html);await p.evaluate(()=>{for(const svg of document.querySelectorAll('svg'))for(const e of svg.querySelectorAll('path,circle,ellipse'))if(e.closest('[data-layer=rear],[data-layer=back],[data-layer=volume],[data-layer=front],[data-layer=sides],[data-layer=texture],[data-layer=lengths]')){if(e.getAttribute('fill')!=='none')e.setAttribute('fill','#9d7b47');if(e.hasAttribute('stroke')&&e.getAttribute('stroke')!=='none')e.setAttribute('stroke','#4c3822');e.removeAttribute('opacity');}});fs.writeFileSync(path.join(dir,'planches/quasi-doublons.html'),await p.content());await p.screenshot({path:path.join(dir,'planches/quasi-doublons.png'),fullPage:true});
 // Native vector export of the controlled full catalogue: no screenshot-based tracing.
 await p.goto('file://'+path.join(dir,'planches/planche-generale.html'));const svg=await p.evaluate(()=>{
 const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;'),height=document.documentElement.scrollHeight;
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}"><rect width="1200" height="${height}" fill="white"/>`;
 for(const e of document.querySelectorAll('h1,h2,h3,article>p')){const r=e.getBoundingClientRect(),size=e.tagName==='H1'?28:e.tagName==='H2'?21:e.tagName==='H3'?11:9,words=['H1','H2'].includes(e.tagName)?[e.textContent]:(e.textContent.match(/.{1,39}(?:\s|$)|\S+/g)||[]);out+=`<text x="${r.x}" y="${r.y+size}" fill="#352b21" font-family="sans-serif" font-size="${size}">${words.map((s,i)=>`<tspan x="${r.x}" dy="${i?size*1.18:0}">${esc(s)}</tspan>`).join('')}</text>`;}
 for(const e of document.querySelectorAll('article>svg')){const r=e.getBoundingClientRect();out+=e.outerHTML.replace('<svg ',`<svg x="${r.x}" y="${r.y}" width="${r.width}" height="${r.height}" `);}
 return out+'</svg>';
 });fs.writeFileSync(path.join(dir,'planches/planche-generale.svg'),svg);
 }
 }finally{await b.close()}}})().catch(e=>{console.error(e);process.exitCode=1});
