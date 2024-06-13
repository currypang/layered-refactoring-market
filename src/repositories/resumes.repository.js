export class ResumesRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
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
}
