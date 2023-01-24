import { IApiError } from "@src/utils/errors/api-error";

export interface IProduct {
    name: string;
    tissue: string;
    details: string;
}

export class ProductService {
    public static validate(product: IProduct): void {
        if (!product) {
            const customError: IApiError = {
                message: "O campo {product} é obrigatório.",
                code: 400,
            };
            throw customError;
        }
        if (!product.name) {
            const customError: IApiError = {
                message: "O campo {name} é obrigatório.",
                code: 400,
            };
            throw customError;
        }
        if (!product.tissue) {
            const customError: IApiError = {
                message: "O campo {tissue} é obrigatório.",
                code: 400,
            };
            throw customError;
        }
        if (!product.details) {
            const customError: IApiError = {
                message: "O campo {details} é obrigatório.",
                code: 400,
            };
            throw customError;
        }
    }
}