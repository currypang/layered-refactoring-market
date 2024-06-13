import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumesService } from '../../../src/services/resumes.service.js';
import { dummyResumes } from '../../dummies/resume.dummy.js';
import { USER_CONS } from '../../../src/constants/user.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

const mockResumesRepository = {
  createResume: jest.fn(),
  getAllResumes: jest.fn(),
  getResume: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
  updateStatus: jest.fn(),
  getResumeLogs: jest.fn(),
};

const resumesService = new ResumesService(mockResumesRepository);

describe('resumesService Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });
  // 이력서 생성 로직 테스트
  test('createResume Method', async () => {
    // GIVEN
    const { title, content, authorId } = dummyResumes[0];
    const expectedResult = { id: 1, title, content, authorId };
    mockResumesRepository.createResume.mockReturnValue(expectedResult);
    // WHEN
    const createdResume = await resumesService.createResume(title, content, authorId);
    // THEN
    expect(mockResumesRepository.createResume).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.createResume).toHaveBeenCalledWith(title, content, authorId);
    expect(createdResume).toEqual(expectedResult);
  });
  // 이력서 목록 조회 로직 테스트 - 지원자
  test('getAllResumes Method', async () => {
    // GIVEN
    const id = 1;
    const role = USER_CONS.APPLICANT;
    const sort = 'desc';
    const status = 'APPLY';
    const expectedResult = [dummyResumes[1], dummyResumes[5]];
    mockResumesRepository.getAllResumes.mockReturnValue(expectedResult);
    // WHEN
    const resumeList = await resumesService.getAllResumes(id, role, sort, status);
    // THEN
    expect(mockResumesRepository.getAllResumes).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getAllResumes).toHaveBeenCalledWith({ authorId: id, status }, sort);
    expect(resumeList).toEqual(
      expectedResult.map((resume) => {
        return {
          id: resume.id,
          authorName: resume.author.name,
          title: resume.title,
          content: resume.content,
          status: resume.status,
          createdAt: resume.createdAt,
          updatedAt: resume.updatedAt,
        };
      }),
    );
  });
  // 이력서 목록 조회 로직 테스트- 리크루터
  test('getAllResumes Method Recruiter', async () => {
    // GIVEN
    const id = 100;
    const role = USER_CONS.RECRUITER;
    const sort = 'desc';
    const status = 'APPLY';
    const expectedResult = [dummyResumes[1], dummyResumes[3], dummyResumes[5]];
    mockResumesRepository.getAllResumes.mockReturnValue(expectedResult);

    // WHEN
    const resumeList = await resumesService.getAllResumes(id, role, sort, status);
    // THEN
    expect(mockResumesRepository.getAllResumes).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getAllResumes).toHaveBeenCalledWith({ status }, sort);
    expect(resumeList).toEqual(
      expectedResult.map((resume) => {
        return {
          id: resume.id,
          authorName: resume.author.name,
          title: resume.title,
          content: resume.content,
          status: resume.status,
          createdAt: resume.createdAt,
          updatedAt: resume.updatedAt,
        };
      }),
    );
  });
  // 이력서 상세 조회 로직 테스트 - 지원자
  test('getResume Method', async () => {
    // GIVEN
    const { id, authorId } = dummyResumes[1];
    const role = USER_CONS.APPLICANT;
    const expectedResult = dummyResumes[1];
    const convertedResult = {
      id: expectedResult.id,
      authorName: expectedResult.author.name,
      title: expectedResult.title,
      content: expectedResult.content,
      status: expectedResult.status,
      createdAt: expectedResult.createdAt,
      updatedAt: expectedResult.updatedAt,
    };
    mockResumesRepository.getResume.mockReturnValue(expectedResult);
    // WHEN
    const resume = await resumesService.getResume(id, role, authorId);
    // THEN
    expect(mockResumesRepository.getResume).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getResume).toHaveBeenCalledWith({ authorId, id });
    expect(resume).toEqual(convertedResult);
  });
  // 이력서 상세 조회 로직 테스트 - 리크루터
  test('updateResume Method', async () => {
    // GIVEN
    const { id, authorId } = dummyResumes[1];
    const role = USER_CONS.RECRUITER;
    const expectedResult = dummyResumes[1];
    const convertedResult = {
      id: expectedResult.id,
      authorName: expectedResult.author.name,
      title: expectedResult.title,
      content: expectedResult.content,
      status: expectedResult.status,
      createdAt: expectedResult.createdAt,
      updatedAt: expectedResult.updatedAt,
    };
    mockResumesRepository.getResume.mockReturnValue(expectedResult);
    // WHEN
    const resume = await resumesService.getResume(id, role, authorId);
    // THEN
    expect(mockResumesRepository.getResume).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getResume).toHaveBeenCalledWith({ id });
    expect(resume).toEqual(convertedResult);
  });
  // 이력서 수정 로직 테스트
  test('updateResume Method', async () => {
    // GIVEN
    const { id, authorId } = dummyResumes[1];
    const title = '수정된 이력서';
    const content = '수정된 내용';
    const existingResume = dummyResumes[1];
    const updatedResume = { ...existingResume, title, content };
    mockResumesRepository.getResume.mockReturnValue(existingResume);
    mockResumesRepository.updateResume.mockReturnValue(updatedResume);
    // WHEN
    const resume = await resumesService.updateResume(id, authorId, title, content);
    // THEN
    expect(mockResumesRepository.getResume).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getResume).toHaveBeenCalledWith({ id, authorId });
    expect(mockResumesRepository.updateResume).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.updateResume).toHaveBeenCalledWith({ id, authorId }, { title, content });
    expect(resume).toEqual(updatedResume);
  });
  // 이력서 삭제 로직 테스트
  test('deleteResume Method', async () => {
    // GIVEN
    const { id, authorId } = dummyResumes[1];
    const existingResume = dummyResumes[1];
    mockResumesRepository.getResume.mockReturnValue(existingResume);
    mockResumesRepository.deleteResume.mockReturnValue(existingResume);
    // WHEN
    const deletedResume = await resumesService.deleteResume(id, authorId);
    // THEN
    expect(mockResumesRepository.getResume).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getResume).toHaveBeenCalledWith({ id, authorId });
    expect(mockResumesRepository.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getResume).toHaveBeenCalledWith({ id, authorId });
    expect(deletedResume).toEqual(existingResume);
  });

  // 이력서 삭제 로직 에러 테스트 - 이력서 없는 경우
  test('deleteResume Method Error', async () => {
    // GIVEN
    const { id, authorId } = dummyResumes[1];
    mockResumesRepository.getResume.mockReturnValue(null);
    try {
      // WHEN
      await resumesService.deleteResume(id, authorId);
    } catch (err) {
      // THEN
      expect(mockResumesRepository.getResume).toHaveBeenCalledTimes(1);
      expect(mockResumesRepository.getResume).toHaveBeenCalledWith({ id, authorId });
      expect(mockResumesRepository.deleteResume).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual(MESSAGES.RESUMES.COMMON.NOT_FOUND);
    }
  });

  // 이력서 상태 변경 로직 테스트
  test('updateStatus Method', async () => {
    // GIVEN
    const { id, status: oldStatus } = dummyResumes[1];
    const recruiterId = 100;
    const newStatus = 'INTERVIEW';
    const reason = '코딩테스트 합격';
    const existingResume = dummyResumes[1];
    const createdLog = { id, recruiterId, resumeId: id, oldStatus, newStatus, reason };
    mockResumesRepository.getResume.mockReturnValue(existingResume);
    mockResumesRepository.updateStatus.mockReturnValue(createdLog);
    // WHEN
    const log = await resumesService.updateStatus(id, recruiterId, newStatus, reason);
    // THEN
    expect(mockResumesRepository.getResume).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getResume).toHaveBeenCalledWith({ id });
    expect(mockResumesRepository.updateStatus).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.updateStatus).toHaveBeenCalledWith(id, recruiterId, newStatus, oldStatus, reason);
    expect(log).toEqual(createdLog);
  });
  // 이력서 로그 목록 조회 로직 테스트
  test('getResumeLogs Method', async () => {
    // GIVEN
    const currentDate = new Date();
    const id = 1;
    const expectedResult = [
      {
        id: 2,
        recruiterId: 1,
        resumeId: 3,
        oldStatus: 'PASS',
        newStatus: 'INTERVIEW2',
        reason: '코테2 통과',
        createdAt: currentDate,
        recruiter: {
          id: 1,
          name: '포포비치',
          role: 'RECRUITER',
          createdAt: currentDate,
        },
      },
    ];
    mockResumesRepository.getResumeLogs.mockReturnValue(expectedResult);
    // WHEN
    const logs = await resumesService.getResumeLogs(id);
    // THEN
    expect(mockResumesRepository.getResumeLogs).toHaveBeenCalledTimes(1);
    expect(mockResumesRepository.getResumeLogs).toHaveBeenCalledWith(id);
    expect(logs).toEqual(
      expectedResult.map((log) => {
        return {
          id: log.id,
          recruiterName: log.recruiter.name,
          resumeId: log.resumeId,
          oldStatus: log.oldStatus,
          newStatus: log.newStatus,
          reason: log.reason,
          createdAt: log.createdAt,
        };
      }),
    );
  });
});
