/* Palabritas — Spanish for little learners (Pre-K, Kindergarten, 1st Grade).
   Built on the Learn & Play pattern: parent-led setup, grown-up PIN, grade-based levels,
   adaptive steps, recorded voice. Everything is saved on this device only. */
const D=/*DATA*/;
const CLIPS=/*CLIPS*/;
const LETTERS=/*LETTERS*/;
const AGEW=/*AGES*/;
const PACK=/*PACK*/;   // preview build only: every clip in one file (audio/pack.mp3), as [offset, length]
const TOPICS=D.TOPICS,GRADES=D.GRADES,AGES=D.AGES,AVATARS=D.AVATARS;
const VERSION="1.1.0",MAX_KIDS=4,GO=["prek","k","g1"];
const gi=g=>GO.indexOf(g);
const STICKERS=["🦄","🐶","🐱","🦊","🐼","🐯","🦁","🐸","🐵","🐰","🐻","🐨","🐧","🦖","🐙","🦋","🚀","⚽","🌈","⭐","🍦","🍩","🎈","🎁","🏆","🌻","🍉","🐳","🦒","🐢","🌮","🎨","🎵","🚂","🧸","🪁","🌟","🍓","🐝","🦜"];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}};
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const dayKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const plain=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
const PRAISE=["¡Muy bien!","¡Excelente!","¡Fantástico!","¡Genial!","¡Bravo!","¡Increíble!"];

/* ---------- saved data: device settings + up to 4 children ---------- */
function blankKid(o={}){return Object.assign({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:"",avatar:"lion",grade:null,sex:"",age:0,
  stars:0,stickers:[],box:{},miss:{},lvl:{},cur:{},prog:{},best:{},log:{},showAll:false,last:null},o)}
let DB=store.get("pal3",null);
if(!DB||!Array.isArray(DB.kids)){
  DB={v:3,device:{pinHash:null,voice:true},kids:[],cur:null};
  const old=store.get("pal2",null);   // the earlier version: keep names, stars and what each child learned
  if(old&&Array.isArray(old.kids))old.kids.slice(0,MAX_KIDS).forEach(k=>DB.kids.push(blankKid({id:k.id,name:k.name||"",avatar:AVATARS.includes(k.avatar)?k.avatar:"lion",stars:k.stars||0,box:k.box||{},miss:k.miss||{},log:k.log||{}})));
  DB.cur=(old&&DB.kids.find(k=>k.id===old.cur)||DB.kids[0]||{}).id||null;
  store.set("pal3",DB);
}
let saveWarned=false;
function saveDB(){if(!store.set("pal3",DB)&&!saveWarned){saveWarned=true;toast("Progress could not be saved on this device (storage may be full).")}}
let K=DB.kids.find(k=>k.id===DB.cur)||DB.kids[0]||null;

/* ---------- Learn & Play on this device (same website): shared grown-up PIN, children to copy ---------- */
function lpData(){try{return JSON.parse(localStorage.getItem("learnplay.v1"))||null}catch(e){return null}}
const lpPin=()=>{const d=lpData();return d&&((d.device&&d.device.pinHash)||d.pinHash)||null};
function lpKids(){const d=lpData();if(!d||!d.profiles)return[];
  return (d.order||Object.keys(d.profiles)).map(id=>d.profiles[id]).filter(p=>p&&p.name).map(p=>({name:String(p.name).slice(0,20),grade:p.grade==="prek"||p.grade==="k"?p.grade:p.grade?"g1":null}))}
const pinHash=p=>{let h=5381;for(const ch of "lp:"+p)h=((h*33)^ch.charCodeAt(0))>>>0;return h.toString(36)};
const pinNow=()=>DB.device.pinHash||lpPin();
const pinShared=()=>!DB.device.pinHash&&!!lpPin();

/* ---------- grade, levels and personal content ---------- */
const G=()=>GRADES[(K&&K.grade)||"g1"];
const lvOK=L=>gi(L.g)<=gi((K&&K.grade)||"g1")||(K&&K.showAll);
const levelsFor=t=>TOPICS[t].L.map((L,i)=>({L,i})).filter(x=>lvOK(x.L));
const itemsOf=L=>L.w.filter(w=>!(w.sx&&w.sx!==K.sex)&&!(w.age&&!K.age));
const esFull=w=>((w.a?w.a+" ":"")+w.es).replace("{A}",AGEW.es[K.age]||"");
const enFull=w=>w.en.replace("{A}",AGEW.en[K.age]||"");
const nameIn=s=>s.replace("{N}",K.name||"");
const picOf=w=>w.p==="n:{A}"?"n:"+K.age:w.p;
const box=w=>K.box[w.es]||0;
const learned=w=>box(w)>=2;
function topLv(t){const ls=levelsFor(t);if(!ls.length)return 0;let v=K.lvl[t];
  if(v==null){v=ls[0].i;for(let k=0;k<ls.length-1;k++){const it=itemsOf(ls[k].L);if(it.length&&it.filter(learned).length/it.length>=.8)v=ls[k+1].i;else break}K.lvl[t]=v}
  const ok=ls.filter(x=>x.i<=v);return ok.length?ok[ok.length-1].i:ls[0].i}
const isOpen=(t,i)=>i<=topLv(t);
const nextLv=(t,i)=>{const n=levelsFor(t).find(x=>x.i>i);return n?n.i:null};
const prevLv=(t,i)=>{const p=levelsFor(t).filter(x=>x.i<i);return p.length?p[p.length-1].i:null};
const lvNum=(t,i)=>levelsFor(t).findIndex(x=>x.i===i)+1;
function openItems(t){return levelsFor(t).filter(x=>isOpen(t,x.i)).flatMap(x=>itemsOf(x.L))}
function gradeItems(t){const seen=new Set();return levelsFor(t).flatMap(x=>itemsOf(x.L)).filter(w=>!seen.has(w.es)&&seen.add(w.es))}
const allGradeItems=()=>{const seen=new Set();return TOPICS.flatMap((_,t)=>gradeItems(t)).filter(w=>!seen.has(w.es)&&seen.add(w.es))};
const score=()=>{const a=allGradeItems();return a.length?Math.round(100*a.reduce((s,w)=>s+Math.min(4,box(w)),0)/(4*a.length)):0};
function weakItems(){const out=[];TOPICS.forEach((T,t)=>levelsFor(t).filter(x=>isOpen(t,x.i)).forEach(x=>itemsOf(x.L).forEach(w=>{if(box(w)<2&&(K.miss[w.es]||0)>0&&!out.some(o=>o.w.es===w.es))out.push({w,t,i:x.i})})));
  return out.sort((a,b)=>(K.miss[b.w.es]-box(b.w))-(K.miss[a.w.es]-box(a.w)))}

/* ---------- voice: recorded clips (Spanish voice Dora, English voice Heart) ---------- */
// The child's name is the only thing the device voice says. Every new say() cancels the last one,
// and leaving a screen stops all sound, so nothing plays late.
const ckey=s=>s.toLowerCase().replace(/[¡!¿?.,;:]/g," ").replace(/\s+/g," ").trim();
let actx=null,curSrc=null,sayTok=0;
try{if(navigator.audioSession)navigator.audioSession.type="playback"}catch(e){}
function ctx(){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state!=="running")actx.resume().catch(()=>{})}catch(e){}return actx}
const htmlPlayer=new Audio();htmlPlayer.preload="auto";let htmlUnlocked=false;
function unlockAudio(){const c=ctx();try{const b=c.createBuffer(1,1,22050),s=c.createBufferSource();s.buffer=b;s.connect(c.destination);s.start(0)}catch(e){}
  if(!htmlUnlocked){htmlPlayer.src="audio/silence.mp3";const p=htmlPlayer.play();if(p&&p.then)p.then(()=>{htmlUnlocked=true}).catch(()=>{})}}
["touchend","pointerdown","keydown"].forEach(ev=>addEventListener(ev,unlockAudio,{capture:true,passive:true}));
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopAudio();else if(actx)actx.resume().catch(()=>{})});
const bufs=new Map();
let packBuf=null;
const packData=()=>packBuf||(packBuf=fetch("audio/pack.mp3").then(r=>{if(!r.ok)throw new Error(r.status);return r.arrayBuffer()}).catch(e=>{packBuf=null;throw e}));
async function fileBytes(file){if(PACK&&PACK[file]){const ab=await packData(),[o,l]=PACK[file];return ab.slice(o,o+l)}
  const r=await fetch("audio/"+file);if(!r.ok)throw new Error(r.status);return r.arrayBuffer()}
function getBuf(file){if(bufs.has(file))return bufs.get(file);if(bufs.size>90)bufs.delete(bufs.keys().next().value);
  const p=fileBytes(file).then(ab=>new Promise((ok,bad)=>ctx().decodeAudioData(ab,ok,bad)));
  bufs.set(file,p);p.catch(()=>bufs.delete(file));return p}
function stopAudio(){sayTok++;try{curSrc&&curSrc.stop()}catch(e){}curSrc=null;try{htmlPlayer.pause()}catch(e){}try{"speechSynthesis" in window&&speechSynthesis.cancel()}catch(e){}}
async function playHtml(file,rate,tok){let src="audio/"+file,blob=null;
  if(PACK&&PACK[file]){try{blob=URL.createObjectURL(new Blob([await fileBytes(file)],{type:"audio/mpeg"}));src=blob}catch(e){}}
  if(tok!==sayTok){if(blob)URL.revokeObjectURL(blob);return}
  return new Promise(res=>{let done=false;const fin=()=>{if(!done){done=true;clearTimeout(g);htmlPlayer.onended=htmlPlayer.onerror=null;if(blob)setTimeout(()=>URL.revokeObjectURL(blob),1000);res()}};
  const g=setTimeout(fin,9000);htmlPlayer.onended=fin;htmlPlayer.onerror=fin;
  try{htmlPlayer.src=src;htmlPlayer.playbackRate=rate;htmlPlayer.preservesPitch=true;htmlPlayer.webkitPreservesPitch=true;const p=htmlPlayer.play();if(p&&p.catch)p.catch(fin)}catch(e){fin()}
  const chk=setInterval(()=>{if(tok!==sayTok){clearInterval(chk);try{htmlPlayer.pause()}catch(e){}fin()}else if(done)clearInterval(chk)},120)})}
