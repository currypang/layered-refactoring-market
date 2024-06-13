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
  // 이력서 상세 조회
  getResume = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { role } = req.user;
      const authorId = req.user.id;

      const resume = await this.resumesService.getResume(id, role, authorId);
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED, data: resume });
    } catch (err) {
      next(err);
    }
  };
  // 이력서 수정
  updateResume = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const authorId = req.user.id;
      const { title, content } = req.body;

      const updatedResume = await this.resumesService.updateResume(id, authorId, title, content);

      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.UPDATE.SUCCEED, data: updatedResume });
    } catch (err) {
      next(err);
    }
  };
  // 이력서 삭제
  deleteResume = async (req, res, next) => {
    try {
      const id = +req.params.id;
      const authorId = req.user.id;

      const deletedResume = await this.resumesService.deleteResume(id, authorId);
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.DELETE.SUCCEED, data: { id: deletedResume.id } });
    } catch (err) {
      next(err);
    }
  };
  // 이력서 지원 상태 변경
  updateStatus = async (req, res, next) => {
    try {
      // 전달받은 이력서 ID, 역할, 수정할 상태와 사유.
      const id = +req.params.id;
      const recruiterId = req.user.id;
      const { status, reason } = req.body;

      const data = await this.resumesService.updateStatus(id, recruiterId, status, reason);
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.UPDATE.STATUS.SUCCEED, data });
    } catch (err) {
      next(err);
    }
  };
  // 이력서 로그 목록 조회
  getResumeLogs = async (req, res, next) => {
    try {
      const id = +req.params.id;

      const logList = await this.resumesService.getResumeLogs(id);
      return res
        .status(HTTP_STATUS.OK)
        .json({ status: HTTP_STATUS.OK, message: MESSAGES.RESUMES.READ_LIST.LOG.SUCCEED, data: logList });
    } catch (err) {
      next(err);
    }
  };
}
