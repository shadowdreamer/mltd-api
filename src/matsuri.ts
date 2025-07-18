import { Hono } from 'hono'
import { cors } from 'hono/cors'

export type Env = { STATIC: R2Bucket }


export const app = new Hono<{ Bindings: Env }>()
app.use('*', cors())

app.get('/', async (c) => {
  return c.text('Hello! This is some MLTD api')
})

app.get('/__scheduled', async (c) => {
  const msg = await asyncCardsJson(c.env)
  return c.json(msg)
})

export async function asyncCardsJson(env:Env){
  const response = await fetch('https://api.matsurihi.me/api/mltd/v2/cards?prettyPrint=false');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const jsonData = await response.text();
  await env.STATIC.put('mltd/cards.json', jsonData,{
     httpMetadata:{
      contentType:'application/json; charset=utf-8'
     }
  });
  
  return { success: true, message: 'Cards data updated successfully' };
}