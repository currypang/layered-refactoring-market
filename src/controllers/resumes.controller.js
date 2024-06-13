import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

export class ResumesController {
  constructor(resumesService) {
    this.resumesService = resumesService;
  }
  // 이력서 생성
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
  // 이력서 목록 조회
  getAllResumes = async (req, res, next) => {
    try {
      const { id, role } = req.user;
      const sort = req.query.sort?.toLocaleLowerCase() === 'asc' ? 'asc' : 'desc';
      const status = req.query.status || '';

      const resumeList = await this.resumesService.getAllResumes(id, role, sort, status);
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.READ_LIST.SUCCEED, data: resumeList });
    } catch (err) {
      next(err);
    }
  };
}
