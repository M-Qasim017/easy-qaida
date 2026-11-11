/* Easy Qaida — Practice mode.
   Teacher-led practice and games, built from the letters / words of the page that is open.
   Opens from the "Practice this page" button in the toolbar. Progress is kept per student on this device. */
(function(){
"use strict";
if(typeof L==="undefined"||typeof PAGES==="undefined") return;
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const INK="#0B3D2E";

/* ================= students, stars and memory strength (saved on this device) ================= */
const KEY="easyqaida.practice.v1";
const blank=()=>({m:{},stars:0,sel:{},little:false});
let store=null; try{ store=JSON.parse(localStorage.getItem(KEY)||"null"); }catch(e){}
if(!store||!store.students||!Object.keys(store.students).length) store={cur:"Student 1",sound:true,students:{"Student 1":blank()}};
if(!store.students[store.cur]) store.cur=Object.keys(store.students)[0];
{ const q=(new URLSearchParams(location.search).get("student")||"").trim().slice(0,30); if(q){ if(!store.students[q]) store.students[q]=blank(); store.cur=q; } }
const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(store)); }catch(e){} };
const stu=()=>store.students[store.cur];
const little=()=>!!stu().little;
const online=()=>store.online!==false;   /* online class: choices carry numbers the child can say */
const score=k=>{ const r=stu().m[k]; return r?r.s:undefined; };
function record(k,ok){ const m=stu().m, r=m[k]||(m[k]={s:0,r:0,w:0}); if(ok){ r.s=Math.min(4,r.s+1); r.r++; } else { r.s=Math.max(0,r.s-1); r.w++; } r.t=Date.now(); save(); }
function level(items){ const sc=items.map(it=>score(it.key)); if(sc.every(v=>v===undefined)) return "new"; const m=Math.min(...sc.map(v=>v===undefined?0:v)); return m>=3?"good":m>=1?"learn":"weak"; }
/* weakest first, so the letters that need work come up most */
const order=items=>items.map(it=>({it,w:(score(it.key)===undefined?0.5:score(it.key))+Math.random()*0.45})).sort((a,b)=>a.w-b.w).map(x=>x.it);

/* ================= little sounds (no voice) ================= */
let AC=null;
function tone(f,d,o){ o=o||{}; if(!store.sound) return; try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const t=AC.currentTime+(o.at||0), os=AC.createOscillator(), g=AC.createGain();
  os.type=o.type||"sine"; os.frequency.setValueAtTime(f,t); if(o.to) os.frequency.exponentialRampToValueAtTime(o.to,t+d);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(o.vol||0.16,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+d);
  os.connect(g); g.connect(AC.destination); os.start(t); os.stop(t+d+0.03); }catch(e){} }
const sfx={ ok:()=>{ tone(660,.1); tone(990,.16,{at:.09}); }, no:()=>tone(190,.22,{type:"triangle",vol:.12}), pop:()=>tone(720,.13,{to:170,type:"square",vol:.07}),
  flip:()=>tone(420,.05,{vol:.06}), win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.22,{at:i*.11})) };

/* ================= the things we practise ================= */
const A=(t,cls)=>`<span class="pz-a${cls?" "+cls:""}">${t}</span>`;
const cache={};
const LI=id=>cache["l:"+id]||(cache["l:"+id]={key:"l:"+id,kind:"letter",id,html:A(L[id].ch),name:L[id].en,ur:L[id].ur,k:1,len:1,answer:`<b>${L[id].en}</b> ${A(L[id].ur)}`});
function FI(id,f){ const key=`f:${id}:${f}`; return cache[key]||(cache[key]={key,kind:"form",id,f,html:A(formHTML(id,f,INK)),name:L[id].en,k:.85,len:1,
  answer:`<b>${L[id].en}</b> ${A(L[id].ch)}<br><small>${FORMN[f]} shape</small>`}); }
function HI(id,h){ const key=`h:${id}:${h}`; if(cache[key]) return cache[key]; const base=id==="alif"?"ا":L[id].ch, syl=((id==="alif"||id==="hamza")?"":SND[id])+HV[h];
  return cache[key]={key,kind:"har",id,h,html:`<span class="pz-a pz-hg"><span style="color:${HC[h]}">${base+HM[h]}</span><span class="b">${base}</span></span>`,name:syl,k:.9,len:1,
    answer:`<b>${syl}</b><br><small>${L[id].en} + ${HN[h]} (${HU[h]})</small>`}; }
function WI(w){ const key="w:"+w; if(cache[key]) return cache[key]; const ps=analyze(w), n=ps.length;
  return cache[key]={key,kind:"comp",w,ps,html:A(w),name:ps.map(nameOf).join(" + "),k:n<=2?.8:n===3?.64:.5,len:n,
    answer:`${A(ps.map(isoOf).join(" + "))}<br><small>${ps.map(nameOf).join(" + ")}</small>`}; }
function EI(w){ const key="e:"+w; if(cache[key]) return cache[key]; const ps=analyze(w), n=ps.length;
  return cache[key]={key,kind:"word",w,ps,html:A(w),name:ps.map(sylOf).join(""),k:n<=2?.75:n===3?.58:.46,len:n,
    answer:`<b>${ps.map(sylOf).join("")}</b><br><small>${ps.map(sylOf).join(" · ")}</small>`}; }

