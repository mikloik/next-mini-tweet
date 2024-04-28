import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../../lib/auth";
import prisma from "../../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.method === "POST") {
    const { id } = req.query;
    const tweet = await prisma.tweet.update({
      where: {
        id: Number(id),
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    res.status(200).json(tweet);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
