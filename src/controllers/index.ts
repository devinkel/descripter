import { Controller, Get } from '@overnightjs/core';
import logger from '@src/logger';
import { CUSTOM_VALIDATION } from '@src/models/users';
import ApiError, { IApiError } from '@src/utils/errors/api-error';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

export abstract class BaseController {
    protected sendCreatedUpdatedErrorResponse(
        res: Response,
        error: mongoose.Error.ValidationError | Error
    ): void {
        if (error instanceof mongoose.Error.ValidationError) {
            const clientErros = this.handleClientErrors(error);
            res.status(clientErros.code).send(
                ApiError.format({
                    code: clientErros.code,
                    message: clientErros.error,
                })
            );
        } else {
            logger.error(error);
            res.status(500).send(
                ApiError.format({ code: 500, message: 'Something went wrong' })
            );
        }
    }

    private handleClientErrors(error: mongoose.Error.ValidationError): {
        code: number;
        error: string;
    } {
        // verificando se na chave error.erros o erro no campo kind é "DUPLICATED"
        const duplicatedKindErrors = Object.values(error.errors).filter(
            (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
        );
        return duplicatedKindErrors.length
            ? { code: 409, error: error.message }
            : { code: 400, error: error.message };
    }

    protected sendErrorResponse(res: Response, apiError: IApiError): Response {
        return res.status(apiError.code).send(ApiError.format(apiError));
    }
}

@Controller('/')
export class HomeController {
    @Get("")
    public async getHome(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).send({
                message: 'Olá, eu sou o DESCRIPTER!'
            });
        } catch (error:any) {
            res.status(500).send({
                message: 'Something went wrong'
            });
        }
    }
}
