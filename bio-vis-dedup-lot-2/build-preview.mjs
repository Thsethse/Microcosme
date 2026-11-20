// Build only this preview, from committed sources. Publishing is a separate step.
import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const out=process.argv[2];
assert(out,'Usage: node bio-vis-dedup-lot-2/build-preview.mjs /absolute/output');
assert(out.startsWith('/'),'An absolute output directory is required');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'});
const hash=data=>createHash('sha256').update(data).digest('hex');
const commit=git('rev-parse','HEAD').trim();
const frozen=JSON.parse(git('show','HEAD:bio-vis-dedup-lot-2/tests/frozen-manifest.json'));
for(const f of frozen)assert.equal(hash(readFileSync(resolve(root,f.path))),f.sha256,f.path);
mkdirSync(out,{recursive:true});
const files=[];
for(const file of ['index.html','style.css','app.mjs','catalogue.mjs','selection.mjs','render.mjs']){
 const source=git('show',`HEAD:bio-vis-dedup-lot-2/${file}`);
 const published=source.replaceAll('../preview/bio-vis-','../bio-vis-');
 writeFileSync(resolve(out,file),published);files.push({path:file,sha256:hash(published)});
}
const version={mission:'BIO-VIS-DEDUP-01 LOT 2',codeCommit:commit,contractCommit:'0fbbc3eb4e8896284fedd855c9841ac95f2fe31a',baselineCommit:'5bcda0dd2fdae799ef3f7779109660bfbee988f1',lot1CodeCommit:'5ea862510b04904904241a09695be4c9141ce4a8',canonicalReferences:72,documentaryChoices:126,ordinaryChoices:120,files,inherited:frozen};
writeFileSync(resolve(out,'version.json'),JSON.stringify(version,null,2)+'\n');
console.log(JSON.stringify({codeCommit:commit,output:out,publishedFiles:files.length+1,frozenFiles:frozen.length}));
