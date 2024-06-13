import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { AuthService } from '../../../src/services/auth.service.js';
import { dummyUsers } from '../../dummies/users.dummy.js';
import { MESSAGES } from '../../../src/constants/message.constant.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const mockUsersRepository = {
  findUser: jest.fn(),
  createUser: jest.fn(),
  upsertRefreshToken: jest.fn(),
  findRefreshToken: jest.fn(),
  deleteRefreshToken: jest.fn(),
};

const authService = new AuthService(mockUsersRepository);

describe('authService Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });
  // 회원 가입 로직 테스트
  test('signUpUser Method', async () => {
    // GIVEN
    const { email, name, password } = dummyUsers[0];
    const currentDate = new Date();
    const hashedPassword = 'hashPassword';
    // bcrypt.hash를 모킹하여 항상 'hashPassword' 반환
    bcrypt.hash = jest.fn().mockReturnValue('hashPassword');
    mockUsersRepository.findUser.mockReturnValue(null);
    mockUsersRepository.createUser.mockReturnValue({
      id: 7,
      email,
      name,
      password: hashedPassword,
      role: 'APPLICANT',
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    // WHEN
    const signUpedUser = await authService.signUpUser(email, name, password);
    // THEN
    expect(mockUsersRepository.findUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(email, name, hashedPassword);
    expect(signUpedUser).toEqual({
      id: 7,
      email,
      name,
      role: 'APPLICANT',
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  });
  // 회원 가입 에러 테스트
  test('signUpUser Method Error', async () => {
    // GIVEN
    const { email, name, password } = dummyUsers[0];
    mockUsersRepository.findUser.mockReturnValue('exiseUser');
    // WHEN
    try {
      await authService.signUpUser(email, name, password);
    } catch (err) {
      // THEN
      expect(mockUsersRepository.findUser).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual(MESSAGES.AUTH.COMMON.EMAIL.DUPLICATED);
    }
  });
  // 로그인 로직 테스트
  test('signInUser Method', async () => {
    // GIVEN
    const { email, password } = dummyUsers[1];
    const user = dummyUsers[1];
    const accessToken = 'accessToken';
    const refreshToken = 'refreshToken';
    mockUsersRepository.findUser.mockReturnValue(user);
    bcrypt.compare = jest.fn().mockReturnValue(true);
    // 첫 번째 호출에서 accessToken 반환, 두 번째 호출에서 refreshToken 반환
    jwt.sign = jest.fn().mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);

    // WHEN
    const tokens = await authService.signInUser(email, password);
    // THEN
    expect(mockUsersRepository.findUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.upsertRefreshToken).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findUser).toHaveBeenCalledWith({ email });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    expect(tokens).toEqual({ accessToken, refreshToken });
  });
  // 로그인 에러 로직 테스트
  test('signInUser Method Error', async () => {
    // GIVEN
    const { email, password } = dummyUsers[1];
    mockUsersRepository.findUser.mockReturnValue(null);
    try {
      // WHEN
      await authService.signInUser(email, password);
    } catch (err) {
      // THEN
      expect(mockUsersRepository.findUser).toHaveBeenCalledTimes(1);
      expect(mockUsersRepository.upsertRefreshToken).toHaveBeenCalledTimes(0);
      expect(err.message).toEqual(MESSAGES.AUTH.COMMON.UNAUTHORIZED);
    }
  });

  // 토큰 재발급 로직 테스트
  test('reNewToken Method', async () => {
    // GIVEN
    const user = dummyUsers[1];
    const accessToken = 'accessToken';
    const refreshToken = 'refreshToken';
    jwt.sign = jest.fn().mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);
    // 모킹해야 횟수 테스트 가능
    const hashedRefreshToken = 'hashedToken';
    bcrypt.hashSync = jest.fn().mockReturnValue(hashedRefreshToken);

    // WHEN
    const reNewToken = await authService.reNewToken(user);
    // THEN
    expect(bcrypt.hashSync).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(mockUsersRepository.upsertRefreshToken).toHaveBeenCalledTimes(1);
    // expect(mockUsersRepository.upsertRefreshToken).toHaveBeenCalledWith(user.id, hashedRefreshToken);
    expect(reNewToken).toEqual({ accessToken, refreshToken });
  });
  // 로그 아웃 로직
  test('signOut Method', async () => {
    // GIVEN
    const user = dummyUsers[1];
    mockUsersRepository.deleteRefreshToken.mockReturnValue(user);
    // WHEN
    const deletedUser = await authService.signOut(user.id);
    // THEN
    expect(mockUsersRepository.deleteRefreshToken).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.deleteRefreshToken).toHaveBeenCalledWith(user.id);
    expect(deletedUser).toEqual(user.id);
  });
});
