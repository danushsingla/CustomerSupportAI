import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize the AWS SDK clients
const secretsManagerClient = new SecretsManagerClient({ region: 'us-east-1' });
const bedrockRuntimeClient = new BedrockRuntimeClient({ region: 'us-east-1' });

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

// Replace with your secret ARN
const secretArn = 'arn:aws:secretsmanager:us-east-1:339712952767:secret:modelArn-dHpCYk';

// Retrieve secrets
let modelArn: string;
let kbId: string;

getSecret(secretArn)
    .then(secrets => {
        modelArn = secrets.modelArn;
        kbId = secrets.kb_id;
    })
    .catch(error => {
        console.error(`Error retrieving secrets: ${error}`);
    });

// Function to ask the Bedrock LLM with knowledge base
async function askBedrockLlmWithKnowledgeBase(query: string): Promise<string> {
    try {
        const command = new InvokeModelCommand({
            body: JSON.stringify({
                input: {
                    text: query,
                },
                retrieveAndGenerateConfiguration: {
                    type: 'KNOWLEDGE_BASE',
                    knowledgeBaseConfiguration: {
                        knowledgeBaseId: kbId,
                        modelArn: modelArn,
                    },
                },
            }),
            contentType: 'application/json',
            modelId: 'your-model-id',  // Replace with your Model ID if necessary
        });

        const response = await bedrockRuntimeClient.send(command);
        return response.body?.toString() || 'No response text';
    } catch (error) {
        console.error(`Error asking Bedrock LLM: ${error}`);
        throw error;
    }
}

// Example usage
const query = "Tell me who won swimming in the Olympics";
askBedrockLlmWithKnowledgeBase(query)
    .then(result => {
        console.log('Result:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
