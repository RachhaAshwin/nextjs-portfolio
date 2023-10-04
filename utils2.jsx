import { ChatOpenAI } from "langchain/llms/openai";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 1000,
});

import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});
const index = client.Index(process.env.PINECONE_INDEX);

const embeddings = new OpenAIEmbeddings();
const vectorStore = await PineconeStore.fromDocuments(docs, embeddings, {
  pineconeIndex: index,
});

import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: "chat_history",
    }),
  }
);

const question = "What did the president say about Justice Breyer?";
const res = await chain.call({ question });
console.log(res);