import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password,
        },
      });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Error creating user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
