import mongoose, { Document, Model } from 'mongoose';
import { AuthService } from '@src/services/auth';
import logger from '@src/logger';

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
}

export enum CUSTOM_VALIDATION {
    DUPLICATED = 'DUPLICATED',
}

interface UserModel extends Omit<User, '_id'>, Document {}

const schema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            unique: [true, 'E-mail must be unique'],
        },
        password: { type: String, requerid: true },
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

/**
 * Validates the email and throws a validation error, otherwise it will throw a 500
 */
schema.path('email').validate(
    async (email: string) => {
        const emailCount = await mongoose.models.User.countDocuments({ email });
        return !emailCount;
    },
    'already exists in the database',
    CUSTOM_VALIDATION.DUPLICATED
);

/**
 * Hashing password pre-save user in the database
 */
schema.pre<UserModel>('save', async function (): Promise<void> {
    if (!this.password || !this.isModified('password')) {
        return;
    }
    try {
        const hashedPassword = await AuthService.hashPassword(this.password);
        this.password = hashedPassword;
    } catch (error) {
        logger.error(`Error hashing the password for the user ${this.name}`);
    }
});

export const User: Model<UserModel> = mongoose.model<UserModel>('User', schema);