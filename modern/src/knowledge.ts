import {z} from 'zod'
export const objectKinds=['Note','Project','Person','Book','Paper','Resource','Idea','Course','Goal','Task','Daily entry'] as const
export const customKinds=['Note','Project','Person','Book','Paper','Resource','Idea'] as const
export const objectSchema=z.object({id:z.string().min(1),kind:z.enum(customKinds),title:z.string(),body:z.string(),tags:z.array(z.string()),properties:z.record(z.string(),z.string()),createdAt:z.string(),updatedAt:z.string(),revision:z.number().int().positive()})
export const relationSchema=z.object({sourceId:z.string(),targetId:z.string(),kind:z.enum(['related','depends-on','part-of','references'])})
export const knowledgeSchema=z.object({objects:z.array(objectSchema),relations:z.array(relationSchema)})
export type Knowledge=z.infer<typeof knowledgeSchema>
export type KnowledgeObject=z.infer<typeof objectSchema>
export type Relation=z.infer<typeof relationSchema>
export const blankKnowledge=():Knowledge=>({objects:[],relations:[]})
export function addRelation(k:Knowledge,edge:Relation):Knowledge{
 if(edge.sourceId===edge.targetId||k.relations.some(r=>r.sourceId===edge.sourceId&&r.targetId===edge.targetId&&r.kind===edge.kind))return k
 return {...k,relations:[...k.relations,edge]}
}
export function removeObject(k:Knowledge,id:string):Knowledge{return {...k,objects:k.objects.filter(o=>o.id!==id),relations:k.relations.filter(r=>r.sourceId!==id&&r.targetId!==id)}}
