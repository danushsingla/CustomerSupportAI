import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromEnv } from "@aws-sdk/credential-providers";
import { NextResponse } from "next/server";
// import { env } from "~/env";

const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: fromEnv(), // reads AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from env
})

// Embed the promp in Llama 3's instruction format
// https://llama.meta.com/docs/model-cards-and-prompt-formats/meta-llama-3/ 

export async function POST(req: Request) {
    try {
        const { user_message } = await req.json() as { user_message: string};
        const modelId = 'meta.llama3-8b-instruct-v1:0'; // depending on the model, the region can change

        const system_prompt = "You are a helpful AI assistant.";

        const prompt = `
            <|begin_of_text|><|start_header_id|>system<|end_header_id|>
            ${system_prompt}
            <|eot_id|>
            
            <|start_header_id|>user<|end_header_id|>
            ${user_message}
            <|eot_id|>

            <|start_header_id|>assistant<|end_header_id|>
            `;

        const request = {
            prompt,
            max_gen_len: 512,
            temperature: 0.5,
            top_p: 0.9,
        };

        const responseStream = await client.send(
            new InvokeModelWithResponseStreamCommand({
                contentType: "application/json",
                body: JSON.stringify(request),
                modelId,
            }),
        );

        const readableStream = new ReadableStream({
            async start(controller) {
                if (responseStream.body) {
                    for await (const event of responseStream.body) {
                        const chunk = JSON.parse(new TextDecoder().decode(event.chunk?.bytes)) as { generation: string };
                        if (chunk.generation) {
                            controller.enqueue(chunk.generation);
                        }
                    }
                }
                controller.close();
            },
        });

        return new NextResponse(readableStream, {
            headers: { 'Content-Type': 'text/event-stream' },
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error proccessing your request' }, { status: 500 });
    }
    
}