/* what a page offers: units the teacher can switch on or off, and the items inside them */
function pageInfo(i){
  const pg=PAGES[i], xs=pg?$$("[data-x]",pg).map(e=>e.dataset.x):[], uniq=a=>[...new Set(a)];
  const no=pg&&pg.querySelector(".hdr .no"), label=no?"Page "+no.textContent:"Cover";
  const Ls=uniq(xs.filter(x=>/^l:[a-z]+$/.test(x)).map(x=>x.slice(2)));
  const Sh=uniq(xs.filter(x=>/^l:[a-z]+:Shapes$/.test(x)).map(x=>x.split(":")[1])).filter(id=>L[id]&&L[id].j!=="U");
  const Ms=uniq(xs.filter(x=>x.startsWith("m:")).flatMap(x=>x.slice(2).split(",")).flatMap(z=>ZONE_LETTERS[z]||[]));
  const Ws=uniq(xs.filter(x=>x.startsWith("w:")).map(x=>x.slice(2))).filter(w=>analyze(w).length>=2);
  const Hs=uniq(xs.filter(x=>x.startsWith("h:")).map(x=>x.slice(2)));
  const Es=uniq(xs.filter(x=>x.startsWith("e:")).map(x=>x.slice(2)));
  const U=(id,label,name,items)=>({id,label,name,items});
  let mode, title, units, words=[], note="";
  if(Sh.length){ mode="shapes"; title="Joined shapes"; units=Sh.map(id=>U(id,L[id].ch,L[id].en,(L[id].j==="D"?["S","M","E"]:["E"]).map(f=>FI(id,f)))); words=Ws.map(WI); }
  else if(Hs.length){ mode="har"; title="Fatha · Kasra · Damma"; const by={}; Hs.forEach(x=>{ const [id,h]=x.split(":"); (by[id]=by[id]||[]).push(HI(id,h)); });
    units=Object.keys(by).map(id=>U(id,id==="alif"?"ا":L[id].ch,L[id].en,by[id])); }
  else if(Es.length){ mode="word"; title="Words"; units=Es.map(w=>U(w,w,"",[EI(w)])); words=Es.map(EI); }
  else if(Ws.length){ mode="comp"; title="Joined letters"; units=Ws.map(w=>U(w,w,"",[WI(w)])); words=Ws.map(WI); }
  else { mode="letters"; title="Letters"; const ids=Ls.length?Ls:Ms.length?ORDER.filter(id=>Ms.includes(id)):ORDER;
    if(!Ls.length&&!Ms.length) note="This page has no table to practise, so here are the 29 letters.";
    units=ids.map(id=>U(id,L[id].ch,L[id].en,[LI(id)])); }
  const rows6=mode==="letters"&&units.length===29;
  return {i,key:rows6?"letters":"p"+i,label,title,mode,units,words,note,rows6,all:units.flatMap(u=>u.items)};
}

/* ================= shell ================= */
const S={info:null,sel:new Set(),view:"hub",cleanup:[],keys:null};
const PZ=document.createElement("div"); PZ.className="pz"; PZ.hidden=true;
PZ.innerHTML=`<div class="pz-card" role="dialog" aria-modal="true" aria-label="Practice">
  <div class="pz-head"><div class="pz-title" id="pzT"></div><div class="pz-sp"></div>
    <button class="pz-chip" id="pzStu" title="Change student"></button><span class="pz-stars" id="pzStars" title="Stars earned"></span>
    <button class="pz-ic" id="pzSnd" title="Sound on / off"></button><button class="pz-ic" id="pzX" aria-label="Close">✕</button></div>
  <div class="pz-body" id="pzB"></div></div>`;
document.body.appendChild(PZ);
const B=$("#pzB",PZ);
const selUnits=()=>S.info.units.filter(u=>S.sel.has(u.id));
const selItems=()=>selUnits().flatMap(u=>u.items);
function saveSel(){ stu().sel=stu().sel||{}; stu().sel[S.info.key]=[...S.sel]; save(); }
function loadSel(){ const ids=S.info.units.map(u=>u.id), saved=(stu().sel||{})[S.info.key];
  S.sel=new Set(saved&&saved.some(id=>ids.includes(id))?saved.filter(id=>ids.includes(id)):(S.info.rows6?ids.slice(0,6):ids)); }
function header(){ $("#pzT",PZ).innerHTML=`🎯 Practice<small>${S.info.label} · ${S.info.title}</small>`; $("#pzStu",PZ).textContent="👤 "+store.cur;
  $("#pzStars",PZ).textContent="⭐ "+(stu().stars||0); $("#pzSnd",PZ).textContent=store.sound?"🔔":"🔕"; }
function runCleanup(){ S.cleanup.splice(0).forEach(f=>{ try{ f(); }catch(e){} }); S.keys=null; }
function toast(t){ const d=document.createElement("div"); d.className="pz-toast"; d.innerHTML=t; B.appendChild(d); setTimeout(()=>d.remove(),2500); }
function open(i){ S.info=pageInfo(i); loadSel(); PZ.hidden=false; document.body.style.overflow="hidden"; header(); hub(); }
function close(){ runCleanup(); PZ.hidden=true; B.innerHTML=""; document.body.style.overflow=""; }

/* ================= hub: 1 choose what, 2 choose an activity ================= */
const LEG=`<div class="pz-leg"><span><i></i>New</span><span><i class="lv-weak"></i>Needs practice</span><span><i class="lv-learn"></i>Learning</span><span><i class="lv-good"></i>Knows it</span></div>`;
const unitChip=u=>`<button class="pz-u ${S.sel.has(u.id)?"on":""} lv-${level(u.items)}" data-u="${esc(u.id)}">${A(u.label)}${u.name?`<small>${u.name}</small>`:""}</button>`;
function count(){ const n=selUnits().length, m=S.info.mode, el=$("#pzN",B); if(!el) return;
  el.textContent=n+" "+(m==="word"?(n===1?"word":"words"):m==="comp"?(n===1?"box":"boxes"):(n===1?"letter":"letters"))+" chosen"; }
