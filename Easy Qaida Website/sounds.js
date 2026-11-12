/* eQaida — sound effects for the book and Practice mode.
   Made live in the browser (Web Audio): no sound files and no voices, so it also works offline and in the single file.
   EQSfx.tap()  any button          EQSfx.flip()  a card turns       EQSfx.open()  a help box opens
   EQSfx.page() a page turns        EQSfx.ok()    right answer       EQSfx.no()    wrong answer (gentle)
   EQSfx.pop()  a balloon pops      EQSfx.yay()   MashaAllah: ding + clapping
   EQSfx.coin() points  EQSfx.bloop() pop-up  EQSfx.whistle() / chug(sec) train  EQSfx.launch() rocket
   EQSfx.win(stars)  end of a game: 2–3 stars = party poppers + ta-da + clapping; 1 star = a little clapping
   EQSfx.on = true / false   (the 🔊 buttons; saved on this device) */
(function(){
"use strict";
const KEY="eqaida.sound";
let on=true; try{ on=localStorage.getItem(KEY)!=="off"; }catch(e){}
let AC=null, OUT=null, REV=null, NZ=null;

function ctx(){
  if(!on) return null;
  try{
    if(!AC){
      const C=window.AudioContext||window.webkitAudioContext; if(!C) return null;
      AC=new C();
      /* gentle safety limiter: quiet sounds pass untouched, only the loudest peaks are rounded off */
      const lim=AC.createWaveShaper(), N=2048, cu=new Float32Array(N);
      for(let i=0;i<N;i++){ const x=(i/(N-1))*4-2; cu[i]=x/Math.pow(1+Math.pow(Math.abs(x),4),0.25); }
      lim.curve=cu; lim.oversample="2x";
      OUT=AC.createGain(); OUT.gain.value=0.5; OUT.connect(lim);   /* the curve spans -2…2, squeezed into the shaper's -1…1 input */ lim.connect(AC.destination);
      const n=AC.sampleRate*2; NZ=AC.createBuffer(1,n,AC.sampleRate);
      const d=NZ.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1;
      /* a small room, so claps and pops do not sound dry */
      const len=Math.floor(AC.sampleRate*1.2), ir=AC.createBuffer(2,len,AC.sampleRate);
      for(let ch=0;ch<2;ch++){ const b=ir.getChannelData(ch); for(let i=0;i<len;i++) b[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.4); }
      const cv=AC.createConvolver(); cv.buffer=ir; REV=AC.createGain(); REV.gain.value=0.55; REV.connect(cv); cv.connect(OUT);
    }
    if(AC.state==="suspended") AC.resume();
    return AC;
  }catch(e){ return null; }
}
const rnd=(a,b)=>a+Math.random()*(b-a);
function route(node,o){
  let n=node;
  if(o.pan&&AC.createStereoPanner){ const p=AC.createStereoPanner(); p.pan.value=Math.max(-1,Math.min(1,o.pan)); n.connect(p); n=p; }
  n.connect(OUT);
  if(o.rev){ const s=AC.createGain(); s.gain.value=o.rev; n.connect(s); s.connect(REV); }
}
/* filtered noise burst: claps, pops, paper, whooshes */
function noise(t,o){
  const s=AC.createBufferSource(); s.buffer=NZ;
  const f=AC.createBiquadFilter(); f.type=o.type||"bandpass"; f.frequency.setValueAtTime(o.f||1500,t);
  if(o.f2) f.frequency.exponentialRampToValueAtTime(o.f2,t+o.dur); f.Q.value=o.q||1;
  const g=AC.createGain(), a=o.a||0.002, v=o.vol||0.3;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+a);
  if(o.tau) g.gain.setTargetAtTime(0,t+a,o.tau); else g.gain.exponentialRampToValueAtTime(0.0001,t+o.dur);
  s.connect(f); f.connect(g); route(g,o);
  s.start(t,Math.random()*1.5); s.stop(t+o.dur+0.05);
}
/* plain tone, optionally sliding */
function tone(t,o){
  const s=AC.createOscillator(); s.type=o.type||"sine"; s.frequency.setValueAtTime(o.f,t);
  if(o.to) s.frequency.exponentialRampToValueAtTime(o.to,t+(o.glide||o.dur));
  const g=AC.createGain(), a=o.a||0.005;
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(o.vol||0.2,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+o.dur);
  let n=s; if(o.lp){ const f=AC.createBiquadFilter(); f.type="lowpass"; f.frequency.value=o.lp; s.connect(f); n=f; }
  n.connect(g); route(g,o); s.start(t); s.stop(t+o.dur+0.05);
}
/* music-box bell */
function bell(t,f,vol,dur,o){
  o=o||{}; dur=dur||0.8;
  [[1,1,1],[2,0.28,0.55],[3.01,0.1,0.32],[5.4,0.05,0.18]].forEach(([r,v,d])=>{
    if(f*r<16000) tone(t,{f:f*r,dur:dur*d,vol:vol*v,a:0.002,pan:o.pan,rev:o.rev===undefined?0.25:o.rev}); });
}
function sparkle(t,n,vol){
  for(let i=0;i<n;i++) bell(t+i*0.06+rnd(0,0.03),rnd(2000,4200),vol*(1-i/n*0.6),0.4,{pan:rnd(-0.8,0.8)});
}
/* a crowd clapping: every person claps at their own speed, then they stop one by one */
function clap(t0,dur,people,vol){
  const norm=vol*1.4/Math.sqrt(people);
  for(let p=0;p<people;p++){
    const per=rnd(0.19,0.29), fc=rnd(850,2300), q=rnd(0.9,2), pv=rnd(0.5,1), pan=rnd(-0.8,0.8), tau=rnd(0.006,0.013);
    let t=t0+rnd(0,0.22); const end=t0+dur*rnd(0.65,1);
    while(t<end){
      const fade=Math.max(0.15,Math.min(1,(end-t)/(dur*0.3)));
      noise(t,{f:fc*rnd(0.92,1.08),q,vol:norm*pv*rnd(0.75,1)*fade,a:0.0008,tau,dur:0.07,pan,rev:0.35});
      t+=per*rnd(0.9,1.1);
    }
  }
}
/* party popper: the "pah!", then paper streamers fluttering down */
function popper(t,pan){
  noise(t,{f:2200,q:0.6,vol:1.1,a:0.0005,tau:0.008,dur:0.06,pan,rev:0.3});
  noise(t,{type:"lowpass",f:900,vol:0.6,a:0.001,tau:0.02,dur:0.12,pan});
  tone(t,{f:140,to:40,glide:0.1,dur:0.13,vol:0.5,a:0.001,pan});
  noise(t+0.01,{f:1500,f2:5000,q:0.7,vol:0.12,a:0.03,dur:0.35,pan});
  for(let i=0;i<34;i++){ const dt=0.04+Math.pow(Math.random(),1.6)*0.9;
    noise(t+dt,{f:rnd(3000,8000),q:1.5,vol:(0.05+Math.random()*0.08)*(1-dt*0.7),a:0.001,tau:rnd(0.004,0.01),dur:0.05,pan:pan+rnd(-0.3,0.3)}); }
}
function fanfare(t){
  [784,1046.5,1318.5,1568].forEach((f,i)=>bell(t+i*0.11,f,0.2,i===3?1.5:0.6));
  bell(t+0.33,2093,0.09,1.5);
}

const now=()=>AC.currentTime+0.01;
const S={
  tap(){ const t=now(); tone(t,{f:1100,to:620,glide:0.05,dur:0.08,vol:0.28,a:0.002}); noise(t,{type:"highpass",f:3000,dur:0.012,vol:0.08,a:0.001}); },
  flip(){ const t=now(); noise(t,{f:900,f2:3800,q:1.1,dur:0.13,vol:0.9,a:0.02}); tone(t+0.09,{f:520,to:380,dur:0.06,vol:0.18}); },
  open(){ const t=now(); tone(t,{f:480,to:960,glide:0.12,dur:0.18,vol:0.24,a:0.01}); noise(t,{f:1200,f2:3000,q:0.8,dur:0.15,vol:0.22,a:0.03}); },
  page(){ const t=now(); for(let i=0;i<7;i++) noise(t+i*0.035+rnd(0,0.02),{f:rnd(1800,4300),q:0.6,dur:0.09,vol:0.16+0.14*Math.sin(Math.PI*i/6),a:0.012,pan:-0.3+i*0.1}); },
  ok(){ const t=now(); bell(t,1046.5,0.3,0.7); bell(t+0.1,1568,0.3,0.9); },
  no(){ const t=now(); tone(t,{f:330,to:311,dur:0.16,vol:0.24,type:"triangle",lp:1200,a:0.01}); tone(t+0.17,{f:247,to:220,dur:0.26,vol:0.24,type:"triangle",lp:1000,a:0.01}); },
  pop(){ const t=now();
    noise(t,{f:1700,q:0.7,vol:1,a:0.0008,tau:0.012,dur:0.09,rev:0.2});
    noise(t,{type:"highpass",f:5000,vol:0.35,a:0.0005,tau:0.004,dur:0.03});
    tone(t,{f:190,to:45,glide:0.09,dur:0.11,vol:0.45,a:0.001});
    bell(t+0.05,2093,0.06,0.4); },
  yay(){ const t=now(); bell(t,1046.5,0.3,0.7); bell(t+0.1,1568,0.3,0.9); sparkle(t+0.2,4,0.05); clap(t+0.15,1.2,7,0.55); },
  coin(){ const t=now(); bell(t,1568,0.16,0.35,{rev:0.1}); bell(t+0.06,2349,0.14,0.5,{rev:0.1}); },
  bloop(){ const t=now(); tone(t,{f:260,to:720,glide:0.09,dur:0.13,vol:0.2,a:0.006}); },
  whistle(){ const t=now();
    [[0,0.22],[0.3,0.75]].forEach(([s,d])=>[587,740,880].forEach(f=>{ tone(t+s,{f,to:f*0.985,dur:d,vol:0.07,a:0.04,type:"triangle",lp:2400,rev:0.25}); }));
    noise(t,{f:2500,q:0.8,vol:0.05,a:0.05,dur:0.25}); noise(t+0.3,{f:2500,q:0.8,vol:0.05,a:0.05,dur:0.75}); },
  chug(dur,speed){ const t=now(), step=speed||0.19; let k=0;
    for(let x=0;x<(dur||1.6);x+=step,k++){ const fade=Math.min(1,((dur||1.6)-x)/0.5);
      noise(t+x,{type:"lowpass",f:k%2?700:950,vol:(k%2?0.18:0.28)*fade,a:0.004,tau:0.035,dur:0.16,rev:0.15}); } },
  launch(){ const t=now();
    noise(t,{type:"lowpass",f:180,f2:1400,vol:0.55,a:0.35,dur:2.3,rev:0.3});
    noise(t,{f:900,f2:3200,q:0.6,vol:0.18,a:0.6,dur:2.2});
    tone(t,{f:55,to:90,dur:2,vol:0.35,a:0.3}); },
  win(stars){ const t=now();
    if((stars||3)>=2){ popper(t,-0.6); popper(t+0.09,0.6); fanfare(t+0.25); sparkle(t+0.45,8,0.06); clap(t+0.3,stars===2?2.2:3,stars===2?11:16,0.9); }
    else { bell(t,880,0.26,0.6); bell(t+0.14,1046.5,0.26,0.8); clap(t+0.2,1.5,9,0.95); } }
};

const SV=p=>'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
const ICON_ON=SV('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/>');
const ICON_OFF=SV('<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>');
const api={
  get on(){ return on; },
  set on(v){ on=!!v; try{ localStorage.setItem(KEY,on?"on":"off"); }catch(e){} api.sync(); },
  sync(){ document.querySelectorAll(".eq-snd").forEach(b=>{ b.innerHTML=on?ICON_ON:ICON_OFF; b.title=on?"Sound effects are on (tap to turn off)":"Sound effects are off (tap to turn on)"; b.classList.toggle("off",!on); }); },
  play(name,...a){ if(!S[name]||!ctx()) return; try{ S[name](...a); }catch(e){} }
};
Object.keys(S).forEach(k=>{ api[k]=(...a)=>api.play(k,...a); });
window.EQSfx=api;
api.sync();
})();
