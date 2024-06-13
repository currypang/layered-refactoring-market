import { beforeEach, describe, jest, test, expect } from '@jest/globals';
import { UsersRepository } from '../../../src/repositories/users.repository.js';
import { dummyUsers } from '../../dummies/users.dummy.js';

// TODO: template 이라고 되어 있는 부분을 다 올바르게 수정한 후 사용해야 합니다.

const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  refreshToken: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const usersRepository = new UsersRepository(mockPrisma);

describe('users Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다
  });
  // 유저 생성 테스트
  test('createUser Method', async () => {
    // GIVEN
    const { email, name, password } = dummyUsers[0];
    const currentDate = new Date();
    mockPrisma.user.create.mockResolvedValue({
      id: 1,
      email,
      password,
      name,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    // WHEN
    const createdUser = await usersRepository.createUser(email, name, password);
    // THEN
    expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email,
        name,
        password,
      },
    });
    expect(createdUser).toEqual({
      id: 1,
      email,
      password,
      name,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  });
  // 유저 정보 조회 테스트
  test('findUser Method', async () => {
    // GIVEN
    const userId = 1;
    const condition = { id: userId };
    const user = dummyUsers.find((el) => el.id === userId);
    mockPrisma.user.findUnique.mockResolvedValue(user);
    // WHEN
    const searchedUser = await usersRepository.findUser(condition);
    // THEN
    expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: condition,
    });
    expect(searchedUser).toEqual(user);
  });
  // 토큰 생성 테스트
  test('upsertRefreshToken Method', async () => {
    // GIVEN
    const userId = 1;
    const hashedRefreshToken = '$2b$10$ZMjVozX6yV3zTPYBNBP';
    // WHEN
    await usersRepository.upsertRefreshToken(userId, hashedRefreshToken);
    // THEN
    expect(mockPrisma.refreshToken.upsert).toHaveBeenCalledTimes(1);
    expect(mockPrisma.refreshToken.upsert).toHaveBeenCalledWith({
      where: { userId },
      update: { refreshToken: hashedRefreshToken },
      create: { userId, refreshToken: hashedRefreshToken },
    });
  });
  // refreshToken 조회
  test('findRefreshToken Method', async () => {
    // GIVEN
    const userId = 2;
    const currentDate = new Date();
    mockPrisma.refreshToken.findUnique.mockResolvedValue({
      id: 1,
      userId: 2,
      refreshToken: '$2b$10$ZMjVozX6yV3zTPYBNBPwVuwmE7/y6UprRMGTufeIWiNkwg1ejohA2',
      createdAt: currentDate,
      updatedAt: currentDate,
    });

    // WHEN
    const exitedRefreshToken = await usersRepository.findRefreshToken(userId);
    // THEN
    expect(mockPrisma.refreshToken.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.refreshToken.findUnique).toHaveBeenCalledWith({
      where: { userId },
    });
    expect(exitedRefreshToken).toEqual({
      id: 1,
      userId: 2,
      refreshToken: '$2b$10$ZMjVozX6yV3zTPYBNBPwVuwmE7/y6UprRMGTufeIWiNkwg1ejohA2',
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  });
  // refreshToken 삭제
  test('deleteRefreshToken Method', async () => {
    // GIVEN
    const userId = 5;
    const currentDate = new Date();
    mockPrisma.refreshToken.update.mockResolvedValue({
      id: 4,
      userId: 5,
      refreshToken: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
    // WHEN
    const deletedUser = await usersRepository.deleteRefreshToken(userId);
    // THEN
    expect(mockPrisma.refreshToken.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.refreshToken.update).toHaveBeenCalledWith({
      where: { userId },
      data: {
        refreshToken: null,
      },
    });
    expect(deletedUser).toEqual({
      id: 4,
      userId: 5,
      refreshToken: null,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  });
});
