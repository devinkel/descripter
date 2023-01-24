import OpenAiClient from '@src/clients/openAi';
import axios from 'axios';
import openAiResponse from '@test/fixtures/openAiResponse.json';

jest.mock('axios')


describe('OpenAiClient', () => {
    it('should return a response', async () => {
        const mockResponse = openAiResponse;

        (axios.post as jest.Mock).mockResolvedValue(mockResponse);

        const openAiClientMock = new OpenAiClient();

        const response = await openAiClientMock.fetchGenerateDescription('text-davinci-003', 'Make a product short description for dress', 1)

        expect(response.data).toHaveProperty('choices');
    })

    it('should throw  when model is not provided', async () => {
        // create an instance of OpenAiClient
        const openAiClient = new OpenAiClient();
        // define the function to test
        const testFunction = async () => {
            await openAiClient.fetchGenerateDescription("", "What is the capital of France?", 0.7);
        }
        // assert that the function throws an error
        expect(testFunction()).rejects.toThrow();
    });

    it('should throw an error when API returns 404', async () => {
        // define a mock response
        const mockError = {
            response: {
                status: 404,
                data: {
                    message: 'Not found'
                }
            }
        };
        // set the mock response when axios.post is called
        (axios.post as jest.Mock).mockRejectedValue(mockError);
        // create an instance of OpenAiClient
        const openAiClient = new OpenAiClient();
        // define the function to test
        const testFunction = async () => {
            await openAiClient.fetchGenerateDescription("model", "What is the capital of France?", 0.7);
        }
        // assert that the function throws an error
        expect(testFunction()).rejects.toThrow();
    });
});