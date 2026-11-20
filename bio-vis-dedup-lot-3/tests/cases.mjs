import {controls,presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
export const axes=Object.keys(controls);
export const corners=Array.from({length:256},(_,mask)=>Object.fromEntries(axes.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']])));
export const morphologies=[{},priorityCase,presets.tall.values,presets.broad.values,corners[0],corners[255],...axes.flatMap(k=>[{[k]:controls[k].min},{[k]:controls[k].max}]),...Array.from({length:16},(_,i)=>Object.fromEntries(axes.map((k,j)=>[k,controls[k].min+(controls[k].max-controls[k].min)*(.5+.46*Math.sin((i+1)*.67+j*.91))])))];
