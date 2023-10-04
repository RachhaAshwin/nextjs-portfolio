import {OpenAI} from "langchain/llms/openai";
import {pinecone} from "./pinecone-client";
import {PineconeStore} from "langchain/vectorstores/pinecone";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import {ConversationalRetrievalQAChain} from "langchain/chains";
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { CallbackManager } from 'langchain/callbacks';


async function initChain() {
    const model = new OpenAI({});

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX ?? '');

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        {
            pineconeIndex: pineconeIndex,
            textKey: 'text',
        },
    );

    return ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever({ maxDocuments: 3 }),
        {returnSourceDocuments: true}
    );
}


export const chain = await initChain()