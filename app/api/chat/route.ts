import OpenAI from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { NextResponse } from "next/server"
import { ApiConfig } from "@/app/store/config"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const defaultKey = openai.apiKey

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages, config } = await req.json()
  const apiConfig = config as ApiConfig
  openai.apiKey = apiConfig.apiKey ? apiConfig.apiKey : defaultKey
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    })
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      return new NextResponse(err.message, { status: err.status })
    } else {
      return new NextResponse(String(err), { status: 500 })
    }
  }
}