function hub(){
  runCleanup(); S.view="hub"; const inf=S.info;
  const pre=inf.rows6?[["r1","Row 1"],["r2","Rows 1–2"],["r3","Rows 1–3"],["r4","Rows 1–4"],["all","All 29"]]:[["all","All"],["none","None"]];
  const acts=["flash","find","balloon","memory"].concat(inf.words.length?["spot"]:[],["read"]);
  B.innerHTML=`<div class="pz-hub">${inf.note?`<p class="pz-hint">${inf.note}</p>`:""}
    <section class="pz-sec"><div class="pz-sh"><b>1 · Choose what to practise</b><span class="n" id="pzN"></span><div class="pz-sp"></div>
      ${pre.map(([k,t])=>`<button class="pz-pre" data-pre="${k}">${t}</button>`).join("")}<button class="pz-pre" data-pre="weak">Needs practice</button><button class="pz-pre" data-view="prog">📊 Progress</button></div>
      <div class="pz-units ${inf.rows6?"rows6":""} ${inf.mode==="comp"||inf.mode==="word"?"wide":""}" id="pzU">${inf.units.map(unitChip).join("")}</div>${LEG}</section>
    <section class="pz-sec"><div class="pz-sh"><b>2 · Choose an activity</b><div class="pz-sp"></div><label class="pz-lit"><input type="checkbox" id="pzOn" ${online()?"checked":""}> Online class (numbers to say)</label><label class="pz-lit"><input type="checkbox" id="pzLit" ${little()?"checked":""}> Age 3–5 (easier and slower)</label></div>
      <button class="pz-quick" data-quick="1">▶ Quick practice <small>about 5 minutes · Flash cards → Find it → Balloon pop</small></button>
      <div class="pz-acts">${acts.map(a=>`<button class="pz-act" data-act="${a}"><span class="e">${ACTS[a].icon}</span><div><b>${ACTS[a].title}</b><span>${ACTS[a].desc}</span></div></button>`).join("")}</div></section></div>`;
  count();
}
B.addEventListener("click",e=>{
  const t=e.target.closest("[data-u],[data-pre],[data-act],[data-quick],[data-view],[data-go],[data-stu]"); if(!t) return;
  if(t.dataset.u!==undefined){ const id=t.dataset.u; if(S.sel.has(id)) S.sel.delete(id); else S.sel.add(id); t.classList.toggle("on"); saveSel(); count(); return; }
  if(t.dataset.pre){ const ids=S.info.units.map(u=>u.id), p=t.dataset.pre; let pick;
    if(p==="all") pick=ids; else if(p==="none") pick=[]; else if(p[0]==="r") pick=ids.slice(0,6*+p[1]);
    else { pick=S.info.units.filter(u=>["weak","learn"].includes(level(u.items))).map(u=>u.id); if(!pick.length){ toast("Nothing needs practice yet. Play an activity first."); return; } }
    S.sel=new Set(pick); saveSel(); $("#pzU",B).innerHTML=S.info.units.map(unitChip).join(""); count(); return; }
  if(t.dataset.view==="prog") return progress();
  if(t.dataset.view==="hub") return hub();
  if(t.dataset.quick) return quick();
  if(t.dataset.act) return start(t.dataset.act);
  if(t.dataset.go==="weak"){ const items=ORDER.map(LI).filter(it=>["weak","learn"].includes(level([it]))); if(!items.length){ toast("No letters need work yet."); return; } return start("flash",{items}); }
  if(t.dataset.stu!==undefined){ store.cur=t.dataset.stu; save(); loadSel(); header(); hub(); }
});
B.addEventListener("change",e=>{ if(e.target.id==="pzLit"){ stu().little=e.target.checked; save(); } if(e.target.id==="pzOn"){ store.online=e.target.checked; save(); } });

