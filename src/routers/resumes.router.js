import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { USER_CONS } from '../constants/user.constant.js';
import { createResumeValidator } from '../middlewares/validators/create-resume.validator.middleware.js';
import { updateResumeStatusValidator } from '../middlewares/validators/update-resume-status.validator.middleware.js';
import { updateResumeValidator } from '../middlewares/validators/updated-resume-validator.middleware.js';
import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';
import { ResumesController } from '../controllers/resumes.controller.js';
import { ResumesService } from '../services/resumes.service.js';
import { ResumesRepository } from '../repositories/resumes.repository.js';

const resumesRouter = express.Router();
const resumesRepository = new ResumesRepository(prisma);
const resumesService = new ResumesService(resumesRepository);
const resumesController = new ResumesController(resumesService);

// 이력서 생성 API
resumesRouter.post('/', createResumeValidator, resumesController.createResume);
// 이력서 목록 조회 API
resumesRouter.get('/list', resumesController.getAllResumes);
// 이력서 상세 조회 API
resumesRouter.get('/:id', resumesController.getResume);
// 이력서 수정 API
resumesRouter.put('/:id', updateResumeValidator, resumesController.updateResume);
// 이력서 삭제 API
resumesRouter.delete('/:id', resumesController.deleteResume);
// 이력서 지원 상태 변경 API
resumesRouter.patch(
  '/:id/status',
  requireRoles(USER_CONS.RECRUITER),
  updateResumeStatusValidator,
  resumesController.updateStatus,
);
// 이력서 로그 목록 조회 API, accessToken 미들웨어, 역할 인증 미들웨어로 인증
resumesRouter.get('/:id/logs', requireRoles(USER_CONS.RECRUITER), async (req, res, next) => {
  try {
    const id = +req.params.id;
    let data = await prisma.resumeLog.findMany({
      where: {
        resumeId: id,
      },
      include: {
        recruiter: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    data = data.map((log) => {
      return {
        id: log.id,
        recruiterName: log.recruiter.name,
        resumeId: log.resumeId,
        oldStatus: log.oldStatus,
        newStatus: log.newStatus,
        reason: log.reason,
        createdAt: log.createdAt,
      };
    });

    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.LOG.SUCCEED,
      data,
    });
  } catch (err) {
    next(err);
  }
});

export { resumesRouter };
