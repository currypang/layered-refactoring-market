import bcrypt from 'bcrypt';
import { ENV_CONS } from '../constants/env.constant.js';

export class AuthService {
  // userRepository를 통해 DB에 접근
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  signUpUser = async (email, name, password) => {
    const existUser = await this.userRepository.findUserByEmail(email);

    if (existUser) {
      throw new Error('existUser');
    }
    const hashedPassword = await bcrypt.hash(password, +ENV_CONS.BCRYPT_ROUND);
    const createdUser = await this.userRepository.createUser(email, name, hashedPassword);
    // 비밀번호 제외한 나머지 정보 controller에 전달
    delete createdUser.password;
    return createdUser;
  };
}
