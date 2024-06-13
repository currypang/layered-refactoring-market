import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { UsersController } from '../../../src/controllers/users.controller.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

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

const usersController = new UsersController();

describe('usersController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });
  // 내 정보 조회
  test('getUser Method', async () => {
    // GIVEN
    const currentDate = new Date();
    const user = {
      id: 1,
      email: 'recruiter5@gomail.com',
      name: '포포비치',
      role: 'RECRUITER',
      createdAt: currentDate,
      updatedAt: currentDate,
    };
    mockRequest.user.mockReturnValue(user);
    // WHEN
    await usersController.getUser(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.USERS.READ_ME.SUCCEED,
      data: mockRequest.user,
    });
  });
});
