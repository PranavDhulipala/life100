import {z} from 'zod'
import {knowledgeSchema} from './knowledge'
const str=z.string();const id=z.string().min(1);const pct=z.number().min(0).max(100)
export const taskSchema=z.object({id,title:str,date:str,time:str,minutes:z.number().nonnegative(),goalId:str,priority:str,done:z.boolean()})
export const goalSchema=z.object({id,title:str,area:str,target:str,due:str,detail:str,progress:pct})
export const courseSchema=z.object({id,title:str,group:str,due:str,detail:str,progress:pct})
export const noteSchema=z.object({id,title:str,body:str,tags:z.array(str),createdAt:str,updatedAt:str})
export const journalSchema=z.object({body:str,wins:str,lessons:str,tomorrow:str})
export const daySchema=z.object({weight:str,vo2:str,sleep:str,steps:str,mood:str,study:str,workout:z.boolean(),german:z.boolean(),outside:z.boolean(),social:z.boolean()})
export const vaultSchema=z.object({version:z.literal(1),tasks:z.array(taskSchema),goals:z.array(goalSchema),courses:z.array(courseSchema),notes:z.array(noteSchema),journal:z.record(str,journalSchema),daily:z.record(str,daySchema),focus:z.record(str,str),legacy:z.unknown().optional(),knowledge:knowledgeSchema.optional()})
export type Vault=z.infer<typeof vaultSchema>;export type Task=z.infer<typeof taskSchema>;export type Goal=z.infer<typeof goalSchema>;export type Course=z.infer<typeof courseSchema>;export type Note=z.infer<typeof noteSchema>
export const key='life100-react-v1'
export const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
export const shift=(s:string,n:number)=>{const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10)}
export const uid=()=>crypto.randomUUID()
export const empty=():Vault=>({version:1,tasks:[],goals:[],courses:[],notes:[],journal:{},daily:{},focus:{}})
export const blankJournal=()=>({body:'',wins:'',lessons:'',tomorrow:''})
export const blankDay=()=>({weight:'',vo2:'',sleep:'',steps:'',mood:'',study:'',workout:false,german:false,outside:false,social:false})
export const progress=(x:number)=>Math.max(0,Math.min(100,Number.isFinite(x)?x:0))
export function migrate(old:any):Vault {const v=empty(),w=old?.workspace||{};v.legacy=old;
 for(const k of ['tasks','goals','courses'] as const){const schema={tasks:taskSchema,goals:goalSchema,courses:courseSchema}[k];const rows=Array.isArray(w[k])?w[k]:[];(v[k] as unknown[]).push(...rows.flatMap((r:unknown)=>{const p=schema.safeParse(r);return p.success?[p.data]:[]}))}
 v.focus=w.focus||{};for(const [d,j] of Object.entries<any>(w.journal||{}))v.journal[d]={...blankJournal(),...j}
 for(const n of old?.notes||[])v.notes.push({id:String(n.id||uid()),title:String(n.title||'Untitled'),body:String(n.body||''),tags:Array.isArray(n.tags)?n.tags.map(String):[],createdAt:String(n.createdAt||new Date().toISOString()),updatedAt:String(n.updatedAt||n.createdAt||new Date().toISOString())})
 for(const [d,e] of Object.entries<any>(old?.entries||{})){const a=blankDay();for(const k of ['weight','vo2','sleep','steps','mood'] as const)a[k]=String(e.metrics?.[k]??'');a.workout=Object.values(e.activities||{}).some(Boolean);a.german=Boolean(e.habits?.german);a.outside=Boolean(e.habits?.outside);a.social=Boolean(e.habits?.social);v.daily[d]=a;if(!v.journal[d]&&Object.values(e.journal||{}).some(Boolean))v.journal[d]={body:String(e.journal?.sentence||''),wins:String(e.journal?.best||''),lessons:String(e.journal?.hardest||''),tomorrow:''}}
 // Do not copy legacy cloud credentials into the new vault.
 if(v.legacy&&typeof v.legacy==='object'){const copy=structuredClone(v.legacy) as any;if(copy.settings){delete copy.settings.supabaseAnonKey;delete copy.settings.syncEmail}v.legacy=copy}
 return vaultSchema.parse(v)}
export function readVault():{data:Vault;error:string}{try{const raw=localStorage.getItem(key);if(raw)return {data:vaultSchema.parse(JSON.parse(raw)),error:''};const old=localStorage.getItem('life100-state-v4');return {data:old?migrate(JSON.parse(old)):empty(),error:''}}catch{return {data:empty(),error:'Existing storage could not be read. It has not been overwritten. Recover it before saving.'}}}
export function download(name:string,body:string,type='application/json'){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
export function importWorkspace(v:Vault,raw:unknown):Vault {const parsed=vaultSchema.safeParse(raw);if(parsed.success)return parsed.data;const p=z.object({version:z.literal(1),tasks:z.array(taskSchema),goals:z.array(goalSchema),courses:z.array(courseSchema),journal:z.record(str,journalSchema),focus:z.record(str,str)}).parse(raw);const merge=<T extends {id:string}>(a:T[],b:T[])=>[...a,...b.filter(x=>!a.some(y=>y.id===x.id))];return {...v,tasks:merge(v.tasks,p.tasks),goals:merge(v.goals,p.goals),courses:merge(v.courses,p.courses),journal:{...p.journal,...v.journal},focus:{...p.focus,...v.focus}}}
