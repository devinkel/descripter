import './utils/module-alias';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import * as http from 'http';
import expressPino from 'express-pino-logger'
import logger from './logger';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import apiSchema from './api.schema.json';
import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { Application } from 'express';
import { DescripterController } from './controllers/descripter';
import * as database from '@src/database';
import { apiErrorValidator } from './middlewares/api-error-validatos';
import { UsersController } from './controllers/users';

export class SetupServer extends Server {
    private server?: http.Server

    constructor(private port = 3000) {
        super();
    }

    public async init(): Promise<void> {
        this.setupExpress();
        await this.docsSetup();
        this.setupControllers();
        await this.setupDatabase();
        this.setupErrorHandlers();
    }

    private setupExpress(): void {
        this.app.use(bodyParser.json()); // settando a app para transacionar dados em json
        this.app.use(expressPino({ logger }));
        this.app.use(
            cors({
                origin: '*',
            })
        );
    }

    private setupErrorHandlers(): void {
        this.app.use(apiErrorValidator);
    }

    private async docsSetup(): Promise<void> {
        this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
        this.app.use(
            OpenApiValidator.middleware({
                apiSpec: apiSchema as OpenAPIV3.Document,
                validateRequests: true, //will be implemented in step2
                validateResponses: true, //will be implemented in step2
            })
        );
    }

    private setupControllers(): void {
        const descripterController = new DescripterController();
        const usersController = new UsersController();
        this.addControllers([
            descripterController,
            usersController
        ])
    }

    private async setupDatabase(): Promise<void> {
        await database.connect();
    }

    public async close(): Promise<void> {
        await database.close();
    }

    public start(): void {
        this.app.listen(this.port, () => {
            logger.info('Server listening on port: ' + this.port);
        });
    }

    public getApp(): Application {
        return this.app;
    }
}