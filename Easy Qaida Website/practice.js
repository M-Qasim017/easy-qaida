/* eQaida — Practice mode.
   Teacher-led practice and games, built from the letters / words of the page that is open.
   Opens from the "Practice this page" button in the toolbar. Progress, stars and points are kept per student on this device. */
(function(){
"use strict";
if(typeof L==="undefined"||typeof PAGES==="undefined") return;
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const shuffle=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const pickOne=a=>a[Math.floor(Math.random()*a.length)];
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmtN=n=>Number(n||0).toLocaleString("en");
const INK="#14231D";

/* ================= line icons ================= */
const ICO={
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3"/>',
  cards:'<rect x="3" y="7" width="13" height="14" rx="2.5"/><path d="M8 3.5h10.5a2 2 0 0 1 2 2V17"/>',
  pointer:'<path d="M8.5 13V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M11.5 11.5v-2a1.5 1.5 0 0 1 3 0V12"/><path d="M14.5 10.5a1.5 1.5 0 0 1 3 0V12"/><path d="M17.5 11.5a1.5 1.5 0 0 1 3 0V15a6.5 6.5 0 0 1-6.5 6.5h-1.6a6.5 6.5 0 0 1-5.5-3L4.6 15a1.6 1.6 0 0 1 2.6-1.9L8.5 14.5"/>',
  balloon:'<path d="M12 16.2c-3.4 0-6-3.2-6-7.2a6 6 0 0 1 12 0c0 4-2.6 7.2-6 7.2z"/><path d="M10.8 16.2h2.4l-.6 1.5h-1.2z"/><path d="M12 17.7c0 1.8-1.8 2-1.8 3.8"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1.8"/><rect x="13" y="4" width="7" height="7" rx="1.8"/><rect x="4" y="13" width="7" height="7" rx="1.8"/><rect x="13" y="13" width="7" height="7" rx="1.8"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>',
  clipboard:'<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1.5"/><path d="M9 14l2 2 4-4"/>',
  train:'<rect x="5" y="3" width="14" height="13" rx="3"/><path d="M5 10h14M9.5 6.5h5"/><circle cx="8.5" cy="13" r=".9"/><circle cx="15.5" cy="13" r=".9"/><path d="M8 16l-2.5 5M16 16l2.5 5M7.2 19h9.6"/>',
  dots:'<path d="M3.5 12.5c0 3.6 3.8 6 8.5 6s8.5-2.4 8.5-6"/><circle cx="9" cy="7" r="1.6"/><circle cx="15" cy="7" r="1.6"/>',
  shapes:'<circle cx="7.5" cy="7.5" r="3.5"/><rect x="13" y="4" width="7" height="7" rx="1.8"/><path d="M7.5 13.5l4 6.5h-8z"/><path d="M14 17h6"/>',
  blocks:'<rect x="3" y="13" width="8" height="7" rx="1.8"/><rect x="13" y="13" width="8" height="7" rx="1.8"/><rect x="8" y="4" width="8" height="7" rx="1.8"/>',
  peek:'<ellipse cx="12" cy="19" rx="8.5" ry="2.5"/><path d="M7 18.5V12a5 5 0 0 1 10 0v6.5"/><circle cx="10" cy="11.5" r=".9"/><circle cx="14" cy="11.5" r=".9"/>',
  map:'<path d="M3 6.5l6-3 6 3 6-3v14l-6 3-6-3-6 3z"/><path d="M9 3.5v14M15 6.5v14"/>',
  bolt:'<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  star:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
  coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7.3l1.4 2.9 3.2.5-2.3 2.2.5 3.2-2.8-1.5-2.8 1.5.5-3.2-2.3-2.2 3.2-.5z"/>',
  vol:'<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  left:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  right:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  turn:'<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4v4.5H15"/>',
  flame:'<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.4-2.3-5.6-4-7.8-.4 2-1.4 3.2-2.6 3.8.3-2.9-.7-5.6-3-7.8.2 3.4-3.4 5.8-3.4 10.3C5.5 17.6 8.1 21 12 21z"/>',
  gauge:'<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  sign:'<path d="M6 18l6-12 6 12"/><path d="M8.5 13h7"/><path d="M10 3.5h4"/>',
  stopsign:'<path d="M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2z"/><path d="M8.5 12h7"/>',
  twins:'<rect x="3" y="6" width="8" height="12" rx="2"/><rect x="13" y="6" width="8" height="12" rx="2"/>',
  split:'<path d="M12 3v18"/><path d="M8 8l-4 4 4 4M16 8l4 4-4 4"/>',
  bounce:'<circle cx="12" cy="6" r="2.6"/><path d="M4.5 20h15"/><path d="M12 10v6M9.5 14l2.5 2.5 2.5-2.5"/>',
  nose:'<path d="M12 3.5c-1 5-4.5 8-4.5 11.5a4.5 4.5 0 0 0 9 0c0-3.5-3.5-6.5-4.5-11.5z"/>',
  soft:'<path d="M3.5 14c3-5 6-5 8.5 0s5.5 5 8.5 0"/><path d="M3.5 9h17"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5.5H5V7a3.5 3.5 0 0 0 3.5 3.5M16 5.5h3V7a3.5 3.5 0 0 1-3.5 3.5"/><path d="M12 13v4M8.5 20h7M9.5 17h5v3h-5z"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
  cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>'
};
const IC=n=>`<svg class="pz-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[n]||""}</svg>`;
const STAR=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1 6.4 20l1.1-6.2L2.9 9.4l6.3-.9z" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`;

/* ================= students, stars, points and memory strength (saved on this device) ================= */
const KEY="easyqaida.practice.v1";   /* old name kept on purpose, so students keep their progress */
const blank=()=>({m:{},stars:0,pts:0,sel:{},little:false,days:{},path:{}});
let store=null; try{ store=JSON.parse(localStorage.getItem(KEY)||"null"); }catch(e){}
if(!store||!store.students||!Object.keys(store.students).length) store={cur:"Student 1",students:{"Student 1":blank()}};
if(!store.students[store.cur]) store.cur=Object.keys(store.students)[0];
{ const U=new URLSearchParams(location.search), q=(U.get("student")||"").trim().slice(0,30), sid=(U.get("sid")||"").trim().slice(0,60);
  if(q){ if(!store.students[q]) store.students[q]=blank(); store.cur=q; if(sid) store.students[q].sid=sid; } }
const save=()=>{ try{ localStorage.setItem(KEY,JSON.stringify(store)); }catch(e){} };
const stu=()=>store.students[store.cur];
const little=()=>!!stu().little;
const online=()=>store.online!==false;   /* online class: choices carry numbers the child can say */
const score=k=>{ const r=stu().m[k]; return r?r.s:undefined; };
function record(k,ok){ const m=stu().m, r=m[k]||(m[k]={s:0,r:0,w:0}); if(ok){ r.s=Math.min(4,r.s+1); r.r++; } else { r.s=Math.max(0,r.s-1); r.w++; } r.t=Date.now(); save(); }
function level(items){ const sc=items.map(it=>score(it.key)); if(sc.every(v=>v===undefined)) return "new"; const m=Math.min(...sc.map(v=>v===undefined?0:v)); return m>=3?"good":m>=1?"learn":"weak"; }
/* weakest first, so the letters that need work come up most */
const order=items=>items.map(it=>({it,w:(score(it.key)===undefined?0.5:score(it.key))+Math.random()*0.45})).sort((a,b)=>a.w-b.w).map(x=>x.it);
/* points → levels */
const LVS=[0,100,250,450,700,1000,1400,1900,2500,3200,4000,5000,6200,7600,9200,11000];
function lvOf(p){ p=p||0; let i=0; while(i+1<LVS.length&&p>=LVS[i+1]) i++;
  if(i===LVS.length-1){ const x=Math.floor((p-LVS[i])/2000); return {n:i+1+x,lo:LVS[i]+x*2000,hi:LVS[i]+(x+1)*2000}; }
  return {n:i+1,lo:LVS[i],hi:LVS[i+1]}; }
const pts=()=>stu().pts||0;
/* scoring by day: today, this week (Monday to Sunday), days in a row, daily goal */
const GOAL=100;
const BOOK=window.EQAIDA_BOOK||"part1";
const dayKey=d=>{ d=d||new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
const weekDays=()=>{ const d=new Date(), wd=(d.getDay()+6)%7, out=[]; for(let i=0;i<=wd;i++){ const x=new Date(d); x.setDate(d.getDate()-i); out.push(dayKey(x)); } return out; };
const ptsOf=(s,keys)=>keys.reduce((a,k)=>a+((s.days||{})[k]||0),0);
const todayPts=s=>ptsOf(s,[dayKey()]), weekPts=s=>ptsOf(s,weekDays());
function dayStreak(s){ const days=s.days||{}, d=new Date(); let n=0; if(!days[dayKey(d)]) d.setDate(d.getDate()-1); while(days[dayKey(d)]){ n++; d.setDate(d.getDate()-1); } return n; }
/* eQuran: every change of score is sent out, and the leaderboard is read back (see README) */
const CFG=Object.assign({api:""},window.EQAIDA_CONFIG||{}), API=String(CFG.api||"").replace(/\/+$/,"");
function scoreData(){ const s=stu(); return {source:"eqaida",type:"score",book:BOOK,sid:s.sid||"",name:store.cur,points:s.pts||0,weekPoints:weekPts(s),todayPoints:todayPts(s),
  stars:s.stars||0,level:lvOf(s.pts).n,streakDays:dayStreak(s),stepsDone:Object.keys(s.path||{}).filter(k=>PATH.some(x=>x.id===k)).length,weekStart:weekDays().slice(-1)[0],updated:new Date().toISOString()}; }
let syncT=0;
function sync(){ const p=scoreData(); try{ if(window.parent&&window.parent!==window) window.parent.postMessage(p,"*"); }catch(e){}
  if(API){ try{ fetch(API+"/score",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p),keepalive:true}).catch(()=>{}); }catch(e){} } }
const queueSync=()=>{ clearTimeout(syncT); syncT=setTimeout(sync,1500); };
const narrow=()=>(document.documentElement.clientWidth||innerWidth)<600;   /* phone held upright */
const short_=()=>(document.documentElement.clientHeight||innerHeight)<500;   /* phone held sideways */

/* ================= sound effects (sounds.js, no voice) ================= */
const sfx=new Proxy({},{get:(_,k)=>(...a)=>{ try{ if(window.EQSfx&&EQSfx[k]) EQSfx[k](...a); }catch(e){} }});

/* ================= the things we practise ================= */
const A=(t,cls)=>`<span class="pz-a${cls?" "+cls:""}">${String(t).replace(/\u064C/g,"\u08F1")}</span>`;
const cache={};
const LI=id=>cache["l:"+id]||(cache["l:"+id]={key:"l:"+id,kind:"letter",id,html:A(L[id].ch),name:L[id].en,ur:L[id].ur,k:1,len:1,answer:`<b>${L[id].en}</b> ${A(L[id].ur)}`});
function FI(id,f){ const key=`f:${id}:${f}`; return cache[key]||(cache[key]={key,kind:"form",id,f,html:A(formHTML(id,f,INK)),name:L[id].en,k:.85,len:1,
  answer:`<b>${L[id].en}</b> ${A(L[id].ch)}<br><small>${FORMN[f]} shape</small>`}); }
function HI(id,h){ const key=`h:${id}:${h}`; if(cache[key]) return cache[key]; const base=id==="alif"?"ا":L[id].ch, syl=((id==="alif"||id==="hamza")?"":SND[id])+HV[h];
  return cache[key]={key,kind:"har",id,h,html:`<span class="pz-a pz-hg"><span style="color:${HC[h]}">${base+HM[h]}</span><span class="b">${base}</span></span>`,name:syl,k:.9,len:1,
    answer:`<b>${syl}</b><br><small>${L[id].en} + ${HN[h]}</small>`}; }
function WI(w){ const key="w:"+w; if(cache[key]) return cache[key]; const ps=analyze(w), n=ps.length;
  return cache[key]={key,kind:"comp",w,ps,html:A(w),name:ps.map(nameOf).join(" + "),k:n<=2?.8:n===3?.64:.5,len:n,
    answer:`${A(ps.map(isoOf).join(" + "))}<br><small>${ps.map(nameOf).join(" + ")}</small>`}; }
function EI(w){ const key="e:"+w; if(cache[key]) return cache[key]; const ps=analyze(w), n=ps.length;
  return cache[key]={key,kind:"word",w,ps,html:A(w),name:ps.map(sylOf).join(""),k:n<=2?.75:n===3?.58:.46,len:n,
    answer:`<b>${ps.map(sylOf).join("")}</b><br><small>${ps.map(sylOf).join(" · ")}</small>`}; }

function YI(w,lesson){ const key="y:"+w; if(cache[key]) return cache[key]; const R=window.P2.read(w), co=window.P2.core(w,lesson)||null, n=R.ps.length;
  const TG={bounce:"bounce",nose:"nose sound",hold:"hold"};
  return cache[key]={key,kind:"sig",w,ps:R.ps,html:A(w),name:R.text,k:n<=2?1:n===3?.8:n<=5?.62:n<=8?.48:.36,len:n,core:co&&co.c,pat:co&&co.pat,fam:co&&co.fam,tags:R.tags,
    answer:`<b>${R.text}</b>${R.tags.length?`<br><small>${R.tags.map(t=>TG[t]).join(" · ")}</small>`:""}`}; }
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
  const Ys=uniq(xs.filter(x=>x.startsWith("y:")).map(x=>x.slice(2))), Zs=uniq(xs.filter(x=>x.startsWith("z:")).map(x=>x.slice(2)));
  const lesson=pg&&pg.dataset.lesson||"", stops=Zs.map(z=>{ const [w,s,tag]=z.split("|"); return {w,s,tag:tag||""}; }); let twins=[]; try{ twins=JSON.parse(pg&&pg.dataset.twins||"[]"); }catch(e){}
  const U=(id,label,name,items)=>({id,label,name,items});
  let mode, title, units, words=[], note="";
  if(Ys.length&&window.P2){ mode="signs"; title=pg.dataset.title||"Signs"; units=Ys.map(w=>U(w,w,"",[YI(w,+lesson||0)])); words=units.flatMap(u=>u.items).filter(it=>it.len>=3); }
  else if(BOOK!=="part1"){ mode="none"; title="Lessons"; units=[]; }
  else if(Sh.length){ mode="shapes"; title="Joined shapes"; units=Sh.map(id=>U(id,L[id].ch,L[id].en,(L[id].j==="D"?["S","M","E"]:["E"]).map(f=>FI(id,f)))); words=Ws.map(WI); }
  else if(Hs.length){ mode="har"; title="Fatha · Kasra · Damma"; const by={}; Hs.forEach(x=>{ const [id,h]=x.split(":"); (by[id]=by[id]||[]).push(HI(id,h)); });
    units=Object.keys(by).map(id=>U(id,id==="alif"?"ا":L[id].ch,L[id].en,by[id])); }
  else if(Es.length){ mode="word"; title="Words"; units=Es.map(w=>U(w,w,"",[EI(w)])); words=Es.map(EI); }
  else if(Ws.length){ mode="comp"; title="Joined letters"; units=Ws.map(w=>U(w,w,"",[WI(w)])); words=Ws.map(WI); }
  else { mode="letters"; title="Letters"; const ids=Ls.length?Ls:Ms.length?ORDER.filter(id=>Ms.includes(id)):ORDER;
    if(!Ls.length&&!Ms.length) note="This page has no table to practise, so here are the 29 letters.";
    units=ids.map(id=>U(id,L[id].ch,L[id].en,[LI(id)])); }
  const rows6=mode==="letters"&&units.length===29;
  const lines=!!(pg&&pg.dataset.lines), only=mode==="signs"&&lesson==="B"?(lines?["flash","stop","read"]:["flash","find","hum","spot2","read"]):null;
  return {i,key:rows6?"letters":(BOOK==="part1"?"p":BOOK+"-p")+i,label,title,mode,units,words,note,rows6,lesson,stops,twins,lines,only,all:units.flatMap(u=>u.items)};
}

