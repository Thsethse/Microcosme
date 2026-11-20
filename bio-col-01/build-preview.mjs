// Build this preview from committed files. Publication remains a separate operation.
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),out=process.argv[2];
assert(out?.startsWith('/'),'Usage: node bio-col-01/build-preview.mjs /absolute/output');
const git=(...a)=>execFileSync('git',a,{cwd:root,encoding:'utf8'}),sha=s=>createHash('sha256').update(s).digest('hex');
const commit=git('rev-parse','HEAD').trim(),inherited=JSON.parse(git('show','HEAD:bio-col-01/tests/frozen-manifest.json'));
assert.equal(inherited.length,129);for(const f of inherited)assert.equal(sha(readFileSync(resolve(root,f.path))),f.sha256,f.path);
mkdirSync(out,{recursive:true});const files=[];
for(const path of ['index.html','style.css','app.mjs','palette.mjs','paint.mjs','render.mjs','catalogue.mjs','selection.mjs']){const data=git('show','HEAD:bio-col-01/'+path).replaceAll('../preview/bio-vis-','../bio-vis-');writeFileSync(resolve(out,path),data);files.push({path,sha256:sha(data)});}
writeFileSync(resolve(out,'version.json'),JSON.stringify({mission:'BIO-COL-01',codeCommit:commit,contractCommit:'e6fd39680bfe43e801069c9046f75f09d9ade1ff',baselineCommit:'9590c809e8b1e316da4f8b11466ebd9e02e322fb',lot3CodeCommit:'f8c70e23cdea56cd506e837a9587035af9e2c81f',references:72,historicalChoices:126,ordinaryChoices:120,paletteSwatches:26,files,inherited},null,2)+'\n');
console.log(JSON.stringify({codeCommit:commit,publishedFiles:files.length+1,inheritedFiles:inherited.length,output:out}));
