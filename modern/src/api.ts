import type {Vault} from './model'
export type Connection={url:string;token:string}
export type Answer={text:string;sources:{url:string;title:string}[]}
export type Remote={sha:string|null;vault:Vault|null}
export async function call<T>(c:Connection,path:string,method='GET',body?:unknown):Promise<T>{if(!c.url||!c.token)throw Error('Connect your gateway in Settings first.');const url=new URL(c.url);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))throw Error('Gateway must use HTTPS.');const r=await fetch(new URL(path,url.origin),{method,headers:{Authorization:'Bearer '+c.token,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});const j=await r.json();if(!r.ok)throw Error(j.error||'Gateway request failed: '+r.status);return j as T}
