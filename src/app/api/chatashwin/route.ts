import { openai } from "../../../lib/openai";
import { pinecone } from "../../../lib/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const POST = async (req : NextRequest) => {

  const body = await req.json();

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  console.log(body)

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex
  });

  const results = await vectorStore.similaritySearch(message, 4);



};
