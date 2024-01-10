import { PineconeClient } from "@pinecone-database/pinecone"
import { PineconeStore } from "langchain/vectorstores/pinecone"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { VectorDBQAChain } from "langchain/chains"
import { OpenAI } from "langchain/llms/openai";
import { NextRequest, NextResponse } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai';


const model = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export const runtime = 'edge';



export async function POST(req) {

    const response = await model.call("Tell me a joke.");
    console.log(response);
    
    return NextResponse.json({
      data: response
    })
  }