/* ================= running an activity ================= */
function start(name,opt){
  opt=opt||{};
  if(name==="spot"&&!opt.items){ let ws=S.info.mode==="shapes"?S.info.words.filter(w=>w.ps.some(p=>S.sel.has(p.id))):selItems(); if(!ws.length) ws=S.info.words; opt.items=ws; }
  const items=opt.items||selItems();
  if(!items.length){ toast("Choose at least one first."); return; }
  runCleanup(); S.view="act"; const act=ACTS[name], ch=opt.chain;
  B.innerHTML=`<div class="pz-actw"><div class="pz-acth"><button class="pz-btn sm" id="pzBack">← Activities</button><b>${act.icon} ${act.title}</b>${ch?`<span class="pz-chainp">Step ${ch.i+1} of ${ch.steps.length}</span>`:""}<div class="pz-sp"></div><span class="pz-prog" id="pzP"></span></div><div class="pz-stage" id="pzS"></div></div>`;
  $("#pzBack",B).onclick=hub;
  const stage=$("#pzS",B), P=$("#pzP",B);
  act.run({items,stage,opt,little:little(),online:online(),prog:(a,b)=>{ P.textContent=a+" / "+b; },label:t=>{ P.textContent=t; },
    onLeave:f=>S.cleanup.push(f),later:(f,ms)=>{ const id=setTimeout(f,ms); S.cleanup.push(()=>clearTimeout(id)); },keys:f=>{ S.keys=f; },done:r=>finish(name,r,opt,stage)});
}
function quick(){
  const sel=selItems(); if(!sel.length){ toast("Choose at least one first."); return; }
  const chain={steps:["flash","find","balloon"],i:0,stars:0,sets:[order(sel).slice(0,little()?6:10),sel,sel]};
  start("flash",{chain,items:chain.sets[0]});
}
function finish(name,r,opt,stage){
  runCleanup(); const ratio=r.total?r.right/r.total:1, stars=r.stars||(ratio>=0.9?3:ratio>=0.6?2:1);
  stu().stars=(stu().stars||0)+stars; save(); header();
  const ch=opt.chain, last=!ch||ch.i>=ch.steps.length-1; if(ch) ch.stars=(ch.stars||0)+stars;
  const missed=(r.missed||[]).slice(0,10), nxt=ch&&!last?ACTS[ch.steps[ch.i+1]]:null, P=$("#pzP",B); if(P) P.textContent="";
  stage.innerHTML=`<div class="pz-res"><div class="pz-st">${[1,2,3].map(i=>`<span class="${i<=stars?"on":""}" style="animation-delay:${i*0.18}s">★</span>`).join("")}</div>
    <h2>${stars===3?"MashaAllah! Excellent!":stars===2?"MashaAllah! Well done!":"Good try! Keep going!"}</h2>
    <p class="pz-rs">${r.text||`${r.right} of ${r.total} right the first time`}</p>
    ${missed.length?`<div class="pz-miss"><span>Practise these again:</span>${missed.map(m=>`<i style="--k:${m.k}">${m.html}</i>`).join("")}</div>`:""}
    ${ch&&last?`<p class="pz-rs big">Quick practice finished · ${ch.stars} stars today ⭐</p>`:""}
    <div class="pz-rb">${nxt?`<button class="pz-btn pri" id="pzNext">Next: ${nxt.icon} ${nxt.title} →</button>`:`<button class="pz-btn pri" id="pzAgain">↻ Play again</button>`}
      ${missed.length&&!nxt?`<button class="pz-btn" id="pzMiss">🃏 Flash cards for the missed ones</button>`:""}<button class="pz-btn" id="pzHub">${nxt?"Stop here":"← Activities"}</button></div></div>`;
  const q=id=>$("#"+id,stage);
  if(q("pzNext")) q("pzNext").onclick=()=>start(ch.steps[ch.i+1],{chain:{steps:ch.steps,i:ch.i+1,stars:ch.stars,sets:ch.sets},items:ch.sets[ch.i+1]});
  if(q("pzAgain")) q("pzAgain").onclick=()=>start(name,{items:opt.items});
  if(q("pzMiss")) q("pzMiss").onclick=()=>start("flash",{items:r.missed});
  q("pzHub").onclick=hub;
  if(stars===3||(ch&&last)){ sfx.win(); if(typeof celebrate==="function") celebrate(null); } else sfx.ok();
}

/* wrong answers to show next to the right one: look-alikes first */
function distract(t,n){
  const pool=S.info.all.filter(x=>x.key!==t.key&&x.kind===t.kind); let pri;
  if(t.kind==="letter"){ const sel=selItems().filter(x=>x.kind==="letter"&&x.id!==t.id).map(x=>x.id), fam=(VF[t.id]||[]).filter(x=>x!==t.id);
    pri=[...shuffle(fam.filter(x=>sel.includes(x))),...shuffle(sel),...shuffle(fam),...shuffle(ORDER.filter(x=>x!==t.id))].map(LI); }
  else if(t.kind==="form"){ const same=pool.filter(x=>x.f===t.f), fam=same.filter(x=>(VF[t.id]||[]).includes(x.id));
    pri=[...shuffle(fam),...shuffle(same),...shuffle(ORDER.filter(id=>id!==t.id&&L[id].j!=="U"&&(t.f==="E"||L[id].j==="D")).map(id=>FI(id,t.f)))]; }
  else if(t.kind==="har") pri=[...shuffle(pool.filter(x=>x.id===t.id)),...shuffle(pool.filter(x=>x.h===t.h)),...shuffle(pool)];
  else pri=shuffle(pool).sort((a,b)=>Math.abs(a.len-t.len)-Math.abs(b.len-t.len));
  const out=[], seen=new Set([t.key]); for(const x of pri){ if(seen.has(x.key)) continue; seen.add(x.key); out.push(x); if(out.length>=n) break; } return out;
}
function promptOf(t){
  if(t.kind==="letter") return `Find <b>${t.name}</b> ${A(t.ur,"sm")}`;
  if(t.kind==="form") return `Find <b>${t.name}</b><small>in its ${FORMN[t.f].toLowerCase()} shape</small>`;
  if(t.kind==="har") return `Find <b>${t.name}</b><small>${L[t.id].en} with ${HN[t.h]} (${HU[t.h]})</small>`;
  if(t.kind==="comp") return `Find ${A(t.ps.map(isoOf).join(" + "))}<small>joined together</small>`;
  return `Find <b>${t.name}</b>`;
}

