import bcrypt from 'bcrypt';
import { ENV_CONS } from '../constants/env.constant.js';
import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

export class AuthService {
  // userRepository를 통해 DB에 접근
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  signUpUser = async (email, name, password) => {
    const existUser = await this.userRepository.findUserByEmail(email);

    if (existUser) {
      // 생성된 HttpError.Conflict 인스턴스가 controller catch문의 err로 전달됨
      // 메시지 넣지 않으면 message = Conflict.name으로 설정해 둔 Conflict 출력
      throw new HttpError.Conflict(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }
    const hashedPassword = await bcrypt.hash(password, +ENV_CONS.BCRYPT_ROUND);
    const createdUser = await this.userRepository.createUser(email, name, hashedPassword);
    // 비밀번호 제외한 나머지 정보 controller에 전달
    delete createdUser.password;
    return createdUser;
  };
}