/* ================= shell ================= */
const S={info:null,sel:new Set(),view:"hub",cleanup:[],keys:null,gp:0,lv0:1};
const PZ=document.createElement("div"); PZ.className="pz"; PZ.hidden=true;
PZ.innerHTML=`<div class="pz-card" role="dialog" aria-modal="true" aria-label="Practice">
  <div class="pz-head"><div class="pz-logo">${IC("target")}</div><div class="pz-title" id="pzT"></div><div class="pz-sp"></div>
    <button class="pz-chip" id="pzStu" title="Change student"></button>
    <span class="pz-pts" id="pzPts" title="Points"><span class="c">${IC("coin")}</span><b id="pzPtsN">0</b><small id="pzLvS">Level 1</small></span>
    <button class="pz-ic eq-snd" id="pzSnd" title="Sound effects on / off"></button><button class="pz-ic" id="pzX" aria-label="Close">${IC("x")}</button></div>
  <div class="pz-nav" id="pzNav"><button data-nav="hub">${IC("grid")}<span>Games</span></button><button data-nav="path">${IC("list")}<span>Lessons</span></button><button data-nav="prog">${IC("map")}<span>Progress</span></button><button data-nav="board">${IC("trophy")}<span>Leaderboard</span></button></div>
  <div class="pz-body" id="pzB"></div></div>`;
document.body.appendChild(PZ);
const B=$("#pzB",PZ), CARD=$(".pz-card",PZ), NAV=$("#pzNav",PZ);
function navSync(){ NAV.hidden=!["hub","path","prog","board"].includes(S.view); $$("button",NAV).forEach(b=>b.classList.toggle("on",b.dataset.nav===S.view)); }
NAV.addEventListener("click",e=>{ const b=e.target.closest("[data-nav]"); if(b) ({hub,path:pathView,prog:progress,board})[b.dataset.nav](); });
const selUnits=()=>S.info.units.filter(u=>S.sel.has(u.id));
const selItems=()=>selUnits().flatMap(u=>u.items);
function saveSel(){ stu().sel=stu().sel||{}; stu().sel[S.info.key]=[...S.sel]; save(); }
function loadSel(){ const ids=S.info.units.map(u=>u.id), saved=(stu().sel||{})[S.info.key];
  S.sel=new Set(saved?saved.filter(x=>ids.includes(x)):(S.info.rows6?ids.slice(0,6):ids)); }
function header(){ $("#pzT",PZ).innerHTML=`Practice<small>${S.info.label} · ${S.info.title}</small>`; $("#pzStu",PZ).innerHTML=IC("user")+`<span class="nm">${esc(store.cur)}</span>`;
  $("#pzPtsN",PZ).textContent=fmtN(pts()); $("#pzLvS",PZ).textContent="Level "+lvOf(pts()).n; if(window.EQSfx) EQSfx.sync(); }
function runCleanup(){ S.cleanup.splice(0).forEach(f=>{ try{ f(); }catch(e){} }); S.keys=null; }
function toast(t){ const d=document.createElement("div"); d.className="pz-toast"; d.innerHTML=t; CARD.appendChild(d); setTimeout(()=>d.remove(),2500); }
function floatAt(el,text,cls){ if(!el||!el.getBoundingClientRect) return; const cr=CARD.getBoundingClientRect(), r=el.getBoundingClientRect();
  const f=document.createElement("div"); f.className="pz-float"+(cls?" "+cls:""); f.textContent=text;
  f.style.left=(r.left-cr.left+r.width/2)+"px"; f.style.top=(r.top-cr.top+Math.min(r.height*.35,70))+"px"; CARD.appendChild(f); setTimeout(()=>f.remove(),1150); }
/* points: every right answer adds to the student's total */
function award(n,el,cls,label){
  if(!n) return; const s=stu(), dk=dayKey(); s.days=s.days||{}; const before=s.days[dk]||0; s.days[dk]=before+n;
  { const ks=Object.keys(s.days).sort(); while(ks.length>70) delete s.days[ks.shift()]; }
  s.pts=pts()+n; S.gp+=n; save(); queueSync();
  if(before<GOAL&&before+n>=GOAL) setTimeout(()=>{ toast("Daily goal reached! +20 points"); award(20,null,"bonus"); },900);
  $("#pzPtsN",PZ).textContent=fmtN(pts()); $("#pzLvS",PZ).textContent="Level "+lvOf(pts()).n;
  const P=$("#pzPts",PZ); P.classList.remove("bump"); void P.offsetWidth; P.classList.add("bump");
  const g=$("#pzGp b",B); if(g) g.textContent=fmtN(S.gp);
  floatAt(el,label||("+"+n),cls); setTimeout(sfx.coin,220);
}
function open(i){ sfx.open(); S.info=pageInfo(i); loadSel(); PZ.hidden=false; document.body.style.overflow="hidden"; header(); if(!S.info.units.length) pathView(); else hub(); }
function close(){ runCleanup(); PZ.hidden=true; B.innerHTML=""; document.body.style.overflow=""; }

/* ================= hub: 1 choose what, 2 choose a game ================= */
const LEG=`<div class="pz-leg"><span><i></i>New</span><span><i class="lv-weak"></i>Needs practice</span><span><i class="lv-learn"></i>Learning</span><span><i class="lv-good"></i>Knows it</span></div>`;
const unitChip=u=>`<button class="pz-u ${S.sel.has(u.id)?"on":""} lv-${level(u.items)}" data-u="${esc(u.id)}">${A(u.label)}${u.name?`<small>${u.name}</small>`:""}</button>`;
function count(){ const n=selUnits().length, m=S.info.mode, el=$("#pzN",B); if(!el) return;
  el.textContent=n+" "+(m==="signs"?(n===1?"box":"boxes"):m==="word"?(n===1?"word":"words"):m==="comp"?(n===1?"box":"boxes"):(n===1?"letter":"letters"))+" chosen"; }
const tint=a=>`--t:${ACTS[a].t};--tc:${ACTS[a].tc}`;
function statsHTML(){ const s=stu(), t=todayPts(s), st=dayStreak(s);
  return `<div class="pz-stats"><div><span class="i" style="--t:#FBF3D8;--tc:#8A6A0C">${IC("coin")}</span><b>${fmtN(t)} <small>/ ${GOAL}</small></b><em>Today’s points</em><span class="bar"><i style="width:${Math.min(100,Math.round(100*t/GOAL))}%"></i></span></div>
    <div><span class="i" style="--t:#E8F0FB;--tc:#2F5FA7">${IC("cal")}</span><b>${fmtN(weekPts(s))}</b><em>This week</em></div>
    <div><span class="i" style="--t:#FFF1E4;--tc:#B4540A">${IC("flame")}</span><b>${st} ${st===1?"day":"days"}</b><em>Practised in a row</em></div>
    <div><span class="i" style="--t:#E5F4EB;--tc:#0B6B45">${IC("check")}</span><b>${Object.keys(s.path||{}).filter(k=>PATH.some(x=>x.id===k)).length} <small>/ ${PATH.length}</small></b><em>Lesson steps done</em></div></div>`; }
function hub(){
  runCleanup(); S.view="hub"; navSync(); const inf=S.info;
  const pre=inf.rows6?[["r1","Row 1"],["r2","Rows 1–2"],["r3","Rows 1–3"],["r4","Rows 1–4"],["all","All 29"]]:[["all","All"],["none","None"]];
  const acts=actOrder().filter(a=>(!ACTS[a].ok||ACTS[a].ok(inf))&&(!inf.only||inf.only.includes(a)));
  B.innerHTML=`<div class="pz-hub">${inf.note?`<p class="pz-hint">${inf.note}</p>`:""}
    <section class="pz-sec"><div class="pz-sh"><h3>What to practise</h3><span class="n" id="pzN"></span></div>
      <div class="pz-pres">${pre.map(([k,t])=>`<button class="pz-pre" data-pre="${k}">${t}</button>`).join("")}<button class="pz-pre" data-pre="weak">Needs practice</button></div>
      <div class="pz-units ${inf.rows6?"rows6":""} ${inf.mode==="comp"||inf.mode==="word"||inf.mode==="signs"?"wide":""}" id="pzU">${inf.units.map(unitChip).join("")}</div>${LEG}</section>
    <section class="pz-sec"><div class="pz-sh"><h3>Pick a game</h3><div class="pz-sp"></div>
        <div class="pz-tg"><label class="pz-lit"><input type="checkbox" id="pzOn" ${online()?"checked":""}>Online class</label><label class="pz-lit"><input type="checkbox" id="pzLit" ${little()?"checked":""}>Age 3–5</label></div></div>
      <button class="pz-quick" data-quick="1"><span class="t">${IC("bolt")}</span><span><b>Quick practice</b><small>About 5 minutes · ${quickSteps(inf).map(a=>ACTS[a].title).join(", ")}, then a rocket launch</small></span><span class="go">${IC("right")}</span></button>
      <div class="pz-acts">${acts.map(a=>`<button class="pz-act" data-act="${a}" style="${tint(a)}">${ACTS[a].isNew?`<span class="pz-new">New</span>`:""}<span class="t">${IC(ACTS[a].ic)}</span><div><b>${ACTS[a].title}</b><span>${ACTS[a].desc}</span></div></button>`).join("")}</div>
      <div class="pz-tip">${IC("vol")}<div><b>Online class:</b> turn on the numbers above so the child can say them. So the child also hears the sound effects, share your computer sound (Zoom: <b>Share sound</b> · Google Meet: share a Chrome tab with <b>Also share tab audio</b> · Teams: <b>Include computer sound</b>).</div></div></section></div>`;
  count();
}
B.addEventListener("click",e=>{
  const t=e.target.closest("[data-u],[data-pre],[data-act],[data-quick],[data-view],[data-go],[data-stu],[data-step],[data-period]"); if(!t) return;
  if(t.dataset.step!==undefined) return startStep(PATH[+t.dataset.step]);
  if(t.dataset.period){ boardPeriod=t.dataset.period; return board(); }
  if(t.dataset.u!==undefined){ const id=t.dataset.u; if(S.sel.has(id)) S.sel.delete(id); else S.sel.add(id); t.classList.toggle("on"); saveSel(); count(); return; }
  if(t.dataset.pre){ const ids=S.info.units.map(u=>u.id), p=t.dataset.pre; let pick;
    if(p==="all") pick=ids; else if(p==="none") pick=[]; else if(p[0]==="r") pick=ids.slice(0,6*+p[1]);
    else { pick=S.info.units.filter(u=>["weak","learn"].includes(level(u.items))).map(u=>u.id); if(!pick.length){ toast("Nothing needs practice yet. Play a game first."); return; } }
    S.sel=new Set(pick); saveSel(); $("#pzU",B).innerHTML=S.info.units.map(unitChip).join(""); count(); return; }
  if(t.dataset.view==="prog") return progress();
  if(t.dataset.view==="hub") return hub();
  if(t.dataset.quick) return quick();
  if(t.dataset.act) return start(t.dataset.act);
  if(t.dataset.go==="weak"){ const items=ORDER.map(LI).filter(it=>["weak","learn"].includes(level([it]))); if(!items.length){ toast("No letters need work yet."); return; } return start("flash",{items}); }
  if(t.dataset.stu!==undefined){ store.cur=t.dataset.stu; save(); loadSel(); header(); hub(); }
});
B.addEventListener("change",e=>{ if(e.target.id==="pzLit"){ stu().little=e.target.checked; save(); } if(e.target.id==="pzOn"){ store.online=e.target.checked; save(); } });

/* ================= running a game ================= */
function start(name,opt){
  opt=opt||{};
  if(name==="spot"&&!opt.items){ let ws=S.info.mode==="shapes"?S.info.words.filter(w=>w.ps.some(p=>S.sel.has(p.id))):selItems(); if(!ws.length) ws=S.info.words; opt.items=ws; }
  if(name==="build"&&!opt.items&&S.info.mode==="shapes"){ let ws=S.info.words.filter(w=>w.ps.some(p=>S.sel.has(p.id))); if(!ws.length) ws=S.info.words; opt.items=ws; }
  const items=opt.items||selItems();
  if(!items.length){ toast("Choose at least one first."); return; }
  runCleanup(); S.view="act"; navSync(); S.gp=0; S.lv0=lvOf(pts()).n; const act=ACTS[name], ch=opt.chain;
  B.innerHTML=`<div class="pz-actw"><div class="pz-acth"><button class="pz-btn sm" id="pzBack">${IC("left")}Games</button><div class="gt" style="${tint(name)}"><span class="t">${IC(act.ic)}</span>${act.title}</div>${ch?`<span class="pz-chainp">Step ${ch.i+1} of ${ch.steps.length}</span>`:""}<div class="pz-sp"></div><span id="pzSk"></span><span class="pz-gp" id="pzGp" title="Points in this game">${IC("coin")}<b>0</b></span><span class="pz-prog" id="pzP"></span></div><div class="pz-stage" id="pzS"></div></div>`;
  $("#pzBack",B).onclick=hub;
  const stage=$("#pzS",B), P=$("#pzP",B), game={streak:0};
  const showStreak=()=>{ const el=$("#pzSk",B); if(el) el.innerHTML=game.streak>=2?`<span class="pz-streak">${IC("flame")}${game.streak} in a row</span>`:""; };
  act.run({items,stage,opt,little:little(),online:online(),prog:(a,b)=>{ P.textContent=a+" / "+b; },label:t=>{ P.textContent=t; },
    onLeave:f=>S.cleanup.push(f),later:(f,ms)=>{ const id=setTimeout(f,ms); S.cleanup.push(()=>clearTimeout(id)); },keys:f=>{ S.keys=f; },
    award,
    right:(el,first,n)=>{ award(n!=null?n:(first?10:5),el); if(first){ game.streak++; if(game.streak%3===0) setTimeout(()=>award(5,el,"bonus",`${game.streak} in a row! +5`),420); } else game.streak=0; showStreak(); },
    wrong:()=>{ game.streak=0; showStreak(); },
    none:msg=>{ toast(msg); hub(); },
    done:r=>finish(name,r,opt,stage)});
}
const quickSteps=inf=>inf.only?["flash","find","read"].filter(a=>inf.only.includes(a)):["flash",inf.mode==="signs"&&ACTS.which.ok(inf)?"which":"find","balloon"];
function quick(){
  const sel=selItems(); if(!sel.length){ toast("Choose at least one first."); return; }
  const steps=quickSteps(S.info), chain={steps,i:0,stars:0,sets:steps.map(a=>a==="flash"?order(sel).slice(0,little()?6:10):sel)};
  start("flash",{chain,items:chain.sets[0]});
}
const ROCKET=`<svg viewBox="0 0 100 190" aria-hidden="true"><g class="fl"><path d="M34 148 Q50 196 66 148Z" fill="#F59E0B"/><path d="M41 148 Q50 178 59 148Z" fill="#FDE68A"/></g><path d="M50 4C76 26 80 80 70 150H30C20 80 24 26 50 4Z" fill="#fff" stroke="#14231D" stroke-width="3"/><path d="M50 4C62 14 69 28 72 44H28C31 28 38 14 50 4Z" fill="#0B6B45" stroke="#14231D" stroke-width="3"/><circle cx="50" cy="80" r="13" fill="#D7EEFB" stroke="#14231D" stroke-width="3"/><path d="M30 110L12 146L30 140ZM70 110L88 146L70 140Z" fill="#C9A227" stroke="#14231D" stroke-width="3" stroke-linejoin="round"/></svg>`;
function rocket(host){ const d=document.createElement("div"); d.className="pz-rocket";
  d.innerHTML=`<div class="rk">${ROCKET}</div>`+[...Array(7)].map((_,i)=>`<i class="pz-smoke" style="left:calc(50% + ${(i-3)*30-30}px);--dx:${(i-3)*34}px;animation-delay:${i*70}ms"></i>`).join("");
  host.appendChild(d); sfx.launch(); setTimeout(()=>d.remove(),2800); }