async function playClip(file,slow,tok){
  if(slow)return playHtml(file,.7,tok);
  try{const b=await getBuf(file);if(tok!==sayTok)return;const c=ctx();const s=c.createBufferSource();s.buffer=b;s.connect(c.destination);curSrc=s;
    await new Promise(r=>{s.onended=r;s.start(0);setTimeout(r,b.duration*1000+400)});if(curSrc===s)curSrc=null}
  catch(e){if(tok===sayTok)await playHtml(file,1,tok)}}
function tts(text,lang,tok){return new Promise(res=>{if(!("speechSynthesis" in window)||!text||tok!==sayTok)return res();
  const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=.9;const g=setTimeout(res,text.length*120+1500);u.onend=u.onerror=()=>{clearTimeout(g);res()};
  try{speechSynthesis.speak(u)}catch(e){clearTimeout(g);res()}})}
// parts: Spanish text, or "en:" + English text. {N} = child's name.
async function say(parts,opt={}){
  stopAudio();const tok=sayTok;if(!DB.device.voice)return;
  for(const raw of [].concat(parts)){
    const en=raw.startsWith("en:"),lang=en?"en":"es",text=(en?raw.slice(3):raw).replace("{A}",(K&&AGEW[lang][K.age])||"");const bits=text.split("{N}");
    for(let i=0;i<bits.length;i++){
      if(tok!==sayTok)return;
      const k=ckey(bits[i]);
      if(k){const f=CLIPS[lang][k];if(f)await playClip(f,opt.slow&&!en,tok);else await tts(bits[i],en?"en-US":"es-MX",tok)}
      if(i<bits.length-1&&tok===sayTok&&K&&K.name)await tts(K.name,"en-US",tok);
    }
    if(tok!==sayTok)return;
  }
}
const sayLetter=l=>say(LETTERS[plain(l)]||l);
const sayTokText=s=>say(s.replace(/[.,¡!¿?]/g,""));
const sayItem=(w,slow)=>say(esFull(w),{slow});

/* ---------- little sounds and confetti ---------- */
function tone(fs,{dur=.12,gap=.09,vol=.1,type="sine"}={}){if(!DB.device.voice)return;
  try{const c=ctx(),t0=c.currentTime;fs.forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=f;
    g.gain.setValueAtTime(0,t0+i*gap);g.gain.linearRampToValueAtTime(vol,t0+i*gap+.01);g.gain.exponentialRampToValueAtTime(.001,t0+i*gap+dur);
    o.connect(g).connect(c.destination);o.start(t0+i*gap);o.stop(t0+i*gap+dur+.02)})}catch(e){}}
const sfx={ok:()=>tone([660,880],{dur:.14}),no:()=>tone([220,180],{type:"triangle",dur:.16,vol:.07}),win:()=>tone([523,659,784,1047],{dur:.18,gap:.11}),flip:()=>tone([520],{dur:.06,vol:.05}),tap:()=>tone([440],{dur:.05,vol:.04})};
const cv=$("#confetti"),cx=cv.getContext("2d");let parts=[],raf=0;
function confetti(n=90){if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  cv.width=innerWidth*devicePixelRatio;cv.height=innerHeight*devicePixelRatio;const cols=["#E8507A","#F4A51C","#1C8C83","#7C5CD6","#2F80ED","#3B9B4F"];
  for(let i=0;i<n;i++)parts.push({x:Math.random()*cv.width,y:-20*devicePixelRatio-Math.random()*cv.height*.3,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,r:Math.random()*6.3,vr:(Math.random()-.5)*.3,s:(5+Math.random()*6)*devicePixelRatio,c:rnd(cols)});
  if(!raf)raf=requestAnimationFrame(frame)}
function frame(){cx.clearRect(0,0,cv.width,cv.height);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy*devicePixelRatio;p.vy+=.05;p.r+=p.vr;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.fillRect(-p.s/2,-p.s/4,p.s,p.s/2);cx.restore()});
  parts=parts.filter(p=>p.y<cv.height+40);raf=parts.length?requestAnimationFrame(frame):0;if(!raf)cx.clearRect(0,0,cv.width,cv.height)}
let toastT=null;
function toast(text){clearTimeout(toastT);$("#toastBox").innerHTML=`<div class="toast" role="status">${esc(text)}</div>`;toastT=setTimeout(()=>{$("#toastBox").innerHTML=""},3800)}

/* ---------- pictures ---------- */
function pic(p){
  if(p.startsWith("t:"))return `<span class="tword">${esc(p.slice(2))}</span>`;
  if(p==="a:")return `<img class="pimg" src="img/${K.avatar}.webp" alt="" draggable="false">`;
  if(p.startsWith("i:"))return `<img class="pimg" src="img/${p.slice(2)}.webp" alt="" draggable="false" decoding="async">`;
  if(p.startsWith("#"))return `<span class="swatch" style="--c:${p}"></span>`;
  const n=+p.slice(2);let vis="";
  if(n<=20){const f=Math.max(1,Math.ceil(n/10));for(let k=0;k<f;k++){let c="";for(let j=0;j<10;j++)c+=`<i class="${k*10+j<n?"on":""}"></i>`;vis+=`<span class="tf">${c}</span>`}}
  else vis=`<span class="tens">${"<i></i>".repeat(n/10)}</span>`;
  return `<span class="numpic"><span class="numeral">${n}</span><span class="frames">${vis}</span></span>`;
}
function mini(w){const p=picOf(w);return p.startsWith("i:")?`<img src="img/${p.slice(2)}.webp" alt="">`:p==="a:"?`<img src="img/${K.avatar}.webp" alt="">`:p.startsWith("#")?`<span class="mini" style="background:${p}"></span>`:p.startsWith("t:")?`<span class="mini">Aa</span>`:`<span class="mini">${esc(p.slice(2))}</span>`}

/* ---------- screens ---------- */
const S={screen:"splash",t:0,i:0,c:0,reps:0,R:null,grown:false,hist:{listen:[],spell:[],build:[]},recent:[]};
function show(id){stopAudio();S.screen=id;$$(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
  if(id==="home"||id==="topic")S.grown=false;
  document.documentElement.style.setProperty("--rs",String(K&&K.grade?GRADES[K.grade].scale:1));
  try{scrollTo(0,0)}catch(e){}}
function setSheet(html){$("#sheetBox").innerHTML=html?`<div class="sheet" id="sheet">${html}</div>`:"";$$(".screen").forEach(s=>s.inert=!!html)}

/* ---------- grown-up PIN (same PIN as Learn & Play on this device) ---------- */
let pinEpoch=0,pinMiss=0,pinLockUntil=0;
const PIN_BOX=(title,note,inner)=>`<div class="sheet-box pin-box" id="pinBox"><button class="pin-back" data-pin="back">🏠 Back</button><h2>${title}</h2><p class="note" id="pinNote">${note}</p>${inner}</div>`;
const PAD=`<div class="pin-dots" id="pinDots"><i></i><i></i><i></i><i></i></div><div class="pin-pad">${["1","2","3","4","5","6","7","8","9","✕","0","⌫"].map(k=>`<button data-pin="${k}" aria-label="${k==="⌫"?"Delete":k==="✕"?"Cancel":k}">${k}</button>`).join("")}</div>`;
function verifyParentDevice(onOk){
  const ep=++pinEpoch;
  setSheet(PIN_BOX("Grown-up setup","Use the device owner’s fingerprint, face or device passcode before creating a PIN.",`<button class="big-btn" data-pin="verify">Verify device owner</button>`));
  S.pinHandler=async k=>{
    if(k==="back")return closePin();
    if(k!=="verify")return;
    const btn=$('[data-pin="verify"]');btn.disabled=true;
    try{
      if(!window.isSecureContext||!navigator.credentials||!navigator.credentials.create||!window.PublicKeyCredential)throw Error("unsupported");
      const cr=await navigator.credentials.create({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:"Palabritas parent setup"},
        user:{id:crypto.getRandomValues(new Uint8Array(16)),name:"parent-"+Date.now(),displayName:"Palabritas parent"},
        pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],
        authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"discouraged"},timeout:60000,attestation:"none"}});
      if(ep!==pinEpoch)return;
      const ad=cr&&cr.response&&cr.response.getAuthenticatorData&&cr.response.getAuthenticatorData();
      if(!cr||cr.type!=="public-key"||!ad||!(new Uint8Array(ad)[32]&4))throw Error("not verified");
      onOk();
    }catch(e){if(ep!==pinEpoch)return;$("#pinNote").textContent="Device verification was not completed. Set up a device passcode or Face ID / Touch ID and try again in Safari or Chrome. Parent controls stay locked.";btn.disabled=false}
  };
}
function closePin(){pinEpoch++;S.pinHandler=null;setSheet("")}
function askPin(onOk,change=false,verified=false){
  pinEpoch++;
  if(change&&pinNow()&&!verified)return askPin(()=>askPin(onOk,true,true));
  if(!pinNow()&&!verified)return verifyParentDevice(()=>askPin(onOk,change,true));
  let typed="",first=null;const ep=pinEpoch;
  const mode=()=>(!pinNow()||change)?(first?"confirm":"new"):"check";
  const title=()=>mode()==="check"?"🔒 Grown-ups only":mode()==="new"?"🔒 Make a grown-up PIN":"🔒 Type it again";
  const note=()=>mode()==="check"?(pinShared()?"Type your 4-digit Learn & Play PIN.":"Type your 4-digit PIN."):mode()==="new"?"Pick 4 numbers. You will need them to open Settings.":"Type the same 4 numbers.";
  const paint=()=>{$("#pinBox h2").textContent=title();$("#pinNote").textContent=note();$$("#pinDots i").forEach((d,k)=>d.classList.toggle("on",k<typed.length))};
  const shake=()=>{const b=$("#pinBox");b.classList.remove("shake");void b.offsetWidth;b.classList.add("shake");sfx.no()};
  setSheet(PIN_BOX(title(),note(),PAD+(mode()==="check"?`<button class="link-btn" data-pin="forgot" style="align-self:center;color:var(--soft)">Forgot PIN?</button><div id="pinForgot"></div>`:"")));
  if(mode()==="check")say(["en:This part is for grown-ups.","en:Tap the house to go back."]);
  S.pinHandler=k=>{
    if(ep!==pinEpoch)return;
    if(k==="back"||k==="✕"){stopAudio();return closePin()}
    if(k==="forgot"){$("#pinForgot").innerHTML=`<div class="pin-forgot">Your PIN stays on this device and cannot be recovered here. ${pinShared()?"It is the same PIN as Learn & Play. ":""}Clearing this website’s data in the browser settings removes the PIN, but also deletes every child’s progress.</div>`;return}
    if(k==="⌫"){typed=typed.slice(0,-1);return paint()}
    if(!/^\d$/.test(k)||typed.length>=4)return;
    typed+=k;paint();sfx.tap();if(typed.length<4)return;
    setTimeout(()=>{
      if(ep!==pinEpoch)return;const m=mode();
      if(m==="check"){
        if(Date.now()<pinLockUntil){typed="";shake();paint();$("#pinNote").textContent="Too many tries. Wait a little and try again.";return}
        if(pinHash(typed)===pinNow()){pinMiss=0;closePin();S.grown=true;onOk()}
        else{typed="";shake();paint();say(["en:This part is for grown-ups.","en:Tap the house to go back."]);pinMiss++;if(pinMiss>=3){pinLockUntil=Date.now()+30000*(pinMiss-2);$("#pinNote").textContent="Too many tries. Wait 30 seconds."}}
      }else if(m==="new"){first=typed;typed="";paint()}
      else if(typed===first){DB.device.pinHash=pinHash(typed);saveDB();closePin();sfx.ok();say("en:PIN saved!");S.grown=true;onOk()}
      else{first=null;typed="";shake();paint()}
    },150);
  };
}
const grown=fn=>S.grown?fn():askPin(fn);

