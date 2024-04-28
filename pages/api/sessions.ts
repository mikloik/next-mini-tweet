import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/db";
import { serialize } from 'cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user && user.password === password) {
        const sessionToken = `${user.id}:${Math.random().toString(36).substring(2)}`;
        res.setHeader('Set-Cookie', serialize('session', sessionToken, { path: '/', httpOnly: true }));
        res.status(200).json({ message: 'Logged in successfully', user });
        res.status(200).json({ message: "Logged in successfully", user });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      res.status(400).json({ error: "Error logging in" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