function finish(name,r,opt,stage){
  runCleanup(); const ratio=r.total?r.right/r.total:1, stars=r.stars||(ratio>=0.9?3:ratio>=0.6?2:1);
  stu().stars=(stu().stars||0)+stars; save();
  award(stars===3?20:stars===2?10:5,null);
  const ch=opt.chain, last=!ch||ch.i>=ch.steps.length-1; if(ch) ch.stars=(ch.stars||0)+stars;
  let stepSt=0, stepNext=null; const stepOf=ch&&last&&ch.step?PATH.find(x=>x.id===ch.step):null;
  if(stepOf){ stepSt=Math.max(1,Math.min(3,Math.round(ch.stars/ch.steps.length))); const P_=stu().path=stu().path||{}, firstTime=!P_[stepOf.id];
    P_[stepOf.id]=Math.max(P_[stepOf.id]||0,stepSt); save(); if(firstTime) award(30,null); stepNext=PATH[PATH.indexOf(stepOf)+1]||null; }
  const missed=(r.missed||[]).slice(0,10), nxt=ch&&!last?ACTS[ch.steps[ch.i+1]]:null, P=$("#pzP",B); if(P) P.textContent="";
  const lv=lvOf(pts()), up=lv.n>S.lv0, pct=Math.round(100*(pts()-lv.lo)/(lv.hi-lv.lo));
  stage.innerHTML=`<div class="pz-res"><div class="pz-st">${[1,2,3].map(i=>`<span class="${i<=stars?"on":""}" style="animation-delay:${i*0.18}s">${STAR}</span>`).join("")}</div>
    <h2>${stars===3?"MashaAllah! Excellent!":stars===2?"MashaAllah! Well done!":"Good try! Keep going!"}</h2>
    <p class="pz-rs">${r.text||`${r.right} of ${r.total} right the first time`}</p>
    <div class="pz-earn"><span class="c">${IC("coin")}</span><div class="grow"><div><span class="e">+${fmtN(S.gp)}</span> <span class="pz-el">points · ${fmtN(pts())} in all</span> ${up?`<span class="pz-lvup">Level up! Level ${lv.n}</span>`:""}</div>
      <div class="bar"><i style="width:${up?0:Math.max(0,pct-8)}%"></i></div><div class="pz-el">Level ${lv.n} · ${fmtN(lv.hi-pts())} more points to level ${lv.n+1} · Today: ${fmtN(todayPts(stu()))}</div></div></div>
    ${missed.length?`<div class="pz-miss"><span>Practise these again:</span>${missed.map(m=>`<i style="--k:${m.k}">${m.html}</i>`).join("")}</div>`:""}
    ${stepOf?`<p class="pz-rs"><b>Step finished: ${stepOf.title} · ${stepSt} of 3 stars</b></p>`:ch&&last?`<p class="pz-rs"><b>Quick practice finished · ${ch.stars} stars today</b></p>`:""}
    <div class="pz-rb">${nxt?`<button class="pz-btn pri" id="pzNext">Next: ${nxt.title}${IC("right")}</button>`:stepOf?(stepNext?`<button class="pz-btn pri" id="pzStepNext">Next step${IC("right")}</button>`:"")+`<button class="pz-btn${stepNext?"":" pri"}" id="pzPath">${IC("list")}Lessons</button>`:`<button class="pz-btn pri" id="pzAgain">${IC("turn")}Play again</button>`}
      ${missed.length&&!nxt?`<button class="pz-btn" id="pzMiss">${IC("cards")}Flash cards for the missed ones</button>`:""}<button class="pz-btn" id="pzHub">${nxt?"Stop here":"All games"}</button></div></div>`;
  setTimeout(()=>{ const bar=$(".pz-earn .bar i",stage); if(bar) bar.style.width=pct+"%"; },60);
  const q=id=>$("#"+id,stage);
  if(q("pzNext")) q("pzNext").onclick=()=>start(ch.steps[ch.i+1],{chain:{...ch,i:ch.i+1},items:ch.sets[ch.i+1]});
  if(q("pzStepNext")) q("pzStepNext").onclick=()=>startStep(stepNext);
  if(q("pzPath")) q("pzPath").onclick=pathView;
  if(q("pzAgain")) q("pzAgain").onclick=()=>start(name,{items:opt.items});
  if(q("pzMiss")) q("pzMiss").onclick=()=>start("flash",{items:r.missed});
  q("pzHub").onclick=hub;
  if(ch&&last){ rocket(stage); setTimeout(()=>{ if(typeof celebrate==="function") celebrate(null,3); else sfx.win(3); },1900); }
  else if(stars>=2||up){ if(typeof celebrate==="function") celebrate(null,up?3:stars); else sfx.win(stars); }
  else sfx.win(1);
}

/* wrong answers to show next to the right one: look-alikes first */
function distract(t,n,strict){
  const pool=S.info.all.filter(x=>x.key!==t.key&&x.kind===t.kind); let pri;
  if(t.kind==="letter"){ const sel=selItems().filter(x=>x.kind==="letter"&&x.id!==t.id).map(x=>x.id), fam=(VF[t.id]||[]).filter(x=>x!==t.id);
    pri=[...shuffle(fam.filter(x=>sel.includes(x))),...shuffle(sel),...shuffle(fam),...shuffle(ORDER.filter(x=>x!==t.id))].map(LI); }
  else if(t.kind==="form"){ const same=pool.filter(x=>x.f===t.f), fam=same.filter(x=>(VF[t.id]||[]).includes(x.id));
    pri=[...shuffle(fam),...shuffle(same),...shuffle(ORDER.filter(id=>id!==t.id&&L[id].j!=="U"&&(t.f==="E"||L[id].j==="D")).map(id=>FI(id,t.f)))]; }
  else if(t.kind==="har") pri=[...shuffle(pool.filter(x=>x.id===t.id)),...shuffle(pool.filter(x=>x.h===t.h)),...shuffle(pool)];
  else if(t.kind==="sig"){ const L_=+S.info.lesson||0, vs=(window.P2?P2.variants(t.w,L_,8):[]).map(w=>YI(w,L_)), same=pool.filter(x=>x.core&&x.core===t.core), pat=pool.filter(x=>x.pat&&x.pat===t.pat&&x.core!==t.core);
    pri=strict?[...shuffle(vs),...shuffle(same)]:[...shuffle(vs).slice(0,2),...shuffle(same),...shuffle(pat),...shuffle(pool.filter(x=>t.len>=3&&x.len>=3&&(x.ps[0].id===t.ps[0].id||x.ps[x.ps.length-1].id===t.ps[t.ps.length-1].id))),...shuffle(vs),...shuffle(pool).sort((a,b)=>Math.abs(a.len-t.len)-Math.abs(b.len-t.len))]; }
  else pri=shuffle(pool).sort((a,b)=>Math.abs(a.len-t.len)-Math.abs(b.len-t.len));
  const out=[], seen=new Set([t.key]), names=new Set([t.name]); for(const x of pri){ if(seen.has(x.key)||t.kind==="sig"&&names.has(x.name)) continue; seen.add(x.key); names.add(x.name); out.push(x); if(out.length>=n) break; } return out;
}
function promptOf(t){
  if(t.kind==="letter") return `Find <b>${t.name}</b> ${A(t.ur,"sm")}`;
  if(t.kind==="form") return `Find <b>${t.name}</b><small>in its ${FORMN[t.f].toLowerCase()} shape</small>`;
  if(t.kind==="har") return `Find <b>${t.name}</b><small>${L[t.id].en} with ${HN[t.h]}</small>`;
  if(t.kind==="comp") return `Find ${A(t.ps.map(isoOf).join(" + "))}<small>joined together</small>`;
  if(t.kind==="sig") return `Find <b dir="ltr">${t.name}</b><small>The teacher says it, the child finds it</small>`;
  return `Find <b>${t.name}</b>`;
}
/* a list of rounds, weakest first, without the same one twice in a row */
function roundsOf(items,n){ const base=order(items), out=[]; let g=0;
  while(out.length<n&&g++<60){ for(const it of (out.length?shuffle(base):base)){ if(out.length>=n) break; if(base.length>1&&out[out.length-1]===it) continue; out.push(it); } } return out; }
const okBadge=b=>{ if(!b.querySelector(".pz-ok-badge")) b.insertAdjacentHTML("beforeend",`<span class="pz-ok-badge">${IC("check")}</span>`); };

/* ---------- 1. flash cards: the child says it, the teacher marks it (the card turns over) ---------- */
function actFlash(c){
  const queue=c.opt.chain?c.items.slice():order(c.items), total=queue.length, first={}, miss={}, missed=[]; let doneN=0;
  c.stage.innerHTML=`<div class="pz-fl"><div class="pz-flc" id="flC"><div class="pz-fli"><div class="pz-flf" id="flF"></div><div class="pz-flk"><div class="big" id="flK"></div><div class="pz-fla" id="flA"></div></div></div></div>
    <div class="pz-flb"><button class="pz-btn no" id="flNo">${IC("x")}Not yet</button><button class="pz-btn" id="flShow">${IC("turn")}Turn over</button><button class="pz-btn yes" id="flYes">${IC("check")}Knew it</button></div>
    <p class="pz-hint">The child says it out loud. You tap Knew it or Not yet. Missed cards come back.</p></div>`;
  const F=$("#flF",c.stage), K=$("#flK",c.stage), An=$("#flA",c.stage), C=$("#flC",c.stage);
  function show(){ const it=queue[0]; F.innerHTML=it.html; K.innerHTML=it.html; F.style.setProperty("--k",it.k); K.style.setProperty("--k",it.k); An.innerHTML=it.answer;
    C.classList.remove("in","flip"); void C.offsetWidth; C.classList.add("in"); c.prog(doneN,total); c.later(sfx.flip,doneN||Object.keys(first).length?180:0); }
  function turn(){ C.classList.toggle("flip"); sfx.flip(); }
  function mark(ok){ const it=queue.shift(), isFirst=!(it.key in first); if(isFirst){ first[it.key]=ok; record(it.key,ok); }
    if(ok){ doneN++; sfx.ok(); c.right(C,isFirst,isFirst?5:2); } else { sfx.no(); c.wrong(); miss[it.key]=(miss[it.key]||0)+1; if(!missed.includes(it)) missed.push(it); if(miss[it.key]<3) queue.splice(Math.min(queue.length,2),0,it); else doneN++; }
    if(!queue.length) return c.done({right:Object.values(first).filter(Boolean).length,total,missed});
    show(); }
  $("#flYes",c.stage).onclick=()=>mark(true); $("#flNo",c.stage).onclick=()=>mark(false); $("#flShow",c.stage).onclick=turn; C.onclick=turn;
  c.keys(e=>{ if(e.key===" "){ e.preventDefault(); turn(); } else if(e.key==="ArrowRight"||e.key==="2") mark(true); else if(e.key==="ArrowLeft"||e.key==="1") mark(false); });
  show();
}

/* ---------- 2. find it: the teacher says the name, the child taps it ---------- */
function actFind(c){
  const rounds=c.opt.chain?(c.little?5:8):(c.little?6:Math.max(8,Math.min(12,c.items.length))), withCore=c.which?c.items.filter(it=>it.core&&it.core!=="ا"):[];
  const targets=roundsOf(withCore.length?withCore:c.items,rounds); let n=0, right=0, streak=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-find"><div class="pz-q" id="fiQ"></div><div class="pz-ch" id="fiC"></div><p class="pz-fb" id="fiF">&nbsp;</p>${c.online?`<p class="pz-hint">The child says the number. You tap it, or press that number key.</p>`:""}</div>`;
  const Q=$("#fiQ",c.stage), C=$("#fiC",c.stage), F=$("#fiF",c.stage);
  function round(){
    const t=targets[n], k=c.little?(streak>=3?3:2):(streak>=6?6:streak>=3?4:3), nd=c.which?Math.max(3,k)-1:k-1, ds0=distract(t,nd,c.which), ch=shuffle([t,...(c.which&&ds0.length<2?distract(t,nd,false):ds0)]); let firstTry=true, lock=false;
    Q.innerHTML=promptOf(t); F.innerHTML="&nbsp;"; F.className="pz-fb"; c.prog(n+1,rounds);
    const cols=narrow()?(ch.length===4?2:Math.min(3,ch.length)):(ch.length>4?3:ch.length); C.className="pz-ch"+(Math.ceil(ch.length/cols)>1?" two":""); C.style.setProperty("--c",cols);
    C.innerHTML=ch.map((it,i)=>`<button class="pz-c" data-i="${i}" style="--k:${it.k};--i:${i}">${c.online?`<i class="pz-num">${i+1}</i>`:""}${it.html}</button>`).join("");
    c.keys(e=>{ const k=+e.key; if(k>=1&&k<=ch.length) C.children[k-1].click(); });
    C.onclick=e=>{ const b=e.target.closest(".pz-c"); if(!b||lock) return; const it=ch[+b.dataset.i];
      if(it===t){ lock=true; b.classList.add("ok"); okBadge(b); sfx.yay(); if(firstTry){ right++; streak++; record(t.key,true); } c.right(b,firstTry); F.className="pz-fb good"; F.innerHTML="MashaAllah!";
        c.later(()=>{ n++; if(n>=rounds) c.done({right,total:rounds,missed}); else round(); },900); }
      else { b.classList.add("bad"); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; streak=0; record(t.key,false); if(!missed.includes(t)) missed.push(t); }
        F.className="pz-fb bad"; F.innerHTML=`That one is <b>${it.name}</b>. Try again.`; } };
  }
  round();
}

