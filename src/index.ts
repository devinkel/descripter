import logger from './logger';
import { SetupServer } from './server';
import config from 'config';

enum ExitStatus {
    Failure = 1,
    Success = 0,
}

// ouvindo todas as promessas que foram rejeitadas caso não tenham catch e aplica uma exception para finalizar o processo
process.on('unhandledRejection', (reason, promise) => {
    logger.error(
        `App exiting due to an enhandled promise: ${promise} and reason: ${reason}`
    );

    throw reason;
});

// ouvindo todas as Exception que não foram tratadas e finalizando a App
process.on('uncaughtException', (error) => {
    logger.error(`App exiting due to an uncaught exception: ${error}`);
    process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
    try {
        const server = new SetupServer(config.get('App.port'));
        await server.init();
        server.start();

        const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
        for (const signal of exitSignals) {
            process.on(signal, async () => {
                try {
                    await server.close();
                    logger.info(`App exited with success`);
                    process.exit(ExitStatus.Success);
                } catch (error) {
                    logger.error(`App exited with error: ${error}`);
                    process.exit(ExitStatus.Failure);
                }
            });
        }
    } catch (error) {
        logger.error(`App exited with error: ${error}`);
        process.exit(ExitStatus.Failure); // desligando a app caso algum erro aconteça na inicialização
    }
})();
