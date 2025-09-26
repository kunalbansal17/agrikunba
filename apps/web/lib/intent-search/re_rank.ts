import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export async function rerank(query: string, candidates: {id:string,title:string,description?:string,brand?:string,category?:string}[]) {
const top = candidates.slice(0, 20);
const prompt = `You are a ranking function for an e-commerce store.\nQuery: ${query}\nRank these items from best to worst based on relevance to the query. Return JSON array of product ids in best-first order. Items:\n` +
top.map((c,i)=>`${i+1}. id=${c.id} title=${c.title} brand=${c.brand??''} category=${c.category??''} desc=${(c.description??'').slice(0,160)}`).join('\n');


const res = await openai.chat.completions.create({
model: 'gpt-4o-mini',
messages: [{ role: 'user', content: prompt }],
temperature: 0
});
const text = res.choices[0].message?.content ?? '[]';
const order: string[] = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? '[]');
const idx = new Map(order.map((id, i) => [id, i]));
return top.slice().sort((a,b)=> (idx.get(a.id) ?? 999) - (idx.get(b.id) ?? 999));
}