/* ---------- 3. balloon pop (speeds up when the child is doing well, slows down after a miss) ---------- */
function actBalloon(c){
  const targets=order(c.items).slice(0,c.opt.chain?Math.min(2,c.items.length):Math.min(c.little?3:4,c.items.length)), need=c.little?4:5, missed=[];
  const COLS=["#FFC9D6","#BFE3FF","#CDEFC3","#FFE3A6","#DDD0FF","#FFD2B8"];
  let ti=0, got=0, clean=true, right=0, lastLane=-1, sinceT=9, fast=false, alive=true, pace=1;
  c.stage.innerHTML=`<div class="pz-bl"><div class="pz-blt pz-target"><span>Pop every</span><span class="x" id="blX"></span><b id="blN"></b><span class="pz-dots" id="blD"></span><div class="pz-sp"></div>${c.online?`<span class="pz-hint">The child says the balloon’s number</span>`:""}<button class="pz-btn sm" id="blSp">${IC("gauge")}Slow</button></div>
    <div class="pz-sky" id="blS">${[[8,52],[30,74],[60,44]].map(([top,d],i)=>`<i class="pz-cloud" style="top:${top}%;animation-duration:${d}s;animation-delay:-${i*17}s;transform:scale(${1-i*.15})"></i>`).join("")}</div></div>`;
  const sky=$("#blS",c.stage), X=$("#blX",c.stage), N=$("#blN",c.stage), D=$("#blD",c.stage), SP=$("#blSp",c.stage);
  SP.onclick=()=>{ fast=!fast; SP.innerHTML=IC("gauge")+(fast?"Fast":"Slow"); };
  function head(){ const t=targets[ti]; X.innerHTML=t.html; X.style.setProperty("--k",t.k); N.textContent=t.kind==="comp"?"":t.name;
    D.innerHTML=Array.from({length:need},(_,i)=>`<i class="${i<got?"on":""}"></i>`).join(""); c.prog(ti+1,targets.length); }
  function spawn(){
    if(!alive||document.hidden||!sky.clientHeight||$$(".pz-bw",sky).length>=(narrow()?4:(c.little||c.online)?5:7)) return;
    const t=targets[ti]; sinceT++; const ds=distract(t,6), isT=!ds.length||sinceT>=3||Math.random()<(c.little?0.55:0.42); if(isT) sinceT=0;
    const it=isT?t:ds[Math.floor(Math.random()*ds.length)], lanes=sky.clientWidth<600?(it.len>=3?2:3):sky.clientWidth<900?(it.len>=3?3:4):(it.len>=3?4:6); let lane; do{ lane=Math.floor(Math.random()*lanes); }while(lane===lastLane); lastLane=lane;
    const w=document.createElement("div"); w.className="pz-bw"; w._it=it; w.style.left=((lane+0.5)*100/lanes)+"%";
    const col=COLS[Math.floor(Math.random()*COLS.length)];
    w.style.setProperty("--d",(((fast?5:(c.little||c.online)?11:8)+Math.random()*1.5)*pace).toFixed(2)+"s"); w.style.setProperty("--travel",(sky.clientHeight+300)+"px");
    let num=0; if(c.online){ const used=new Set($$(".pz-bw",sky).map(x=>x._n)); for(let k=1;k<=9;k++){ if(!used.has(k)){ num=k; break; } } } w._n=num;
    w.innerHTML=`<button class="pz-b${it.len>=3?" wide":""}" style="--c:${col};--k:${it.k}"><span class="pz-str" style="left:calc(50% - 1px)"></span>${it.html}${num?`<i class="pz-num">${num}</i>`:""}</button>`;
    w.addEventListener("animationend",e=>{ if(e.animationName==="pzRise") w.remove(); }); sky.appendChild(w);
  }
  function burst(b){ const sr=sky.getBoundingClientRect(), r=b.getBoundingClientRect(), cx=r.left-sr.left+r.width/2, cy=r.top-sr.top+r.height/2, col=b.style.getPropertyValue("--c");
    for(let i=0;i<10;i++){ const a=i/10*Math.PI*2+Math.random()*.4, d=70+Math.random()*60, p=document.createElement("i"); p.className="pz-bit";
      p.style.cssText=`left:${cx}px;top:${cy}px;--c:${col};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px`; sky.appendChild(p); setTimeout(()=>p.remove(),650); } }
  function hit(b){
    if(!b||b.classList.contains("pop")) return; const t=targets[ti], w=b.parentNode;
    if(w._it===t){ b.classList.add("pop"); burst(b); sfx.pop(); setTimeout(()=>w.remove(),240); got++; c.award(2,b); pace=Math.max(.6,pace*.95);
      if(got>=need){ if(clean){ right++; record(t.key,true); } c.right(b,clean,clean?10:5); ti++; got=0; clean=true; $$(".pz-bw",sky).forEach(x=>{ if(x!==w) x.remove(); });
        if(ti>=targets.length){ alive=false; return c.later(()=>c.done({right,total:targets.length,missed,text:`${targets.length} ${targets.length===1?"round":"rounds"} popped · ${right} without a mistake`}),450); }
        sfx.yay(); toast("MashaAllah! Next one…"); }
      head(); }
    else { b.classList.add("no"); setTimeout(()=>b.classList.remove("no"),450); sfx.no(); c.wrong(); pace=Math.min(1.35,pace*1.12); if(clean){ clean=false; record(t.key,false); if(!missed.includes(t)) missed.push(t); } }
  }
  sky.addEventListener("pointerdown",e=>{ const b=e.target.closest(".pz-b"); if(b){ e.preventDefault(); hit(b); } });
  c.keys(e=>{ const k=+e.key; if(k>=1&&k<=9){ const w=$$(".pz-bw",sky).find(x=>x._n===k&&!x.firstChild.classList.contains("pop")); if(w) hit(w.firstChild); } });
  const iv=setInterval(spawn,(c.little||c.online)?1200:850); c.onLeave(()=>{ alive=false; clearInterval(iv); });
  head(); spawn();
}

/* ---------- 4. memory match (cards turn over in 3D) ---------- */
function actMemory(c){
  const want=c.little?3:6, used=new Set(), chosen=[];
  const take=it=>{ const b=it.kind==="form"?it.id:it.kind==="sig"?"n:"+it.name:it.key; if(used.has(b)||chosen.length>=want) return; used.add(b); chosen.push(it); };
  shuffle(c.items).forEach(take); if(chosen.length<3) distract(chosen[0],8).forEach(it=>{ if(chosen.length<3) take(it); });
  const isForm=chosen[0].kind==="form";
  const cards=shuffle(chosen.flatMap((it,i)=>[{p:i,html:it.html,k:it.k},{p:i,html:it.kind==="sig"?`<span class="pz-lat">${it.name}</span>`:isForm?LI(it.id).html:it.html,k:it.kind==="sig"||isForm?1:it.k}]));
  const n=cards.length, cols=narrow()?(n<=6?2:3):short_()?(n<=6?3:n<=8?4:6):(n<=6?3:n<=8?4:n<=10?5:4);
  c.stage.innerHTML=`<div class="pz-mmw"><p class="pz-hint">${isForm?"Match each joined shape with its letter.":"Turn two cards over and find the pairs."} Say the name every time.${c.online?" The child says the two numbers.":""}</p>
    <div class="pz-mm" style="--c:${cols}">${cards.map((cd,i)=>`<button class="pz-mc" data-i="${i}" style="--k:${cd.k}"><span class="in"><span class="bk">${IC("star")}</span><span class="fr">${cd.html}</span></span>${c.online?`<i class="pz-num">${i+1}</i>`:""}</button>`).join("")}</div></div>`;
  let open2=[], lock=false, moves=0, found=0; c.prog(0,chosen.length);
  const grid=$(".pz-mm",c.stage);
  c.keys(e=>{ const k=+e.key; if(k>=1&&k<=9&&grid.children[k-1]) grid.children[k-1].click(); });
  grid.onclick=e=>{
    const b=e.target.closest(".pz-mc"); if(!b||lock||b.classList.contains("up")) return; b.classList.add("up"); sfx.flip(); open2.push(b); if(open2.length<2) return;
    moves++; const [a,d]=open2; open2=[];
    if(cards[+a.dataset.i].p===cards[+d.dataset.i].p){ lock=true; c.later(()=>{ a.classList.add("ok"); d.classList.add("ok"); sfx.yay(); c.right(d,true); found++; c.prog(found,chosen.length); lock=false;
      if(found>=chosen.length) c.later(()=>c.done({right:found,total:found,stars:moves<=found*1.7?3:moves<=found*2.7?2:1,text:`All ${found} pairs found in ${moves} turns`}),800); },420); }
    else { lock=true; c.wrong(); c.later(sfx.no,420); c.later(()=>{ a.classList.remove("up"); d.classList.remove("up"); sfx.flip(); lock=false; },c.little?1600:1100); }
  };
}

/* ---------- 5. spot it: find the letter hiding inside a word ---------- */
function pieces(it){ const ps=it.ps, out=[]; for(let i=0;i<ps.length;i++){ const p=ps[i], n=ps[i+1];
  if(p.id==="lam"&&n&&n.ch==="ا"&&p.jn){ out.push({ids:["lam","alif"],t:(p.jp?ZWJ:"")+p.ch+p.m+n.ch+n.m,form:p.form}); i++; }
  else out.push({ids:nameOf(p)===L[p.id].en?[p.id]:[],t:ptxt(p),form:p.form}); } return out; }
function actSpot(c){
  const words=c.items.filter(w=>w.ps&&pieces(w).some(p=>p.ids.length)); if(!words.length) return c.none("No words with letters to spot here.");
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
      if(p.ids.includes(id)){ lock=true; s.classList.add("ok"); sfx.yay(); if(firstTry){ right++; record("l:"+id,true); } c.right(s,firstTry);
        F.className="pz-fb good"; F.innerHTML=`MashaAllah! That is <b>${L[id].en}</b> in its ${FORMN[p.form].toLowerCase()} shape.`;
        c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed}); else round(); },1400); }
      else { s.classList.add("bad"); setTimeout(()=>s.classList.remove("bad"),450); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; record("l:"+id,false); if(!missed.includes(LI(id))) missed.push(LI(id)); }
        F.className="pz-fb bad"; F.innerHTML="Not that one. Try again."; } };
  }
  round();
}

/* ---------- 6. read check: the page, shuffled; the teacher taps the wrong ones ---------- */
function actRead(c){
  const cap=c.little?12:30, fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); let items=[], bad=new Set(), t0=Date.now();
  c.stage.innerHTML=`<div class="pz-rc"><p class="pz-hint">The child reads every box, starting from the right. Tap any box that was wrong, then tap Done.</p><div class="pz-rg" id="rcG"></div>
    <div class="pz-rf"><button class="pz-btn sm" id="rcSh">${IC("turn")}Shuffle again</button><span class="pz-time" id="rcT">0:00</span><button class="pz-btn pri" id="rcDone">${IC("check")}Done</button></div></div>`;
  const G=$("#rcG",c.stage), T=$("#rcT",c.stage);
  const inOrder=!!(S.info&&S.info.lines);
  if(inOrder){ $(".pz-hint",c.stage).textContent="The child reads each line, from the top. Tap any line that was wrong, then tap Done."; $("#rcSh",c.stage).style.display="none"; }
  function deal(){ items=inOrder?c.items.slice(0,cap):shuffle(c.items).slice(0,cap); bad=new Set(); const n=items.length, cols=inOrder?1:narrow()?Math.min(4,n):(n<=4?n:n<=8?4:n<=15?5:6), rows=Math.ceil(n/cols);
    G.style.setProperty("--c",cols); G.style.setProperty("--fs",inOrder?(narrow()?"6.2vw":`min(${Math.round(30/rows)}vh,40px)`):narrow()?`min(${Math.round(40/rows)}vh,${Math.round(46/cols)}vw)`:`min(${Math.round(36/rows)}vh,${Math.round(340/cols)+40}px)`);
    G.innerHTML=items.map((it,i)=>`<button class="pz-rcell${inOrder?" line":""}" data-i="${i}" style="--k:${inOrder?1:it.k}">${it.html}</button>`).join(""); t0=Date.now();
    const u=inOrder?"lines":"boxes"; c.label(n<c.items.length?`${n} of ${c.items.length} ${u}`:`${n} ${u}`); }
  G.onclick=e=>{ const b=e.target.closest(".pz-rcell"); if(!b) return; const it=items[+b.dataset.i]; b.classList.toggle("bad"); if(bad.has(it)){ bad.delete(it); sfx.tap(); } else { bad.add(it); sfx.no(); } };
  const iv=setInterval(()=>{ T.textContent=fmt(Math.round((Date.now()-t0)/1000)); },500); c.onLeave(()=>clearInterval(iv));
  $("#rcSh",c.stage).onclick=deal;
  $("#rcDone",c.stage).onclick=e=>{ const secs=Math.round((Date.now()-t0)/1000), right=items.length-bad.size; items.forEach(it=>record(it.key,!bad.has(it)));
    c.award(right*2,e.currentTarget); c.done({right,total:items.length,missed:[...bad],text:`${right} of ${items.length} read correctly · time ${fmt(secs)}`}); };
  deal();
}