/* ---------- parent-led setup ---------- */
const needsSetup=k=>!k||!k.grade||!GRADES[k.grade]||!k.name;
function openWelcome(adding=false){
  const k=K;const lp=lpKids().filter(x=>!DB.kids.some(d=>d.name.toLowerCase()===x.name.toLowerCase()));
  const draft=S.draft={name:k&&k.name||"",avatar:k&&k.avatar||rnd(AVATARS),sex:k&&k.sex||"",age:k&&k.age||0,grade:k&&k.grade||null};
  setSheet(`<div class="sheet-box" role="dialog" aria-modal="true" aria-labelledby="welTitle">
    <div class="kicker">Spanish for little learners</div>
    <h2 id="welTitle">Who is learning Spanish?</h2>
    <p class="note">A grown-up sets this up once. Each child gets their own levels, stars and progress.</p>
    ${lp.length?`<div class="field">From Learn &amp; Play on this device<small>Tap to copy a child's name and grade.</small><div class="lp-kids">${lp.map((x,i)=>`<button data-w="lp" data-k="${i}">＋ ${esc(x.name)}${x.grade?` · ${esc(GRADES[x.grade].label)}`:""}</button>`).join("")}</div></div>`:""}
    <label class="field" for="welName">Child's name<input id="welName" maxlength="20" autocomplete="off" placeholder="First name" value="${esc(draft.name)}"></label>
    <div class="field">Pick a buddy<div class="avs">${AVATARS.map(a=>`<button class="av" data-w="av" data-k="${a}" aria-pressed="${a===draft.avatar}" aria-label="${a.replace(/-face/,"").replace(/-/g," ")}"><img src="img/${a}.webp" alt=""></button>`).join("")}</div></div>
    <div class="field">For sentences like “Soy una niña”<small>Spanish says boy and girl differently.</small>
      <div class="seg">${[["m","Boy","niño"],["f","Girl","niña"],["","Skip",""]].map(x=>`<button data-w="sex" data-k="${x[0]}" aria-pressed="${draft.sex===x[0]}">${x[1]}${x[2]?`<small>${x[2]}</small>`:""}</button>`).join("")}</div></div>
    <label class="field" for="welAge">Age<small>Used for “Tengo cinco años” (I am five).</small><select id="welAge"><option value="0">Skip</option>${AGES.map(a=>`<option value="${a}" ${draft.age===a?"selected":""}>${a}</option>`).join("")}</select></label>
    <div class="field">Pick their grade to begin<div class="grades">${GO.map(g=>`<button data-w="grade" data-k="${g}" aria-pressed="${draft.grade===g}"><b>${GRADES[g].label}</b><small>${GRADES[g].ages}</small></button>`).join("")}</div></div>
    <p class="err" id="welErr" role="alert"></p>
    <p class="note small">Up to ${MAX_KIDS} children on this device. Add more later in ⚙️ Grown-up settings.</p>
    ${adding&&DB.kids.length>1?`<button class="link-btn" data-w="cancel" style="color:var(--soft)">Cancel adding this child</button>`:""}
  </div>`);
  S.welHandler=(w,key)=>{
    const d=S.draft;
    if(w==="lp"){const x=lp[+key];$("#welName").value=x.name;if(x.grade){d.grade=x.grade;$$('[data-w="grade"]').forEach(b=>b.setAttribute("aria-pressed",b.dataset.k===x.grade))}return}
    if(w==="av"){d.avatar=key;$$('[data-w="av"]').forEach(b=>b.setAttribute("aria-pressed",b.dataset.k===key));return}
    if(w==="sex"){d.sex=key;$$('[data-w="sex"]').forEach(b=>b.setAttribute("aria-pressed",b.dataset.k===key));return}
    if(w==="cancel"){DB.kids=DB.kids.filter(x=>x!==K);K=DB.kids[0];DB.cur=K.id;saveDB();setSheet("");renderHome();show("home");return}
    if(w==="grade"){
      const name=$("#welName").value.trim().replace(/[<>&"']/g,"").slice(0,20);
      if(!name){$("#welErr").textContent="Please enter a name so each child has their own progress.";$("#welName").focus();return}
      Object.assign(K,{name,avatar:d.avatar,sex:d.sex,age:+$("#welAge").value||0,grade:key});K.lvl={};K.cur={};K.prog={};
      TOPICS.forEach((_,t)=>topLv(t));saveDB();welcomeDone();
    }
  };
}
function welcomeDone(){
  const canAdd=DB.kids.length<MAX_KIDS;
  setSheet(`<div class="sheet-box" style="text-align:center;align-items:center">
    <img src="img/${K.avatar}.webp" alt="" style="width:110px">
    <div class="kicker">Ready</div><h2>${esc(K.name)}’s Spanish adventure is ready!</h2>
    <p class="note">${esc(GRADES[K.grade].label)}: ${K.grade==="prek"?"listening, matching pictures and saying words out loud. No reading needed.":K.grade==="k"?"listening, matching, saying words, and first reading and spelling.":"listening, matching, reading, spelling and building sentences."} Levels move up as ${esc(K.name)} plays well.</p>
    <button class="big-btn" data-w="go" style="width:100%">▶ Start learning</button>
    ${canAdd?`<button class="big-btn alt" data-w="another" style="width:100%">＋ Set up another child</button>`:""}
  </div>`);
  S.welHandler=w=>{
    if(w==="go"){setSheet("");renderHome();show("home");say(["¡Hola!{N}","en:Let's learn some Spanish!"])}
    if(w==="another"){K=blankKid();DB.kids.push(K);DB.cur=K.id;saveDB();openWelcome(true)}
  };
}
function openWho(){
  setSheet(`<div class="sheet-box"><h2>Who is learning today?</h2>
    <div class="who-grid">${DB.kids.map(k=>`<button class="who-kid ${k===K?"on":""}" data-who="${k.id}"><img src="img/${k.avatar}.webp" alt=""><span>${esc(k.name||"New child")}</span><small>${k.grade?GRADES[k.grade].label:"Needs setup"}</small></button>`).join("")}
    ${DB.kids.length<MAX_KIDS?`<button class="who-kid add" data-who="add"><span class="plus">＋</span><span>Add a child</span><small>Grown-up PIN</small></button>`:""}</div>
    <p class="note small">Switching children needs the grown-up PIN.</p></div>`);
  S.whoHandler=id=>{
    if(id==="add")return askPin(()=>{K=blankKid();DB.kids.push(K);DB.cur=K.id;saveDB();openWelcome(true)});
    if(id===K.id){setSheet("");say(["¡Hola!{N}"]);return}
    askPin(()=>{switchKid(id);if(needsSetup(K))openWelcome();else{renderHome();show("home");say(["¡Hola!{N}"])}});
  };
}
function switchKid(id){K=DB.kids.find(k=>k.id===id)||K;DB.cur=K.id;S.hist={listen:[],spell:[],build:[]};S.recent=[];saveDB()}

/* ---------- home ---------- */
function renderHome(){
  $("#kidBtn").innerHTML=`<img src="img/${K.avatar}.webp" alt="">`;
  $("#hello").textContent=`¡Hola, ${K.name}!`;
  $("#starN").textContent=K.stars;$("#stickN").textContent=K.stickers.length;$("#gradeN").textContent=GRADES[K.grade].label;
  const weak=weakItems();const b=$("#banner");
  if(weak.length>=3){b.dataset.k="review";b.innerHTML=`<img src="img/sparkles.webp" alt=""><div><b>🔁 Repaso · Practice time</b><span>${Math.min(5,weak.length)} tricky words to practice</span></div>`}
  else{const t=K.last!=null&&TOPICS[K.last]?K.last:TOPICS.findIndex((_,t)=>gradeItems(t).some(w=>!learned(w)));const tt=t<0?0:t;
    b.dataset.k=String(tt);b.innerHTML=`<img src="img/${TOPICS[tt].i}.webp" alt=""><div><b>▶ Keep going</b><span>${esc(TOPICS[tt].n)} · Nivel ${lvNum(tt,K.cur[tt]??topLv(tt))||1}</span></div>`}
  $("#grid").innerHTML=TOPICS.map((T,t)=>{const all=gradeItems(t),l=all.filter(learned).length,ls=levelsFor(t);
    return `<button class="tile" data-act="topic" data-k="${t}" style="--c:${T.c}"><span class="lv">Nivel ${lvNum(t,topLv(t))}/${ls.length}</span>
      <img src="img/${T.i}.webp" alt=""><span class="tt">${esc(T.n)}</span><span class="ts">${esc(T.en)}</span>
      <span class="tbar" aria-label="${l} of ${all.length} learned"><i style="width:${all.length?Math.round(l/all.length*100):0}%"></i></span></button>`}).join("");
}

/* ---------- topic ---------- */
function activities(){
  const L=TOPICS[S.t].L[S.i],g=G(),items=itemsOf(L),acts=[["learn","📖","Aprender","Learn"],["listen","👂","Escuchar","Listen"],["match","🃏","Parejas","Match"]];
  if(L.k!=="s"&&g.spell&&items.filter(spellable).length>=2)acts.push(["spell","🔤","Deletrear","Spell"]);
  if(L.k==="s"&&g.build&&items.filter(buildable).length>=2)acts.push(["build","🧩","Ordenar","Build it"]);
  return acts;
}
function renderTopic(){
  const T=TOPICS[S.t],ls=levelsFor(S.t),top=topLv(S.t),cur=K.cur[S.t];
  $("#tTitle").innerHTML=`${esc(T.n)}<small>${esc(T.en)}</small>`;
  $("#lvls").innerHTML=ls.map((x,n)=>{const it=itemsOf(x.L),l=it.filter(learned).length,locked=x.i>top;
    return `<button class="lvl ${locked?"locked":""}" data-act="lvl" data-k="${x.i}" aria-pressed="${x.i===S.i}">
      <b>${locked?"🔒":"⭐"} Nivel ${n+1}</b><span>${esc(x.L.n)}</span>${locked?"":`<span class="bar" aria-label="${l} of ${it.length} learned"><i style="width:${it.length?Math.round(l/it.length*100):0}%"></i></span>`}
      ${!locked&&cur===x.i&&cur<top?`<span class="tip">🙂 Practice here a bit more</span>`:""}</button>`}).join("");
  $("#acts").innerHTML=activities().map(a=>{const b=K.best[`${S.t}|${S.i}|${a[0]}`]||0;
    return `<button class="act" data-act="act" data-k="${a[0]}"><span class="ai">${a[1]}</span><b>${a[2]}</b><span>${a[3]}</span>
      <span class="st" aria-label="Best ${b} of 3 stars">${a[0]==="learn"?"":"★".repeat(b)+"☆".repeat(3-b)}</span></button>`}).join("");
  $("#preview").innerHTML=itemsOf(TOPICS[S.t].L[S.i]).map(w=>`<span>${esc(nameIn(esFull(w)))}${learned(w)?` <span class="k">★</span>`:""}</span>`).join("");
  ls.forEach(x=>itemsOf(x.L).forEach(w=>{const p=picOf(w);if(p.startsWith("i:")){const im=new Image();im.src=`img/${p.slice(2)}.webp`}}));
}
function openTopic(t){S.t=t;K.last=t;const top=topLv(t);S.i=K.cur[t]!=null&&isOpen(t,K.cur[t])&&lvOK(TOPICS[t].L[K.cur[t]])?K.cur[t]:top;S.c=0;S.reps=0;saveDB();renderTopic();show("topic")}

/* ---------- learn cards ---------- */
const sayHTML=p=>esc(p).split(/([- ])/).map(s=>/^[A-Z]+$/.test(s)?`<b>${s}</b>`:s).join("");
function knowHTML(w){const b=box(w),n=b>=4?3:b>=2?2:b>=1?1:0;return `<div class="know" aria-label="How well it's known">${[0,1,2].map(k=>`<i class="${k<n?"on":""}">★</i>`).join("")} ${["New","Seen","Learned","Mastered"][n]}</div>`}
function renderLearn(){
  const L=TOPICS[S.t].L[S.i],ws=itemsOf(L);if(S.c>=ws.length)S.c=0;const w=ws[S.c];
  $("#lTitle").innerHTML=`Nivel ${lvNum(S.t,S.i)}<small>${esc(L.en)}</small>`;
  const head=L.k==="s"
    ?`<div class="word sent">${nameIn(esFull(w)).split(" ").map(x=>`<button class="wchip" data-act="sayWord" data-k="${esc(x)}">${esc(x)}</button>`).join("")}</div><div class="en">${esc(nameIn(enFull(w)))}</div>`
    :L.k==="t"?`<div class="say">${sayHTML(w.pr)}</div><div class="en">${esc(w.en)}</div>`
    :`<div class="word">${w.a?`<span class="art">${esc(w.a)}</span> `:""}${esc(w.es)}</div><div class="say" aria-label="Pronunciation">${sayHTML(w.pr)}</div><div class="en">${esc(w.en)}</div>`;
  $("#learnBody").innerHTML=`<section class="card learn">
    <button class="pic" data-act="hear" aria-label="Hear it">${pic(picOf(w))}</button>
    ${head}${knowHTML(w)}
    <div class="row"><button class="btn hear grow" data-act="hear">🔊 Escuchar</button><button class="btn slow" data-act="slow">🐢 Slow</button><button class="btn slow" data-act="meaning">💬 English</button></div>
    <div class="repeat"><p>${L.k==="s"?"Tap a word to hear it. Then say it together, 3 times!":"Say it out loud together, 3 times!"}</p>
      <div class="dots">${[0,1,2].map(d=>`<button class="dot ${d<S.reps?"on":""}" data-act="rep" aria-label="Said it ${d+1}">${d<S.reps?"✓":d+1}</button>`).join("")}</div></div>
    <div class="nav"><span class="swipe" aria-hidden="true">‹ swipe</span><span class="count">${S.c+1} / ${ws.length}</span><span class="swipe" aria-hidden="true">swipe ›</span></div>
  </section>`;
}

/* ---------- rounds: listen, spell, build, match ---------- */
const spellable=w=>/^[a-záéíóúüñ]+$/i.test(w.es)&&[...w.es].length<=G().spell;
const buildable=w=>nameIn(esFull(w)).split(" ").length>=2&&nameIn(esFull(w)).split(" ").length<=G().build;
const NAMES={listen:"👂 Escuchar",spell:"🔤 Deletrear",build:"🧩 Ordenar",match:"🃏 Parejas"};
function pickFrom(pool,count,filter){
  // weak items come up more; about 1 in 4 cards reviews shaky items from earlier levels; no item more than twice
  const out=[],used={};
  const earlier=S.R&&!S.R.review?levelsFor(S.t).filter(x=>x.i<S.i).flatMap(x=>itemsOf(x.L).filter(w=>filter(w)&&box(w)<3)):[];
  for(let n=0;n<count;n++){
    let src=(earlier.length&&Math.random()<.25)?earlier:pool;
    let cand=src.filter(w=>(used[w.es]||0)<2&&!(out.length&&out[out.length-1].es===w.es));
    if(!cand.length)cand=pool.filter(w=>(used[w.es]||0)<2&&!(out.length&&out[out.length-1].es===w.es));
    if(!cand.length)break;
    const wt=cand.map(w=>Math.pow(6-box(w),2)*((used[w.es]||0)?.35:1));
    let r=Math.random()*wt.reduce((a,b)=>a+b,0),pick=cand[0];for(let i=0;i<cand.length;i++){r-=wt[i];if(r<=0){pick=cand[i];break}}
    out.push(pick);used[pick.es]=(used[pick.es]||0)+1;
  }
  return out;
}
const struggling=m=>{const h=S.hist[m];return h.length>=4&&h.reduce((a,b)=>a+b,0)/h.length<.5};
const doingWell=m=>{const h=S.hist[m];return h.length>=4&&h.reduce((a,b)=>a+b,0)/h.length>=.75};
function startRound(mode,review){
  stopAudio();
  const L=TOPICS[S.t].L[S.i];
  S.R={mode,review:!!review,t:S.t,i:S.i,qs:[],n:0,k:0,res:[],first:0,mistakes:0,q:null,intro:true,top:S.i===topLv(S.t)};
  if(review){S.R.qs=review;}
  else if(mode==="match"){S.R.qs=[0]}
  else{const f=mode==="spell"?spellable:mode==="build"?buildable:()=>true;const pool=itemsOf(L).filter(f);
    S.R.qs=pickFrom(pool,G().round,f);}
  S.R.n=mode==="match"?1:S.R.qs.length;
  $("#rTitle").innerHTML=review?`🔁 Repaso<small>Practice tricky words</small>`:`${NAMES[mode]}<small>Nivel ${lvNum(S.t,S.i)} · ${esc(L.en)}</small>`;
  show("round");nextQ();
}
function renderProg(){const R=S.R;if(R.mode==="match"){$("#prog").innerHTML="";return}
  $("#prog").innerHTML=R.qs.map((_,i)=>`<span class="pd ${i<R.k?(R.res[i]?"ok":"meh"):i===R.k?"now":""}">${i<R.k?(R.res[i]?"⭐":"✓"):""}</span>`).join("")}
function nextQ(){
  const R=S.R;if(R.k>=R.qs.length)return finish();
  renderProg();
  if(R.mode==="listen"){newListen();renderListen()}
  else if(R.mode==="spell"){newSpell();renderPuzzle()}
  else if(R.mode==="build"){newBuild();renderPuzzle()}
  else{newMatch();renderMatch()}
  promptQ();
}
function promptQ(){const R=S.R,q=R.q;if(!q)return;
  const intro=R.intro?{listen:R.q.sight?"en:Listen, then tap the word.":"en:Listen, then tap the picture.",spell:"en:Spell the word.",build:"en:Put the words in order.",match:R.q.kind==="pp"?"en:Find two that match.":R.q.kind==="et"?"en:Match the Spanish and the English.":"en:Match the picture and the word."}[R.mode]:null;
  R.intro=false;
  if(R.mode==="match")return intro&&say(intro);
  say(intro?[intro,esFull(q.w)]:[esFull(q.w)]);}
function replay(slow){const R=S.R;if(!R||!R.q)return;if(R.mode==="match")return;say(esFull(R.q.w),{slow})}
function logAnswer(w,ok){const d=dayKey(new Date()),L=K.log[d]||(K.log[d]={a:0,c:0,r:0});L.a++;if(ok)L.c++;else K.miss[w.es]=(K.miss[w.es]||0)+1;
  const keys=Object.keys(K.log).sort();while(keys.length>120)delete K.log[keys.shift()]}
function cardDone(first,talk){
  const R=S.R,q=R.q;q.done=true;R.res[R.k]=first;if(first)R.first++;
  if(R.mode!=="match"){S.hist[R.mode]=(S.hist[R.mode]||[]).concat(first?1:0).slice(-8)}
  saveDB();
  const go=()=>{if(S.R===R&&S.screen==="round"&&R.q===q){R.k++;nextQ()}};
  Promise.race([talk||Promise.resolve(),sleep(6000)]).then(()=>setTimeout(go,550));
}
function firstMiss(q){if(q.tries===0){K.box[q.w.es]=Math.max(0,box(q.w)-1);logAnswer(q.w,false)}q.tries++;S.R.mistakes++}
function firstHit(q){if(q.tries===0&&!q.hinted){K.box[q.w.es]=Math.min(5,box(q.w)+1);logAnswer(q.w,true);return true}return false}

/* listen */
function newListen(){
  const R=S.R,w=R.qs[R.k],ctxT=w._t!=null?w._t:S.t,sight=w.p.startsWith("t:");
  let n=G().choices;if(K.grade==="k"&&doingWell("listen"))n=4;if(struggling("listen"))n=3;
  const others=[],seen=new Set([w.es]),pics=new Set([picOf(w)]);
  const add=x=>{if(others.length>=n-1||seen.has(x.es)||pics.has(picOf(x))||x.p.startsWith("t:")!==sight)return;if(sight&&plain(x.es)===plain(w.es))return;others.push(x);seen.add(x.es);pics.add(picOf(x))};
  const T=TOPICS[ctxT],li=w._i!=null?w._i:S.i;
  shuffle(itemsOf(T.L[li])).forEach(add);
  shuffle(levelsFor(ctxT).filter(x=>isOpen(ctxT,x.i)).flatMap(x=>itemsOf(x.L))).forEach(add);
  shuffle(levelsFor(ctxT).flatMap(x=>itemsOf(x.L))).forEach(add);
  R.q={w,opts:shuffle([w,...others]),tries:0,done:false,sight};
}
function renderListen(){
  const q=S.R.q;
  $("#roundBody").innerHTML=`<section class="card">
    <p class="prompt">${q.sight?"Listen, then tap the word":"Listen, then tap the picture"}</p>
    <div class="row"><button class="btn hear grow" data-act="replay">🔊 Play it</button><button class="btn slow" data-act="replaySlow">🐢 Slow</button></div>
    <div class="choices ${q.opts.length===3?"three":""}" id="choices">${q.opts.map((o,k)=>`<button class="choice ${o.x?"x":""}" data-act="pick" data-k="${k}" aria-label="${esc(nameIn(enFull(o)))}">${pic(picOf(o))}<span class="cap">${esc(nameIn(enFull(o)))}</span></button>`).join("")}</div>
    <div class="msg" id="msg" aria-live="polite"></div></section>`;
}
function pickListen(k,b){
  const R=S.R,q=R.q;if(q.done||b.disabled)return;const o=q.opts[k],m=$("#msg");
  if(o===q.w){
    b.classList.add("right");sfx.ok();$$(".choice").forEach(c=>c.disabled=true);
    const first=firstHit(q);if(!first&&q.tries===0)logAnswer(q.w,true);
    const pr=rnd(PRAISE);m.className="msg good";m.textContent=pr;
    cardDone(first,say([esFull(q.w),pr]));
  }else{
    firstMiss(q);sfx.no();b.classList.add("wrong");b.disabled=true;$("#choices").classList.add("reveal");
    m.className="msg bad";
    if(q.tries>=2){const i=q.opts.indexOf(q.w);$$(".choice")[i].classList.add("pulse");m.textContent=`Here it is: ${nameIn(enFull(q.w))}`;say([esFull(q.w),"en:"+enFull(q.w)])}
    else{m.textContent="¡Otra vez! Try again";say(["¡Otra vez!",esFull(q.w)])}
  }
}

/* spell + build: tap the next piece; a wrong piece shakes right away */
function newSpell(){const R=S.R,w=R.qs[R.k];const parts=[...w.es.normalize("NFC")];
  let tiles=parts.map((p,i)=>({p,i}));if(K.grade==="g1"&&!struggling("spell")){const pool="aeiloursntmcdp".split("").filter(c=>!parts.includes(c));if(pool.length)tiles.push({p:rnd(pool),i:-1})}
  R.q={w,parts,tiles:shuffle(tiles),placed:[],tries:0,wrongHere:0,hinted:false,done:false,ghost:K.grade==="k"||struggling("spell"),build:false}}
function newBuild(){const R=S.R,w=R.qs[R.k];const parts=nameIn(esFull(w)).split(" ");
  R.q={w,parts,tiles:shuffle(parts.map((p,i)=>({p,i}))),placed:[],tries:0,wrongHere:0,hinted:false,done:false,ghost:false,build:true};
  if(R.q.tiles.every((t,i)=>t.i===i)&&parts.length>1)R.q.tiles.reverse()}
function renderPuzzle(){
  const q=S.R.q,w=q.w,need=q.parts[q.placed.length];
  $("#roundBody").innerHTML=`<section class="card">
    <button class="pic spic" data-act="replay" aria-label="Hear it">${pic(picOf(w))}</button>
    <div class="en">${esc(nameIn(enFull(w)))}</div>
    <div class="row"><button class="btn hear" data-act="replay">🔊 Hear it</button><button class="btn slow" data-act="replaySlow">🐢 Slow</button></div>
    <p class="prompt">${q.build?"Tap the words in order":"Spell the word"}</p>
    <div class="slots ${q.done?"ok":""}" id="slots">${q.parts.map((p,k)=>q.build
      ?`<div class="wslot ${k<q.placed.length?"fill":""}">${k<q.placed.length?esc(p):""}</div>`
      :`<div class="slot ${k<q.placed.length?"fill":q.ghost?"ghost-l":""}" data-g="${esc(p)}">${k<q.placed.length?esc(p):""}</div>`).join("")}</div>
    <div class="tiles">${q.tiles.map((t,k)=>`<button class="ltile ${q.build?"w":""}" data-act="tile" data-k="${k}" ${t.used||q.done?"disabled":""}>${esc(t.p)}</button>`).join("")}</div>
    <div class="msg" id="msg" aria-live="polite"></div>
    ${q.done?"":`<div class="row"><button class="btn ghost" data-act="hint">💡 Hint</button></div>`}</section>`;
}
function placeNext(q,idx){const t=q.tiles[idx];t.used=true;q.placed.push(t.p);q.wrongHere=0}
function tapTile(k,b){
  const q=S.R.q;if(q.done)return;const t=q.tiles[k];if(t.used)return;const need=q.parts[q.placed.length];
  if(t.p===need){placeNext(q,k);q.build?sayTokText(t.p):sayLetter(t.p);
    if(q.placed.length===q.parts.length)return finishPuzzle();renderPuzzle();}
  else{
    firstMiss(q);q.wrongHere++;sfx.no();b.classList.remove("bad");void b.offsetWidth;b.classList.add("bad");
    const m=$("#msg");m.className="msg bad";m.textContent=q.build?"Not that word yet. Try again!":"Not that letter yet. Try again!";
    if(q.wrongHere===1)say("en:Try again!");
    if(q.wrongHere>=2){const j=q.tiles.findIndex(x=>!x.used&&x.p===need);if(j>=0)$$(".ltile")[j].classList.add("pulse");say(["en:Here is a hint.",q.build?need.replace(/[.,¡!¿?]/g,""):LETTERS[plain(need)]||need])}
  }
}
function hintTile(){const q=S.R.q;if(q.done)return;q.hinted=true;const need=q.parts[q.placed.length];const j=q.tiles.findIndex(x=>!x.used&&x.p===need);
  if(j<0)return;placeNext(q,j);q.build?sayTokText(need):sayLetter(need);if(q.placed.length===q.parts.length)return finishPuzzle();renderPuzzle()}
function finishPuzzle(){
  const q=S.R.q;const first=firstHit(q);if(!first&&q.tries===0)logAnswer(q.w,true);
  q.done=true;sfx.ok();renderPuzzle();const pr=first?rnd(PRAISE):"¡Lo hiciste!";
  const m=$("#msg");m.className="msg good";m.textContent=first?pr:"¡Lo hiciste! You did it";
  cardDone(first,sleep(250).then(()=>say([esFull(q.w),pr])));
}

/* match (Parejas): Pre-K matches two pictures; readers match picture and word */
function newMatch(){
  const R=S.R,L=TOPICS[S.t].L[S.i],pool=itemsOf(L);const n=Math.min(G().pairs,pool.length);
  const ws=pickFrom(pool,n*2,()=>true).filter((w,i,a)=>a.findIndex(x=>x.es===w.es)===i).slice(0,n);
  while(ws.length<n){const x=pool.find(w=>!ws.includes(w));if(!x)break;ws.push(x)}
  const kind=K.grade==="prek"||(L.k==="s"&&K.grade==="k")?"pp":L.k==="t"?"et":"pw";
  const cards=[];ws.forEach((w,i)=>{cards.push({w,i,side:"a"});cards.push({w,i,side:"b"})});
  R.q={kind,ws,cards:shuffle(cards),up:[],matched:0,tries:0,done:false,lock:false,w:ws[0]};
}
function cardFace(c,kind){
  if(kind==="pp")return pic(picOf(c.w));
  if(kind==="et")return c.side==="a"?`<span class="mtext">${esc(c.w.es)}</span>`:`<span class="mtext en">${esc(c.w.en)}</span>`;
  return c.side==="a"?pic(picOf(c.w)):`<span class="mtext">${esc(nameIn(esFull(c.w)))}</span>`;
}
function renderMatch(){
  const q=S.R.q;const cols=q.cards.length<=6?"c3":"c4";
  $("#roundBody").innerHTML=`<section class="card"><p class="prompt">${q.kind==="pp"?"Find two that match":q.kind==="et"?"Match the Spanish and the English":"Match the picture and the word"}</p>
    <div class="mgrid ${cols}">${q.cards.map((c,k)=>`<button class="mcard ${c.done?"done":c.up?"up":""}" data-act="flip" data-k="${k}" aria-label="Card ${k+1}"><span class="in"><span class="b">?</span><span class="f">${cardFace(c,q.kind)}</span></span></button>`).join("")}</div>
    <div class="msg" id="msg" aria-live="polite"></div></section>`;
}
function flipCard(k,b){
  const q=S.R.q;const c=q.cards[k];if(q.lock||c.done||c.up)return;
  c.up=true;b.classList.add("up");sfx.flip();say(q.kind==="et"&&c.side==="b"?"en:"+enFull(c.w):esFull(c.w));q.up.push(k);
  if(q.up.length<2)return;
  const [a,bb]=q.up.map(i=>q.cards[i]);q.up=[];
  if(a.i===bb.i){a.done=bb.done=true;q.matched++;const btns=$$(".mcard");[q.cards.indexOf(a),q.cards.indexOf(bb)].forEach(i=>btns[i].classList.add("done"));
    if(box(a.w)<1)K.box[a.w.es]=1;sfx.ok();
    if(q.matched===q.ws.length){q.done=true;S.R.first=q.ws.length;S.R.res=[1];saveDB();const m=$("#msg");m.className="msg good";m.textContent=rnd(PRAISE);
      setTimeout(()=>{if(S.R&&S.R.q===q){S.R.k=1;say(rnd(PRAISE)).then(()=>{if(S.R&&S.R.q===q)finish()})}},700)}}
  else{q.tries++;S.R.mistakes++;q.lock=true;setTimeout(()=>{a.up=bb.up=false;const btns=$$(".mcard");btns.forEach((x,i)=>{if(!q.cards[i].done&&!q.cards[i].up)x.classList.remove("up")});q.lock=false},1000)}
}

/* ---------- result + adaptive levels ---------- */
function progression(t,i,R){
  const rule=G().prog,n=R.qs.length;if(n<rule.minQ)return"";
  const ft=R.first/n,mis=R.mistakes/n,rec=K.prog[t]&&K.prog[t].lv===i?K.prog[t]:{lv:i,m:0,s:0};
  let status="";
  if(ft>=rule.up.ft&&mis<=rule.up.mis){rec.m++;rec.s=0}else if(ft<=rule.down.ft&&mis>=rule.down.mis){rec.s++;rec.m=0}else{rec.m=0;rec.s=0}
  const it=itemsOf(TOPICS[t].L[i]),pct=it.length?it.filter(learned).length/it.length:0;
  if(rec.m>=rule.up.n||pct>=.8){const nx=nextLv(t,i);rec.m=0;if(nx!=null){K.lvl[t]=Math.max(topLv(t),nx);K.cur[t]=nx;status="up"}else status="top"}
  else if(rec.s>=rule.down.n){rec.s=0;const pv=prevLv(t,i);if(pv!=null){K.cur[t]=pv;status="down"}}
  K.prog[t]=rec;return status;
}
function finish(){
  const R=S.R;renderProg();
  const n=R.mode==="match"?R.q.ws.length:R.qs.length,stars=R.mode==="match"?(R.mistakes<=n*.5?3:R.mistakes<=n*1.5?2:1)
    :(R.mistakes/n<=.2&&R.first/n>=.8?3:R.mistakes/n<=.5?2:1);
  const earned=R.first;K.stars+=earned;
  let status="";
  if(!R.review){const key=`${R.t}|${R.i}|${R.mode}`;K.best[key]=Math.max(K.best[key]||0,stars);if(R.mode!=="match"&&R.top)status=progression(R.t,R.i,R)}
  const d=dayKey(new Date());(K.log[d]||(K.log[d]={a:0,c:0,r:0})).r++;
  const left=STICKERS.filter(s=>!K.stickers.includes(s)),sticker=left.length?rnd(left):null;if(sticker)K.stickers.push(sticker);
  saveDB();
  const nx=status==="up"?K.cur[R.t]:null;
  $("#result").innerHTML=`<img class="trophy" src="img/trophy.webp" alt="">
    <h2>${stars===3?"¡Superestrella!":stars===2?"¡Muy bien!":"¡Buen intento!"}</h2>
    <div class="note">${stars===3?"Superstar!":stars===2?"Great job!":"Good try!"}</div>
    <div class="rstars">${[1,2,3].map(k=>`<span class="${k<=stars?"on":""}" style="animation-delay:${k*250}ms">★</span>`).join("")}</div>
    <div class="rscore">${R.mode==="match"?`${n} pairs found · ⭐ ${earned} stars`:`${R.first} of ${n} right on the first try · ⭐ ${earned} stars`}</div>
    ${status==="up"?`<div class="rlevel">⬆️ ¡Nivel ${lvNum(R.t,nx)}! ${esc(TOPICS[R.t].L[nx].en)} is open.</div>`:status==="down"?`<div class="rlevel soft">🙂 Let's practice the level before a bit more.</div>`:status==="top"?`<div class="rlevel">⭐ Every level in ${esc(TOPICS[R.t].n)} is open!</div>`:""}
    ${sticker?`<div class="rsticker"><span class="s">${sticker}</span>New sticker!</div>`:""}
    <div class="rbtns">
      ${status==="up"?`<button class="big-btn" data-act="lvlGo" data-k="${nx}">⭐ Next level</button>`:""}
      ${R.review?"":`<button class="big-btn ${status==="up"?"alt":""}" data-act="act" data-k="${R.mode}">🔁 Again</button>`}
      <button class="big-btn alt" data-act="go" data-k="${R.review?"home":"topic"}">‹ Back</button>
      <button class="big-btn alt" data-act="go" data-k="home">🏠 Home</button>
    </div>`;
  S.R=null;show("result");sfx.win();confetti(140);setTimeout(()=>confetti(90),600);
  const nums=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
  setTimeout(()=>say(["en:"+(stars===3?"Wow! Awesome job!":stars===2?"Great job!":"Good try!"),...(earned<=20?[`en:You got ${nums[earned]} star${earned===1?"":"s"}.`]:[]),...(status==="up"?["¡Nuevo nivel!"]:[]),...(sticker?["en:And a new sticker!"]:[])]),400);
}
function startReview(){
  const weak=weakItems().slice(0,5).map(x=>Object.assign(Object.create(x.w),x.w,{_t:x.t,_i:x.i}));
  if(weak.length<2)return;S.t=weak[0]._t;S.i=weak[0]._i;startRound("listen",weak);
}

/* ---------- stickers ---------- */
function renderStickers(){$("#stickNote").textContent=`${K.stickers.length} of ${STICKERS.length}. Finish a game to win a new one!`;
  $("#sgrid").innerHTML=STICKERS.map(s=>K.stickers.includes(s)?`<div class="stk">${s}</div>`:`<div class="stk no">?</div>`).join("")}

/* ---------- grown-ups: progress ---------- */
function renderDash(){
  $("#dTitle").innerHTML=`📊 Progress<small>${esc(K.name)} · ${esc(GRADES[K.grade].label)}</small>`;
  const all=allGradeItems(),sc=score(),lrn=all.filter(learned).length,mst=all.filter(w=>box(w)>=4).length;
  const now=new Date(),days=[];for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(now.getDate()-i);days.push([d,K.log[dayKey(d)]||{a:0,c:0,r:0}])}
  let streak=0;for(let i=0;i<400;i++){const d=new Date(now);d.setDate(now.getDate()-i);const L=K.log[dayKey(d)];if(L&&(L.a||L.r))streak++;else if(i===0)continue;else break}
  const wk=days.reduce((a,[,L])=>({a:a.a+L.a,c:a.c+L.c,r:a.r+L.r}),{a:0,c:0,r:0});
  const top=Math.max(5,Math.ceil(Math.max(...days.map(([,L])=>L.a))/5)*5);
  const W=340,H=140,pl=26,pr=10,pb=20,bw=(W-pl-pr)/7;
  let svg=`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Answers each day for the last 7 days">`;
  [0,.5,1].forEach(f=>{const y=(H-pb)-(H-pb-8)*f;svg+=`<line class="gl" x1="${pl}" x2="${W-pr}" y1="${y}" y2="${y}"/><text x="${pl-5}" y="${y+3}" text-anchor="end">${Math.round(top*f)}</text>`});
  days.forEach(([d,L],i)=>{const x=pl+i*bw+5,w=bw-10,k=(H-pb-8)/top,ht=L.a*k,hc=L.c*k;
    svg+=`<rect class="tot" x="${x}" y="${H-pb-ht}" width="${w}" height="${ht}" rx="3"/><rect class="cor" x="${x}" y="${H-pb-hc}" width="${w}" height="${hc}" rx="3"/><text x="${x+w/2}" y="${H-5}" text-anchor="middle">${i===6?"Today":d.toLocaleDateString(undefined,{weekday:"short"})}</text>`});
  svg+="</svg>";
  const weak=weakItems().slice(0,12);
  $("#dashBody").innerHTML=`
    ${DB.kids.length>1?`<div class="kchips">${DB.kids.filter(k=>k.grade).map(k=>`<button class="kchip" data-act="dashKid" data-k="${k.id}" aria-pressed="${k===K}"><img src="img/${k.avatar}.webp" alt="">${esc(k.name)}</button>`).join("")}</div>`:""}
    <div class="hero"><div class="ring" style="--p:${sc}"><b>${sc}<small>of 100</small></b></div>
      <div><h2>Learning score</h2><p class="note">How well ${esc(K.name)} knows the ${all.length} words and sentences for ${esc(GRADES[K.grade].label)}. Right answers raise it; misses lower it a little.</p></div></div>
    <div class="stats">
      <div class="stat"><b>${lrn}</b><span>Learned of ${all.length}</span></div>
      <div class="stat"><b>${mst}</b><span>Mastered</span></div>
      <div class="stat"><b>${wk.a?Math.round(wk.c/wk.a*100)+"%":"–"}</b><span>Right, last 7 days</span></div>
      <div class="stat"><b>${streak}</b><span>Day streak 🔥</span></div>
    </div>
    <div class="dash2">
      <div class="panel"><h3>Last 7 days</h3>${svg}<div class="legend"><span><i style="background:var(--good)"></i>Right</span><span><i style="background:var(--line)"></i>Answers</span></div>
        <p class="note small">${wk.r} games finished this week · ⭐ ${K.stars} stars in all</p></div>
      <div class="panel"><h3>Practice at home</h3>${weak.length?`<div class="weak">${weak.map(x=>`<button data-act="hearBoth" data-k="${x.t}|${x.i}|${esc(x.w.es)}">${mini(x.w)}<span>${esc(nameIn(esFull(x.w)))}<small>${esc(nameIn(enFull(x.w)))}</small></span></button>`).join("")}</div><p class="note small">Tap a word to hear it in Spanish and English. The games bring these back more often, and the home screen offers a short Repaso round.</p>`:`<p class="note">Nothing yet. Words missed in Listen, Spell or Build show up here.</p>`}</div>
    </div>
    <div class="panel"><h3>By topic</h3>${TOPICS.map((T,t)=>{const it=gradeItems(t),l=it.filter(learned).length;return `<div class="trow"><img src="img/${T.i}.webp" alt=""><div><b>${esc(T.n)} <small>· Nivel ${lvNum(t,topLv(t))} of ${levelsFor(t).length}</small></b><span class="bar"><i style="width:${it.length?Math.round(l/it.length*100):0}%"></i></span></div><span class="num">${l}/${it.length}</span></div>`}).join("")}</div>
    <p class="note small">Saved only on this device. “Learned” means answered right at least twice more than missed. A level opens after two great rounds or when 80% of its words are learned.</p>`;
}

/* ---------- grown-ups: settings ---------- */
function renderSettings(){
  const ls=TOPICS.map((T,t)=>`<div class="lrow"><img src="img/${T.i}.webp" alt=""><span>${esc(T.n)}</span><select id="lv-${t}" data-set="lvl" data-k="${t}">${levelsFor(t).map((x,n)=>`<option value="${x.i}" ${x.i===topLv(t)?"selected":""}>Nivel ${n+1} · ${esc(x.L.en)}</option>`).join("")}</select></div>`).join("");
  $("#setBody").innerHTML=`
    <div class="panel"><h3>Children <small class="note small">(up to ${MAX_KIDS})</small></h3>
      <div class="kchips">${DB.kids.map(k=>`<button class="kchip" data-act="setKid" data-k="${k.id}" aria-pressed="${k===K}"><img src="img/${k.avatar}.webp" alt="">${esc(k.name||"New child")}</button>`).join("")}${DB.kids.length<MAX_KIDS?`<button class="kchip add" data-act="addKid">＋ Add a child</button>`:""}</div>
      <label class="field" for="setName">Name<input id="setName" data-set="name" maxlength="20" autocomplete="off" value="${esc(K.name)}"></label>
      <div class="field">Buddy<div class="avs">${AVATARS.map(a=>`<button class="av" data-act="setAv" data-k="${a}" aria-pressed="${a===K.avatar}" aria-label="${a.replace(/-face/,"").replace(/-/g," ")}"><img src="img/${a}.webp" alt=""></button>`).join("")}</div></div>
      <div class="field">Grade<small>Sets which levels, games and reading show for ${esc(K.name)}.</small><div class="grades">${GO.map(g=>`<button data-act="setGrade" data-k="${g}" aria-pressed="${K.grade===g}"><b>${GRADES[g].label}</b><small>${GRADES[g].ages}</small></button>`).join("")}</div></div>
      <div class="field">Boy or girl<small>Only for “Soy un niño / Soy una niña”.</small><div class="seg">${[["m","Boy"],["f","Girl"],["","Skip"]].map(x=>`<button data-act="setSex" data-k="${x[0]}" aria-pressed="${K.sex===x[0]}">${x[1]}</button>`).join("")}</div></div>
      <label class="field" for="setAge">Age<small>Only for “Tengo … años”.</small><select id="setAge" data-set="age"><option value="0">Skip</option>${AGES.map(a=>`<option value="${a}" ${K.age===a?"selected":""}>${a}</option>`).join("")}</select></label>
      ${DB.kids.length>1?`<div id="delBox"><button class="link-btn" data-act="delAsk">Remove ${esc(K.name)}…</button></div>`:""}
    </div>
    <div class="panel"><h3>Levels for ${esc(K.name)}</h3><p class="note small">Levels open by themselves after great rounds. Open a level early here.</p>${ls}
      <label class="switch">Harder levels (show levels above this grade)<input type="checkbox" id="setAll" data-set="all" ${K.showAll?"checked":""}></label></div>
    <div class="panel"><h3>Voice</h3>
      <label class="switch">Voice and sounds<input type="checkbox" id="setVoice" data-set="voice" ${DB.device.voice?"checked":""}></label>
      <p class="note small">Spanish is spoken by the recorded voice Dora; instructions and hints in English by the voice Heart. They sound the same on every device. The device voice only says the child's name.</p>
      <button class="big-btn alt small" data-act="vtest">▶ Play a sample</button></div>
    <div class="panel"><h3>Grown-up tools</h3>
      <button class="big-btn alt small" data-act="dash">📊 Progress for grown-ups</button>
      <button class="big-btn alt small" data-act="review">📋 Review all content</button>
      ${pinShared()?`<p class="note small">🔒 Uses the same PIN as Learn &amp; Play on this device. Change it in Learn &amp; Play.</p>`:`<button class="big-btn alt small" data-act="pinChange">🔒 Change grown-up PIN</button>`}
    </div>
    <div class="panel"><h3>Back up or move progress</h3><p class="note small">Progress is saved only on this device. Copy the backup code to keep it safe or to move it to another iPhone or iPad.</p>
      <div class="row" style="justify-content:flex-start"><button class="big-btn alt small" data-act="backup">Show backup code</button><button class="big-btn alt small" data-act="restoreAsk">Restore from code</button></div><div id="backupBox"></div></div>
    <div class="panel" id="resetBox"><button class="link-btn" data-act="resetAsk">Reset ${esc(K.name)}’s stars and levels…</button></div>
    <p class="note small">Palabritas ${VERSION} · 3D pictures: Fluent Emoji © Microsoft, MIT License · Voices: Kokoro, Apache 2.0 License · Everything is saved only on this device. No accounts, no ads, no tracking.</p>`;
}
document.addEventListener("change",e=>{const el=e.target,k=el.dataset&&el.dataset.set;if(!k||!K)return;
  if(k==="name"){K.name=el.value.trim().replace(/[<>&"']/g,"").slice(0,20)||K.name}
  if(k==="age")K.age=+el.value||0;
  if(k==="lvl"){const t=+el.dataset.k,v=+el.value;K.lvl[t]=v;K.cur[t]=v;delete K.prog[t]}
  if(k==="all"){K.showAll=el.checked;renderSettings()}
  if(k==="voice"){DB.device.voice=el.checked;if(!el.checked)stopAudio()}
  saveDB();
});
const enc=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o))));
const dec=s=>JSON.parse(decodeURIComponent(escape(atob(s.trim()))));

