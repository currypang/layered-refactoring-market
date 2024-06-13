export class ResumesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 이력서 생성
  createResume = async (title, content, userId) => {
    const resume = await this.prisma.resume.create({
      data: {
        authorId: userId,
        title,
        content,
      },
    });
    return resume;
  };
  // 이력서 목록 조회
  getAllResumes = async (condition, sort) => {
    const resumeList = await this.prisma.resume.findMany({
      where: condition,
      orderBy: { createdAt: sort },
      include: {
        author: true,
      },
    });
    return resumeList;
  };
  // 이력서 상세 조회
  getResume = async (condition) => {
    const resume = await this.prisma.resume.findFirst({
      where: condition,
      include: {
        author: true,
      },
    });
    return resume;
  };
  // 이력서 수정
  updateResume = async (condition, updatedContent) => {
    const updatedResume = await this.prisma.resume.update({
      where: condition,
      data: updatedContent,
    });
    return updatedResume;
  };
}
