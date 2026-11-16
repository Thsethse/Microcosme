// The reference is supplied by the caller: no anatomical coordinates live here.
export function normalize(ref, input = {}) {
  return Object.fromEntries(Object.entries(ref.parameters).map(([key, [min, value, max]]) =>
    [key, Math.max(min, Math.min(max, Number.isFinite(input[key]) ? input[key] : value))]));
}
export function geometry(ref, view, input = {}) {
  if (!['front', 'profile'].includes(view)) throw new Error('Unknown view');
  const p = normalize(ref, input);
  const elements = structuredClone(ref.views[view]);
  const scale = (name, sx=1, sy=1) => {
    const r=elements[name].rect; r[0]+=r[2]*(1-sx)/2; r[2]*=sx; r[3]*=sy;
  };
  if (view==='front') {
    const axis=elements.skull.rect[0]+elements.skull.rect[2]/2;
    for (const side of ['left','right']) {
      for (const part of ['eye','brow']) {
        const r=elements[`${part}_${side}`].rect;
        const center=r[0]+r[2]/2;
        r[0]=axis+(center-axis)*p.eye_spacing-r[2]/2;
        scale(`${part}_${side}`,p.eye_width);
      }
    }
    scale('nose',p.nose_width,p.nose_length);
    scale('mouth',p.mouth_width);
    scale('jaw',p.jaw_width);
    scale('chin',Math.sqrt(p.jaw_width),p.chin_length);
  } else {
    // Widths project into depth; spacing affects the orbit's recession.
    scale('eye',p.eye_width); scale('brow',p.eye_width);
    elements.eye.rect[0]-=(p.eye_spacing-1)*elements.eye.rect[2]*.5;
    scale('nose',p.nose_projection,p.nose_length);
    scale('mouth',Math.sqrt(p.mouth_width));
    scale('jaw',Math.sqrt(p.jaw_width));
    scale('chin',Math.sqrt(p.jaw_width),p.chin_length);
  }
  for (const element of Object.values(elements)) {
    const [x,y,w,h]=element.rect;
    element.center=[x+w/2,y+h/2];
    element.anchors=Object.fromEntries(Object.entries(element.points).map(([k,[u,v]])=>[k,[x+w*u/100,y+h*v/100]]));
  }
  return {view,parameters:p,elements};
}
