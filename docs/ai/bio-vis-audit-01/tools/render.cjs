// Isolated renderer/measurement tool. No runtime or save is written.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const dir=path.resolve(__dirname,'..'),root=path.resolve(dir,'../../..'),data=JSON.parse(fs.readFileSync(path.join(dir,'data/generated.json')));
(async()=>{
 const {families,minorPairs}=await import('./annotations.mjs');
 const groupFor=e=>data.groups.find(g=>g.includes(e.key));
 const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
 const card=e=>`<article data-key="${e.key}"><h3>${e.key} · ${esc(e.name)}</h3>${e.svg}<p>${e.status==='unknown'?'CHEVEUX INCONNUS · support seul':e.status==='partial'?'FRAGMENTS OBSERVÉS · implantation cachée inconnue':groupFor(e).length>1?'Groupe technique : '+groupFor(e).join(' / '):'Géométrie technique distincte'}</p></article>`;
 const style=`body{font:14px system-ui,sans-serif;color:#352b21;background:#fff;margin:0;padding:24px;width:1200px;box-sizing:border-box}h1{font:30px Georgia;margin:0 0 10px}h2{font:23px Georgia;margin:24px 0 12px}h3{font-size:12px;min-height:32px;margin:8px 0 0}p{font-size:12px;line-height:1.5}.cards{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}article{border:1px solid #d7cbb7;border-radius:8px;background:#fffdf8;padding:10px;box-sizing:border-box;min-width:0}article svg{width:100%;height:250px;display:block}article p{font-size:10px;min-height:30px;margin:4px 0}.partial{background:#f5f5f5}.source-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.source-grid>article{padding:10px}.source-grid .original{height:190px}.source-grid .pair{display:grid;grid-template-columns:1fr 1fr}.source-grid .pair svg{height:245px}.three{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.three svg{height:210px}.three article{padding:8px}footer{margin-top:18px;font-size:11px}`;
 const heading=`<h1>BIO-VIS-AUDIT-01 · catalogue sans accessoires</h1><p>Même habitant P4-R1, tête neutre, corps standard, face et échelle fixes. Couleur de cheveux commune. Aucun accessoire ; seuls les traits identifiés de liens P4 sont retirés des copies d’audit. Les zones cachées restent inconnues. Regroupement visuel proposé, distinct des égalités techniques.</p>`;
 const sections=families.map(f=>`<section id="fam-${f.id}" class="${f.id.length>2||!/^\d/.test(f.id)?'partial':''}"><h2>${f.id} · ${f.name}</h2><div class="cards">${f.keys.map(k=>card(data.entries.find(e=>e.key===k))).join('')}</div></section>`).join('');
 fs.writeFileSync(path.join(dir,'planches/index.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><title>Audit visuel Microcosme</title><style>${style}</style>${heading}${sections}<footer>Source effective : 4fb938a. Classement de lecture humaine ; aucune validation artistique automatique.</footer></html>`);
 const exact=data.groups.filter(g=>g.length>1).map((g,i)=>`<section id="exact-${i+1}"><h2>Groupe exact ${i+1} · ${g.join(' / ')}</h2><div class="cards">${g.map(k=>card(data.entries.find(e=>e.key===k))).join('')}</div></section>`).join('');
 const close=minorPairs.map((g,i)=>`<section id="proche-${i+1}"><h2>Paire examinée · ${g.join(' / ')}</h2><div class="cards">${g.map(k=>card(data.entries.find(e=>e.key===k))).join('')}</div></section>`).join('');
 fs.writeFileSync(path.join(dir,'planches/doublons.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><style>${style}</style><h1>Copies exactes et paires proches à examiner</h1><p>Les dix premiers groupes sont égaux selon les commandes de cheveux canonisées sur 270 états. Les paires suivantes ne sont pas déclarées égales : elles servent à vérifier les différences restantes, sans couleur ni accessoire.</p>${exact}${close}</html>`);
 const boardMap={A:[19,'P5-A.png'],B:[28,'P5-B.png'],C:[37,'P5-C.png'],D:[46,'P5-D.png'],E:[55,'P5-E-v1.png'],F:[64,'P5-F.png']};
 for(const [letter,[first,file]]of Object.entries(boardMap)){
  const cells=Array.from({length:9},(_,i)=>{
   const n=first+i,x=5+(i%3)*512,y=107+Math.floor(i/3)*288;
   return `<article><h3>${n} · ${esc(data.entries.find(e=>e.number===n).name)}</h3><p>Source ${letter}${letter==='E'?' v1':''} · cheveux seulement comme référence</p><svg class="original" viewBox="${x} ${y} 503 280"><defs><clipPath id="source-${letter}-${i}"><rect x="${x}" y="${y}" width="503" height="280"/></clipPath></defs><image clip-path="url(#source-${letter}-${i})" href="../../../../preview/bio-vis-p5-i6/references/${file}" width="1536" height="1024"/></svg><p>Rendus programmés · même tête neutre, monochrome sans objets</p><div class="pair">${['G','D'].map(a=>`<div><b>${a}</b>${data.entries.find(e=>e.key===n+'-'+a).svg}<p>${data.entries.find(e=>e.key===n+'-'+a).status==='unknown'?'CHEVEUX INCONNUS · support seul':data.entries.find(e=>e.key===n+'-'+a).status==='partial'?'FRAGMENTS OBSERVÉS · couronne inconnue':''}</p></div>`).join('')}</div></article>`;
  }).join('');
  fs.writeFileSync(path.join(dir,'planches/source-'+letter+'.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><style>${style}</style><h1>Planche ${letter}${letter==='E'?' v1':''} · original / programme</h1><p>Le visage et les proportions du poster ne sont pas des critères de fidélité. Comparer contour, texture, implantation observable, attaches et longueur. Les objets des originaux ne sont pas des cheveux.</p><div class="source-grid">${cells}</div></html>`);
 }
 const v1cells=Array.from({length:12},(_,i)=>{const e=data.entries.find(e=>e.number===i+1),x=20+(i%4)*195,y=120+Math.floor(i/4)*285;return `<article><h3>${e.key} · ${esc(e.name)}</h3><p>Source V1 · cheveux seulement</p><svg class="original" viewBox="${x} ${y} 193 280"><defs><clipPath id="v1-${i}"><rect x="${x}" y="${y}" width="193" height="280"/></clipPath></defs><image clip-path="url(#v1-${i})" href="../../../../preview/bio-vis-p5-i6/references/catalogue-v1.png" width="1536" height="1024"/></svg><p>Programme sans objets, même habitant</p>${e.svg}</article>`}).join('');
 fs.writeFileSync(path.join(dir,'planches/source-V1.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><style>${style}</style><h1>V1 · douze références historiques / programme</h1><p>Comparer les cheveux, sans reprendre les proportions ou les visages du poster. Les six explorations 13–18 n’ont pas de case sur V1.</p><div class="source-grid">${v1cells}</div></html>`);
 const scaleKeys=['06','10','13','14','15','17','18','24-G','30-D','52-D','55-G','66-D','72-D'];
 fs.writeFileSync(path.join(dir,'planches/echelles.html'),`<!doctype html><html lang="fr"><meta charset="utf-8"><style>${style}</style><h1>Trois vues effectives · cadrages et longueurs</h1><p>Comparaison complémentaire : cadrages d’origine conservés, panneaux de même taille écran. Ce document ne sert pas au comptage des silhouettes à échelle commune. Les liens P4 identifiés sont retirés uniquement des copies présentées.</p>${scaleKeys.map(k=>{const e=data.entries.find(e=>e.key===k);return `<section><h2>${k} · ${esc(e.name)}</h2><div class="three">${e.originalViews.map((s,i)=>`<article><h3>${['Entier','Tête agrandie','Petite échelle : géométrie/cadrage'][i]}</h3>${s}</article>`).join('')}</div></section>`}).join('')}</html>`);
 const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return}res.setHeader('Content-Type',file.endsWith('.mjs')?'text/javascript':file.endsWith('.html')?'text/html':file.endsWith('.json')?'application/json':file.endsWith('.png')?'image/png':'text/plain');res.end(fs.readFileSync(file));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}/docs/ai/bio-vis-audit-01/`;
 try{for(const engine of [chromium,webkit]){
  const b=await engine.launch();try{
   const page=await b.newPage({viewport:{width:1248,height:900},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'planches/index.html');
   const metrics=await page.evaluate(async entries=>{
    const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(x=>x.toString(16).padStart(2,'0')).join('');
    const hairSelector='[data-layer=rear],[data-layer=back],[data-layer=volume],[data-layer=front],[data-layer=sides],[data-layer=texture],[data-layer=lengths]';
    function clean(svg,mask=false){
     svg.querySelectorAll('[data-layer^=accessories],[data-layer=color]').forEach(e=>e.remove());
     for(const e of svg.querySelectorAll('path,circle,ellipse,rect,polygon,polyline,line')){
      if(e.closest('defs'))continue;
      const hair=e.closest(hairSelector),filled=e.getAttribute('fill')!=='none',stroked=e.hasAttribute('stroke')&&e.getAttribute('stroke')!=='none';
      if(mask){if(hair&&(e.closest('[data-layer=texture]')||!filled)){e.remove();continue;}if(filled)e.setAttribute('fill',hair?'#000':'#fff');if(stroked)e.setAttribute('stroke',hair?'#000':'#fff');e.removeAttribute('opacity');}
      else if(hair){if(filled)e.setAttribute('fill','#9d7b47');if(stroked)e.setAttribute('stroke','#4c3822');e.removeAttribute('opacity');}
     }
     return svg;
    }
    // Same paint normalization for every displayed audit figure. Prefix all clip IDs per occurrence.
    for(const [i,svg]of [...document.querySelectorAll('svg')].entries()){
     const map=new Map([...svg.querySelectorAll('[id]')].map(e=>[e.id,'plate-'+i+'-'+e.id]));for(const e of svg.querySelectorAll('[id]'))e.id=map.get(e.id);for(const e of svg.querySelectorAll('[clip-path]')){const v=e.getAttribute('clip-path').slice(5,-1);if(map.has(v))e.setAttribute('clip-path','url(#'+map.get(v)+')');}clean(svg);
    }
    const canvas=document.createElement('canvas');canvas.width=480;canvas.height=710;const ctx=canvas.getContext('2d'),masks=[],result=[],face=new Set(),body=new Set(),scales=[];
    for(const entry of entries){
     const svg=document.querySelector('[data-key="'+entry.key+'"] svg').cloneNode(true);face.add(svg.querySelector('[data-layer=face]')?.innerHTML);body.add(svg.querySelector('.body-shape')?.innerHTML);
     clean(svg,true);const image=new Image();image.src='data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg))));await image.decode();ctx.fillStyle='#fff';ctx.fillRect(0,0,480,710);ctx.drawImage(image,0,0,480,710);
     const pixels=ctx.getImageData(0,0,480,710).data,bit=new Uint32Array(Math.ceil(480*710/32));let area=0;
     for(let j=0;j<480*710;j++)if(pixels[j*4]<128){bit[j>>>5]|=1<<(j&31);area++;}
     masks.push(bit);result.push({key:entry.key,area,hash:await digest(bit.buffer)});
     const versions=entry.originalViews.map(s=>new DOMParser().parseFromString(s,'image/svg+xml').documentElement),count=s=>s.querySelector('[data-layer=lengths]')?.querySelectorAll('path').length||0;
     scales.push({key:entry.key,frames:versions.map(s=>s.getAttribute('viewBox')),lengthPaths:versions.map(count)});
    }
    function pop(n){n-=n>>>1&0x55555555;n=(n&0x33333333)+(n>>>2&0x33333333);return ((n+(n>>>4)&0x0f0f0f0f)*0x01010101)>>>24;}
    const pairs=[];for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
     if(entries[i].status==='unknown'||entries[j].status==='unknown'||!result[i].area||!result[j].area)continue;
     let intersection=0;for(let k=0;k<masks[i].length;k++)intersection+=pop(masks[i][k]&masks[j][k]);const union=result[i].area+result[j].area-intersection,iou=intersection/union;
     if(iou>=.80)pairs.push({a:entries[i].key,b:entries[j].key,iou:Number(iou.toFixed(6))});
    }
    return {resolution:[480,710],threshold:128,viewBox:[-40,-85,240,355],faceVariants:face.size,bodyVariants:body.size,entries:result,pairs:pairs.sort((a,b)=>b.iou-a.iou),scales,normalizedHTML:document.documentElement.outerHTML};
   },data.entries);
   assert.equal(metrics.faceVariants,1);assert.equal(metrics.bodyVariants,1);const normalized=metrics.normalizedHTML;delete metrics.normalizedHTML;
   fs.writeFileSync(path.join(dir,'data/visual-'+engine.name()+'.json'),JSON.stringify(metrics,null,2)+'\n');
   if(engine===chromium){
    fs.writeFileSync(path.join(dir,'planches/planche-generale.html'),normalized);fs.writeFileSync(path.join(dir,'planches/index.html'),normalized);await page.screenshot({path:path.join(dir,'planches/planche-generale.png'),fullPage:true});
    for(const f of families)await page.locator('#fam-'+f.id).screenshot({path:path.join(dir,'planches/famille-'+f.id+'.png')});
    // Normalize remaining plates with the same shared function, already serialized through source plate settings below.
    const normalizePage=async()=>page.evaluate(()=>{
     const selector='[data-layer=rear],[data-layer=back],[data-layer=volume],[data-layer=front],[data-layer=sides],[data-layer=texture],[data-layer=lengths]';
     for(const [i,svg]of [...document.querySelectorAll('svg')].entries()){
      if(svg.classList.contains('original'))continue;
      const ids=new Map([...svg.querySelectorAll('[id]')].map(e=>[e.id,'page-'+i+'-'+e.id]));for(const e of svg.querySelectorAll('[id]'))e.id=ids.get(e.id);for(const e of svg.querySelectorAll('[clip-path]')){const id=e.getAttribute('clip-path').slice(5,-1);if(ids.has(id))e.setAttribute('clip-path','url(#'+ids.get(id)+')');}
      svg.querySelectorAll('[data-layer^=accessories],[data-layer=color]').forEach(e=>e.remove());for(const e of svg.querySelectorAll('path,circle,ellipse,rect'))if(!e.closest('defs')&&e.closest(selector)){if(e.getAttribute('fill')!=='none')e.setAttribute('fill','#9d7b47');if(e.hasAttribute('stroke')&&e.getAttribute('stroke')!=='none')e.setAttribute('stroke','#4c3822');e.removeAttribute('opacity');}
     }
    });
    for(const name of ['doublons',...Object.keys(boardMap).map(l=>'source-'+l),'source-V1','echelles']){
     await page.goto(base+'planches/'+name+'.html');await page.evaluate(()=>Promise.all([...document.querySelectorAll('image')].map(e=>new Promise((r,j)=>{const i=new Image();i.onload=r;i.onerror=j;i.src=e.getAttribute('href')}))));await normalizePage();
     // Original-scale strips: strip identified ties by the exact path list from the normalized whole svg.
     if(name==='echelles')await page.evaluate(()=>{for(const section of document.querySelectorAll('section')){const key=section.querySelector('h2').textContent.split(' · ')[0];for(const p of section.querySelectorAll('path'))if((key==='12'&&p.getAttribute('stroke-width')==='4')||(['10','17'].includes(key)&&p.getAttribute('stroke-width')==='3.3'))p.remove();}});
     await page.screenshot({path:path.join(dir,'planches/'+name+'.png'),fullPage:true});
     const html=await page.content();fs.writeFileSync(path.join(dir,'planches/'+name+'.html'),html);
    }
   }
   assert.deepEqual(errors,[]);console.log(engine.name(),JSON.stringify({faceVariants:metrics.faceVariants,bodyVariants:metrics.bodyVariants,nearPairs:metrics.pairs.length,pixelGroups:new Set(metrics.entries.filter((_,i)=>data.entries[i].status!=='unknown').map(e=>e.hash)).size}));
  }finally{await b.close()}
 }}finally{await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
