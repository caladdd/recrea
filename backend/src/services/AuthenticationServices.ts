
import {Express, Request, Response} from 'express';
import ResponseOperation from '../helpers/ResponseOperation';
import { IUser, IUserController, IUserPrototype, IAuthenticationController } from '../interfaces/UserInterfaces';
import { HttpCode } from '../helpers/HttpCodes';
import AuthenticationControllerMongo from '../controllers/AuthenticationControllerMongo';

export default class AuthenticationServices {

    public static routes(app: Express){
        app.post('/api/user/signin', (req: Request, res: Response) => {
            try {
                this.signin(req, res);
            } catch (e){
                return this.response(res, new ResponseOperation<IUser>(false, HttpCode.BAD_REQUEST, null, {msf: 'Incorrect params'}));
            }
        });

        app.put('/api/user/signout', (req: Request, res: Response) => {
            try {
                this.signout(req, res);
            } catch (e){
                return this.response(res, new ResponseOperation<IUser>(false, HttpCode.BAD_REQUEST, null, {msf: 'Incorrect params'}));
            }
        });
    }

    private static signin(req: Request, res: Response){
        const controller: IAuthenticationController = new AuthenticationControllerMongo();

        const userData: IUserPrototype = {
            email: req.body.email,
            password: req.body.password
        }
        controller.signIn(userData)
        .then((result) => this.response(res, result))
        .catch((result) => this.response(res, result));
    }

    private static signout(req: Request, res: Response){
        const controller: IAuthenticationController = new AuthenticationControllerMongo();

        const userData: IUserPrototype = {
            email: req.body.email
        }
        controller.signOut(userData, '')
        .then((result) => this.response(res, result))
        .catch((result) => this.response(res, result));
    }

    private static response(res: Response, result: ResponseOperation<any>){
        res.status(result.statusCode).json(result);
    }
}