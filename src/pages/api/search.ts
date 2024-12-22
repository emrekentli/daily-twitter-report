import { Client } from "twitter-api-sdk";

export default async function handler(req, res) {
  const token = process.env.TWITTER_BEARER_TOKEN;
  const client = new Client(token);

  if (req.method === "GET") {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const startTime = oneDayAgo.toISOString();
    const { q } = req.query;
    try {
      // @ts-ignore
      const response = await client.tweets.tweetsRecentSearch({
        query: `${q} -is:retweet`, // Arama kelimesi ve retweetleri hariç tutma
        max_results: 10,
        "tweet.fields": "created_at,author_id",
        start_time: startTime, // Son 1 gün
      });

      if (!response || !response.data) {
        res.status(404).json({ error: "No tweets found for the query." });
        return;
      }

      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.statusText });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
