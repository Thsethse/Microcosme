import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {palette} from './model.mjs';
const reference=JSON.parse(readFileSync(new URL('./reference.json',import.meta.url)));
const data=readFileSync(new URL('../'+reference.path,import.meta.url));
function crc32(bytes){let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^(crc&1?0xedb88320:0)}return (crc^0xffffffff)>>>0}
test('archived original is an exact, complete PNG with intact CRCs and raster stream',()=>{
 assert.equal(data.length,reference.bytes);assert.equal(createHash('sha256').update(data).digest('hex'),reference.sha256);
 assert.deepEqual([...data.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 let offset=8;const types=[],idat=[];
 while(offset<data.length){
  const length=data.readUInt32BE(offset),kind=data.toString('ascii',offset+4,offset+8),payload=data.subarray(offset+8,offset+8+length);
  assert.ok(offset+12+length<=data.length);assert.equal(crc32(data.subarray(offset+4,offset+8+length)),data.readUInt32BE(offset+8+length));
  if(kind==='IHDR'){
   assert.equal(payload.readUInt32BE(0),reference.width);assert.equal(payload.readUInt32BE(4),reference.height);
   assert.deepEqual([...payload.subarray(8)],[8,6,0,0,0]);
  }
  if(kind==='IDAT')idat.push(payload);types.push(kind);offset+=length+12;
 }
 assert.equal(types[0],'IHDR');assert.equal(types.at(-1),'IEND');assert.equal(offset,data.length);
 const raster=inflateSync(Buffer.concat(idat)),row=reference.width*4+1;
 assert.equal(raster.length,row*reference.height);
 for(let y=0;y<reference.height;y++)assert.ok(raster[y*row]<=4);
});
test('renderer palette uses the sampled sand and ochre of the original',()=>{
 assert.equal(palette.skin,reference.paletteSampledFromOpaquePixels.skin);
 assert.equal(palette.contour,reference.paletteSampledFromOpaquePixels.contour);
 assert.equal(palette.hair,reference.paletteSampledFromOpaquePixels.shortHair);
});
