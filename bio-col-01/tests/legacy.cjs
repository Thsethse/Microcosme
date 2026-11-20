// Run the original Lot 1/2 suites in disposable copies. Never write to their branches/previews.
const {mkdtempSync,mkdirSync,cpSync,symlinkSync,writeFileSync,readFileSync}=require('node:fs');
const {execFileSync}=require('node:child_process');
const {tmpdir}=require('node:os');
const path=require('node:path');
const root=path.resolve(__dirname,'../..'),sandbox=mkdtempSync(path.join(tmpdir(),'microcosme-legacy-col01-'));
const output=process.env.ARTIFACT_DIR||'/tmp/microcosme-bio-col01-browser';mkdirSync(output,{recursive:true});
const revisions=[['bio-vis-dedup-lot-1','1ff931586776b3f7ed41bbdc5772b97e030aa4db'],['bio-vis-dedup-lot-2','4156254ca5a9b4a52f138a558bd70d461f4d4c4e'],['bio-vis-dedup-lot-3','576ee961b5be385e6cceb2f357ffe74341b0d05f']];
const env={...process.env};delete env.BASE_URL;delete env.NODE_OPTIONS;env.ARTIFACT_DIR=path.join(sandbox,'browser-results');
symlinkSync(path.join(root,'node_modules'),path.join(sandbox,'node_modules'),'dir');
for(const folder of ['bio-vis-p5-i6','bio-vis-dedup-lot-1','bio-vis-dedup-lot-2','bio-vis-dedup-lot-3'])cpSync(path.join(root,'preview',folder),path.join(sandbox,'preview',folder),{recursive:true});
const results=[];
for(const [folder,ref]of revisions){
 env.ARTIFACT_DIR=path.join(sandbox,folder+'-browser');
 const archive=execFileSync('git',['-c','safe.directory='+root,'archive',ref,folder],{cwd:root,maxBuffer:32*1024*1024});execFileSync('tar',['-x','-C',sandbox],{input:archive});
 console.log('Legacy:',folder,ref);
 execFileSync(process.execPath,['--test',folder+'/tests/model.test.mjs'],{cwd:sandbox,env,stdio:'inherit'});
 execFileSync(process.execPath,[folder+'/tests/browser.cjs'],{cwd:sandbox,env,stdio:'inherit'});
 const report=folder.endsWith('1')?path.join(sandbox,folder,'captures/verification.json'):path.join(env.ARTIFACT_DIR,'results.json');
 results.push({folder,ref,nodePassed:true,browsersPassed:true,report:JSON.parse(readFileSync(report,'utf8'))});
}
writeFileSync(path.join(output,'legacy-results.json'),JSON.stringify(results,null,2)+'\n');
console.log('Lots 1, 2 et 3 : suites originales Node, Chromium et WebKit réussies ; écritures limitées à',sandbox);
