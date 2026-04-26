import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST() {
  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Genera un menú semanal variado, equilibrado y típicamente español para una pareja. 
Para cada día (Lunes a Domingo) indica comida y cena, más los ingredientes principales que hay que comprar (4-6 ingredientes).
Responde SOLO con JSON válido sin backticks ni explicaciones, con esta estructura exacta:
{"menu":[{"dia":"Lunes","comida":"nombre del plato","cena":"nombre del plato","ingredientes":["ing1","ing2","ing3"]},...]}
7 días, sin preamble.`
      }]
    })

    const text = msg.content.map((b: any) => b.text || '').join('')
    const clean = text.replace(/```json|```/g, '').trim()
    const data = JSON.parse(clean)

    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
