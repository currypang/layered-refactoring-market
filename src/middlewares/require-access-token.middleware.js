import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { ENV_CONS } from '../constants/env.constant.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { UsersRepository } from '../repositories/users.repository.js';

const usersRopository = new UsersRepository(prisma);

// accessToken 인증 미들웨어
export const validateAccessToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN });
    }
    const [tokenType, accessToken] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE });
    }
    if (!accessToken) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.COMMON.JWT.NO_TOKEN });
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, ENV_CONS.ACCESS_TOKEN_KEY);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.COMMON.JWT.EXPIRED });
      } else {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.COMMON.JWT.INVALID });
      }
    }
    // 유저 DB에 접근하는 usersRopository 클래스 메서드를 통해 쿼리하도록 리팩토링
    const user = await usersRopository.findUserById(decodedToken.id);
    if (!user) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ status: HTTP_STATUS.UNAUTHORIZED, message: MESSAGES.AUTH.COMMON.JWT.NO_USER });
    }
    // 인증 통과 시 비밀번호 제외 후 유저 정보를 req.user에 담아 넘겨주기.
    delete user.password;
    req.user = user;
    return next();
  } catch (err) {
    next(err);
  }
};
