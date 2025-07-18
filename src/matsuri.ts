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
  return c.text(`[scheduled] ${msg}`)
})

export async function asyncCardsJson(env:Env){
  const response = await fetch('https://api.matsurihi.me/api/mltd/v2/cards');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const jsonData = await response.json();
  await env.STATIC.put('mltd/cards.json', JSON.stringify(jsonData));
  
  return { success: true, message: 'Cards data updated successfully' };
}