import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';
import { ENV_CONS } from '../constants/env.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { UsersRepository } from '../repositories/users.repository.js';
import { HttpError } from '../errors/http.error.js';

const usersRopository = new UsersRepository(prisma);

// accessToken 인증 미들웨어
export const validateAccessToken = async (req, res, next) => {
  try {
    // accessToken 받아오기
    const { authorization } = req.headers;
    if (!authorization) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);
    }
    // JWT 표준 인증 형태와 일치하지 않는 경우
    const [tokenType, accessToken] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NOT_SUPPORTED_TYPE);
    }
    // accessToken 없는경우
    if (!accessToken) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_TOKEN);
    }
    let decodedToken;
    //jwt.verify 함수를 통해 자체적으로 에러처리가 가능해서 따로 try, catch문 사용
    try {
      decodedToken = jwt.verify(accessToken, ENV_CONS.ACCESS_TOKEN_KEY);
    } catch (err) {
      // refreshToken 유효기간이 지난경우
      // npm JWT 에러 문서의 TokenExpiredError 사용함. if (err instanceof jwt.TokenExpiredError)도 사용가능,
      if (err.name === 'TokenExpiredError') {
        throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.EXPIRED);
      } else {
        // 나머지 두 JsonWebTokenError, NotBeforeError 의 경우.
        throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.INVALID);
      }
    }
    // 유저 DB에 접근하는 usersRopository 클래스 메서드를 통해 쿼리하도록 리팩토링
    const user = await usersRopository.findUserById(decodedToken.id);
    if (!user) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.JWT.NO_USER);
    }
    // 인증 통과 시 비밀번호 제외 후 유저 정보를 req.user에 담아 넘겨주기.
    delete user.password;
    req.user = user;
    return next();
  } catch (err) {
    next(err);
  }
};