/* ---------- 1. flash cards: the child says it, the teacher marks it ---------- */
function actFlash(c){
  const queue=c.opt.chain?c.items.slice():order(c.items), total=queue.length, first={}, miss={}, missed=[]; let doneN=0;
  c.stage.innerHTML=`<div class="pz-fl"><div class="pz-flc" id="flC"><div class="pz-flf" id="flF"></div><div class="pz-fla" id="flA" hidden></div></div>
    <div class="pz-flb"><button class="pz-btn no" id="flNo">✗ Not yet</button><button class="pz-btn" id="flShow">Show answer</button><button class="pz-btn yes" id="flYes">✓ Knew it</button></div>
    <p class="pz-hint">The child says it out loud. You tap ✓ or ✗. Missed cards come back.</p></div>`;
  const F=$("#flF",c.stage), An=$("#flA",c.stage), C=$("#flC",c.stage);
  function show(){ const it=queue[0]; F.innerHTML=it.html; F.style.setProperty("--k",it.k); An.innerHTML=it.answer; An.hidden=true; C.classList.remove("in"); void C.offsetWidth; C.classList.add("in"); c.prog(doneN,total); }
  function mark(ok){ const it=queue.shift(); if(!(it.key in first)){ first[it.key]=ok; record(it.key,ok); }
    if(ok){ doneN++; sfx.ok(); } else { sfx.no(); miss[it.key]=(miss[it.key]||0)+1; if(!missed.includes(it)) missed.push(it); if(miss[it.key]<3) queue.splice(Math.min(queue.length,2),0,it); else doneN++; }
    if(!queue.length) return c.done({right:Object.values(first).filter(Boolean).length,total,missed});
    show(); }
  $("#flYes",c.stage).onclick=()=>mark(true); $("#flNo",c.stage).onclick=()=>mark(false); $("#flShow",c.stage).onclick=()=>{ An.hidden=!An.hidden; };
  c.keys(e=>{ if(e.key===" "){ e.preventDefault(); An.hidden=!An.hidden; } else if(e.key==="ArrowRight"||e.key==="2") mark(true); else if(e.key==="ArrowLeft"||e.key==="1") mark(false); });
  show();
}

/* ---------- 2. find it: the teacher says the name, the child taps it ---------- */
function actFind(c){
  const rounds=c.opt.chain?(c.little?5:8):(c.little?6:Math.max(8,Math.min(12,c.items.length)));
  const base=order(c.items), targets=[]; let g=0;
  while(targets.length<rounds&&g++<60){ for(const it of (targets.length?shuffle(base):base)){ if(targets.length>=rounds) break; if(base.length>1&&targets[targets.length-1]===it) continue; targets.push(it); } }
  let n=0, right=0, streak=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-find"><div class="pz-q" id="fiQ"></div><div class="pz-ch" id="fiC"></div><p class="pz-fb" id="fiF">&nbsp;</p>${c.online?`<p class="pz-hint">The child says the number. You tap it, or press that number key.</p>`:""}</div>`;
  const Q=$("#fiQ",c.stage), C=$("#fiC",c.stage), F=$("#fiF",c.stage);
  function round(){
    const t=targets[n], k=c.little?(streak>=3?3:2):(streak>=6?6:streak>=3?4:3), ch=shuffle([t,...distract(t,k-1)]); let firstTry=true, lock=false;
    Q.innerHTML=promptOf(t); F.innerHTML="&nbsp;"; F.className="pz-fb"; c.prog(n+1,rounds);
    C.className="pz-ch"+(ch.length>4?" two":""); C.style.setProperty("--c",ch.length>4?3:ch.length);
    C.innerHTML=ch.map((it,i)=>`<button class="pz-c" data-i="${i}" style="--k:${it.k}">${c.online?`<i class="pz-num">${i+1}</i>`:""}${it.html}</button>`).join("");
    c.keys(e=>{ const k=+e.key; if(k>=1&&k<=ch.length) C.children[k-1].click(); });
    C.onclick=e=>{ const b=e.target.closest(".pz-c"); if(!b||lock) return; const it=ch[+b.dataset.i];
      if(it===t){ lock=true; b.classList.add("ok"); sfx.ok(); if(firstTry){ right++; streak++; record(t.key,true); } F.className="pz-fb good"; F.innerHTML="MashaAllah! ⭐";
        c.later(()=>{ n++; if(n>=rounds) c.done({right,total:rounds,missed}); else round(); },850); }
      else { b.classList.add("bad"); sfx.no(); if(firstTry){ firstTry=false; streak=0; record(t.key,false); if(!missed.includes(t)) missed.push(t); }
        F.className="pz-fb bad"; F.innerHTML=`That one is <b>${it.name}</b>. Try again.`; } };
  }
  round();
}

