import { debugLog, errorLog } from '@/logs';
import { ChatOpenAI } from '@langchain/openai';

export type ChatModel = 'github_copilot/gpt-5-mini' | 'openai/gpt-5-mini';
export type TranslateModel = 'github_copilot/gpt-5-mini' | 'openai/gpt-5-mini';

export interface ModelPreset {
  openaiEndpoint?: string;
  openaiKey?: string;
  modelName: string;
}

export interface ModelOptions {
  maxTokens?: number;
  streaming?: boolean;
  modelPreset: ModelPreset;
  responseFormat?: { type: 'json_object' };
}

export interface OpenAIChatOptions {
  modelName: string;
  apiKey: string;
  maxTokens: number;
  streaming: boolean;
  configuration: {
    baseURL: string;
  }
  modelKwargs?: { response_format?: { type: 'json_object' } }; // Added for JSON mode
}

export async function getModelInstance({
  maxTokens = -1,
  streaming = false,
  modelPreset,
  responseFormat,
}: ModelOptions): Promise<ChatOpenAI> {
  const { openaiKey, openaiEndpoint, modelName } = modelPreset;

  if (!openaiKey || !openaiEndpoint) {
    const errMsg = 'OpenAI API key or Endpoint is not set. Cannot create LLM instance.';
    errorLog(errMsg);
    throw new Error(errMsg);
  }

  try {
    const options: OpenAIChatOptions = {
      modelName,
      apiKey: openaiKey,
      configuration: {
        baseURL: openaiEndpoint
      },
      streaming,
      maxTokens,
    };

    if (responseFormat) {
      options.modelKwargs = { response_format: responseFormat };
    }

    const llmInstance = new ChatOpenAI(options);
    debugLog('getModelInstance Successfully created a new model instance with options:', options);
    return llmInstance;
  } catch (err) {
    errorLog('getModelInstance Error during new LLM instance creation:', err);
    throw err;
  }
}
