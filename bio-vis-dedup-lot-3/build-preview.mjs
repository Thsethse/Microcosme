// Build the isolated Pages artefact from committed sources. Never publishes itself.
import {execFileSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),out=process.argv[2];
assert(out?.startsWith('/'),'Usage: node bio-vis-dedup-lot-3/build-preview.mjs /absolute/output');
const git=(...args)=>execFileSync('git',args,{cwd:root,maxBuffer:24*1024*1024}),sha=b=>createHash('sha256').update(b).digest('hex');
const commit=git('rev-parse','HEAD').toString().trim(),inherited=JSON.parse(git('show','HEAD:bio-vis-dedup-lot-3/tests/frozen-manifest.json'));
for(const f of inherited)assert.equal(sha(readFileSync(resolve(root,f.path))),f.sha256,f.path);
const runtime=['index.html','style.css','app.mjs','hair.mjs','render.mjs','catalogue.mjs','selection.mjs'];
const sources=JSON.parse(git('show','HEAD:bio-vis-dedup-lot-3/references/provenance.json'));
const names=[...runtime,'references/provenance.json',...Object.values(sources).map(s=>s.crop)];assert.equal(names.length,22);
const files=[];
for(const name of names){let data=git('show','HEAD:bio-vis-dedup-lot-3/'+name);if(!name.endsWith('.png'))data=Buffer.from(data.toString().replaceAll('../preview/bio-vis-','../bio-vis-'));mkdirSync(dirname(resolve(out,name)),{recursive:true});writeFileSync(resolve(out,name),data);files.push({path:name,sha256:sha(data)});}
const version={mission:'BIO-VIS-DEDUP-01 LOT 3',codeCommit:commit,contractCommit:'2b0fb7c8a47d19008263519a7cfc681ca6006fee',baselineCommit:'5b6e4019084ee302090656b2736efcce85adece8',lot1CodeCommit:'5ea862510b04904904241a09695be4c9141ce4a8',lot2CodeCommit:'94bffaf0cf6fddc5d0f40ebebf21c76ed5acaddf',originalsCommit:'0d8cc1dccea821c14c35ac4addf46bafa753bc86',references:72,historicalChoices:126,ordinaryChoices:120,files,inherited};
writeFileSync(resolve(out,'version.json'),JSON.stringify(version,null,2)+'\n');
console.log(JSON.stringify({codeCommit:commit,publishedFiles:files.length+1,inheritedFiles:inherited.length,output:out}));
