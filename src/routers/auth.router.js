import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { validateRefreshToken } from '../middlewares/require-refresh-token-middleware.js';
import { signUpValidator } from '../middlewares/validators/sign-up.validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in.validator.middleware.js';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { UsersRepository } from '../repositories/users.repository.js';

const authRouter = express.Router();
const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

// 회원가입 API
authRouter.post('/sign-up', signUpValidator, authController.signUpUser);
// 로그인 API
authRouter.post('/sign-in', signInValidator, authController.signInUser);
// 토큰 재발급 API
authRouter.post('/refresh', validateRefreshToken, authController.reNewToken);
// 로그아웃 API
authRouter.post('/sign-out', validateRefreshToken, authController.signOut);

export { authRouter };
