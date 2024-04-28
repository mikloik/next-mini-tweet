import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import  prisma from "../../lib/db";
import { Tweet } from "@prisma/client";

export default function TweetDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: tweet, error } = useSWR<Tweet>(`/api/tweets/${id}`, fetcher);

  const handleLike = async () => {
    await fetch(`/api/tweets/${id}/like`, {
      method: "POST",
      credentials: "include",
    });
    mutate(`/api/tweets/${id}`);
  };

  if (!tweet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Tweet Details</h1>
      <div className="bg-white p-4 rounded shadow">
        <p>{tweet.content}</p>
        <p className="text-gray-500">
          {new Date(tweet.createdAt).toLocaleString()} | Likes: {tweet.likes}
        </p>
        <button
          onClick={handleLike}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Like
        </button>
      </div>
    </div>
  );
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;
  const tweet = await prisma.tweet.findUnique({
    where: {
      id: Number(id),
    },
  });
  return {
    props: {
      tweet: JSON.parse(JSON.stringify(tweet)),
    },
  };
};
