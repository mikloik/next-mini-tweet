import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { Tweet, User } from "@prisma/client";

export default function Home() {
  const router = useRouter();
  const { data: user, error } = useSWR("/api/me", fetcher);
  const { data: tweets, mutate: mutateTweets } = useSWR("/api/tweets", fetcher);
  const [newTweet, setNewTweet] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/log-in");
    }
  }, [user, router]);

  const handleTweetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/tweets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newTweet }),
    });
    mutateTweets();
    setNewTweet("");
  };

  if (!tweets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <form onSubmit={handleTweetSubmit} className="mb-4">
        <textarea
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Write a new tweet..."
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tweet
        </button>
      </form>
      {Array.isArray(tweets) && tweets.length > 0 ? (
        tweets.map((tweet: Tweet) => (
          <div key={tweet.id} className="bg-white p-4 rounded shadow mb-4">
            <p>{tweet.content}</p>
            <p className="text-gray-500">
              {new Date(tweet.createdAt).toLocaleString()} | Likes:{" "}
              {tweet.likes}
            </p>
            <a
              href={`/tweet/${tweet.id}`}
              className="text-blue-500 hover:underline"
            >
              View Tweet
            </a>
          </div>
        ))
      ) : (
        <div>No tweets found.</div>
      )}
    </div>
  );
}

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());
