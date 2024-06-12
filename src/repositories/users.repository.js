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
}
