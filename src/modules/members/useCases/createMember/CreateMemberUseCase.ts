import { prisma } from "../../../../database/lib/prisma";

interface IMember {
  name: string;
  phone: string;
  congregation_Id: string;
}

export class CreateMemberUseCase {
  async execute({ name, phone, congregation_Id }: IMember) {
    const memberExist = await prisma.members.findUnique({
      where: { phone },
    });

    if (memberExist) {
      throw new Error("Member already exists");
    }

    const member = await prisma.members.create({
      data: {
        name,
        phone,
        congregation_Id,
      },
    });

    return member;
  }
}
