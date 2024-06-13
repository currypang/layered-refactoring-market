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
}
