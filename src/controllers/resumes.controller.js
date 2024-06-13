import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class ResumesController {
  constructor(resumesService) {
    this.resumesService = resumesService;
  }
  createResume = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.id;

      const resume = await this.resumesService.createResume(title, content, userId);
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.CREATE.SUCCEED, data: resume });
    } catch (err) {
      next(err);
    }
  };
}