/* ---------- 7. letter train: a train brings wagons; pick the right one and the train leaves ---------- */
function actTrain(c){
  const rounds=c.opt.chain?5:(c.little?4:6), targets=roundsOf(c.items,rounds); let n=0, right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-tr"><div class="pz-q" id="trQ"></div>
    <div class="pz-track" id="trS"><i class="pz-hill" style="left:-6%;width:40%;height:20%;bottom:38%"></i><i class="pz-hill" style="left:40%;width:32%;height:13%;bottom:38%"></i><i class="pz-hill" style="left:68%;width:44%;height:24%;bottom:38%"></i>
      <div class="pz-sleepers"></div><div class="pz-rail"></div><div class="pz-train" id="trT"></div></div>
    <p class="pz-fb" id="trF">${c.online?"The child says the wagon’s number.":"&nbsp;"}</p></div>`;
  const sc=$("#trS",c.stage), T=$("#trT",c.stage), Q=$("#trQ",c.stage), F=$("#trF",c.stage);
  const ENG=`<div class="pz-eng"><i class="step"></i><i class="boil"></i><i class="band"></i><i class="nose"></i><i class="lamp"></i><i class="chim"></i><i class="cab"></i><i class="roof"></i><i class="win"></i><span class="pz-wh" style="left:10px"></span><span class="pz-wh" style="left:62px"></span><span class="pz-wh" style="left:122px"></span></div>`;
  let busy=true, puffT=0, ch=[], t=null, firstTry=true, sc_=1;
  c.onLeave(()=>clearInterval(puffT));
  function puff(){ const cm=T.querySelector(".chim"); if(!cm) return; const r=cm.getBoundingClientRect(), s=sc.getBoundingClientRect();
    const p=document.createElement("div"); p.className="pz-puff"; p.style.left=(r.left-s.left+r.width/2-13)+"px"; p.style.top=(r.top-s.top-22)+"px"; sc.appendChild(p); setTimeout(()=>p.remove(),1500); }
  function move(x,ms,ease,then){ T.classList.add("moving"); clearInterval(puffT); puffT=setInterval(puff,230);
    T.style.transition=`transform ${ms}ms ${ease}`; T.style.transform=`translateX(${x}px) scale(${sc_})`;
    c.later(()=>{ T.classList.remove("moving"); clearInterval(puffT); if(then) then(); },ms); }
  function round(){
    t=targets[n]; firstTry=true; const k=(c.little||narrow())?3:(t.len>=3?3:4); ch=shuffle([t,...distract(t,k-1)]);
    Q.innerHTML=promptOf(t); F.className="pz-fb"; F.innerHTML=c.online?"The child says the wagon’s number.":"&nbsp;"; c.prog(n+1,rounds);
    const ww=narrow()?(t.len>=3?Math.min(240,100+t.len*36):t.len===2?170:130):(t.len>=3?Math.min(280,110+t.len*42):t.len===2?200:150);
    T.innerHTML=ENG+ch.map((it,i)=>`<button class="pz-wag" data-i="${i}" style="--ww:${ww}px;--k:${it.k}">${c.online?`<i class="pz-num">${i+1}</i>`:""}<span class="wb">${it.html}</span><span class="pz-wh" style="left:18px"></span><span class="pz-wh" style="right:18px"></span></button>`).join("");
    T.style.transition="none"; T.style.transform="none"; const w=T.scrollWidth;
    sc_=Math.min(1.3,(sc.clientWidth*.94)/w,(sc.clientHeight*.62)/190);
    T.style.transform=`translateX(${sc.clientWidth+40}px) scale(${sc_})`; void T.offsetWidth;
    busy=true; sfx.whistle(); sfx.chug(2); move(0,2100,"cubic-bezier(.15,.65,.3,1)",()=>{ busy=false; });
    c.keys(e=>{ const kk=+e.key; if(kk>=1&&kk<=ch.length) pick(kk-1); });
  }
  function pick(i){ if(busy) return; const w=T.querySelector(`[data-i="${i}"]`); if(!w) return; const it=ch[i];
    if(it===t){ busy=true; w.classList.add("ok"); sfx.yay(); if(firstTry){ right++; record(t.key,true); } c.right(w,firstTry);
      F.className="pz-fb good"; F.innerHTML="MashaAllah! Off it goes…";
      c.later(()=>{ sfx.whistle(); sfx.chug(1.5,.15); move(-(T.getBoundingClientRect().width+120),1500,"cubic-bezier(.55,0,.85,.45)",()=>{ n++; if(n>=rounds) c.done({right,total:rounds,missed}); else round(); }); },700); }
    else { w.classList.remove("bad"); void w.offsetWidth; w.classList.add("bad"); sfx.no(); c.wrong();
      if(firstTry){ firstTry=false; record(t.key,false); if(!missed.includes(t)) missed.push(t); }
      F.className="pz-fb bad"; F.innerHTML=`That one is <b>${it.name}</b>. Try again.`; } }
  T.addEventListener("click",e=>{ const w=e.target.closest(".pz-wag"); if(w) pick(+w.dataset.i); });
  round();
}

/* ---------- 8. peek-a-boo: letters pop out of holes; tap the right one before it hides ---------- */
function actPeek(c){
  const nH=c.little?4:6, cols=short_()?nH:nH===4?2:(narrow()?2:3), need=c.little?4:5, missed=[];
  const targets=order(c.items).slice(0,c.opt.chain?1:Math.min(c.little?2:3,c.items.length));
  let ti=0, got=0, clean=true, right=0, alive=true, sinceT=9;
  c.stage.innerHTML=`<div class="pz-pk"><div class="pz-target"><span>Tap every</span><span class="x" id="pkX"></span><b id="pkN"></b><span class="pz-dots" id="pkD"></span><div class="pz-sp"></div>${c.online?`<span class="pz-hint">The child says the hole’s number</span>`:""}</div>
    <div class="pz-field" id="pkF" style="--c:${cols}">${[...Array(nH)].map((_,i)=>`<div class="pz-hole"><button class="pz-mole" data-h="${i}"></button>${c.online?`<span class="hn">${i+1}</span>`:""}</div>`).join("")}</div></div>`;
  const F=$("#pkF",c.stage), X=$("#pkX",c.stage), N=$("#pkN",c.stage), D=$("#pkD",c.stage), moles=$$(".pz-mole",F), up=new Map();
  function head(){ const t=targets[ti]; X.innerHTML=t.html; X.style.setProperty("--k",t.k); N.textContent=t.kind==="comp"?"":t.name;
    D.innerHTML=Array.from({length:need},(_,i)=>`<i class="${i<got?"on":""}"></i>`).join(""); c.prog(ti+1,targets.length); }
  function down(h){ const u=up.get(h); if(!u) return; clearTimeout(u.tm); up.delete(h); moles[h].classList.remove("up","no"); }
  function popUp(){
    if(!alive||document.hidden) return; const free=[...Array(nH).keys()].filter(h=>!up.has(h)); if(!free.length) return;
    const h=pickOne(free), t=targets[ti]; sinceT++; const ds=distract(t,5), isT=!ds.length||sinceT>=3||Math.random()<.42; if(isT) sinceT=0;
    const it=isT?t:pickOne(ds), m=moles[h]; m.classList.remove("hit","no"); m.style.setProperty("--mc",pickOne(["#FFE2B8","#D8ECFF","#E5DBFF","#FFD9E2","#D9F2DF","#FFF1B8"])); m.style.setProperty("--k",it.k); m.innerHTML=it.html; void m.offsetWidth; m.classList.add("up"); sfx.bloop();
    up.set(h,{it,tm:setTimeout(()=>down(h),(c.little||c.online)?2700:1800)});
  }
  function hit(h){ const u=up.get(h); if(!u) return; const m=moles[h], t=targets[ti];
    if(u.it===t){ clearTimeout(u.tm); up.delete(h); m.classList.add("hit"); sfx.pop(); c.award(3,m); got++; setTimeout(()=>m.classList.remove("up","hit"),280);
      if(got>=need){ if(clean){ right++; record(t.key,true); } c.right(m,clean,clean?10:5); ti++; got=0; clean=true; [...up.keys()].forEach(down);
        if(ti>=targets.length){ alive=false; return c.later(()=>c.done({right,total:targets.length,missed,text:`${targets.length} ${targets.length===1?"letter":"letters"} caught · ${right} without a mistake`}),600); }
        sfx.yay(); toast("MashaAllah! Next one…"); }
      head(); }
    else { m.classList.remove("no"); void m.offsetWidth; m.classList.add("no"); sfx.no(); c.wrong(); if(clean){ clean=false; record(t.key,false); if(!missed.includes(t)) missed.push(t); } }
  }
  F.addEventListener("pointerdown",e=>{ const m=e.target.closest(".pz-mole"); if(m){ e.preventDefault(); hit(+m.dataset.h); } });
  c.keys(e=>{ const k=+e.key; if(k>=1&&k<=nH) hit(k-1); });
  const iv=setInterval(popUp,(c.little||c.online)?1300:900); c.onLeave(()=>{ alive=false; clearInterval(iv); up.forEach(u=>clearTimeout(u.tm)); });
  head(); popUp();
}

/* ---------- 9. dot it: the letter without its dots; the child picks the right dots ---------- */
const DOTP={ba:"1b",ta:"2a",tha:"3a",noon:"1a",jeem:"1i",hha:"0",kha:"1a",dal:"0",dhal:"1a",ra:"0",zay:"1a",seen:"0",sheen:"3a",sad:"0",dad:"1a",tta:"0",zza:"1a",ain:"0",ghain:"1a",fa:"1a",qaf:"2a"};
const DLAB={"0":"No dots","1a":"1 dot on top","1b":"1 dot below","2a":"2 dots on top","2b":"2 dots below","3a":"3 dots on top","1i":"1 dot inside"};
const dBody=id=>id==="noon"?"ں":(DOTLESS[L[id].ch]||L[id].ch);
function dotPic(code){ const n=+code[0], p=code[1], y=p==="a"?20:p==="b"?84:50, xs=n===1?[60]:n===2?[47,73]:n===3?[47,73,60]:[];
  return `<svg viewBox="0 0 120 100" aria-hidden="true"><path d="M14 38Q14 68 60 68Q106 68 106 38" fill="none" stroke="#14231D" stroke-width="7" stroke-linecap="round"/>${xs.map((x,i)=>`<circle cx="${x}" cy="${n===3&&i===2?y-13:y}" r="7.5" fill="#14231D"/>`).join("")}</svg>`; }
function actDot(c){
  let ids=[...new Set(c.items.map(it=>it.id).filter(id=>DOTP[id]!==undefined))];
  if(ids.length&&ids.length<3) ids=[...new Set(ids.flatMap(id=>(VF[id]||[id]).filter(x=>DOTP[x]!==undefined)))];
  if(!ids.length) return c.none("Dot it needs letters with dots, like ب ت ث. Choose some first.");
  const rounds=c.little?5:8, list=roundsOf(ids.map(LI),rounds); let n=0, right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-dot"><div class="pz-q" id="dtQ"></div><div class="pz-dotL" id="dtL"></div><div class="pz-dopts" id="dtO"></div><p class="pz-fb" id="dtF">&nbsp;</p></div>`;
  const Q=$("#dtQ",c.stage), Lb=$("#dtL",c.stage), O=$("#dtO",c.stage), F=$("#dtF",c.stage);
  function round(){
    const it=list[n], id=it.id, good=DOTP[id], k=c.little?3:4; let firstTry=true, lock=false;
    const fam=(VF[id]||[]).map(x=>DOTP[x]).filter(x=>x!==undefined), opts=[good];
    for(const x of [...shuffle(fam),...shuffle(["1a","1b","2a","3a","0","2b"])]) if(!opts.includes(x)&&opts.length<k) opts.push(x);
    const show=shuffle(opts);
    Q.innerHTML=`Which dots does <b>${L[id].en}</b> ${A(L[id].ur,"sm")} have?`; F.innerHTML="&nbsp;"; F.className="pz-fb"; c.prog(n+1,list.length);
    Lb.className="pz-dotL"; Lb.innerHTML=`<span class="pz-a pz-db">${dBody(id)}</span><span class="pz-a pz-df">${L[id].ch}</span>`;
    O.style.setProperty("--c",narrow()&&show.length>3?2:show.length); O.innerHTML=show.map((code,i)=>`<button class="pz-dopt" data-i="${i}" style="--i:${i}">${c.online?`<i class="pz-num">${i+1}</i>`:""}${dotPic(code)}<span>${DLAB[code]}</span></button>`).join("");
    c.keys(e=>{ const kk=+e.key; if(kk>=1&&kk<=show.length) O.children[kk-1].click(); });
    O.onclick=e=>{ const b=e.target.closest(".pz-dopt"); if(!b||lock) return; const code=show[+b.dataset.i];
      if(code===good){ lock=true; b.classList.add("ok"); okBadge(b); Lb.classList.add("done"); sfx.yay(); if(firstTry){ right++; record(it.key,true); } c.right(b,firstTry);
        F.className="pz-fb good"; F.innerHTML=`MashaAllah! ${L[id].en} has ${DLAB[code].toLowerCase()}.`;
        c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed}); else round(); },1700); }
      else { b.classList.add("bad"); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; record(it.key,false); if(!missed.includes(it)) missed.push(it); }
        F.className="pz-fb bad"; F.innerHTML="Not that one. Look at the dots again."; } };
  }
  round();
}

/* ---------- 10. shape detective: is this the start, middle or end shape? ---------- */
const FCOL={S:"#1C6FD1",M:"#0E8A43",E:"#D6336C",A:"#7048E8"};
const FPIC={A:"<i></i>",S:"<u></u><i></i>",M:"<u></u><i></i><u></u>",E:"<i></i><u></u>"};
function actShape(c){
  let pool=[];
  if(S.info.mode==="shapes"){ pool=c.items.filter(it=>it.kind==="form"); [...new Set(pool.map(it=>it.id))].forEach(id=>pool.push(FI(id,"A"))); }
  else c.items.forEach(w=>(w.ps||[]).forEach(p=>{ if(L[p.id]&&L[p.id].j!=="U"&&p.ch===L[p.id].ch) pool.push(FI(p.id,p.form)); }));
  const seen=new Set(); pool=pool.filter(it=>!seen.has(it.key)&&seen.add(it.key));
  if(!pool.length) return c.none("Shape detective needs joined letters. Choose some first.");
  const rounds=c.little?5:8, list=roundsOf(pool,rounds); let n=0, right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-shd"><div class="pz-q" id="sdQ"></div><div class="pz-shc" id="sdC"></div><div class="pz-sopts" id="sdO"></div><p class="pz-fb" id="sdF">&nbsp;</p></div>`;
  const Q=$("#sdQ",c.stage), C=$("#sdC",c.stage), O=$("#sdO",c.stage), F=$("#sdF",c.stage);
  function round(){
    const it=list[n], opts=L[it.id].j==="D"?["A","S","M","E"]:["A","E"]; let firstTry=true, lock=false;
    Q.innerHTML=`Which shape of <b>${it.name}</b> is this?<small>Look at the gold lines: they show where it holds hands</small>`; F.innerHTML="&nbsp;"; F.className="pz-fb"; c.prog(n+1,list.length);
    C.className="pz-shc"; C.style.setProperty("--k",it.k); C.innerHTML=it.html;
    O.style.setProperty("--c",narrow()&&opts.length>3?2:opts.length);
    O.innerHTML=opts.map((f,i)=>`<button class="pz-sopt" data-f="${f}" style="--fc:${FCOL[f]}">${c.online?`<i class="pz-num">${i+1}</i>`:""}<span class="pic">${FPIC[f]}</span><b>${FORMN[f]}</b></button>`).join("");
    c.keys(e=>{ const kk=+e.key; if(kk>=1&&kk<=opts.length) O.children[kk-1].click(); });
    O.onclick=e=>{ const b=e.target.closest(".pz-sopt"); if(!b||lock) return; const f=b.dataset.f;
      if(f===it.f){ lock=true; b.classList.add("ok"); okBadge(b); C.style.setProperty("--fc",FCOL[f]); C.classList.add("done"); sfx.yay(); if(firstTry){ right++; record(it.key,true); } c.right(b,firstTry);
        F.className="pz-fb good"; F.innerHTML=`MashaAllah! That is ${it.name} in its <b>${FORMN[f].toLowerCase()}</b> shape.`;
        c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed}); else round(); },1600); }
      else { b.classList.add("bad"); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; record(it.key,false); if(!missed.includes(it)) missed.push(it); }
        F.className="pz-fb bad"; F.innerHTML="Not quite. Look at where the gold lines are."; } };
  }
  round();
}

