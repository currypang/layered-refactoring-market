import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthController } from '../../../src/controllers/auth.controller.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { HTTP_STATUS } from '../../../src/constants/http-status.constant.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';

const mockAuthService = {
  signUpUser: jest.fn(),
  signInUser: jest.fn(),
  reNewToken: jest.fn(),
  signOut: jest.fn(),
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

const authController = new AuthController(mockAuthService);

describe('authController Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });
  // 회원 가입 테스트
  test('signUpUser Method', async () => {
    // GIVEN
    const currentDate = new Date();
    const { email, name, password } = dummyUsers[0];
    const newUser = { email, name, password };
    mockRequest.body = newUser;
    mockAuthService.signUpUser.mockReturnValue({
      id: 5,
      email: 'spartan@spartacodingclub.kr',
      name: '스파르탄',
      role: 'APPLICANT',
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    // WHEN
    await authController.signUpUser(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockAuthService.signUpUser).toHaveBeenCalledWith(newUser.email, newUser.name, newUser.password);
    expect(mockAuthService.signUpUser).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.CREATED,
      message: MESSAGES.AUTH.SIGN_UP.SUCCEED,
      data: {
        id: 5,
        email: 'spartan@spartacodingclub.kr',
        name: '스파르탄',
        role: 'APPLICANT',
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    });
  });

  // 로그인 테스트
  test('signInUser Method', async () => {
    // GIVEN
    const { email, password } = dummyUsers[1];
    const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };
    mockAuthService.signInUser.mockReturnValue(tokens);
    mockRequest.body = { email, password };
    // WHEN
    await authController.signInUser(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockAuthService.signInUser).toHaveBeenCalledTimes(1);
    expect(mockAuthService.signInUser).toHaveBeenCalledWith(email, password);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_IN.SUCCEED,
      data: tokens,
    });
  });
  // 토큰 재발급 테스트
  test('reNewToken Method', async () => {
    // GIVEN
    const user = dummyUsers[1];
    mockRequest.user = user;
    const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };
    mockAuthService.reNewToken.mockReturnValue(tokens);
    // WHEN
    await authController.reNewToken(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockAuthService.reNewToken).toHaveBeenCalledTimes(1);
    expect(mockAuthService.reNewToken).toHaveBeenCalledWith(user);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.TOKEN.SUCCEED,
      data: tokens,
    });
  });
  // 로그 아웃 테스트
  test('signOut Method', async () => {
    // GIVEN
    const user = dummyUsers[1];
    mockRequest.user = user;
    mockAuthService.signOut.mockReturnValue(user.id);
    // WHEN
    await authController.signOut(mockRequest, mockResponse, mockNext);
    // THEN
    expect(mockAuthService.signOut).toHaveBeenCalledTimes(1);
    expect(mockAuthService.signOut).toHaveBeenCalledWith(user.id);
    expect(mockResponse.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: HTTP_STATUS.OK,
      message: MESSAGES.AUTH.SIGN_OUT.SUCCEED,
      data: { id: user.id },
    });
  });
});
