import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { ResumesRepository } from '../../../src/repositories/resumes.repository.js';
import { dummyResumes } from '../../dummies/resume.dummy.js';

const mockPrisma = {
  resume: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  resumeLog: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

const resumesRepository = new ResumesRepository(mockPrisma);

describe('resumesRepository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });
  // 이력서 생성 테스트
  test('createResume Method', async () => {
    // GIVEN
    const currentDate = new Date();
    const { title, content, authorId } = dummyResumes[0];
    const expectedResult = {
      id: 7,
      authorId,
      title,
      content,
      status: 'APPLY',
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    mockPrisma.resume.create.mockReturnValue(expectedResult);
    // WHEN
    const resume = await resumesRepository.createResume(title, content, authorId);
    // THEN
    expect(mockPrisma.resume.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resume.create).toHaveBeenCalledWith({
      data: {
        authorId,
        title,
        content,
      },
    });
    expect(resume).toEqual(expectedResult);
  });
  // 이력서 목록 조회 테스트
  test('getAllResumes Method', async () => {
    // GIVEN
    const condition = { authorId: 1 };
    const sort = 'desc';
    const expectedResult = dummyResumes.filter((el) => el.authorId === 1);
    mockPrisma.resume.findMany.mockReturnValue(expectedResult);
    // WHEN
    const resumeList = await resumesRepository.getAllResumes(condition, sort);
    // THEN
    expect(mockPrisma.resume.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resume.findMany).toHaveBeenCalledWith({
      where: condition,
      orderBy: { createdAt: sort },
      include: {
        author: true,
      },
    });
    expect(resumeList).toEqual(expectedResult);
  });

  // 이력서 상세 조회 테스트
  test('getResume Method', async () => {
    // GIVEN
    const condition = { authorId: 1, id: 2 };
    const expectedResult = dummyResumes.find((el) => el.authorId === 1 && el.id === 2);
    mockPrisma.resume.findUnique.mockReturnValue(expectedResult);
    // WHEN
    const resume = await resumesRepository.getResume(condition);
    // THEN
    expect(mockPrisma.resume.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resume.findUnique).toHaveBeenCalledWith({
      where: condition,
      include: {
        author: true,
      },
    });
    expect(resume).toEqual(expectedResult);
  });
  // 이력서 수정 테스트
  test('updateResume Method', async () => {
    // GIVEN
    const condition = { id: 1 };
    const updatedContent = { title: 'Updated Title', content: 'Updated Content' };
    const expectedResult = { ...dummyResumes[1], ...updatedContent };
    mockPrisma.resume.update.mockReturnValue(expectedResult);
    // WHEN
    const resume = await resumesRepository.updateResume(condition, updatedContent);
    // THEN
    expect(mockPrisma.resume.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resume.update).toHaveBeenCalledWith({
      where: condition,
      data: updatedContent,
    });
    expect(resume).toEqual(expectedResult);
  });
  // 이력서 삭제 테스트
  test('deleteResume Method', async () => {
    // GIVEN
    const condition = { id: 1 };
    mockPrisma.resume.delete.mockReturnValue(dummyResumes[1]);
    // WHEN
    const deletedResume = await resumesRepository.deleteResume(condition);
    // THEN
    expect(mockPrisma.resume.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resume.delete).toHaveBeenCalledWith({
      where: condition,
    });
    expect(deletedResume).toEqual(dummyResumes[1]);
  });
  // 이력서 상태 변경 테스트
  test('updateStatus Method', async () => {
    // GIVEN
    const currentDate = new Date();
    const id = 1;
    const recruiterId = 1;
    const newStatus = 'PASS';
    const oldStatus = 'APPLY';
    const reason = 'Review passed';
    const log = {
      id: 1,
      recruiterId,
      resumeId: id,
      oldStatus,
      newStatus,
      reason,
      createdAt: currentDate,
    };
    mockPrisma.resume.update.mockReturnValue({});
    mockPrisma.resumeLog.create.mockReturnValue(log);
    // mockImplementation 사용하여 트랜잭션 함수가 mockPrisma.resume, mockPrisma.resumeLog 호출
    mockPrisma.$transaction.mockImplementation(async (fn) => {
      return await fn({
        resume: mockPrisma.resume,
        resumeLog: mockPrisma.resumeLog,
      });
    });
    // WHEN
    const createdLog = await resumesRepository.updateStatus(id, recruiterId, newStatus, oldStatus, reason);
    // THEN
    expect(mockPrisma.resume.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumeLog.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumeLog.create).toHaveBeenCalledWith({
      data: {
        recruiterId,
        resumeId: id,
        oldStatus,
        newStatus,
        reason,
      },
    });
    expect(createdLog).toEqual(log);
  });
  // 이력서 로그 목록 조회 테스트
  test('getResumeLogs Method', async () => {
    // GIVEN
    const currentDate = new Date();
    const id = 1;
    const logs = [
      {
        id: 1,
        recruiterId: 1,
        resumeId: id,
        oldStatus: 'APPLY',
        newStatus: 'PASS',
        reason: 'Review passed',
        createdAt: currentDate,
        recruiter: { id: 1, name: 'Recruiter' },
      },
      {
        id: 2,
        recruiterId: 1,
        resumeId: id,
        oldStatus: 'PASS',
        newStatus: 'FINAL_PASS',
        reason: 'Review2 passed',
        createdAt: currentDate,
        recruiter: { id: 1, name: 'Recruiter' },
      },
    ];
    mockPrisma.resumeLog.findMany.mockReturnValue(logs);
    // WHEN
    const logList = await resumesRepository.getResumeLogs(id);
    // THEN
    expect(mockPrisma.resumeLog.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.resumeLog.findMany).toHaveBeenCalledWith({
      where: {
        resumeId: id,
      },
      include: {
        recruiter: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    expect(logList).toEqual(logs);
  });
});
