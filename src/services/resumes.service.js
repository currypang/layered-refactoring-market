export class ResumesService {
  constructor(resumesRepository) {
    this.resumesRepository = resumesRepository;
  }
  createResume = async (title, content, userId) => {
    const resume = await this.resumesRepository.createResume(title, content, userId);
    return resume;
  };
}
