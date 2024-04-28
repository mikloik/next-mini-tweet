import { NextApiRequest } from "next";
import prisma from "./db";

export async function getSession(req: NextApiRequest) {
  const cookie = req.cookies.session;
  console.log("cookie", cookie);
  if (!cookie) {
    return null;
  }

  const [userId, token] = cookie.split(":");
  console.log("userId", userId);
  console.log("token", token);
  const user = await prisma.user.findUnique({
    where: {
      id: Number(userId),
    },
  });
  console.log("user", user);

  if (!user) {
    return null;
  }

  return { userId: user.id };
}
