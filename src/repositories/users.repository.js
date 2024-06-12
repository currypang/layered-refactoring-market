export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findUser = async (userId) => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  };
}
