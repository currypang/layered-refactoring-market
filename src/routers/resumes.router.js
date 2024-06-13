import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { USER_CONS } from '../constants/user.constant.js';
import { createResumeValidator } from '../middlewares/validators/create-resume.validator.middleware.js';
import { updateResumeStatusValidator } from '../middlewares/validators/update-resume-status.validator.middleware.js';
import { updateResumeValidator } from '../middlewares/validators/updated-resume-validator.middleware.js';
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
// 이력서 로그 목록 조회 API,
resumesRouter.get('/:id/logs', requireRoles(USER_CONS.RECRUITER), resumesController.getResumeLogs);

export { resumesRouter };
