import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { validateRefreshToken } from '../middlewares/require-refresh-token-middleware.js';
import { signUpValidator } from '../middlewares/validators/sign-up.validator.middleware.js';
import { signInValidator } from '../middlewares/validators/sign-in.validator.middleware.js';
import { ENV_CONS } from '../constants/env.constant.js';
import { AUTH_CONS } from '../constants/auth.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { UsersRepository } from '../repositories/users.repository.js';

const authRouter = express.Router();

const usersRepository = new UsersRepository(prisma);
const authService = new AuthService(usersRepository);
const authController = new AuthController(authService);

// 회원가입 API, joi 미들웨어로 유효성 검사, 에러 미들웨어로 에러처리
authRouter.post('/sign-up', signUpValidator, authController.signUpUser);
authRouter.post('/sign-in', signInValidator, authController.signInUser);

// 토큰 재발급 API, refreshToken 인증 미들웨어 사용
authRouter.post('/refresh', validateRefreshToken, async (req, res, next) => {
  try {
    const user = req.user;
    const payload = { id: user.id };
    // 토큰 발급
    const data = await generateAuthTokens(payload);

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.TOKEN.SUCCEED,
      data,
    });
  } catch (err) {
    next(err);
  }
});

// 로그아웃 API, refreshToken 인증 미들웨어 사용
authRouter.post('/sign-out', validateRefreshToken, async (req, res, next) => {
  try {
    const user = req.user;
    await prisma.refreshToken.update({
      where: { userId: user.id },
      data: {
        refreshToken: null,
      },
    });

    //아래처럼 삭제해도 됨
    // const deletedToken = await prisma.refreshToken.delete({
    //   where: {
    //     userId: user.id,
    //   },
    //   select: {
    //     userId: true,
    //   },
    // });

    return res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
      data: { id: user.id },
    });
  } catch (err) {
    next(err);
  }
});

const generateAuthTokens = async (payload) => {
  const userId = payload.id;
  const accessToken = jwt.sign(payload, ENV_CONS.ACCESS_TOKEN_KEY, {
    expiresIn: AUTH_CONS.ACCESS_EXPIRE_TIME,
  });
  const refreshToken = jwt.sign(payload, ENV_CONS.REFRESH_TOKEN_KEY, {
    expiresIn: AUTH_CONS.REFRESH_EXPIRE_TIME,
  });
  // 리프레쉬 토큰 해쉬한번 더하기, soltround는 숫자여야함
  const hashedRefreshToken = bcrypt.hashSync(refreshToken, ENV_CONS.BCRYPT_ROUND);

  // 서버에 refreshToken 저장
  await prisma.refreshToken.upsert({
    where: { userId },
    update: { refreshToken: hashedRefreshToken },
    create: { userId, refreshToken: hashedRefreshToken },
  });
  return { accessToken, refreshToken };
};

// export 방법 바꿔 보기
export { authRouter };
