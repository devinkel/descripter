
import { InternalError } from '@src/utils/errors/internal-error';
import config, { IConfig } from 'config';
import { OpenAIApi, Configuration } from 'openai';

export class ClientRequestError extends InternalError {
    constructor(message: string) {
        const internalMessage =
            'Unexpected error when trying to communicate to StormGlass';
        super(`${internalMessage}:${message}`);
    }
}

const OpenAiResourceConfig: IConfig = config.get(
    'App.resources.OpenAi'
);

export default class OpenAiClient {
    public async fetchGenerateDescription(model: string, prompt: string, temperature: number): Promise<any> {

        try {
            const configuration = new Configuration({
                apiKey: process.env.API_KEY,
                // organization: OpenAiResourceConfig.get('organization')
            });

            const openAi = new OpenAIApi(configuration);

            const response = await openAi.createCompletion({
                model: model,
                prompt: prompt,
                temperature: temperature,
                max_tokens: 2048
            })

            return response;
        } catch (error: any) {
            throw new ClientRequestError(JSON.stringify(error));
        }
    }
}