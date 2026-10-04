function quick(){const q=new URLSearchParams(location.search),a=q.get('action');if(!a)return;const e=state.entries[today()]||empty(today());if(a==='metric'){const k=q.get('key'),v=Number(q.get('value'));if(['weight','vo2','sleep','steps','mood','energy','anxiety'].includes(k)&&Number.isFinite(v))e.metrics[k]=v}if(a==='habit'){const k=q.get('key');if(habits.some(([x])=>x===k))e.habits[k]=true}state.entries[e.date]=e;save();history.replaceState({},'',location.pathname)}
window.addEventListener('online',render);
window.addEventListener('offline',render);
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
quick();
render();
