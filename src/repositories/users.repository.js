export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 유저 정보 조회
  findUser = async (condition) => {
    const user = await this.prisma.user.findUnique({
      where: condition,
    });
    return user;
  };

  // 유저 생성
  createUser = async (email, name, hashedPassword) => {
    const createdUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    return createdUser;
  };
  // refreshToken 생성, 업데이트
  upsertRefreshToken = async (userId, hashedRefreshToken) => {
    await this.prisma.refreshToken.upsert({
      where: { userId },
      update: { refreshToken: hashedRefreshToken },
      create: { userId, refreshToken: hashedRefreshToken },
    });
  };
  // refreshToken 조회
  findRefreshToken = async (userId) => {
    const exitedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { userId },
    });
    return exitedRefreshToken;
  };
  // refreshToken 삭제
  deleteRefreshToken = async (userId) => {
    const deletedUser = await this.prisma.refreshToken.update({
      where: { userId },
      data: {
        refreshToken: null,
      },
    });
    console.log(deletedUser);
    return deletedUser;
  };
}