/* ---------- 11. build the word: pick the letters in order and watch them join ---------- */
function bpieces(it){ const ps=it.ps, out=[]; for(let i=0;i<ps.length;i++){ const p=ps[i], n=ps[i+1];
  if(p.id==="lam"&&n&&n.ch==="ا"&&p.jn){ out.push({t:(p.jp?ZWJ:"")+p.ch+p.m+n.ch+n.m,iso:"لا"+p.m+n.m,id:"lam"}); i++; }
  else out.push({t:ptxt(p),iso:isoOf(p)+p.m,id:p.id}); } return out; }
function actBuild(c){
  const words=c.items.filter(w=>w.ps&&w.ps.length>=2&&!(w.kind==="sig"&&/[\s\/]/.test(w.w))); if(!words.length) return c.none("Build the word needs words. Choose some first.");
  const rounds=Math.min(c.little?3:5,Math.max(words.length,3)), list=roundsOf(words,rounds); let n=0, right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-bd"><div class="pz-q">Build the word<small>Pick the letters in order, starting from the right</small></div><div class="pz-bw2" id="bdW"></div><div class="pz-tiles" id="bdT"></div><p class="pz-fb" id="bdF">&nbsp;</p></div>`;
  const W=$("#bdW",c.stage), T=$("#bdT",c.stage), F=$("#bdF",c.stage);
  function round(){
    const w=list[n], pcs=bpieces(w); let next=0, firstTry=true, lock=false;
    const tiles=pcs.map(p=>({iso:p.iso}));
    if(!c.little){ const p=pickOne(pcs), fam=(VF[p.id]||[]).filter(x=>x!==p.id&&!pcs.some(q=>q.id===x)); if(fam.length) tiles.push({iso:L[pickOne(fam)].ch}); }
    const order_=shuffle(tiles);
    F.innerHTML="&nbsp;"; F.className="pz-fb"; c.prog(n+1,list.length);
    W.className="pz-bw2"; W.style.setProperty("--k",w.len<=2?1:w.len===3?.85:.7);
    W.innerHTML=pcs.map((p,i)=>`<span class="${c.little?"ghost":""}${i===0?" next":""}">${p.t}</span>`).join("");
    T.innerHTML=order_.map((tl,i)=>`<button class="pz-tile" data-i="${i}" style="--i:${i}">${c.online?`<i class="pz-num">${i+1}</i>`:""}${A(tl.iso)}</button>`).join("");
    c.keys(e=>{ const kk=+e.key; if(kk>=1&&kk<=order_.length) T.children[kk-1].click(); });
    T.onclick=e=>{ const b=e.target.closest(".pz-tile"); if(!b||lock||b.classList.contains("used")) return; const tl=order_[+b.dataset.i], sp=W.children;
      if(tl.iso===pcs[next].iso){ b.classList.add("used"); sp[next].classList.remove("next","ghost"); sp[next].classList.add("on"); next++; c.award(3,sp[next-1]);
        if(next<pcs.length){ sp[next].classList.add("next"); sfx.ok(); return; }
        lock=true; W.classList.add("done"); sfx.yay(); if(firstTry){ right++; record(w.key,true); } else record(w.key,false); c.right(W,firstTry);
        F.className="pz-fb good"; F.innerHTML="MashaAllah! You built the word.";
        c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed}); else round(); },1800); }
      else { b.classList.remove("bad"); void b.offsetWidth; b.classList.add("bad"); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; if(!missed.includes(w)) missed.push(w); }
        F.className="pz-fb bad"; F.innerHTML="Not yet. Which letter comes next?"; } };
  }
  round();
}

/* ================= Part 2 games: one contrast at a time ================= */
const P2R=w=>window.P2.read(w);
/* one big cell, two fixed answer buttons (1 and 2 never move) */
function actSort(c,cfg){
  let pool=c.items.filter(it=>cfg.cls(it)!=null); if(cfg.extra) pool=pool.concat(cfg.extra(c.items).filter(it=>cfg.cls(it)!=null&&!pool.includes(it)));
  if(pool.length<2) return c.none(cfg.empty);
  const rounds=Math.min(c.little?6:10,Math.max(6,pool.length)), grp=[0,1].map(k=>pool.filter(it=>cfg.cls(it)===k)); let list;
  if(grp[0].length&&grp[1].length){ const a=Math.round(rounds/2); list=shuffle([...roundsOf(grp[0],a),...roundsOf(grp[1],rounds-a)]);
    for(let i=1;i<list.length;i++) if(list[i]===list[i-1]){ const j=list.findIndex((x,k)=>k>i&&x!==list[i]&&x!==list[i-1]); if(j>0) [list[i],list[j]]=[list[j],list[i]]; } }
  else list=roundsOf(pool,rounds);
  let n=0,right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-sort"><div class="pz-q">${cfg.q}</div><div class="pz-sc" id="soC"></div>
    <div class="pz-sb" id="soB">${cfg.btn.map((b,i)=>`<button class="pz-so" data-i="${i}" style="--fc:${b.col}"><i class="pz-num">${i+1}</i><span class="pic">${b.pic||""}</span><b>${b.label}</b></button>`).join("")}</div>
    <p class="pz-fb" id="soF">&nbsp;</p></div>`;
  const Cc=$("#soC",c.stage), Bb=$("#soB",c.stage), F=$("#soF",c.stage);
  c.keys(e=>{ const k=+e.key; if(k>=1&&k<=cfg.btn.length) Bb.children[k-1].click(); });
  function round(){ const it=list[n]; let firstTry=true, lock=false; c.prog(n+1,list.length); F.className="pz-fb"; F.innerHTML="&nbsp;";
    Cc.className="pz-sc"; Cc.style.setProperty("--k",it.k); Cc.innerHTML=it.html; $$(".pz-so",Bb).forEach(b=>b.classList.remove("ok","bad"));
    Bb.onclick=e=>{ const b=e.target.closest(".pz-so"); if(!b||lock) return; const i=+b.dataset.i;
      if(i===cfg.cls(it)){ lock=true; b.classList.add("ok"); Cc.classList.add("ok"); if(cfg.hop&&cfg.hop(it,i)) Cc.classList.add("hop"); sfx.yay(); if(firstTry){ right++; record(it.key,true); } c.right(b,firstTry);
        F.className="pz-fb good"; F.innerHTML=cfg.ok(it); c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed}); else round(); },1500); }
      else { b.classList.remove("bad"); void b.offsetWidth; b.classList.add("bad"); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; record(it.key,false); if(!missed.includes(it)) missed.push(it); }
        F.className="pz-fb bad"; F.innerHTML=cfg.miss(it); } };
  }
  round();
}
const shortOf=items=>{ const L_=+S.info.lesson||0, out=[], seen=new Set(); items.forEach(it=>{ if(!it.core||it.core==="ا") return; ["َ","ِ","ُ"].forEach(m=>{ const w=it.core+m; if(!seen.has(w)){ seen.add(w); out.push(YI(w,L_)); } }); }); return shuffle(out).slice(0,Math.ceil(items.length/2)); };
const roleIs=(it,r)=>P2R(it.w).parts.some(p=>p.role===r);
const uniqI=a=>a.filter((x,i)=>a.findIndex(y=>y.key===x.key)===i);
const bounceOf=items=>{ const L_=+S.info.lesson||0, sig=items.filter(it=>it.kind==="sig"), hasB=sig.some(it=>it.tags.includes("bounce")), hasN=sig.some(it=>!it.tags.includes("bounce")), out=[];
  if(!hasB) [...new Set(sig.map(it=>it.pat).filter(p=>p&&p.includes("X")&&/ْ/.test(p)))].forEach(p=>[..."قطبجد"].forEach(l=>out.push(YI(p.replace("X",l),L_))));
  if(!hasN) sig.forEach(it=>{ if(it.core) ["َ","ِ","ُ"].forEach(m=>out.push(YI(it.core+m,L_))); });
  return shuffle(uniqI(out)).slice(0,Math.max(4,Math.ceil(sig.length/2))); };
/* Leen or Madd? looks only at the Waaw or Yaa */
const wyRole=it=>{ const R=P2R(it.w), r=R.parts.map((p,i)=>(R.ps[i].id==="waw"||R.ps[i].id==="ya")?p.role:"").filter(x=>x==="leen"||x==="madd"); return r.includes("leen")&&!r.includes("madd")?0:r.includes("madd")&&!r.includes("leen")?1:null; };
const leenMaddOf=items=>{ const L_=+S.info.lesson||0, sig=items.filter(it=>it.kind==="sig"&&it.len<=3), hasL=sig.some(it=>wyRole(it)===0), hasM=sig.some(it=>wyRole(it)===1), out=[];
  sig.forEach(it=>{ const k=wyRole(it); if(k===0&&!hasM) out.push(YI(it.w.replace("َوْ","ُوْ").replace("َیْ","ِیْ"),L_)); if(k===1&&!hasL) out.push(YI(it.w.replace("ُوْ","َوْ").replace("ِیْ","َیْ"),L_)); });
  return shuffle(uniqI(out.filter(x=>wyRole(x)!=null))).slice(0,Math.max(4,Math.ceil(sig.length/2))); };
function actQuick(c){ actSort(c,{q:"Quick or long?<small>The child says the number, then reads it</small>",empty:"Quick or long? needs letters with signs.",
  btn:[{label:"Quick",col:"#1C6FD1",pic:'<i style="width:22px"></i>'},{label:"Long",col:"#7048E8",pic:'<i style="width:64px"></i>'}],
  cls:it=>it.kind==="sig"&&it.core?(/aa|ee|oo/.test(it.name)?1:0):null, extra:shortOf,
  ok:it=>`MashaAllah! <b dir="ltr">${it.name}</b> is ${/aa|ee|oo/.test(it.name)?"long":"quick"}.`, miss:()=>"Look again: a standing sign or a Madd letter makes it long."}); }
function actBounce(c){ actSort(c,{q:"Does it bounce?<small>Bounce letters: ق ط ب ج د, only when resting</small>",empty:"Bounce it needs Sukun cells.",
  btn:[{label:"Bounce",col:"#C2410C",pic:IC("bounce")},{label:"No bounce",col:"#5F6D67",pic:IC("x")}],
  cls:it=>it.kind==="sig"?(it.tags.includes("bounce")?0:1):null, hop:(it,i)=>i===0, extra:bounceOf,
  ok:it=>it.tags.includes("bounce")?`MashaAllah! It bounces: <b dir="ltr">${it.name}</b>`:`MashaAllah! No bounce: <b dir="ltr">${it.name}</b>`, miss:()=>"Bounce letters: ق ط ب ج د, only when resting."}); }
function actLeenMadd(c){ actSort(c,{q:"Soft or stretch?<small>Look at the sign before the Waaw or Yaa</small>",empty:"Leen or Madd? needs Leen and Madd cells.",
  btn:[{label:"Soft (Leen)",col:"#C2410C",pic:IC("soft")},{label:"Stretch (Madd)",col:"#0E8A43",pic:'<i style="width:64px"></i>'}],
  cls:it=>it.kind==="sig"?wyRole(it):null, extra:leenMaddOf,
  ok:it=>`MashaAllah! <b dir="ltr">${it.name}</b>`, miss:()=>"Fatha before it: soft and quick. Damma before Waaw, Kasra before Yaa: stretch."}); }
/* Say it twice: the Shadda letter splits into two, then the child finds the same word */
function splitShadda(w){ const ch=[...w], k=ch.indexOf("ّ"); if(k<1) return null; let li=k-1; while(li>=0&&/[ً-ٰٟ]/.test(ch[li])) li--; if(li<0) return null;
  const letter=ch[li]; let j=k+1, vowel=""; while(j<ch.length&&/[ً-ٰٟ]/.test(ch[j])) vowel+=ch[j++];
  const prevV=ch.slice(0,li).join("").match(/[َ-ِ]$/); if((letter==="و"&&prevV&&prevV[0]==="ُ")||(letter==="ی"&&prevV&&prevV[0]==="ِ")) return null;
  return {a:ch.slice(0,li).join("")+letter+"ْ", b:letter+vowel+ch.slice(j).join(""), noSh:w.replace(/ّ/g,"")}; }
function actTwice(c){
  const pool=c.items.filter(it=>it.kind==="sig"&&!/[\s\/]/.test(it.w)&&splitShadda(it.w)); if(!pool.length) return c.none("Say it twice needs Shadda cells.");
  const L_=+S.info.lesson||0, rounds=Math.min(c.little?5:8,Math.max(5,pool.length)), list=roundsOf(pool,rounds); let n=0,right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-find"><div class="pz-q">Say it twice<small>First it rests, then it takes its sign</small></div><div class="pz-split" id="twS"></div><div class="pz-ch" id="twC"></div><p class="pz-fb" id="twF">&nbsp;</p></div>`;
  const Sp=$("#twS",c.stage), C=$("#twC",c.stage), F=$("#twF",c.stage);
  function round(){ const it=list[n], sp=splitShadda(it.w), opts=shuffle([it,YI(sp.noSh,L_),YI(sp.a,L_)].filter((x,i,a)=>a.findIndex(y=>y.key===x.key)===i)); let firstTry=true, lock=false;
    c.prog(n+1,list.length); F.className="pz-fb"; F.innerHTML="Which one is the same?";
    Sp.innerHTML=`<span class="tile">${A(sp.a)}<b>${P2R(sp.a).text}</b></span><i>+</i><span class="tile" style="animation-delay:.25s">${A(sp.b)}<b>${P2R(sp.b).text}</b></span>`;
    C.className="pz-ch"; C.style.setProperty("--c",opts.length);
    C.innerHTML=opts.map((o,i)=>`<button class="pz-c" data-i="${i}" style="--k:${o.k};--i:${i}">${c.online?`<i class="pz-num">${i+1}</i>`:""}${o.html}</button>`).join("");
    c.keys(e=>{ const k=+e.key; if(k>=1&&k<=opts.length) C.children[k-1].click(); });
    C.onclick=e=>{ const b=e.target.closest(".pz-c"); if(!b||lock) return; const o=opts[+b.dataset.i];
      if(o===it){ lock=true; b.classList.add("ok"); okBadge(b); sfx.yay(); if(firstTry){ right++; record(it.key,true); } c.right(b,firstTry); F.className="pz-fb good"; F.innerHTML=`MashaAllah! <b dir="ltr">${it.name}</b>`;
        c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed}); else round(); },1500); }
      else { b.classList.add("bad"); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; record(it.key,false); if(!missed.includes(it)) missed.push(it); } F.className="pz-fb bad"; F.innerHTML="Look for the Shadda: the letter is read twice."; } };
  }
  round();
}
/* Stop sign: how do we say this word when we stop? */
function stopOpts(p){ const w=p.w;
  if(p.w===p.s){ const R=P2R(w); let j=R.ps.length-1; while(j>0&&["madd","leen","silent"].includes(R.parts[j].role)) j--;
    const head=R.ps.slice(0,j).map((q,i)=>(q.ws&&i?" ":"")+q.ch+q.m).join("")+(R.ps[j].ws&&j?" ":"")+R.ps[j].ch, own=R.ps[j].m.replace(/[ٰٖٗ]/g,"");
    return [...new Set([head+"ْ",head+(own==="َ"?"ِ":"َ"),head+(own==="ُ"?"ِ":"ُ")])].filter(x=>x!==p.s); }
  const tail=/[ً-ْٰٖٗ]+$/, noSeat=w.replace(/(ً)[ایى]$/,"$1"), base=noSeat.replace(tail,"");
  return [...new Set([w,base+"ْ",base+"َا",w.replace(/ة[ً-ْ]*$/,"هْ"),base+"َ"])].filter(x=>x!==p.s&&x!==base); }
