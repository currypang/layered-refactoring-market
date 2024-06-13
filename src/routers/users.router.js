import express from 'express';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
import { UsersController } from '../controllers/users.controller.js';

const userRouter = express.Router();
// userRepository는 내정보 조회 API에서 validateAccessToken로만 처리 가능하여 제외
const usersController = new UsersController();

// 내 정보 조회 API
userRouter.get('/me', validateAccessToken, usersController.getUser);

export { userRouter };
