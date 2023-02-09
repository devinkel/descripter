import { Controller, Middleware, Post, Get } from '@overnightjs/core';
import { User } from '@src/models/users';
import { Request, Response, response } from 'express';
import { BaseController } from '.';
import { AuthService } from '@src/services/auth';
import { authMiddleware } from '@src/middlewares/auth';
import { send } from 'process';

@Controller('users')
export class UsersController extends BaseController {
    @Post('')
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const user = new User(req.body);
            const newUser = await user.save();
            res.status(201).send(newUser);
        } catch (error: any) {
            this.sendCreatedUpdatedErrorResponse(res, error);
        }
    }

    @Post('checkemail')
    public async checkEmail(req: Request, res: Response): Promise<Response> {
        const emailToCheck = req.body.email;
        const checkedEmail = await User.findOne({ email: emailToCheck }).select('email')

        if (!checkedEmail) {
            return this.sendErrorResponse(res, {
                code: 404,
                message: "E-mail not found"
            });
        }

        return res.send( checkedEmail )
    }

    @Post('authenticate')
    public async authenticate(
        req: Request,
        res: Response
    ): Promise<Response | undefined> {
        const { email, password } = req.body;

        if(!password){
            return this.sendErrorResponse(res,{code: 401, message: 'informe uma senha'});
        }


        const user = await User.findOne({ email: email });

        if (!user) {
            return this.sendErrorResponse(res, {
                code: 401,
                message: 'User not found!',
            });
        }


        if (!(await AuthService.comparePasswords(password, user.password))) {
            return this.sendErrorResponse(res, {
                code: 401,
                message: 'Password doesn`t match!',
            });
        }

        const token = AuthService.generateToken(user.toJSON());
        return res.status(200).send({ token: token });
    }

    @Get('me')
    @Middleware(authMiddleware)
    public async me(req: Request, res: Response): Promise<Response> {
        const email = req.decoded ? req?.decoded?.email : undefined;
        const user = await User.findOne({ email });
        if (!user) {
            return this.sendErrorResponse(res, {
                code: 404,
                message: 'User not found',
            });
        }

        return res.send({ user });
    }
}