function actStop(c){
  const all=(c.opt.stops||S.info.stops||[]); if(!all.length) return c.none("No stopping pairs on this page.");
  const L_=+S.info.lesson||0, rounds=Math.min(c.little?5:8,all.length<4?all.length*2:all.length), list=[]; while(list.length<rounds) shuffle(all).forEach(p=>{ if(list.length<rounds) list.push(p); });
  let n=0,right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-find"><div class="pz-q">How do we say it when we stop?</div><div class="pz-stopw" id="stW"></div><div class="pz-ch" id="stC"></div><p class="pz-fb" id="stF">&nbsp;</p></div>`;
  const W=$("#stW",c.stage), C=$("#stC",c.stage), F=$("#stF",c.stage);
  function round(){ const p=list[n], it=YI(p.w,L_), opts=shuffle([p.s,...shuffle(stopOpts(p)).slice(0,2)]).map(x=>YI(x,L_)); let firstTry=true, lock=false;
    c.prog(n+1,list.length); F.className="pz-fb"; F.innerHTML="&nbsp;";
    W.innerHTML=`<span class="w">${it.html}</span><span class="sg">STOP</span>`;
    C.className="pz-ch"; C.style.setProperty("--c",opts.length);
    C.innerHTML=opts.map((o,i)=>`<button class="pz-c" data-i="${i}" style="--k:${o.k};--i:${i}">${c.online?`<i class="pz-num">${i+1}</i>`:""}${o.html}</button>`).join("");
    c.keys(e=>{ const k=+e.key; if(k>=1&&k<=opts.length) C.children[k-1].click(); });
    C.onclick=e=>{ const b=e.target.closest(".pz-c"); if(!b||lock) return; const o=opts[+b.dataset.i];
      if(o.w===p.s){ lock=true; b.classList.add("ok"); okBadge(b); sfx.yay(); if(firstTry){ right++; record("z:"+p.w,true); } c.right(b,firstTry);
        F.className="pz-fb good"; F.innerHTML=`MashaAllah! Stopping: <b dir="ltr">${o.name}</b>${p.tag==="hold"?" — hold it a little longer":p.tag==="bounce"?" — let it bounce":""}`;
        c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed:[]}); else round(); },1700); }
      else { b.classList.add("bad"); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; record("z:"+p.w,false); } F.className="pz-fb bad"; F.innerHTML="Not quite. When we stop, the last letter rests; two Fathas become “aa”; Round Ta becomes “h”."; } };
  }
  round();
}
/* Twins: two look-alike sounds; the teacher asks for one, then the other */
function actTwins(c){
  const L_=+S.info.lesson||0; let groups=(S.info.twins||[]).map(g=>g.map(w=>YI(w,L_))); if(!groups.length) return c.none("Twins needs a look-alike table.");
  groups=shuffle(groups).slice(0,c.little?4:6); let gi=0, turn=0, right=0, clean=true, cards=[], asked=[];
  c.stage.innerHTML=`<div class="pz-find"><div class="pz-q" id="tnQ"></div><div class="pz-ch" id="tnC"></div><p class="pz-fb" id="tnF">&nbsp;</p><p class="pz-hint">The teacher says it. Then the cards swap and the teacher asks for the other one.</p></div>`;
  const Q=$("#tnQ",c.stage), C=$("#tnC",c.stage), F=$("#tnF",c.stage);
  function round(){ const g=groups[gi]; if(turn===0){ asked=shuffle(g).slice(0,2); clean=true; } cards=shuffle(g); const t=asked[turn]; let firstTry=true, lock=false;
    c.prog(gi+1,groups.length); Q.innerHTML=`Find <b dir="ltr">${t.name}</b><small>${turn===0?"First one":"Now the other one"}</small>`; F.className="pz-fb"; F.innerHTML="&nbsp;";
    C.className="pz-ch"; C.style.setProperty("--c",cards.length);
    C.innerHTML=cards.map((o,i)=>`<button class="pz-c" data-i="${i}" style="--k:${o.k};--i:${i}">${c.online?`<i class="pz-num">${i+1}</i>`:""}${o.html}</button>`).join("");
    c.keys(e=>{ const k=+e.key; if(k>=1&&k<=cards.length) C.children[k-1].click(); });
    C.onclick=e=>{ const b=e.target.closest(".pz-c"); if(!b||lock) return; const o=cards[+b.dataset.i];
      if(o===t){ lock=true; b.classList.add("ok"); okBadge(b); sfx.yay(); record(t.key,firstTry); c.right(b,firstTry); F.className="pz-fb good"; F.innerHTML="MashaAllah!";
        c.later(()=>{ if(turn===0){ turn=1; round(); return; } if(clean&&firstTry){ right++; } turn=0; gi++; if(gi>=groups.length) c.done({right,total:groups.length,text:`${right} of ${groups.length} twins won`}); else round(); },1100); }
      else { b.classList.add("bad"); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; clean=false; record(t.key,false); } F.className="pz-fb bad"; F.innerHTML=`That one is <b dir="ltr">${o.name}</b>. Listen again.`; } };
  }
  round();
}
/* Spot the sign / Hum it: tap the letter that carries the sign */
function signGroups(R){ const out=[]; for(let i=0;i<R.ps.length;i++){ const p=R.ps[i], nx=R.ps[i+1];
    if(p.id==="lam"&&nx&&!nx.ws&&nx.ch==="ا"&&p.jn){ out.push({ix:[i,i+1],t:(p.jp?ZWJ:"")+p.ch+p.m+nx.ch+nx.m,gap:p.ws&&i>0}); i++; }
    else out.push({ix:[i],t:ptxt(p),gap:p.ws&&i>0}); } return out; }
const SPOT={1:["Tap the resting letter (with Sukun)",(R,i)=>R.parts[i].role==="rest"],2:["Tap the letter with Tanween",(R,i)=>/[ً-ٍ]/.test(R.ps[i].m)],
  3:["Tap the letter with a Standing sign",(R,i)=>/[ٰٖٗ]/.test(R.ps[i].m)],4:["Tap the Madd letter (the one that stretches)",(R,i)=>R.parts[i].role==="madd"],
  5:["Tap the Leen letter (soft and quick)",(R,i)=>R.parts[i].role==="leen"],6:["Tap the letter with Shadda",(R,i)=>/ّ/.test(R.ps[i].m)],
  B:["Tap a letter we do not read",(R,i)=>R.parts[i].role==="silent"],hum:["Which letter hums through the nose?",(R,i)=>(R.ps[i].id==="noon"||R.ps[i].id==="meem")&&/ّ/.test(R.ps[i].m)]};
function actSpotSign(c,key){
  const [q,test]=SPOT[key]||SPOT[1], tg=it=>{ const R=P2R(it.w); return R.ps.map((_,i)=>i).filter(i=>test(R,i)); };
  const words=c.items.filter(it=>it.kind==="sig"&&it.ps.length>=2&&tg(it).length); if(!words.length) return c.none("Nothing to spot here. Choose some words first.");
  const rounds=Math.min(c.little?5:8,Math.max(5,words.length)), list=roundsOf(words,rounds); let n=0,right=0; const missed=[];
  c.stage.innerHTML=`<div class="pz-spot"><div class="pz-q">${q}</div><div class="pz-word${c.online?" num":""}" id="ssW"></div><p class="pz-fb" id="ssF">&nbsp;</p></div>`;
  const W=$("#ssW",c.stage), F=$("#ssF",c.stage);
  function round(){ const it=list[n], R=P2R(it.w), targets=new Set(tg(it)), gs=signGroups(R); let firstTry=true, lock=false, num=0;
    c.prog(n+1,list.length); F.className="pz-fb"; F.innerHTML="&nbsp;"; W.style.setProperty("--k",Math.min(1,it.k*1.05));
    W.innerHTML=gs.map((g,i)=>`${g.gap?`<i class="gap"></i>`:""}<span data-i="${i}" data-n="${++num}">${g.t}</span>`).join("");
    c.keys(e=>{ const k=+e.key; const s=W.querySelector(`span[data-n="${k}"]`); if(s) s.click(); });
    W.onclick=e=>{ const s=e.target.closest("span"); if(!s||lock) return; const g=gs[+s.dataset.i];
      if(g.ix.some(i=>targets.has(i))){ lock=true; s.classList.add("ok"); sfx.yay(); if(firstTry){ right++; record(it.key,true); } c.right(s,firstTry);
        F.className="pz-fb good"; F.innerHTML=`MashaAllah! <b dir="ltr">${it.name}</b>`; c.later(()=>{ n++; if(n>=list.length) c.done({right,total:list.length,missed}); else round(); },1500); }
      else { s.classList.add("bad"); setTimeout(()=>s.classList.remove("bad"),450); sfx.no(); c.wrong(); if(firstTry){ firstTry=false; record(it.key,false); if(!missed.includes(it)) missed.push(it); } F.className="pz-fb bad"; F.innerHTML="Not that one. Look at the signs again."; } };
  }
  round();
}
const isSigns=inf=>inf.mode==="signs", lessonIn=(inf,...l)=>isSigns(inf)&&l.map(String).includes(String(inf.lesson));
const actOrder=()=>BOOK==="part1"?Object.keys(ACTS):["flash","which","find","quick","bounce","leenmadd","twice","twins","stop","hum","spot2","train","balloon","peek","memory","build","read"];
const ACTS={
  flash:{ic:"cards",t:"#E8F0FB",tc:"#2F5FA7",title:"Flash cards",desc:"The child says it, you mark it. Missed cards come back.",run:actFlash},
  find:{ic:"pointer",t:"#E5F4EB",tc:"#0B6B45",title:"Find it",desc:"You say the name, the child picks it.",run:actFind},
  train:{ic:"train",t:"#E3F0F6",tc:"#1F6E8C",title:"Letter train",desc:"Pick the right wagon and the train leaves.",run:actTrain,isNew:true},
  balloon:{ic:"balloon",t:"#FCE9EE",tc:"#B83A5E",title:"Balloon pop",desc:"Pop every balloon with the right one.",run:actBalloon},
  peek:{ic:"peek",t:"#EDF5E3",tc:"#4D7A1E",title:"Peek-a-boo",desc:"Tap it when it pops out of a hole.",run:actPeek,isNew:true},
  memory:{ic:"grid",t:"#F0ECFA",tc:"#6246B5",title:"Memory match",desc:"Turn two cards over and find the pairs.",run:actMemory},
  dot:{ic:"dots",t:"#FBF1D9",tc:"#8A6A0C",title:"Dot it!",desc:"Give the letter its right dots.",run:actDot,isNew:true,ok:inf=>inf.mode==="letters"||inf.mode==="shapes"},
  shape:{ic:"shapes",t:"#FCEBE4",tc:"#B4501F",title:"Shape detective",desc:"Start, middle or end shape?",run:actShape,isNew:true,ok:inf=>["shapes","comp","word"].includes(inf.mode)},
  spot:{ic:"search",t:"#E6F2F0",tc:"#2C7A73",title:"Spot it",desc:"Find the letter hiding inside a word.",run:actSpot,ok:inf=>!isSigns(inf)&&inf.words.length>0},
  build:{ic:"blocks",t:"#E9EEF9",tc:"#3B5BA5",title:"Build the word",desc:"Put the letters in order to make the word.",run:actBuild,isNew:true,ok:inf=>["shapes","comp","word","signs"].includes(inf.mode)&&inf.words.some(w=>w.len>=2&&!/[\s\/]/.test(w.w||""))},
  read:{ic:"clipboard",t:"#EEF1EF",tc:"#44524C",title:"Read check",desc:"The page, shuffled. Tap the ones that were wrong.",run:actRead},
  which:{ic:"sign",t:"#E5F4EB",tc:"#0B6B45",title:"Which sign?",desc:"Same letter, different signs. Find the one the teacher says.",run:c=>actFind(Object.assign(c,{which:true})),isNew:true,ok:inf=>isSigns(inf)&&inf.lesson!=="B"&&inf.all.filter(it=>it.core&&it.core!=="ا").length>=Math.max(2,inf.all.length/2)},
  quick:{ic:"gauge",t:"#EDE9FB",tc:"#5B3FC4",title:"Quick or long?",desc:"Is the sound quick or long?",run:actQuick,isNew:true,ok:inf=>lessonIn(inf,3,4)&&inf.all.some(it=>it.core&&it.core!=="ا")},
  bounce:{ic:"bounce",t:"#FDEDE3",tc:"#B4501F",title:"Bounce it",desc:"Does the letter bounce (Qalqala)?",run:actBounce,isNew:true,ok:inf=>lessonIn(inf,1)},
  leenmadd:{ic:"soft",t:"#FDEDE3",tc:"#B4501F",title:"Leen or Madd?",desc:"Soft and quick, or stretched?",run:actLeenMadd,isNew:true,ok:inf=>lessonIn(inf,5)&&inf.all.some(it=>wyRole(it)!=null)},
  twice:{ic:"split",t:"#FBF1D9",tc:"#8A6A0C",title:"Say it twice",desc:"Watch the Shadda letter split into two.",run:actTwice,isNew:true,ok:inf=>lessonIn(inf,6)},
  twins:{ic:"twins",t:"#E8F0FB",tc:"#2F5FA7",title:"Twins",desc:"Two look-alike sounds. The teacher asks for one, then the other.",run:actTwins,isNew:true,ok:inf=>isSigns(inf)&&inf.twins&&inf.twins.length>0},
  stop:{ic:"stopsign",t:"#FDECEC",tc:"#B42318",title:"Stop sign",desc:"How do we say the word when we stop?",run:actStop,isNew:true,ok:inf=>isSigns(inf)&&inf.stops&&inf.stops.length>0},
  hum:{ic:"nose",t:"#E8F0FB",tc:"#2F5FA7",title:"Hum it",desc:"Find the letter that hums through the nose.",run:c=>actSpotSign(c,"hum"),isNew:true,ok:inf=>lessonIn(inf,"B")&&inf.all.some(it=>it.tags&&it.tags.includes("nose"))},
  spot2:{ic:"search",t:"#E6F2F0",tc:"#2C7A73",title:"Spot the sign",desc:"Tap the letter that carries the sign.",run:c=>actSpotSign(c,S.info.lesson||1),isNew:true,ok:inf=>isSigns(inf)&&inf.words.length>0}
};

