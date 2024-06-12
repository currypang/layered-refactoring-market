import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class UsersController {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  getUser = async (req, res, next) => {
    const user = req.user;
    try {
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.USERS.READ_ME.SUCCEED, data: user });
    } catch (err) {
      next(err);
    }
  };
}