/* ---------- 3. balloon pop ---------- */
function actBalloon(c){
  const targets=order(c.items).slice(0,c.opt.chain?Math.min(2,c.items.length):Math.min(c.little?3:4,c.items.length)), need=c.little?4:5, missed=[];
  const COLS=["#FFC9D6","#BFE3FF","#CDEFC3","#FFE3A6","#DDD0FF","#FFD2B8"];
  let ti=0, got=0, clean=true, right=0, lastLane=-1, sinceT=9, fast=false, alive=true;
  c.stage.innerHTML=`<div class="pz-bl"><div class="pz-blt"><span>Pop every</span><span class="x" id="blX"></span><b id="blN"></b><span class="pz-dots" id="blD"></span><div class="pz-sp"></div>${c.online?`<span class="pz-hint">The child says the balloon’s number</span>`:""}<button class="pz-btn sm" id="blSp">🐢 Slow</button></div><div class="pz-sky" id="blS"></div></div>`;
  const sky=$("#blS",c.stage), X=$("#blX",c.stage), N=$("#blN",c.stage), D=$("#blD",c.stage), SP=$("#blSp",c.stage);
  SP.onclick=()=>{ fast=!fast; SP.textContent=fast?"🐇 Fast":"🐢 Slow"; };
  function head(){ const t=targets[ti]; X.innerHTML=t.html; X.style.setProperty("--k",t.k); N.textContent=t.kind==="comp"?"":t.name;
    D.innerHTML=Array.from({length:need},(_,i)=>`<i class="${i<got?"on":""}"></i>`).join(""); c.prog(ti+1,targets.length); }
  function spawn(){
    if(!alive||document.hidden||!sky.clientHeight||$$(".pz-bw",sky).length>=((c.little||c.online)?5:7)) return;
    const t=targets[ti]; sinceT++; const ds=distract(t,6), isT=!ds.length||sinceT>=3||Math.random()<(c.little?0.55:0.42); if(isT) sinceT=0;
    const it=isT?t:ds[Math.floor(Math.random()*ds.length)], lanes=it.len>=3?4:6; let lane; do{ lane=Math.floor(Math.random()*lanes); }while(lane===lastLane); lastLane=lane;
    const w=document.createElement("div"); w.className="pz-bw"; w._it=it; w.style.left=((lane+0.5)*100/lanes)+"%";
    w.style.setProperty("--d",((fast?5:(c.little||c.online)?11:8)+Math.random()*1.5).toFixed(2)+"s"); w.style.setProperty("--travel",(sky.clientHeight+280)+"px");
    let num=0; if(c.online){ const used=new Set($$(".pz-bw",sky).map(x=>x._n)); for(let k=1;k<=9;k++){ if(!used.has(k)){ num=k; break; } } } w._n=num;
    w.innerHTML=`<button class="pz-b${it.len>=3?" wide":""}" style="--c:${COLS[Math.floor(Math.random()*COLS.length)]};--k:${it.k}">${it.html}${num?`<i class="pz-num">${num}</i>`:""}</button>`;
    w.addEventListener("animationend",e=>{ if(e.animationName==="pzRise") w.remove(); }); sky.appendChild(w);
  }
  function hit(b){
    if(!b||b.classList.contains("pop")) return; const t=targets[ti], w=b.parentNode;
    if(w._it===t){ b.classList.add("pop"); sfx.pop(); setTimeout(()=>w.remove(),270); got++;
      if(got>=need){ if(clean){ right++; record(t.key,true); } ti++; got=0; clean=true; $$(".pz-bw",sky).forEach(x=>{ if(x!==w) x.remove(); });
        if(ti>=targets.length){ alive=false; return c.later(()=>c.done({right,total:targets.length,missed,text:`${targets.length} ${targets.length===1?"round":"rounds"} popped · ${right} without a mistake`}),450); }
        sfx.ok(); toast("MashaAllah! Next one…"); }
      head(); }
    else { b.classList.add("no"); setTimeout(()=>b.classList.remove("no"),450); sfx.no(); if(clean){ clean=false; record(t.key,false); if(!missed.includes(t)) missed.push(t); } }
  }
  sky.addEventListener("pointerdown",e=>{ const b=e.target.closest(".pz-b"); if(b){ e.preventDefault(); hit(b); } });
  c.keys(e=>{ const k=+e.key; if(k>=1&&k<=9){ const w=$$(".pz-bw",sky).find(x=>x._n===k&&!x.firstChild.classList.contains("pop")); if(w) hit(w.firstChild); } });
  const iv=setInterval(spawn,(c.little||c.online)?1200:850); c.onLeave(()=>{ alive=false; clearInterval(iv); });
  head(); spawn();
}

/* ---------- 4. memory match ---------- */
function actMemory(c){
  const want=c.little?3:6, used=new Set(), chosen=[];
  const take=it=>{ const b=it.kind==="form"?it.id:it.key; if(used.has(b)||chosen.length>=want) return; used.add(b); chosen.push(it); };
  shuffle(c.items).forEach(take); if(chosen.length<3) distract(chosen[0],8).forEach(it=>{ if(chosen.length<3) take(it); });
  const isForm=chosen[0].kind==="form";
  const cards=shuffle(chosen.flatMap((it,i)=>[{p:i,html:it.html,k:it.k},{p:i,html:isForm?LI(it.id).html:it.html,k:isForm?1:it.k}]));
  const n=cards.length, cols=n<=6?3:n<=8?4:n<=10?5:4;
  c.stage.innerHTML=`<div class="pz-mmw"><p class="pz-hint">${isForm?"Match each joined shape with its letter.":"Turn two cards over and find the pairs."} Say the name every time.${c.online?" The child says the two numbers.":""}</p>
    <div class="pz-mm" style="--c:${cols}">${cards.map((cd,i)=>`<button class="pz-mc" data-i="${i}" style="--k:${cd.k}">${c.online?`<i class="pz-num">${i+1}</i>`:""}${cd.html}</button>`).join("")}</div></div>`;
  let open2=[], lock=false, moves=0, found=0; c.prog(0,chosen.length);
  $(".pz-mm",c.stage).onclick=e=>{
    const b=e.target.closest(".pz-mc"); if(!b||lock||b.classList.contains("up")) return; b.classList.add("up"); sfx.flip(); open2.push(b); if(open2.length<2) return;
    moves++; const [a,d]=open2; open2=[];
    if(cards[+a.dataset.i].p===cards[+d.dataset.i].p){ a.classList.add("ok"); d.classList.add("ok"); sfx.ok(); found++; c.prog(found,chosen.length);
      if(found>=chosen.length) c.later(()=>c.done({right:found,total:found,stars:moves<=found*1.7?3:moves<=found*2.7?2:1,text:`All ${found} pairs found in ${moves} turns`}),750); }
    else { lock=true; c.later(()=>{ a.classList.remove("up"); d.classList.remove("up"); lock=false; },c.little?1500:1000); }
  };
}

