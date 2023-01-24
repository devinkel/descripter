import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import { User } from '@src/models/users';

export interface DecodedUser extends Omit<User, '_id'> {
    id: string;
}

export class AuthService {
    /**
     *
     * @param password
     * @param salt
     * @returns encrypted password
     */
    public static async hashPassword(
        password: string,
        salt = 10
    ): Promise<string> {
        return await bcrypt.hash(password, salt);
    }

    /**
     *
     * @param password
     * @param hashPassword
     * @returns boolean if the same password
     */
    public static async comparePasswords(
        password: string,
        hashPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    }

    /**
     *
     * @param payload
     * @returns
     */
    public static generateToken(payload: object): string {
        return jwt.sign(payload, config.get('App.auth.key'), {
            expiresIn: config.get('App.auth.tokenExpiresIn'),
        });
    }

    /**
     *
     * @param token
     * @returns
     */
    public static decodeToken(token: string): DecodedUser {
        return jwt.verify(token, config.get('App.auth.key')) as DecodedUser;
    }
}
