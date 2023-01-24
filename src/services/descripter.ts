import OpenAiClient from "@src/clients/openAi";
import { IProduct, ProductService } from "./product";
import apiError, { IApiError } from "@src/utils/errors/api-error";

export class DescripterService {
    private openAiClient: OpenAiClient;

    constructor() {
        this.openAiClient = new OpenAiClient();
    }

    public async generateDescription(product: IProduct, sentenceType: string): Promise<string> {
        ProductService.validate(product);
        if (!sentenceType) {
            const customError: IApiError = {
                message: "{sentence_type} é obrigatório.",
                code: 400,
            };
            throw customError;
        }

        const prompt = this.promptBuilder(product, sentenceType);
        const result = await this.openAiClient.fetchGenerateDescription("text-davinci-003", prompt, 1);

        return result.data;
    }


    private promptBuilder(product: any, sentence_type: string): string {
        let prompt = `
            Crie descrição curta para o produto inspirado nas melhores tecnicas de copywriting e com o minimo de 250 caracteres
            ###
            O modelo de escrita do texto: ${sentence_type}
            ###
            Esse é o nome do produto ${product.name} use o apenas 1 vez
            ###
            Esse o tecido do produto ${product.tissue}
            ###
            Essa é uma lista de detalhes sobre o produto ${product.details} use as palavras da lista que melhores se encaixam com a sua descrição. Não é necessário usar todas.
            ###
            Use virgulas e acentuações da lingua portuguesa-Brasil, leia a sua resposta antes de me retornar e a corrija caso tenha erros de lingua portuguesa - Brasil
            ###
            Não escreva coisas como 'Experimentar agora mesmo, prove agora mesmo', somos um e-commerce e não há possibilidade de o cliente provar o produto imediatamente.
            ###
            Somos uma loja de ecommerce e gostariamos de ranquear bem no google.
        `
        return prompt;
    }
}