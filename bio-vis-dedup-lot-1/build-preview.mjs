// Produces a Pages artifact; does not push, deploy or modify any existing preview.
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const source=dirname(fileURLToPath(import.meta.url)),root=resolve(source,'..'),destination=resolve(process.argv[2]||'');
assert(process.argv[2]&&!existsSync(destination),'Pass a new artifact directory.');
const codeCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),files=[];
mkdirSync(destination,{recursive:true});
for(const name of ['index.html','style.css','app.mjs','hair.mjs','render.mjs']){
 const original=readFileSync(resolve(source,name));assert.deepEqual(original,execFileSync('git',['show',codeCommit+':bio-vis-dedup-lot-1/'+name],{cwd:root}),'committed runtime '+name);
 // Source is a root prototype, Pages is a sibling of the existing immutable P5-I6 snapshot.
 const bytes=Buffer.from(original.toString().replaceAll('../preview/bio-vis-p5-i6','../bio-vis-p5-i6'));
 writeFileSync(resolve(destination,name),bytes);files.push({path:name,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const baseline=JSON.parse(readFileSync(resolve(source,'tests/baseline-manifest.json')));
for(const f of baseline)assert.equal(createHash('sha256').update(readFileSync(resolve(root,'preview/bio-vis-p5-i6',f.path))).digest('hex'),f.sha256,'baseline '+f.path);
writeFileSync(resolve(destination,'version.json'),JSON.stringify({mission:'BIO-VIS-DEDUP-01 LOT 1',codeCommit,contractCommit:'bfc914c2853e997443bea8ba36f48e7205dcb494',baselineCommit:'4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5',files,baseline},null,2)+'\n');
console.log(JSON.stringify({destination,codeCommit,files:files.length,baselineFilesVerified:baseline.length}));
