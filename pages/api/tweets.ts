import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../lib/auth";
import prisma from "../../lib/db";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req);
  console.log(session);

  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.method === "GET") {
    const tweets = await prisma.tweet.findMany({
      include: {
        user: true,
      },
    });
    res.status(200).json(tweets);
  } else if (req.method === "POST") {
    const { content } = req.body;
    const tweet = await prisma.tweet.create({
      data: {
        content,
        userId: session.userId,
      },
    });
    res.status(201).json(tweet);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