/* ---------- content review (read-only) ---------- */
function renderReview(){
  $("#revBody").innerHTML=`<p class="note small">Every card in Palabritas with its grade, English meaning and pronunciation. Read-only. Tap ▶ to hear the recordings. {N} is the child's name; {A} is their age.</p>`+
  TOPICS.map((T,t)=>`<div class="panel rv-topic"><h3>${esc(T.n)} <small class="note small">· ${esc(T.en)}</small></h3>${T.L.map((L,i)=>`<div class="rv-level"><h4>Level ${i+1} · ${esc(L.n)}<small>${esc(L.en)} · ${GRADES[L.g].label}+ · ${L.k==="s"?"sentences":L.k==="t"?"reading words":"words"}</small></h4>
    ${L.w.map(w=>`<div class="rv-row">${w.p.startsWith("i:")?`<img src="img/${w.p.slice(2)}.webp" alt="">`:`<span class="mini" ${w.p.startsWith("#")?`style="background:${w.p}"`:""}>${w.p.startsWith("n:")?esc(w.p.slice(2)):w.p==="a:"?"🙂":w.p.startsWith("t:")?"Aa":""}</span>`}
      <div><b>${esc((w.a?w.a+" ":"")+w.es)}</b><small>${esc(w.en)}${w.pr?` · ${esc(w.pr)}`:""}${w.sx?` · ${w.sx==="m"?"boys":"girls"} only`:""}</small></div>
      <div class="row"><button class="btn slow" data-act="rvEs" data-k="${esc((w.a?w.a+" ":"")+w.es)}">▶ es</button><button class="btn slow" data-act="rvEn" data-k="${esc(w.en)}">▶ en</button></div></div>`).join("")}</div>`).join("")}</div>`).join("");
}

