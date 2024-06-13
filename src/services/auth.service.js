import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONS } from '../constants/auth.constant.js';
import { ENV_CONS } from '../constants/env.constant.js';
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class AuthService {
  // userRepository를 통해 DB에 접근
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  // 회원 가입 로직
  signUpUser = async (email, name, password) => {
    const condition = { email };
    const existUser = await this.usersRepository.findUser(condition);

    if (existUser) {
      // 생성된 HttpError.Conflict 인스턴스가 controller catch문의 err로 전달됨
      // 메시지 넣지 않으면 message = Conflict.name으로 설정해 둔 Conflict 출력
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }
    const hashedPassword = await bcrypt.hash(password, +ENV_CONS.BCRYPT_ROUND);
    const createdUser = await this.usersRepository.createUser(email, name, hashedPassword);
    // 비밀번호 제외한 나머지 정보 controller에 전달
    delete createdUser.password;
    return createdUser;
  };
  // 로그인 로직
  signInUser = async (email, password) => {
    const condition = { email };
    const user = await this.usersRepository.findUser(condition);
    //이메일로 조회되지 않거나 비밀번호가 일치하지 앟는 경우
    const isValidUser = user && (await bcrypt.compare(password, user.password));
    if (!isValidUser) {
      throw new HttpError.Unauthorized(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }
    // accessToken 생성
    const accessToken = jwt.sign({ id: user.id }, ENV_CONS.ACCESS_TOKEN_KEY, {
      expiresIn: AUTH_CONS.ACCESS_EXPIRE_TIME,
    });

    // refreshToken 생성
    const refreshToken = jwt.sign({ id: user.id }, ENV_CONS.REFRESH_TOKEN_KEY, {
      expiresIn: AUTH_CONS.REFRESH_EXPIRE_TIME,
    });
    // 리프레쉬 토큰 해쉬한번 더하기
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, ENV_CONS.BCRYPT_ROUND);
    await this.usersRepository.upsertRefreshToken(user.id, hashedRefreshToken);
    return { accessToken, refreshToken };
  };

  // 토큰 재발급 로직
  reNewToken = async (user) => {
    // accessToken 생성
    const accessToken = jwt.sign({ id: user.id }, ENV_CONS.ACCESS_TOKEN_KEY, {
      expiresIn: AUTH_CONS.ACCESS_EXPIRE_TIME,
    });

    // refreshToken 생성
    const refreshToken = jwt.sign({ id: user.id }, ENV_CONS.REFRESH_TOKEN_KEY, {
      expiresIn: AUTH_CONS.REFRESH_EXPIRE_TIME,
    });
    // 리프레쉬 토큰 해쉬한번 더하기
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, ENV_CONS.BCRYPT_ROUND);
    await this.usersRepository.upsertRefreshToken(user.id, hashedRefreshToken);
    return { accessToken, refreshToken };
  };
  // 로그 아웃 로직
  signOut = async (userId) => {
    const deletedUser = await this.usersRepository.deleteRefreshToken(userId);
    console.log(deletedUser);
    return deletedUser.userId;
  };
}
