// Finite proposed swatches, awaiting artistic validation. No biological meaning.
const definitions=[
 ['noir-profond','Noir profond','Noirs','natural','#29272f'],
 ['noir-ebene','Noir ébène','Noirs','natural','#3a3035'],
 ['brun-sombre','Brun sombre','Bruns','natural','#4b2f25'],
 ['brun-chocolat','Brun chocolat','Bruns','natural','#694332'],
 ['chatain','Châtain','Châtains','natural','#875435'],
 ['chatain-clair','Châtain clair','Châtains','natural','#a57950'],
 ['blond-cendre','Blond cendré','Blonds','natural','#b7a17a'],
 ['blond-dore','Blond doré','Blonds','natural','#d7b966'],
 ['blond-pale','Blond pâle','Blonds','natural','#f0dfad'],
 ['roux-cuivre','Roux cuivré','Roux','natural','#b95d32'],
 ['roux-auburn','Roux auburn','Roux','natural','#853d2d'],
 ['gris-acier','Gris acier','Gris','natural','#737a83'],
 ['gris-perle','Gris perle','Gris','natural','#cbd0d4'],
 ['blanc-ivoire','Blanc ivoire','Blancs','natural','#f5f1e7'],
 ['rouge-vif','Rouge vif','Rouges','fantasy','#ed344f'],
 ['rouge-profond','Rouge profond','Rouges','fantasy','#a12746'],
 ['rose-clair','Rose clair','Roses','fantasy','#f0b6ce'],
 ['rose-framboise','Rose framboise','Roses','fantasy','#d74691'],
 ['violet-amethyste','Violet améthyste','Violets','fantasy','#9756bf'],
 ['violet-profond','Violet profond','Violets','fantasy','#643c92'],
 ['bleu-vif','Bleu vif','Bleus','fantasy','#3b66e3'],
 ['bleu-nuit','Bleu nuit','Bleus','fantasy','#304680'],
 ['turquoise-clair','Turquoise clair','Turquoises','fantasy','#6dcfc8'],
 ['turquoise-profond','Turquoise profond','Turquoises','fantasy','#238f96'],
 ['vert-emeraude','Vert émeraude','Verts','fantasy','#2c9b70'],
 ['vert-sauge','Vert sauge','Verts','fantasy','#99b57a']
];
const toLinear=x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4;
const toSRGB=x=>x<=.0031308?12.92*x:1.055*x**(1/2.4)-.055;
export function rgb(hex){if(!/^#[0-9a-f]{6}$/i.test(hex))throw new RangeError('Teinte hexadécimale invalide.');return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);}
export function oklab(hex){
 const [r,g,b]=rgb(hex).map(toLinear),l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
 return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s];
}
function linearRGB([L,a,b]){
 const l=(L+.3963377774*a+.2158037573*b)**3,m=(L-.1055613458*a-.0638541728*b)**3,s=(L-.0894841775*a-1.291485548*b)**3;
 return [4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s];
}
export function contour(hex){
 const [L,a,b]=oklab(hex),dark=Math.max(.035,.64*L-.045);
 // Keep hue; reduce chroma only as needed to remain inside the sRGB gamut.
 let lo=0,hi=.8;
 for(let i=0;i<20;i++){const k=(lo+hi)/2,channels=linearRGB([dark,a*k,b*k]);if(channels.every(v=>v>=0&&v<=1))lo=k;else hi=k;}
 return '#'+linearRGB([dark,a*lo,b*lo]).map(v=>Math.round(Math.max(0,Math.min(1,toSRGB(v)))*255).toString(16).padStart(2,'0')).join('');
}
export function luminance(hex){const [r,g,b]=rgb(hex).map(toLinear);return .2126*r+.7152*g+.0722*b;}
export function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export const palette=Object.freeze(definitions.map(([id,name,family,category,fill])=>Object.freeze({id,name,family,category,fill,stroke:contour(fill)})));
const map=new Map(palette.map(p=>[p.id,p]));
export function swatch(id){const p=map.get(id);if(!p)throw new RangeError('Couleur inconnue : '+String(id));return p;}
