import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }
  signUpUser = async (req, res, next) => {
    try {
      const { email, name, password } = req.body;
      const createdUser = await this.authService.signUpUser(email, name, password);

      return res
        .status(HTTP_STATUS.CREATED)
        .json({ status: HTTP_STATUS.CREATED, message: MESSAGES.AUTH.SIGN_UP.SUCCEED, data: createdUser });
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  };
}
