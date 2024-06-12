import express from 'express';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
import { UsersController } from '../controllers/users.controller.js';

const userRouter = express.Router();
// userRepository는 validateAccessToken에서 사용하여 제외
const usersController = new UsersController();

userRouter.get('/me', validateAccessToken, usersController.getUser);

export { userRouter };
