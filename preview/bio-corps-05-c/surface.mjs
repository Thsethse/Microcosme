import {outlineCurves,stripX} from './bezier.mjs';

const mix=(a,b,t)=>a+(b-a)*t;

// Each row anchors a normalized v coordinate to a landmark on the surface.
// The same u follows the width of the actual section, even on a shaped outline.
export function cutaneousSurface(outline,rows,margin=.9) {
  const curves=outlineCurves(outline);
  const sections=new Map();
  function section(top,bottom=top) {
    const key=top+';'+bottom;
    if (!sections.has(key)) {
      const points=stripX(curves,top,bottom);
      const middle=top===bottom?points:stripX(curves,(top+bottom)/2);
      const center=(Math.min(...middle)+Math.max(...middle))/2;
      const left=points.filter(x=>x<=center), right=points.filter(x=>x>=center);
      sections.set(key,top===bottom?[Math.min(...points),Math.max(...points)]:
        [Math.max(...left),Math.min(...right)]);
    }
    return sections.get(key);
  }
  function vertical(v) {
    const i=rows.findIndex(([at])=>at>=v);
    if (i<=0) return rows[0][1];
    const [a,top]=rows[i-1], [b,bottom]=rows[i];
    return mix(top,bottom,(v-a)/(b-a));
  }
  function point(u,v) {
    const y=vertical(v), [left,right]=section(y);
    return [mix(left,right,u/100),y];
  }
  function coordinates(x,y) {
    const i=rows.findIndex(([,at])=>at>=y);
    if (i<=0) return null;
    const [left,right]=section(y);
    if (x<left||x>right||left===right) return null;
    const [a,top]=rows[i-1], [b,bottom]=rows[i];
    return [100*(x-left)/(right-left),mix(a,b,(y-top)/(bottom-top))];
  }
  function contains({left,right,top,bottom}) {
    if (top<rows[0][1]+margin||bottom>rows.at(-1)[1]-margin) return false;
    const span=section(top,bottom);
    return left>=span[0]+margin&&right<=span[1]-margin;
  }
  return {point,coordinates,contains};
}

export function sceneCoordinates(svg,clientX,clientY,plane) {
  const transform=svg.getScreenCTM();
  if(!transform) return null;
  const pointer=svg.createSVGPoint();
  pointer.x=clientX;
  pointer.y=clientY;
  const {x,y}=pointer.matrixTransform(transform.inverse());
  return plane.coordinates(x,y);
}
