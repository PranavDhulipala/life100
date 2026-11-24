import {describe,it,expect} from 'vitest'
import {encryptVault,decryptVault} from './crypto-vault'
import {empty} from './model'
const pass='example test phrase not a real secret'
describe('encrypted snapshots',()=>{
  it('round trips and uses fresh salt and nonce',async()=>{
    const v=empty();v.notes.push({id:'n',title:'Private example',body:'private test text',tags:[],createdAt:'',updatedAt:''})
    const a=await encryptVault(v,pass),b=await encryptVault(v,pass)
    expect(JSON.stringify(a)).not.toContain('private test text')
    expect(a.salt).not.toBe(b.salt);expect(a.iv).not.toBe(b.iv)
    expect(await decryptVault(a,pass)).toEqual(v)
  },15000)
  it('rejects a wrong passphrase and modified ciphertext',async()=>{
    const a=await encryptVault(empty(),pass)
    await expect(decryptVault(a,'different test passphrase')).rejects.toThrow()
    const corrupted={...a,ciphertext:(a.ciphertext[0]==='A'?'B':'A')+a.ciphertext.slice(1)}
    await expect(decryptVault(corrupted,pass)).rejects.toThrow()
  },15000)
  it('rejects short passwords',async()=>{await expect(encryptVault(empty(),'short')).rejects.toThrow()})
})
