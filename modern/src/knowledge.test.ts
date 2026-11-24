import {describe,it,expect} from 'vitest'
import {addRelation,blankKnowledge,removeObject} from './knowledge'
import {empty,vaultSchema} from './model'
describe('knowledge graph',()=>{
 it('keeps old workspace valid',()=>expect(vaultSchema.parse(empty())).toEqual(empty()))
 it('deduplicates links and disallows self-links',()=>{const edge={sourceId:'a',targetId:'b',kind:'related'} as const;const k=addRelation(blankKnowledge(),edge);expect(addRelation(k,edge)).toEqual(k);expect(addRelation(k,{...edge,targetId:'a'})).toEqual(k);expect(removeObject(k,'b').relations).toEqual([])})
})