/* ================= progress: level, points and the letter journey ================= */
function progress(){
  runCleanup(); S.view="prog"; navSync(); const inf=S.info, P1=BOOK==="part1", doneP=stu().path||{}, NODES=P1?ORDER:PATH, lvs=P1?ORDER.map(id=>level([LI(id)])):PATH.map(s=>doneP[s.id]?"good":"new"), cnt=k=>lvs.filter(x=>x===k).length, lv=lvOf(pts());
  const per=narrow()?4:6, RH=narrow()?96:120, here=NODES.findIndex((id,i)=>lvs[i]!=="good"), rows=Math.ceil(NODES.length/per), H=rows*RH+30;
  const pos=i=>{ const r=Math.floor(i/per), j=i%per, x0=narrow()?13:8; return {x:x0+(r%2===0?per-1-j:j)*((100-2*x0)/(per-1)), y:(narrow()?58:70)+r*RH}; };
  let d=""; NODES.forEach((_,i)=>{ const p=pos(i); if(!i){ d+=`M${p.x} ${p.y}`; return; } const q=pos(i-1);
    d+= Math.floor(i/per)===Math.floor((i-1)/per)?` L${p.x} ${p.y}`:` C${q.x+(q.x>50?7:-7)} ${q.y} ${p.x+(p.x>50?7:-7)} ${p.y} ${p.x} ${p.y}`; });
  B.innerHTML=`<div class="pz-pv"><div class="pz-acth"><div class="gt"><span class="t">${IC("map")}</span>Progress · ${esc(store.cur)}</div></div>
    <div class="pz-lvcard"><div class="lv"><small>Level</small><b>${lv.n}</b></div><div class="grow"><div class="t">${fmtN(pts())} points · ${stu().stars||0} stars</div><div class="s">${fmtN(lv.hi-pts())} more points to level ${lv.n+1}</div><div class="bar"><i style="width:${Math.round(100*(pts()-lv.lo)/(lv.hi-lv.lo))}%"></i></div></div>
      ${P1?`<div class="pz-cnt"><span class="lv-good">Knows it: ${cnt("good")}</span><span class="lv-learn">Learning: ${cnt("learn")}</span><span class="lv-weak">Needs practice: ${cnt("weak")}</span><span>New: ${cnt("new")}</span></div>`:`<div class="pz-cnt"><span class="lv-good">Steps done: ${cnt("good")}</span><span>Still to do: ${cnt("new")}</span></div>`}</div>
    ${statsHTML()}
    <h3>${P1?"Letter journey":"Lesson journey"}</h3>
    <div class="pz-jm" style="height:${H}px"><svg class="path" viewBox="0 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="#D8E0DB" stroke-width="10" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>
      ${NODES.map((id,i)=>{ const p=pos(i); return `<div class="pz-jn lv-${lvs[i]}${i===here?" here":""}"${P1?"":` data-step="${i}" title="${esc(id.title)}"`} style="left:${p.x}%;top:${p.y}px">${P1?`${A(L[id].ch)}<small>${L[id].en}</small>`:`<b class="pz-jnum">${i+1}</b><small>${esc(id.title)}</small>`}${lvs[i]==="good"?`<span class="pz-jst">${IC("star")}</span>`:""}${i===here?`<span class="flag">Next</span>`:""}</div>`; }).join("")}</div>
    ${inf.mode!=="letters"&&inf.mode!=="none"?`<h3>${inf.label} · ${inf.title}</h3><div class="pz-pg">${inf.units.map(u=>`<div class="pz-pc lv-${level(u.items)}">${A(u.label)}${u.name?`<small>${u.name}</small>`:""}</div>`).join("")}</div>`:""}
    ${LEG}<p class="pz-hint" style="text-align:left">${P1?"A letter turns green when it has been answered right three times more than wrong. Every game counts.":"A step turns green when it is finished. Tap a step to play it."}</p>
    ${P1?`<div class="pz-rb" style="justify-content:flex-start"><button class="pz-btn pri" data-go="weak">${IC("cards")}Practise the letters that need work</button></div>`:""}</div>`;
}
/* ================= lesson path: the whole of Part 1 as short practice steps ================= */
const PATH=window.EQAIDA_PATH?window.EQAIDA_PATH({pageInfo,PAGES}):(()=>{
  const out=[], pageIdx=no=>PAGES.findIndex(p=>{ const n=p.querySelector(".hdr .no"); return n&&n.textContent.trim()===no; });
  const add=(group,no,id,title,pick)=>{ const i=pageIdx(no); if(i<0) return; const us=pageInfo(i).units, units=pick?pick(us):us; if(!units.length) return;
    out.push({id,group,page:i,title,ids:units.map(u=>u.id),prev:units.slice(0,6).map(u=>u.label)}); };
  const part=(k,n)=>a=>a.slice(Math.floor(a.length*k/n),Math.floor(a.length*(k+1)/n));
  const G1="Lesson 1 · Letters", G2="New exercise · Letter shapes", G3="Lesson 2 · Joined letters", G4="Lesson 3 · Fatha, Kasra, Damma";
  for(let r=0;r<5;r++) add(G1,"3","3/r"+(r+1),"Letters · row "+(r+1),a=>a.slice(r*6,r*6+6));
  add(G1,"3","3/all","All 29 letters");
  add(G1,"4","4","Letters by Makhraj · 1"); add(G1,"6","6","Letters by Makhraj · 2");
  add(G2,"9B","9B","Start, middle, end · 1"); add(G2,"9C","9C","Start, middle, end · 2"); add(G2,"9D","9D","Start, middle, end · 3");
  add(G3,"10","10","Joined letters · 1");
  for(let k=0;k<3;k++) add(G3,"11","11/"+(k+1),"Joined letters · "+(k+2),part(k,3));
  add(G3,"12","12","Joined letters · 5");
  add(G4,"13","13","Sounds · 1"); add(G4,"14","14/1","Sounds · 2",part(0,2)); add(G4,"14","14/2","Sounds · 3",part(1,2));
  add(G4,"15","15","Words with sounds");
  return out;
})();
function stepInfo(st){ const src=st.src||[{page:st.page,ids:st.ids}];
  const parts=src.map(s=>{ const inf=pageInfo(s.page); return {inf,ids:s.ids?s.ids.filter(id=>inf.units.some(u=>u.id===id)):inf.units.map(u=>u.id)}; });
  if(parts.length===1) return {info:parts[0].inf,ids:parts[0].ids};
  const seen=new Set(), units=[]; parts.forEach(p=>p.inf.units.forEach(u=>{ if(!seen.has(u.id)){ seen.add(u.id); units.push(u); } }));
  const all=units.flatMap(u=>u.items);
  return {info:Object.assign({},parts[0].inf,{key:"step-"+st.id,units,all,words:all.filter(it=>it.len>=3),stops:parts.flatMap(p=>p.inf.stops||[]),twins:parts.flatMap(p=>p.inf.twins||[])}),ids:parts.flatMap(p=>p.ids)};
}
function startStep(st){
  if(!st) return; const {info,ids}=stepInfo(st); S.info=info; S.sel=new Set(ids); header(); const items=selItems(); if(!items.length) return toast("Nothing to practise in this step.");
  const games=st.games||["flash","find",["train","balloon","peek"][PATH.indexOf(st)%3]];
  const sets=games.map(g=>g==="flash"?order(items).slice(0,little()?6:10):items);
  start(games[0],{chain:{steps:games,i:0,stars:0,step:st.id,sets},items:sets[0]});
}
function pathView(){
  runCleanup(); S.view="path"; navSync(); const done=stu().path||{}, nextI=PATH.findIndex(s=>!done[s.id]), n=PATH.filter(s=>done[s.id]).length; let g="";
  B.innerHTML=`<div class="pz-pv"><div class="pz-lvcard"><div class="lv"><small>Steps</small><b>${n}</b></div><div class="grow"><div class="t">${n} of ${PATH.length} steps done</div><div class="s">Each step is a short practice: Flash cards, then two games.</div><div class="bar"><i style="width:${Math.round(100*n/PATH.length)}%"></i></div></div>
      ${nextI>=0?`<button class="pz-btn pri" data-step="${nextI}">${n?"Continue":"Start"}${IC("right")}</button>`:`<span class="pz-lvup">All steps done</span>`}</div>
    <div class="pz-path">${PATH.map((s,i)=>(s.group!==g?(g=s.group,`<h3>${s.group}</h3>`):"")+`<button class="pz-step${done[s.id]?" done":""}${i===nextI?" next":""}" data-step="${i}"><span class="pz-sno">${done[s.id]?IC("check"):i+1}</span><span class="pz-stt"><b>${s.title}</b><span class="pz-spv" dir="rtl">${s.prev.map(t=>A(t)).join("")}</span></span><span class="pz-sst">${[1,2,3].map(k=>`<i class="${k<=(done[s.id]||0)?"on":""}">${STAR}</i>`).join("")}</span><span class="pz-sgo">${i===nextI?"Start":done[s.id]?"Again":"Play"}</span></button>`).join("")}</div></div>`;
  const nx=$(".pz-step.next",B); if(nx&&n) nx.scrollIntoView({block:"center"});
}

/* ================= leaderboard: this week / all time; all students once connected to eQuran ================= */
let boardPeriod="week", boardTok=0;
async function boardRows(period){
  if(API){ try{ const r=await fetch(API+"/leaderboard?book="+BOOK+"&period="+period,{cache:"no-store"});
      if(r.ok){ const d=await r.json(), list=Array.isArray(d)?d:(d.rows||[]);
        return {live:true,rows:list.map(x=>({name:String(x.name||"Student"),sid:String(x.sid||""),pts:+x.points||0,level:+x.level||1}))}; } }catch(e){} }
  return {live:false,rows:Object.keys(store.students).map(n=>{ const s=store.students[n]; return {name:n,sid:s.sid||"",pts:period==="week"?weekPts(s):(s.pts||0),level:lvOf(s.pts).n}; })};
}
async function board(){
  runCleanup(); S.view="board"; navSync(); const tok=++boardTok, RULES=[["Right the first time","+10"],["Right on the second try","+5"],["3 right in a row","+5"],["Finishing a game","+5 to +20"],["Finishing a lesson step","+30"],["Daily goal ("+GOAL+" points)","+20"]];
  B.innerHTML=`<div class="pz-pv"><div class="pz-acth"><div class="gt"><span class="t" style="--t:#FBF3D8;--tc:#8A6A0C">${IC("trophy")}</span>Leaderboard</div><div class="pz-sp"></div>
      <div class="pz-seg"><button data-period="week" class="${boardPeriod==="week"?"on":""}">This week</button><button data-period="all" class="${boardPeriod==="all"?"on":""}">All time</button></div></div>
    <div class="pz-lb" id="pzLb"><p class="pz-hint">Loading…</p></div><p class="pz-hint" id="pzLbN" style="text-align:left"></p>
    <h3>How points work</h3><div class="pz-rules">${RULES.map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join("")}</div></div>`;
  const {rows,live}=await boardRows(boardPeriod); if(tok!==boardTok||S.view!=="board") return;
  const me=stu().sid, isMe=r=>me&&r.sid?r.sid===me:r.name===store.cur;
  rows.sort((a,b)=>b.pts-a.pts||a.name.localeCompare(b.name)); const mine=rows.findIndex(isMe), top=rows.slice(0,10);
  const row=(r,i)=>`<div class="pz-lr${i<3&&r.pts>0?" top"+(i+1):""}${isMe(r)?" me":""}"><span class="pz-rk">${i+1}</span><span class="pz-ln">${esc(r.name)}${isMe(r)?`<em>You</em>`:""}</span><span class="pz-ll">Level ${r.level}</span><span class="pz-lp">${IC("coin")}<b>${fmtN(r.pts)}</b></span></div>`;
  $("#pzLb",B).innerHTML=(rows.some(r=>r.pts>0)?"":`<p class="pz-hint">No points yet ${boardPeriod==="week"?"this week":""}. Play a game to get on the board.</p>`)+top.map(row).join("")+(mine>=10?`<div class="pz-lgap">…</div>`+row(rows[mine],mine):"");
  $("#pzLbN",B).textContent=(boardPeriod==="week"?"The weekly board starts fresh every Monday. ":"")+(live?"Live from eQuran.":"Showing the students on this device. Once eQaida is connected to eQuran, all your students appear here.");
}
function students(){
  runCleanup(); S.view="stu"; navSync(); const names=Object.keys(store.students);
  B.innerHTML=`<div class="pz-pv"><div class="pz-acth"><button class="pz-btn sm" data-view="hub">${IC("left")}Back</button><div class="gt"><span class="t">${IC("user")}</span>Who is practising?</div></div>
    <p class="pz-hint" style="text-align:left">Each student keeps their own stars, points and progress on this device. No login is needed.</p>
    <div class="pz-stu">${names.map(n=>`<button data-stu="${esc(n)}" class="${n===store.cur?"on":""}">${IC("user")}${esc(n)}<small>Level ${lvOf(store.students[n].pts).n} · ${fmtN(store.students[n].pts||0)} pts</small></button>`).join("")}</div>
    <h3>Add a student</h3><div class="pz-add"><input id="pzNew" maxlength="30" placeholder="Student name"><button class="pz-btn pri sm" id="pzAdd">${IC("plus")}Add</button></div>
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
$("#pzSnd",PZ).onclick=()=>{ if(!window.EQSfx) return; EQSfx.on=!EQSfx.on; if(EQSfx.on) sfx.yay(); };
/* a soft tap for every other button and switch (game answers make their own sounds) */
PZ.addEventListener("click",e=>{ const b=e.target.closest("button,input[type=checkbox]"); if(!b||b.id==="pzSnd"||b.closest(".pz-c,.pz-mc,.pz-b,.pz-rcell,.pz-flb,.pz-wag,.pz-mole,.pz-dopt,.pz-sopt,.pz-tile")) return; sfx.tap(); },true);
addEventListener("keydown",e=>{
  if(PZ.hidden) return; e.stopPropagation();
  if(e.key==="Escape"){ e.preventDefault(); if(S.view==="hub") close(); else hub(); return; }
  if(S.keys&&e.target.tagName!=="INPUT") S.keys(e);
},true);
const hs=document.getElementById("hsBtn");
if(hs){ const ob=document.createElement("button"); ob.className="tbb wide pz-open"; ob.id="pzOpen"; ob.title="Practice and games for this page"; ob.innerHTML=IC("target")+"<span>Practice this page</span>";
  hs.parentNode.insertBefore(ob,hs); ob.onclick=()=>open(curPage()); }
{ const pr=new URLSearchParams(location.search).get("practice"); if(pr!==null){ const want=pr.trim().toLowerCase(), idx=PAGES.findIndex(p=>{ const no=p.querySelector(".hdr .no"); return no&&no.textContent.trim().toLowerCase()===want; }); setTimeout(()=>open(idx>=0?idx:3),300); } }
window.EQPractice={open,close,start,pageInfo,store:()=>store,path:PATH,startStep,pathView,board,progress,scoreData,sync};
})();
