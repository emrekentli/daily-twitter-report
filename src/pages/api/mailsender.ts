import axios from "axios";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function fetchTweets(query) {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  const startTime = oneDayAgo.toISOString();

  try {
    const response = await axios.get(
        `https://api.twitter.com/2/tweets/search/recent`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
          },
          params: {
            query: `${query} -is:retweet`, // Retweetleri hariç tut
            max_results: 10,
            "tweet.fields": "created_at,author_id",
            start_time: startTime,
          },
        }
    );

    return response.data.data || [];
  } catch (error) {
    console.error("Twitter API Error:", error);
    return [];
  }
}

// E-posta Gönderimi
async function sendEmail(tweets) {
  if (tweets.length === 0) {
    console.log("No tweets found to send.");
    return;
  }

  const emailBody = tweets
      .map(
          (tweet) =>
              `<p><strong>${tweet.author_id}:</strong> ${tweet.text}<br><small>${tweet.created_at}</small></p>`
      )
      .join("<hr>");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: "Daily Twitter Report",
    html: `<h1>Daily Twitter Report</h1>${emailBody}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Email Error:", error);
  }
}

export default async function handler(req, res) {
  const tweets = await fetchTweets("Adem Soytekin");
  await sendEmail(tweets);
  res.status(200).json({ success: true });
}
