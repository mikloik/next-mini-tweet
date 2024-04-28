import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../lib/auth";
import prisma from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { id } = req.query;

  if (req.method === "GET") {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
      },
    });

    if (!tweet) {
      res.status(404).json({ error: "Tweet not found" });
      return;
    }

    res.status(200).json(tweet);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
