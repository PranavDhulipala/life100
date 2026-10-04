const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const KEY='life100-state-v4',TZ='Europe/Berlin';
const acts=['basketball','gym','bouldering','tennis','hyrox','zone2'];
const actName={basketball:'Basketball',gym:'Gym',bouldering:'Bouldering',tennis:'Tennis',hyrox:'HYROX / Cross',zone2:'Zone 2'};
const actEmoji={basketball:'🏀',gym:'🏋️',bouldering:'🧗',tennis:'🎾',hyrox:'🔥',zone2:'❤️'};
const habits=[['outside','Outside','🌤️'],['movement','Movement','🏃'],['german','German','🇩🇪'],['guitar','Guitar','🎸'],['social','Human contact','👋'],['checkin','Check-in','🧠']];
const metrics=[['weight','Weight','kg',.1],['vo2','VO₂ max','',.1],['sleep','Sleep','h',.1],['steps','Steps','',1],['mood','Mood','/10',1],['energy','Energy','/10',1],['anxiety','Anxiety','/10',1]];
const goalsSeed=[['workouts','Total workouts',70,'sessions'],['basketball','Basketball',20,'sessions'],['gym','Gym',20,'sessions'],['bouldering','Bouldering',14,'sessions'],['tennis','Tennis',10,'sessions'],['hyrox','HYROX / Cross',10,'sessions'],['zone2','Zone 2',14,'sessions'],['german','German',30,'hours'],['guitar','Guitar',40,'sessions'],['invitations','Social invitations',20,'invites'],['adventures','Munich adventures',15,'outings'],['names','People known by name',10,'people'],['messageable','Casually messageable',5,'people'],['hangouts','Outside-activity hangouts',3,'hangouts'],['friends','New genuine friendships',2,'friends'],['checkins','Mental-health check-ins',80,'days']].map(([id,label,target,unit])=>({id,label,target,unit}));
function fresh(){return{startDate:'2026-10-05',endDate:'2027-01-12',entries:{},people:[],notes:[],adventures:[],goals:goalsSeed,settings:{displayName:'Pranav',weightTargetLow:77,weightTargetHigh:79,vo2Target:35,supabaseUrl:'',supabaseAnonKey:'',syncEmail:''}}}
function merge(a,b){return{...a,...b,settings:{...a.settings,...(b.settings||{})},goals:Array.isArray(b.goals)?b.goals:a.goals}}
function load(){try{return merge(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{return fresh()}}
let state=load(),tab='today',selected=today();
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function empty(date){return{date,metrics:{},habits:{},activities:{},germanMinutes:0,guitarMinutes:0,invitation:false,journal:{best:'',hardest:'',sentence:''}}}
function E(){return state.entries[selected]||empty(selected)}
function put(e){state.entries[selected]=e;save();render()}
function esc(x=''){return String(x).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random()}
function days(a,b){return Math.floor((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/86400000)}
function dayNo(d){return Math.max(1,Math.min(100,days(state.startDate,d)+1))}
function sum(fn){return Object.values(state.entries).reduce((n,e)=>n+fn(e),0)}
function totalAct(k){return sum(e=>Number(e.activities?.[k])||0)}
function workouts(){return acts.reduce((n,k)=>n+totalAct(k),0)}
function germanHours(){return +(sum(e=>Number(e.germanMinutes)||0)/60).toFixed(1)}
function guitarSessions(){return Object.values(state.entries).filter(e=>Number(e.guitarMinutes)>0).length}
function invites(){return Object.values(state.entries).filter(e=>e.invitation).length}
function checkins(){return Object.values(state.entries).filter(e=>e.habits?.checkin).length}
function goalValue(id){if(id==='workouts')return workouts();if(acts.includes(id))return totalAct(id);if(id==='german')return germanHours();if(id==='guitar')return guitarSessions();if(id==='invitations')return invites();if(id==='adventures')return state.adventures.length;if(id==='names')return state.people.length;if(id==='messageable')return state.people.filter(p=>p.messageable).length;if(id==='hangouts')return state.people.filter(p=>p.outsideHangout).length;if(id==='friends')return state.people.filter(p=>p.friend).length;if(id==='checkins')return checkins();return 0}
function vals(k){return Object.values(state.entries).sort((a,b)=>a.date.localeCompare(b.date)).map(e=>Number(e.metrics?.[k])).filter(Number.isFinite)}
function avg(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0}
function moodWhere(fn){const a=Object.values(state.entries).filter(fn).map(e=>Number(e.metrics?.mood)).filter(Number.isFinite);return a.length?avg(a).toFixed(1):'—'}
function ring(p){return '<div class="ring" style="--p:'+Math.max(0,Math.min(100,p))*3.6+'deg"><div><strong>'+Math.round(p)+'%</strong><span>journey</span></div></div>'}
function shell(content){const nav=[['today','⌂','Today'],['life','◎','Life'],['notes','✎','Notes'],['people','♙','People'],['insights','⌁','Insights']];return '<main><div class="topbar"><button class="brand" data-tab="today"><span>100</span><div><b>Life 100</b><small>'+esc(state.settings.displayName)+'</small></div></button><div class="topActions"><span class="network">'+(navigator.onLine?'●':'○')+'</span><button data-tab="adventures">⌖</button><button data-tab="connectors">☁</button><button data-tab="settings">⚙</button></div></div>'+content+'<div class="saveState">Local-first · autosaved</div></main><nav>'+nav.map(([k,i,l])=>'<button data-tab="'+k+'" class="'+(tab===k?'active':'')+'"><b>'+i+'</b><span>'+l+'</span></button>').join('')+'</nav>'}
function mbox(m,e){const[k,l,s,step]=m;return '<label class="metricBox"><span>'+l+'</span><div><input data-metric="'+k+'" type="number" inputmode="decimal" step="'+step+'" value="'+(e.metrics?.[k]??'')+'"><small>'+s+'</small></div></label>'}