/* ---------- taps ---------- */
let swiped=false;
document.addEventListener("click",e=>{
  if(swiped){swiped=false;return}
  const p=e.target.closest("[data-pin]");if(p&&S.pinHandler){S.pinHandler(p.dataset.pin);return}
  const w=e.target.closest("[data-w]");if(w&&S.welHandler){sfx.tap();S.welHandler(w.dataset.w,w.dataset.k);return}
  const who=e.target.closest("[data-who]");if(who&&S.whoHandler){sfx.tap();S.whoHandler(who.dataset.who);return}
  if(e.target.id==="sheet"&&$("#sheet .pin-box")){stopAudio();closePin();return}
  if(e.target.id==="sheet"&&$("#sheet .who-grid")){setSheet("");return}
  const b=e.target.closest("[data-act]");if(!b)return;
  const act=b.dataset.act,k=b.dataset.k;
  switch(act){
    case "start":
      unlockAudio();
      if(!K){K=blankKid();DB.kids.push(K);DB.cur=K.id;saveDB()}
      renderHomeSafe();show("home");
      if(needsSetup(K))openWelcome();else if(DB.kids.length>1)openWho();else say(["¡Hola!{N}","en:Let's learn some Spanish!"]);
      break;
    case "kid":if(DB.kids.length>1)openWho();else askPin(()=>{renderSettings();show("settings")});break;
    case "settings":grown(()=>{renderSettings();show("settings")});break;
    case "dash":S.backTo=S.screen==="settings"?"settings":"home";grown(()=>{renderDash();show("dash")});break;
    case "grade":askPin(()=>{renderSettings();show("settings")});break;
    case "review":S.backTo="settings";renderReview();show("review");break;
    case "stickers":renderStickers();show("stickers");break;
    case "go":
      if(k==="home"){S.R=null;renderHome();show("home")}
      else if(k==="grown"){if(S.grown&&S.backTo==="settings"){renderSettings();show("settings")}else if(K&&K.grade){renderHome();show("home")}else show("splash")}
      else if(k==="back"){const R=S.R;S.R=null;if(R&&R.review){renderHome();show("home")}else{renderTopic();show("topic")}}
      else{S.R=null;renderTopic();show("topic")}
      break;
    case "banner":if(b.dataset.k==="review")startReview();else openTopic(+b.dataset.k);break;
    case "topic":openTopic(+k);say(TOPICS[+k].n);break;
    case "sayTopic":say([TOPICS[S.t].n]);break;
    case "lvl":{const i=+k;if(!isOpen(S.t,i)){toast("Keep playing to unlock this level!");say("en:Keep playing to unlock this level.");break}
      S.i=i;K.cur[S.t]=i;S.c=0;S.reps=0;saveDB();renderTopic();break}
    case "lvlGo":S.i=+k;S.c=0;S.reps=0;renderTopic();show("topic");break;
    case "act":if(k==="learn"){S.c=0;S.reps=0;renderLearn();show("learn");sayItem(itemsOf(TOPICS[S.t].L[S.i])[0])}else startRound(k);break;
    case "hear":if(S.screen==="learn")sayItem(itemsOf(TOPICS[S.t].L[S.i])[S.c]);break;
    case "slow":sayItem(itemsOf(TOPICS[S.t].L[S.i])[S.c],true);break;
    case "meaning":{const w=itemsOf(TOPICS[S.t].L[S.i])[S.c];say([esFull(w),"en:"+enFull(w)]);break}
    case "sayWord":sayTokText(k);break;
    case "rep":{const w=itemsOf(TOPICS[S.t].L[S.i])[S.c];S.reps=Math.min(3,S.reps+1);
      if(S.reps===3){if(box(w)<1)K.box[w.es]=1;saveDB();say([esFull(w),rnd(PRAISE)])}else say(S.reps===1?["en:Say it with me, three times!",esFull(w)]:[esFull(w)]);
      renderLearn();break}
    case "replay":replay(false);break;
    case "replaySlow":replay(true);break;
    case "pick":pickListen(+k,b);break;
    case "tile":tapTile(+k,b);break;
    case "hint":hintTile();break;
    case "flip":flipCard(+k,b);break;
    case "hearBoth":{const [t,i,es]=k.split("|");const w=TOPICS[+t].L[+i].w.find(x=>x.es===es);if(w)say([esFull(w),"en:"+enFull(w)]);break}
    case "dashKid":switchKid(k);renderDash();break;
    case "setKid":switchKid(k);if(needsSetup(K))openWelcome();else renderSettings();break;
    case "addKid":K=blankKid();DB.kids.push(K);DB.cur=K.id;saveDB();openWelcome(true);break;
    case "setAv":K.avatar=k;saveDB();renderSettings();break;
    case "setGrade":K.grade=k;saveDB();renderSettings();break;
    case "setSex":K.sex=k;saveDB();renderSettings();break;
    case "delAsk":$("#delBox").innerHTML=`<div class="confirm">Remove ${esc(K.name)} and all of their progress? <button class="big-btn small" data-act="del">Remove</button><button class="big-btn alt small" data-act="keepKid">Keep</button></div>`;break;
    case "keepKid":renderSettings();break;
    case "del":DB.kids=DB.kids.filter(x=>x!==K);K=DB.kids[0];DB.cur=K.id;saveDB();renderSettings();toast("Child removed");break;
    case "vtest":say(["¡Hola! Vamos a aprender español.","en:Let's learn some Spanish!"]);break;
    case "pinChange":askPin(()=>{renderSettings();show("settings")},true);break;
    case "backup":$("#backupBox").innerHTML=`<label class="field">Backup code (all children)<textarea id="bcode" readonly>${enc({pal:3,kids:DB.kids,cur:DB.cur})}</textarea></label><button class="big-btn small" data-act="copy">Copy code</button>`;break;
    case "copy":{const t=$("#bcode");t.focus();t.select();try{navigator.clipboard.writeText(t.value).then(()=>toast("Copied. Paste it into Notes to keep it safe."),()=>toast("Text selected. Tap Copy from the menu."))}catch(err){toast("Text selected. Tap Copy from the menu.")}break}
    case "restoreAsk":$("#backupBox").innerHTML=`<label class="field">Paste a backup code<textarea id="rcode"></textarea></label><p class="note small">This replaces every child on this device.</p><button class="big-btn small" data-act="restore">Restore</button>`;break;
    case "restore":try{const d=dec($("#rcode").value);if(!d||!Array.isArray(d.kids)||!d.kids.length)throw 0;DB.kids=d.kids.slice(0,MAX_KIDS).map(x=>blankKid(x));K=DB.kids.find(x=>x.id===d.cur)||DB.kids[0];DB.cur=K.id;saveDB();renderSettings();toast(`Restored ${DB.kids.length} ${DB.kids.length===1?"child":"children"}`)}catch(err){toast("That code didn't work. Copy the whole code and try again.")}break;
    case "resetAsk":$("#resetBox").innerHTML=`<div class="confirm">Erase ${esc(K.name)}'s stars, stickers, levels and scores? <button class="big-btn small" data-act="reset">Yes, reset</button><button class="big-btn alt small" data-act="keepKid">Keep</button></div>`;break;
    case "reset":Object.assign(K,{stars:0,stickers:[],box:{},miss:{},lvl:{},cur:{},prog:{},best:{},log:{},last:null});saveDB();renderSettings();toast("Progress reset");break;
    case "rvEs":say(k);break;
    case "rvEn":say("en:"+k.replace("{A}","five"));break;
  }
});
function renderHomeSafe(){if(K&&K.grade)renderHome()}