/* ---------- 5. spot it: find the letter hiding inside a word ---------- */
function pieces(it){ const ps=it.ps, out=[]; for(let i=0;i<ps.length;i++){ const p=ps[i], n=ps[i+1];
  if(p.id==="lam"&&n&&n.ch==="ا"&&p.jn){ out.push({ids:["lam","alif"],t:(p.jp?ZWJ:"")+p.ch+p.m+n.ch+n.m,form:p.form}); i++; }
  else out.push({ids:nameOf(p)===L[p.id].en?[p.id]:[],t:ptxt(p),form:p.form}); } return out; }
function actSpot(c){
  const words=c.items.filter(w=>w.ps&&pieces(w).some(p=>p.ids.length)); if(!words.length) return c.done({right:0,total:0,text:"No words on this page."});
  const rounds=c.little?5:8, list=[]; let g=0; while(list.length<rounds&&g++<40) shuffle(words).forEach(w=>{ if(list.length<rounds&&list[list.length-1]!==w) list.push(w); });
  let n=0, right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-spot"><div class="pz-q" id="spQ"></div><div class="pz-word${c.online?" num":""}" id="spW"></div><p class="pz-fb" id="spF">&nbsp;</p>${c.online?`<p class="pz-hint">The child says the number under the letter. You tap it, or press that number key.</p>`:""}</div>`;
  const Q=$("#spQ",c.stage), W=$("#spW",c.stage), F=$("#spF",c.stage);
  function round(){
    const w=list[n], pcs=pieces(w); let pool=pcs.flatMap(p=>p.ids); if(S.info.mode==="shapes"){ const pref=pool.filter(id=>S.sel.has(id)); if(pref.length) pool=pref; }
    const id=pool[Math.floor(Math.random()*pool.length)]; let firstTry=true, lock=false;
    Q.innerHTML=`Tap <b>${L[id].en}</b> ${A(L[id].ch)}`; F.innerHTML="&nbsp;"; F.className="pz-fb"; c.prog(n+1,list.length);
    W.style.setProperty("--k",w.len<=2?1:w.len===3?.85:.68); W.innerHTML=pcs.map((p,i)=>`<span data-i="${i}" data-n="${i+1}">${p.t}</span>`).join("");
    c.keys(e=>{ const k=+e.key; if(k>=1&&k<=pcs.length) W.children[k-1].click(); });
    W.onclick=e=>{ const s=e.target.closest("span"); if(!s||lock) return; const p=pcs[+s.dataset.i];
      if(p.ids.includes(id)){ lock=true; s.classList.add("ok"); sfx.ok(); if(firstTry){ right++; record("l:"+id,true); }
        F.className="pz-fb good"; F.innerHTML=`MashaAllah! That is <b>${L[id].en}</b> in its ${FORMN[p.form].toLowerCase()} shape.`;
        c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed}); else round(); },1400); }
      else { s.classList.add("bad"); setTimeout(()=>s.classList.remove("bad"),450); sfx.no(); if(firstTry){ firstTry=false; record("l:"+id,false); if(!missed.includes(LI(id))) missed.push(LI(id)); }
        F.className="pz-fb bad"; F.innerHTML="Not that one. Try again."; } };
  }
  round();
}

/* ---------- 6. read check: the page, shuffled; the teacher taps the wrong ones ---------- */
function actRead(c){
  const cap=c.little?12:30, fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); let items=[], bad=new Set(), t0=Date.now();
  c.stage.innerHTML=`<div class="pz-rc"><p class="pz-hint">The child reads every box, starting from the right. Tap any box that was wrong, then tap Done.</p><div class="pz-rg" id="rcG"></div>
    <div class="pz-rf"><button class="pz-btn sm" id="rcSh">↻ Shuffle again</button><span class="pz-time" id="rcT">0:00</span><button class="pz-btn pri" id="rcDone">Done ✓</button></div></div>`;
  const G=$("#rcG",c.stage), T=$("#rcT",c.stage);
  function deal(){ items=shuffle(c.items).slice(0,cap); bad=new Set(); const n=items.length, cols=n<=4?n:n<=8?4:n<=15?5:6, rows=Math.ceil(n/cols);
    G.style.setProperty("--c",cols); G.style.setProperty("--fs",`min(${Math.round(36/rows)}vh,${Math.round(340/cols)+40}px)`);
    G.innerHTML=items.map((it,i)=>`<button class="pz-rcell" data-i="${i}" style="--k:${it.k}">${it.html}</button>`).join(""); t0=Date.now();
    c.label(n<c.items.length?`${n} of ${c.items.length} boxes`:`${n} boxes`); }
  G.onclick=e=>{ const b=e.target.closest(".pz-rcell"); if(!b) return; const it=items[+b.dataset.i]; b.classList.toggle("bad"); if(bad.has(it)) bad.delete(it); else bad.add(it); sfx.flip(); };
  const iv=setInterval(()=>{ T.textContent=fmt(Math.round((Date.now()-t0)/1000)); },500); c.onLeave(()=>clearInterval(iv));
  $("#rcSh",c.stage).onclick=deal;
  $("#rcDone",c.stage).onclick=()=>{ const secs=Math.round((Date.now()-t0)/1000), right=items.length-bad.size; items.forEach(it=>record(it.key,!bad.has(it)));
    c.done({right,total:items.length,missed:[...bad],text:`${right} of ${items.length} read correctly · time ${fmt(secs)}`}); };
  deal();
}

