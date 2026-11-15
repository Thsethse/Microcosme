/* R1 attachments only; no facial catalogue, hair or nasal anatomy. */
(function(root){
 'use strict';
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 const H=typeof module!=='undefined'?require('./shape-grammar.js'):root.ShapeGrammar;
 function attach(skeleton,choices){
  const head=skeleton.segments.head,width=head.width*H.headWidthRatio(choices.headShape),height=head.length;
  const eyeFraction=.54,eyeHeight=height*.08,browFraction=.46;
  const spacing=Math.min(H.halfWidth(choices.headShape,eyeFraction),H.halfWidth(choices.headShape,browFraction))*width*.46;
  function anchor(fraction,x=0){let z=head.depth/2;
   if(['round','oval'].includes(choices.headShape))z*=Math.sqrt(Math.max(0,1-(2*x/width)**2-(2*fraction-1)**2));
   return {segment:'head',t:1-fraction,offsetLocal:[x,0,z]};
  }
  const a=skeleton.anchors;
  a.face_top=anchor(0);a.face_chin=anchor(1);delete a.facial_axis; // Median axis is a frame, never an extra central facial point.
  for(const side of ['left','right']){const x=side==='left'?-spacing:spacing;
   a['eye_'+side]=anchor(eyeFraction,x);a['eye_bottom_'+side]=anchor(eyeFraction+eyeHeight/(2*height),x);a['brow_'+side]=anchor(browFraction,x);
  }
  const bottom=S.point(skeleton,a.eye_bottom_left),chin=S.point(skeleton,a.face_chin),mouthY=(bottom[1]+chin[1])/2;
  a.mouth=anchor((head.end[1]-mouthY)/height);
  return {axis:{top:'face_top',bottom:'face_chin'},headShape:choices.headShape,width,height,eyeFraction,eyeHeight,browFraction,
   anchors:Object.fromEntries(['face_top','face_chin','eye_left','eye_right','eye_bottom_left','eye_bottom_right','brow_left','brow_right','mouth'].map(id=>[id,S.point(skeleton,a[id])]))};
 }
 const api={attach};if(typeof module!=='undefined')module.exports=api;root.FacialAnchors=api;
})(globalThis);
