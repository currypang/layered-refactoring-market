import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  // 회원 가입
  signUpUser = async (req, res, next) => {
    try {
      const { email, name, password } = req.body;
      const createdUser = await this.authService.signUpUser(email, name, password);
      return res
        .status(HTTP_STATUS.CREATED)
        .json({ status: HTTP_STATUS.CREATED, message: MESSAGES.AUTH.SIGN_UP.SUCCEED, data: createdUser });
    } catch (err) {
      next(err);
    }
  };
  // 로그인
  signInUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const tokens = await this.authService.signInUser(email, password);

      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_IN.SUCCEED, data: tokens });
    } catch (err) {
      next(err);
    }
  };
  // 토큰 재발급
  reNewToken = async (req, res, next) => {
    try {
      const user = req.user;
      const tokens = await this.authService.reNewToken(user);
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.TOKEN.SUCCEED, data: tokens });
    } catch (err) {
      next(err);
    }
  };
  // 로그 아웃
  signOut = async (req, res, next) => {
    try {
      const user = req.user;
      const deletedUserId = await this.authService.signOut(user.id);
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.AUTH.SIGN_OUT.SUCCEED, data: { id: deletedUserId } });
    } catch (err) {
      next(err);
    }
  };
}
