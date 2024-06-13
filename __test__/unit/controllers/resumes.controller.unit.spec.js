import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ResumesController } from '../../../src/controllers/resumes.controller.js';
import { dummyResumes } from '../../dummies/resume.dummy';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import { USER_CONS } from '../../../src/constants/user.constant.js';
import { RESUME_CONS } from '../../../src/constants/resume.constant.js';

const mockResumesService = {
  createResume: jest.fn(),
  getAllResumes: jest.fn(),
  getResume: jest.fn(),
  updateResume: jest.fn(),
  deleteResume: jest.fn(),
  updateStatus: jest.fn(),
  getResumeLogs: jest.fn(),
};

const mockRequest = {
  user: jest.fn(),
  body: jest.fn(),
  query: jest.fn(),
  params: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const resumesController = new ResumesController(mockResumesService);

describe('TemplateController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });
  // 이력서 생성 테스트
  test('createResume Method', async () => {
    // GIVEN
    const currentDate = new Date();
    const { title, content } = dummyResumes[0];
    const user = dummyUsers[1];
    mockRequest.body = { title, content };
    mockRequest.user = user;
    const createdResume = {
      id: 1,
      authorId: user.id,
      title,
      content,
      status: RESUME_CONS.RESUME_STATUS.APPLY,
      createdAt: currentDate,
      updatedAt: currentDate,
      author: user,
    };
    mockResumesService.createResume.mockReturnValue(createdResume);
    // WHEN
    await resumesController.createResume(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockResumesService.createResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.createResume).toHaveBeenCalledWith(title, content, user.id);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.CREATE.SUCCEED,
      data: createdResume,
    });
  });
  // 이력서 목록 조회 테스트
  test('getAllResumes Method', async () => {
    // GIVEN
    const user = dummyUsers[1];
    const sort = 'desc';
    const status = '';
    const role = USER_CONS.APPLICANT;
    mockRequest.user = user;
    mockRequest.query = { sort, status };
    const expectedResult = [dummyResumes[1], dummyResumes[2], dummyResumes[5]];
    mockResumesService.getAllResumes.mockReturnValue(expectedResult);
    // WHEN
    await resumesController.getAllResumes(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockResumesService.getAllResumes).toHaveBeenCalledTimes(1);
    expect(mockResumesService.getAllResumes).toHaveBeenCalledWith(user.id, role, sort, status);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.SUCCEED,
      data: expectedResult,
    });
  });
  // 이력서 상세 조회 테스트
  test('getResume Method', async () => {
    // GIVEN
    const resume = dummyResumes[1];
    const user = dummyUsers[1];
    const role = USER_CONS.APPLICANT;
    mockRequest.params = { id: resume.id };
    mockRequest.user = { id: user.id, role };
    mockResumesService.getResume.mockReturnValue(resume);
    // WHEN
    await resumesController.getResume(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockResumesService.getResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.getResume).toHaveBeenCalledWith(resume.id, role, resume.authorId);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_DETAIL.SUCCEED,
      data: resume,
    });
  });
  // 이력서 수정 테스트
  test('updateResume Method', async () => {
    // GIVEN
    const resume = dummyResumes[1];
    const updatedData = { title: 'Updated Title', content: 'Updated Content' };
    mockRequest.params = { id: resume.id };
    mockRequest.user = { id: resume.authorId };
    mockRequest.body = updatedData;
    const updatedResume = { ...resume, ...updatedData };
    mockResumesService.updateResume.mockReturnValue(updatedResume);
    // WHEN
    await resumesController.updateResume(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockResumesService.updateResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.updateResume).toHaveBeenCalledWith(
      resume.id,
      resume.authorId,
      updatedData.title,
      updatedData.content,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.SUCCEED,
      data: updatedResume,
    });
  });
  // 이력서 삭제  테스트
  test('deleteResume Method', async () => {
    // GIVEN
    const resume = dummyResumes[1];
    mockRequest.params = { id: resume.id };
    mockRequest.user = { id: resume.authorId };
    mockResumesService.deleteResume.mockReturnValue(resume);
    // WHEN
    await resumesController.deleteResume(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockResumesService.deleteResume).toHaveBeenCalledTimes(1);
    expect(mockResumesService.deleteResume).toHaveBeenCalledWith(resume.id, resume.authorId);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.DELETE.SUCCEED,
      data: { id: resume.id },
    });
  });
  // 이력서 지원 상태 변경 테스트
  test('updateStatus Method', async () => {
    // GIVEN
    const resume = dummyResumes[1];
    const recruiter = dummyUsers[3];
    const status = RESUME_CONS.RESUME_STATUS.PASS;
    const reason = '1차 면접 합격';
    const updatedStatus = { id: resume.id, newStatus: status, oldStatus: resume.status, reason };
    mockRequest.params = { id: resume.id };
    mockRequest.user = { id: recruiter.id };
    mockRequest.body = { status, reason };
    mockResumesService.updateStatus.mockReturnValue(updatedStatus);
    // WHEN
    await resumesController.updateStatus(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockResumesService.updateStatus).toHaveBeenCalledTimes(1);
    expect(mockResumesService.updateStatus).toHaveBeenCalledWith(resume.id, recruiter.id, status, reason);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.UPDATE.STATUS.SUCCEED,
      data: updatedStatus,
    });
  });
  // 이력서 로그 목록 조회
  test('getResumeLogs Method', async () => {
    // GIVEN
    const currentDate = new Date();
    const resume = dummyResumes[1];
    const logList = [
      {
        id: 1,
        recruiterName: 'Recruiter',
        resumeId: resume.id,
        oldStatus: RESUME_CONS.RESUME_STATUS.APPLY,
        newStatus: RESUME_CONS.RESUME_STATUS.PASS,
        reason: '코딩 테스트 통과',
        createdAt: currentDate,
      },
    ];
    mockRequest.params = { id: resume.id };
    mockResumesService.getResumeLogs.mockReturnValue(logList);
    // WHEN
    await resumesController.getResumeLogs(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockResumesService.getResumeLogs).toHaveBeenCalledTimes(1);
    expect(mockResumesService.getResumeLogs).toHaveBeenCalledWith(resume.id);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.RESUMES.READ_LIST.LOG.SUCCEED,
      data: logList,
    });
  });
});