const ACTS={
  flash:{icon:"🃏",title:"Flash cards",desc:"The child says it. You tap ✓ or ✗. Missed cards come back.",run:actFlash},
  find:{icon:"👆",title:"Find it",desc:"You say the name. The child taps the right one.",run:actFind},
  balloon:{icon:"🎈",title:"Balloon pop",desc:"Pop every balloon that has the right one.",run:actBalloon},
  memory:{icon:"🧠",title:"Memory match",desc:"Turn two cards over and find the pairs.",run:actMemory},
  spot:{icon:"🔍",title:"Spot it",desc:"Find the letter hiding inside a word.",run:actSpot},
  read:{icon:"📋",title:"Read check",desc:"The page, shuffled. Tap the ones that were wrong.",run:actRead}
};

/* ================= progress map and students ================= */
function progress(){
  runCleanup(); S.view="prog"; const inf=S.info, lv=ORDER.map(id=>level([LI(id)])), cnt=k=>lv.filter(x=>x===k).length;
  B.innerHTML=`<div class="pz-pv"><div class="pz-acth"><button class="pz-btn sm" data-view="hub">← Back</button><b>📊 Progress · ${esc(store.cur)}</b><div class="pz-sp"></div><span class="pz-prog">⭐ ${stu().stars||0} stars</span></div>
    <h3>The 29 letters</h3>
    <div class="pz-cnt"><span class="lv-good">Knows it: ${cnt("good")}</span><span class="lv-learn">Learning: ${cnt("learn")}</span><span class="lv-weak">Needs practice: ${cnt("weak")}</span><span>New: ${cnt("new")}</span></div>
    <div class="pz-pg">${ORDER.map((id,i)=>`<div class="pz-pc lv-${lv[i]}">${A(L[id].ch)}<small>${L[id].en}</small></div>`).join("")}</div>
    ${inf.mode!=="letters"?`<h3>${inf.label} · ${inf.title}</h3><div class="pz-pg auto">${inf.units.map(u=>`<div class="pz-pc lv-${level(u.items)}">${A(u.label)}${u.name?`<small>${u.name}</small>`:""}</div>`).join("")}</div>`:""}
    ${LEG}<p class="pz-hint" style="text-align:left">A letter turns green when it has been answered right three times more than wrong. Flash cards, Find it, Spot it and Read check all count.</p>
    <div class="pz-rb" style="justify-content:flex-start"><button class="pz-btn pri" data-go="weak">🃏 Practise the letters that need work</button></div></div>`;
}
function students(){
  runCleanup(); S.view="stu"; const names=Object.keys(store.students);
  B.innerHTML=`<div class="pz-pv"><div class="pz-acth"><button class="pz-btn sm" data-view="hub">← Back</button><b>👤 Who is practising?</b></div>
    <p class="pz-hint" style="text-align:left">Each student keeps their own stars and progress on this device. No login is needed.</p>
    <div class="pz-stu">${names.map(n=>`<button data-stu="${esc(n)}" class="${n===store.cur?"on":""}">${esc(n)} · ⭐ ${store.students[n].stars||0}</button>`).join("")}</div>
    <h3>Add a student</h3><div class="pz-add"><input id="pzNew" maxlength="30" placeholder="Student name"><button class="pz-btn pri sm" id="pzAdd">＋ Add</button></div>
    <h3>${esc(store.cur)}</h3><div class="pz-add"><button class="pz-btn sm" id="pzReset">Reset progress</button>${names.length>1?`<button class="pz-btn sm" id="pzDel">Remove this student</button>`:""}</div></div>`;
  const add=()=>{ const n=$("#pzNew",B).value.trim(); if(!n) return; if(!store.students[n]) store.students[n]=blank(); store.cur=n; save(); loadSel(); header(); hub(); };
  $("#pzAdd",B).onclick=add; $("#pzNew",B).onkeydown=e=>{ if(e.key==="Enter") add(); };
  const twice=(btn,fn)=>{ if(!btn) return; btn.onclick=()=>{ if(btn.dataset.sure){ fn(); } else { btn.dataset.sure="1"; btn.textContent="Tap again to confirm"; setTimeout(()=>{ if(btn.isConnected){ delete btn.dataset.sure; students(); } },3500); } }; };
  twice($("#pzReset",B),()=>{ store.students[store.cur]=blank(); save(); loadSel(); header(); students(); toast("Progress reset."); });
  twice($("#pzDel",B),()=>{ delete store.students[store.cur]; store.cur=Object.keys(store.students)[0]; save(); loadSel(); header(); students(); });
}

/* ================= buttons and keys ================= */
$("#pzX",PZ).onclick=close;
$("#pzStu",PZ).onclick=students;
$("#pzSnd",PZ).onclick=()=>{ store.sound=!store.sound; save(); header(); if(store.sound) sfx.ok(); };
addEventListener("keydown",e=>{
  if(PZ.hidden) return; e.stopPropagation();
  if(e.key==="Escape"){ e.preventDefault(); if(S.view==="hub") close(); else hub(); return; }
  if(S.keys&&e.target.tagName!=="INPUT") S.keys(e);
},true);
const hs=document.getElementById("hsBtn");
if(hs){ const ob=document.createElement("button"); ob.className="tbb wide pz-open"; ob.id="pzOpen"; ob.title="Practice and games for this page"; ob.innerHTML="🎯<span>Practice this page</span>";
  hs.parentNode.insertBefore(ob,hs); ob.onclick=()=>open(curPage()); }
{ const pr=new URLSearchParams(location.search).get("practice"); if(pr!==null){ const want=pr.trim().toLowerCase(), idx=PAGES.findIndex(p=>{ const no=p.querySelector(".hdr .no"); return no&&no.textContent.trim().toLowerCase()===want; }); setTimeout(()=>open(idx>=0?idx:3),300); } }
window.EQPractice={open,close,start,pageInfo,store:()=>store};
})();
