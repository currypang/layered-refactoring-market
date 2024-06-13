import { MESSAGES } from '../constants/message.constant.js';
import { USER_CONS } from '../constants/user.constant.js';
import { HttpError } from '../errors/http.error.js';

export class ResumesService {
  constructor(resumesRepository) {
    this.resumesRepository = resumesRepository;
  }
  // 이력서 생성 로직
  createResume = async (title, content, userId) => {
    const resume = await this.resumesRepository.createResume(title, content, userId);
    return resume;
  };

  // 이력서 목록 조회 로직
  getAllResumes = async (id, role, sort, status) => {
    const condition = {
      ...(role !== USER_CONS.RECRUITER && { authorId: id }),
      ...(status && { status }),
    };
    let resumeList = await this.resumesRepository.getAllResumes(condition, sort);

    resumeList = resumeList.map((resume) => {
      return {
        id: resume.id,
        authorName: resume.author.name,
        title: resume.title,
        content: resume.content,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
    });
    return resumeList;
  };

  // 이력서 상세 조회 로직
  getResume = async (id, role, authorId) => {
    const condition = {
      ...(role !== USER_CONS.RECRUITER && { authorId }),
      ...{ id: +id },
    };
    let resume = await this.resumesRepository.getResume(condition);
    if (!resume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    resume = {
      id: resume.id,
      authorName: resume.author.name,
      title: resume.title,
      content: resume.content,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
    return resume;
  };
  // 이력서 수정 로직
  updateResume = async (id, authorId, title, content) => {
    const condition = { id, authorId };
    const resume = await this.resumesRepository.getResume(condition);

    if (!resume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    const updatedContent = {
      title: title || resume.title,
      content: content || resume.content,
    };
    const updatedResume = await this.resumesRepository.updateResume(condition, updatedContent);

    return updatedResume;
  };

  // 이력서 삭제 로직
  deleteResume = async (id, authorId) => {
    const condition = { id, authorId };
    const resume = await this.resumesRepository.getResume(condition);

    if (!resume) {
      throw new HttpError.NotFound(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
    const deletedResume = await this.resumesRepository.deleteResume(condition);
    return deletedResume;
  };
}
