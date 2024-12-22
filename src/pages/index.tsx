"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
    const [query, setQuery] = useState(""); // Arama kelimesi
    const [tweets, setTweets] = useState([]); // Çekilen tweet'ler
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchTweets = async () => {
        if (!query) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/api/search?q=${query}`);
            setTweets(response.data || []);
        } catch (error) {
            setError(error.response.data.error || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
            <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">
                    Twitter Search
                </h1>
                <div className="flex space-x-4 mb-6">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search tweets..."
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={searchTweets}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <ul className="space-y-4">
                    {tweets.map((tweet) => (
                        <li
                            key={tweet.id}
                            className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm"
                        >
                            <p className="text-gray-800">{tweet.text}</p>
                            <small className="text-gray-500 block mt-2">
                                Author: {tweet.author_id}
                            </small>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
