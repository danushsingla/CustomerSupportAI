import { InvokeModelWithResponseStreamCommand, BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { NextResponse } from "next/server";

const client = new BedrockRuntimeClient({
    region: 'us-east-1',
});

const bedrockAgentRuntimeclient = new BedrockAgentRuntimeClient({ region: 'us-east-1' });

const secretsManagerClient = new SecretsManagerClient({ region: 'us-east-1' });

// Function to retrieve a secret from AWS Secrets Manager
async function getSecret(secretName: string): Promise<any> {
    try {
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const response = await secretsManagerClient.send(command);
        const secret = response.SecretString;
        if (secret) {
            return JSON.parse(secret);
        } else {
            throw new Error('Secret string is empty');
        }
    } catch (error) {
        console.error(`Error retrieving secret: ${error}`);
        throw error;
    }
}

const secretArn = 'modelArn'; // Replace with your secret ARN

interface RetrieveAndGenerateParams {
    input: {
        text: string;
    };
    retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE';
        knowledgeBaseConfiguration: {
            knowledgeBaseId: string;
            modelArn: string;
        };
    };
}

async function getContext(query: string): Promise<string> {
    try{
        const secrets = await getSecret(secretArn);
        const modelArn = secrets.modelArn;
        const kbId = secrets.kb_id;

        const params: RetrieveAndGenerateParams = {
            input: {
                text: query,
            },
            retrieveAndGenerateConfiguration: {
                type: 'KNOWLEDGE_BASE',
                knowledgeBaseConfiguration: {
                    knowledgeBaseId: kbId,
                    modelArn: modelArn,
                }
            }
        };

        const command = new RetrieveAndGenerateCommand(params);
        const response = await bedrockAgentRuntimeclient.send(command);
        if (response.output && response.output.text) {
            return response.output.text;
        } else {
            throw new Error('Response is missing output text');
        }
    }
    catch (error) {
        console.error('Error retrieving context:', error);
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        // Retrieve secrets from AWS Secrets Manager
        const secrets = await getSecret(secretArn);
        const modelArn = secrets.modelArn;
        const kbId = secrets.kb_id;

        if (!modelArn || !kbId) {
            throw new Error('Secrets not initialized');
        }

        const messages = await req.json() as { role: string, content: string }[];
        const user_message = messages[messages.length - 1].content;

        const system_prompt = "You are a helpful AI assistant.";
        const prompt = `Human: ${user_message}\nAssistant:`; // Add the "Human:" prefix to the user message

        const requestPayload = {
            "prompt": prompt,
            "max_tokens_to_sample": 512,
            "temperature": 0.5,
            "top_p": 0.9,
        };

        const resp = await getContext(user_message);

        console.log(resp);
        return new NextResponse(resp)
        
        // const responseStream = await client.send(
        //     new InvokeModelWithResponseStreamCommand({
        //         contentType: "application/json",
        //         body: JSON.stringify(requestPayload),
        //         modelId: modelArn, // Use the model ARN retrieved from secrets
        //     }),
        // );

        // const readableStream = new ReadableStream({
        //     async start(controller) {
        //         let responseText = '';
        //         try {
        //             for await (const event of responseStream.body!) {
        //                 const chunk = JSON.parse(new TextDecoder().decode(event.chunk?.bytes)) as { type: string, completion: string, stop_reason?: string, stop?: string };

        //                 if (chunk.completion) {
        //                     responseText += chunk.completion;
        //                 }

        //                 // Check if the stop reason is met and stop the stream
        //                 if (chunk.stop_reason === 'stop_sequence') {
        //                     controller.enqueue(responseText);
        //                     controller.close();
        //                     return;
        //                 }
        //             }
        //             // If no stop_sequence was encountered, return the aggregated text
        //             controller.enqueue(responseText);
        //             controller.close();
        //         } catch (error) {
        //             console.error('Error reading from response stream:', error);
        //             controller.error(error);
        //         }
        //     },
        // });

        // return new NextResponse(readableStream, {
        //     headers: { 'Content-Type': 'text/event-stream' },
        // });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
    }
}