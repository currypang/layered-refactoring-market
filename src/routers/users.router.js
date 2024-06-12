import express from 'express';
import { validateAccessToken } from '../middlewares/require-access-token.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { prisma } from '../utils/prisma.util.js';
import { UsersController } from '../controllers/users.controller.js';
import { UsersRepository } from '../repositories/users.repository.js';

const userRouter = express.Router();

const usersRopository = new UsersRepository(prisma);
const usersController = new UsersController(usersRopository);

userRouter.get('/me', validateAccessToken, usersController.getUser);

// // 내 정보 조회 API, accessToken 인증 미들웨어 사용.
// userRouter.get('/me', validateAccessToken, async (req, res, next) => {
//   try {
//     // validateAccessToken 에서 password 제외 후 유저정보 전달하게 리팩토링. 아래 코드 필요 없음.
//     // const { password, ...withoutPassword } = req.user;
//     const data = req.user;
//     return res.status(HTTP_STATUS.OK).json({ status: HTTP_STATUS.OK, message: MESSAGES.USERS.READ_ME.SUCCEED, data });
//   } catch (err) {
//     next(err);
//   }
// });

export { userRouter };
