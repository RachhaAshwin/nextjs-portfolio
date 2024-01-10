// import { NextResponse } from 'next/server';
// import {chain} from "../../../../utils/chain";
// import {Message} from "../../../../types/messages";
// import { OpenAIStream, StreamingTextResponse } from 'ai'


// export async function POST(request: Request) {

//     const body = await request.json();
//     const question: string = body.query;
//     const history: Message[] = body.history ?? []

//     const res = await chain.call({
//             question: question,
//             chat_history: history.map(h => h.content).join("\n"),
//         });

//     console.log(res.sourceDocuments)

//     const links: string[] = Array.from(new Set(res.sourceDocuments.map((document: {metadata: {source: string}}) => document.metadata.source)))
    
//     return NextResponse.json({role: "assistant", content: res.text, links: links})
// }

import { NextResponse } from 'next/server';
import { OpenAIStream, StreamingTextResponse, LangChainStream } from 'ai';
import { chain } from '../../../../utils/chain';
import { Message } from '../../../../types/messages';

// export const runtime = 'edge';

export async function POST(request: Request) {
    const body = await request.json();
    const question = body.query;
    const history = body.history ?? [];

    const { stream, handlers } = LangChainStream(); 

    const res = await chain.call({
        question: question,
        chat_history: history.map(h => h.content).join("\n"),
        handlers: handlers
    });

    return new Response(stream, { headers: { "Content-Type": "application/json" }, status: 200 });


}
