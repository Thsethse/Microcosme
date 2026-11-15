/* T2 describes adult graphic figures only. No biological, gender or behavior model. */
(function (root) {
  'use strict';
  const palettes = {
    skin: ['#f5d3ac','#edb98d','#d99b74','#bb7e58','#925a3e','#673d2f'],
    eyes: ['#69adf0','#527536','#978048','#59371f','#824b9b','#322638'],
    hair: ['#f4c34e','#bd5827','#80483c','#423039','#5b4267','#efe1d1','#ad5cdb','#3d713b','#70a5d4'],
    fur: ['#f4c34e','#bd5827','#80483c','#423039','#5b4267','#efe1d1','#ad5cdb']
  };
  const fields = [];
  const number = (key,label,group,min,max,initial,effect) => fields.push({key,label,group,type:'number',min,max,initial,step:.01,effect});
  const choice = (key,label,group,options,initial,effect) => fields.push({key,label,group,type:'choice',options,initial,effect});
  const toggle = (key,label,group,initial,effect) => fields.push({key,label,group,type:'boolean',initial,effect});
  const shapes = {circle:'Cercle',oval:'Ovale',triangle:'Triangle',square:'Carré',rectangle:'Rectangle'};
  choice('headShape','Forme de tête','Formes',shapes,'square','Forme entière, sans nez ni mâchoire détaillée');
  number('headX','Tête · horizontal','Formes',.75,1.25,1,'Étirement horizontal indépendant');
  number('headY','Tête · vertical','Formes',.75,1.25,1,'Étirement vertical indépendant');
  choice('bodyShape','Forme du tronc','Formes',{rectangle:'Rectangle',square:'Carré',oval:'Ovale',triangle:'Triangle',composite:'Composée'},'rectangle','Contour du tronc, raccords communs');
  number('bodyX','Tronc · horizontal','Formes',.75,1.3,1,'Largeur du tronc et du bassin');
  number('bodyY','Tronc · vertical','Formes',.75,1.25,1,'Longueur du tronc seulement');
  number('armWidth','Largeur des bras','Membres',.7,1.5,1,'Bras rectangulaires');
  number('armLength','Longueur des bras','Membres',.75,1.2,1,'Poignets déplacés depuis les épaules');
  number('legWidth','Largeur des jambes','Membres',.7,1.4,1,'Jambes rectangulaires');
  number('legLength','Longueur des jambes','Membres',.75,1.25,1,'Pieds déplacés depuis les hanches');
  for (const [key,label] of [['pecs','Pectoraux'],['shoulders','Épaules'],['arms','Bras'],['thighs','Cuisses'],['calves','Mollets']]) {
    number(key+'Size',label+' · volume','Musculature',0,1,.35,'Volume carré/rectangulaire purement visuel');
    number(key+'Ink',label+' · intensité','Musculature',0,1,.35,'Contraste graphique indépendant de la taille');
  }
  toggle('chestPresent','Poitrine présente','Poitrine',false,'Indépendant des signes anatomiques et de la pilosité');
  number('chestVolume','Volume poitrine','Poitrine',0,1,.4,'Volume d’ovales sans détail explicite');
  choice('chestShape','Forme poitrine','Poitrine',{round:'Ronde',oval:'Ovale'},'round','Rapport initial des axes');
  number('chestStretch','Étirement poitrine','Poitrine',.7,1.4,1,'Étirement vertical des volumes');
  number('chestSpacing','Écartement poitrine','Poitrine',.6,1.3,1,'Ancrages bornés au tronc');
  number('chestY','Hauteur poitrine','Poitrine',.2,.65,.4,'Position dans le tronc');
  choice('anatomyMark','Signe anatomique','Signes et pilosité',{neutral:'Neutre',rectangle:'Rectangle',lineTriangle:'Trait fin + triangle'},'neutral','Symbole minimal, aucune identité de genre inférée');
  for (const [key,label] of [['beard','Barbe'],['moustache','Moustache'],['sideburns','Favoris'],['pubicHair','Texture pubienne']]) number(key,label,'Signes et pilosité',0,1,0,'Couche graphique indépendante ; aucune autre zone pileuse');
  choice('eyeShape','Forme des yeux','Visage',{circle:'Cercle',oval:'Ovale',triangle:'Triangle',square:'Carré'},'square','Yeux géométriques, sans nez');
  number('eyeSize','Taille des yeux','Visage',.7,1.3,1,'Iris et contours adaptés à la tête');
  number('eyeSpacing','Écartement yeux','Visage',.7,1.2,1,'Distance entre yeux bornée au visage');
  number('eyeY','Position yeux','Visage',.38,.58,.48,'Position dans la tête');
  toggle('lashes','Cils','Visage',false,'Sans catégorie de genre');
  choice('browShape','Forme sourcils','Visage',{rectangle:'Rectangle',triangle:'Triangle'},'rectangle','Formes simples');
  number('browSize','Taille sourcils','Visage',.6,1.4,1,'Longueur et épaisseur');
  number('browTilt','Inclinaison sourcils','Visage',-.6,.6,0,'Inclinaison symétrique');
  number('browY','Position sourcils','Visage',.12,.30,.22,'Au-dessus des yeux');
  choice('hairStyle','Coiffure','Cheveux',{short:'Courte',medium:'Mi-longue',long:'Longue',bob:'Carré',curly:'Bouclée',tied:'Attachée',shaved:'Rasée'},'short','Bibliothèque de couches adaptée à chaque tête');
  for (const [key,label,palette] of [['skinColor','Peau','skin'],['eyeColor','Iris','eyes'],['hairColor','Cheveux','hair'],['furColor','Poils','fur']]) choice(key,label,'Palettes',Object.fromEntries(palettes[palette].map(c=>[c,c])),palettes[palette][0],'Pigment indépendant des autres couleurs');
  const schema = Object.freeze(fields.map(Object.freeze));
  function hash(seed, index) { let h=2166136261;for(const c of seed+':'+index)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;h^=h>>>16;h=Math.imul(h,0x45d9f3b);return ((h^(h>>>16))>>>0)/4294967296; }
  function validate(d) {
    if(!d||d.schema!=='microcosme.bio-gen-t2'||d.version!==1||typeof d.seed!=='string'||d.seed.length>128||!d.params)throw Error('Profil T2 v1 et graine texte (128 caractères maximum) requis.');
    const params={};
    for(const s of schema){const v=d.params[s.key];if(s.type==='number' ? typeof v!=='number'||!Number.isFinite(v)||v<s.min||v>s.max : s.type==='boolean' ? typeof v!=='boolean' : typeof v!=='string'||!Object.hasOwn(s.options,v))throw Error('Paramètre invalide : '+s.key);params[s.key]=v;}
    return {schema:d.schema,version:1,seed:d.seed,params};
  }
  function reference(seed='reference-4-tetes'){return validate({schema:'microcosme.bio-gen-t2',version:1,seed:String(seed),params:Object.fromEntries(schema.map(s=>[s.key,s.initial]))});}
  function generate(seed){const d=reference(seed);schema.forEach((s,i)=>{const r=hash(d.seed,i);d.params[s.key]=s.type==='number'?Math.round((s.min+r*(s.max-s.min))*100)/100:s.type==='boolean'?r>.55:Object.keys(s.options)[Math.floor(r*Object.keys(s.options).length)];});return validate(d);}
  const api={schema,palettes,hash,validate,reference,generate,serialize:d=>JSON.stringify(validate(d),null,2),parse:s=>validate(JSON.parse(s))};
  if(typeof module!=='undefined')module.exports=api;root.T2Model=api;
})(globalThis);