/* ---------- swipe between learn cards ---------- */
const calm=matchMedia("(prefers-reduced-motion: reduce)").matches;let drag=null,busy=false;
const card=()=>document.querySelector("#learnBody .learn");
function step(dir){if(busy)return;const ws=itemsOf(TOPICS[S.t].L[S.i]);S.c=(S.c+dir+ws.length)%ws.length;S.reps=0;sayItem(ws[S.c]);
  const c=card();if(calm||!c){renderLearn();return}busy=true;
  c.style.transition="transform .22s ease-in, opacity .22s";c.style.transform=`translateX(${-dir*110}%) rotate(${-dir*6}deg)`;c.style.opacity="0";
  setTimeout(()=>{renderLearn();const n=card();n.style.transition="none";n.style.transform=`translateX(${dir*40}%)`;n.style.opacity="0";void n.offsetWidth;
    n.style.transition="transform .25s ease-out, opacity .25s";n.style.transform="";n.style.opacity="";setTimeout(()=>{busy=false},260)},200)}
$("#learnBody").addEventListener("pointerdown",e=>{if(busy||!e.isPrimary)return;const c=e.target.closest(".learn");if(!c)return;drag={x:e.clientX,y:e.clientY,dx:0,h:null,c}});
addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(drag.h===null&&(Math.abs(dx)>10||Math.abs(dy)>10))drag.h=Math.abs(dx)>Math.abs(dy);if(!drag.h)return;
  drag.dx=dx;drag.c.style.transition="none";drag.c.style.transform=`translateX(${dx}px) rotate(${dx/40}deg)`});
