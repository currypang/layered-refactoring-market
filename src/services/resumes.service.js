import { USER_CONS } from '../constants/user.constant.js';

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
}
