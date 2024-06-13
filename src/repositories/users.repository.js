export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  // 유저 정보 ID 조회 - 인증 미들웨어에서도 사용
  findUserById = async (userId) => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  };
  // 유저 정보 이메일 조회
  findUserByEmail = async (email) => {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  };
  // 유저 생성
  createUser = async (email, name, hashedPassword) => {
    console.log('email: ', email, 'name: ', name, 'password: ', hashedPassword);
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
  findRefreshToken = async (userId) => {
    const exitedRefreshToken = await this.prisma.refreshToken.findUnique({
      where: { userId },
    });
    return exitedRefreshToken;
  };
  deleteRefreshToken = async (userId) => {
    const deletedUser = await this.prisma.refreshToken.update({
      where: { userId },
      data: {
        refreshToken: null,
      },
    });
    return deletedUser;
  };
}
