import mongoose from 'mongoose';
import { connect as mongooseConnect, connection } from 'mongoose';
import config, { IConfig } from 'config';

const dbConfig: IConfig = config.get('App.database');

export const connect = async (): Promise<void> => {
    mongoose.set('strictQuery', false);

    await mongooseConnect(dbConfig.get('mongoUrl'));
};

export const close = (): Promise<void> => connection.close();
