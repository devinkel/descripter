import { Request, Response } from "express";
import { ClassMiddleware, Controller, Post } from "@overnightjs/core";
import logger from "../logger";
import { IProduct } from "@src/services/product";
import { DescripterService } from "@src/services/descripter";
import apiError from "@src/utils/errors/api-error";
import { authMiddleware } from "@src/middlewares/auth";

@Controller("makedescription")
@ClassMiddleware(authMiddleware)
export class DescripterController {
    @Post("")
    public async makeDescription(req: Request, res: Response): Promise<void> {
        try {
            const product: IProduct = req.body.product;
            const sentenceType: string = req.body.sentence_type;

            const descripterService = new DescripterService();
            const description = await descripterService.generateDescription(product, sentenceType);

            res.status(201).send({ description });
        } catch (error:any) {
            logger.error(error);
            res.status(error.code).send(apiError.format(error));
        }
    }
}