addEventListener("pointerup",()=>{if(!drag)return;const d=drag;drag=null;if(!d.h)return;swiped=true;setTimeout(()=>{swiped=false},350);
  if(Math.abs(d.dx)>Math.min(90,d.c.offsetWidth*.22))step(d.dx<0?1:-1);else{d.c.style.transition="transform .2s ease-out";d.c.style.transform=""}});
addEventListener("pointercancel",()=>{if(drag&&drag.c){drag.c.style.transition="transform .2s";drag.c.style.transform=""}drag=null});
addEventListener("keydown",e=>{if(S.screen!=="learn"||e.target.closest("select,input,textarea"))return;if(e.key==="ArrowRight"){e.preventDefault();step(1)}if(e.key==="ArrowLeft"){e.preventDefault();step(-1)}});

/* ---------- start ---------- */
if(K)$("#splashAv").src=`img/${K.avatar}.webp`;
let inFrame=true;try{inFrame=window.top!==window}catch(e){}
if("serviceWorker" in navigator&&location.protocol==="https:"&&!inFrame){navigator.serviceWorker.register("sw.js").then(r=>{setTimeout(()=>r.active&&r.active.postMessage({type:"fill"}),8000)}).catch(()=>{})}
if(location.hash==="#review"){S.backTo="home";renderReview();show("review")}
